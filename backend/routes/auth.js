const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./popapp.db');
const upload = multer({ storage: multer.memoryStorage() });

// Middleware to verify JWT token
const verifyToken = (req, res, next) => {
  const token = req.headers['authorization']?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

// SIGNUP
router.post('/signup', async (req, res) => {
  const { username, email, password } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ error: 'All fields required' });
  }

  if (password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters' });
  }

  try {
    const hashedPassword = await bcrypt.hash(password, 10);

    db.run(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      function(err) {
        if (err) {
          if (err.message.includes('UNIQUE')) {
            return res.status(400).json({ error: 'Username or email already exists' });
          }
          return res.status(500).json({ error: err.message });
        }

        const token = jwt.sign(
          { id: this.lastID, username, email },
          process.env.JWT_SECRET,
          { expiresIn: '7d' }
        );
        res.json({
          token,
          user: { id: this.lastID, username, email, bio: '', avatar: null }
        });
      }
    );
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// LOGIN
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Email and password required' });
  }

  db.get('SELECT * FROM users WHERE email = ?', [email], async (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(401).json({ error: 'Invalid credentials' });

    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.json({
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        bio: user.bio,
        avatar: user.avatar
      }
    });
  });
});

// GET current user profile (protected)
router.get('/me', verifyToken, (req, res) => {
  db.get(
    'SELECT id, username, email, bio, avatar, created_at FROM users WHERE id = ?',
    [req.userId],
    (err, user) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!user) return res.status(404).json({ error: 'User not found' });
      res.json(user);
    }
  );
});

// GET user profile by ID (public)
router.get('/profile/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = "SELECT id, username, email, bio, avatar, created_at FROM users WHERE id = ?";
  db.get(sql, [userId], (err, user) => {
    if (err) return res.status(500).json({ error: err.message });
    if (!user) return res.status(404).json({ error: 'User not found' });
    res.json(user);
  });
});

// UPDATE user profile (protected)
router.put('/profile', verifyToken, async (req, res) => {
  const userId = req.userId;
  const { username, bio } = req.body;

  let sql = "UPDATE users SET ";
  const updates = [];
  const values = [];

  if (username) {
    updates.push("username = ?");
    values.push(username);
  }
  if (bio !== undefined) {
    updates.push("bio = ?");
    values.push(bio);
  }

  if (updates.length === 0) {
    return res.status(400).json({ error: 'No fields to update' });
  }

  sql += updates.join(", ") + " WHERE id = ?";
  values.push(userId);

  db.run(sql, values, function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true, message: 'Profile updated' });
  });
});

// Upload avatar (protected)
router.post('/avatar', verifyToken, upload.single('avatar'), async (req, res) => {
  const userId = req.userId;

  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { folder: 'avatars', transformation: [{ width: 150, height: 150, crop: 'fill' }] },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    db.run("UPDATE users SET avatar = ? WHERE id = ?", [result.secure_url, userId], function(err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ avatar: result.secure_url });
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Follow a user (protected)
router.post('/follow/:userId', verifyToken, (req, res) => {
  const followerId = req.userId;
  const followingId = req.params.userId;

  if (followerId == followingId) {
    return res.status(400).json({ error: 'Cannot follow yourself' });
  }

  const checkSql = "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?";
  db.get(checkSql, [followerId, followingId], (err, existing) => {
    if (err) return res.status(500).json({ error: err.message });

    if (existing) {
      const deleteSql = "DELETE FROM follows WHERE follower_id = ? AND following_id = ?";
      db.run(deleteSql, [followerId, followingId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ following: false, message: 'Unfollowed' });
      });
    } else {
      const insertSql = "INSERT INTO follows (follower_id, following_id) VALUES (?, ?)";
      db.run(insertSql, [followerId, followingId], function(err) {
        if (err) return res.status(500).json({ error: err.message });
        const notifSql = "INSERT INTO notifications (user_id, type, from_user_id) VALUES (?, 'follow', ?)";
        db.run(notifSql, [followingId, followerId]);
        res.json({ following: true, message: 'Followed' });
      });
    }
  });
});

// Check if following (protected)
router.get('/follow/check/:followingId', verifyToken, (req, res) => {
  const followerId = req.userId;
  const followingId = req.params.followingId;

  const sql = "SELECT * FROM follows WHERE follower_id = ? AND following_id = ?";
  db.get(sql, [followerId, followingId], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ isFollowing: !!result });
  });
});

// Get user's notifications (protected)
router.get('/notifications', verifyToken, (req, res) => {
  const userId = req.userId;
  const sql = `
    SELECT n.*, u.username as from_username, v.title as video_title
    FROM notifications n
    LEFT JOIN users u ON n.from_user_id = u.id
    LEFT JOIN videos v ON n.video_id = v.id
    WHERE n.user_id = ?
    ORDER BY n.created_at DESC
    LIMIT 50
  `;
  db.all(sql, [userId], (err, notifications) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(notifications);
  });
});

// Mark notification as read (protected)
router.put('/notifications/:id/read', verifyToken, (req, res) => {
  const id = req.params.id;
  db.run("UPDATE notifications SET read = 1 WHERE id = ?", [id], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ success: true });
  });
});

module.exports = router;