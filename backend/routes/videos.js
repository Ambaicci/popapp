const express = require('express');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const sqlite3 = require('sqlite3').verbose();

const router = express.Router();
const db = new sqlite3.Database('./popapp.db');

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

// GET all videos for feed
router.get('/feed', (req, res) => {
  const sql = "SELECT videos.*, users.username, users.avatar FROM videos JOIN users ON videos.user_id = users.id ORDER BY videos.created_at DESC";
  db.all(sql, [], (err, videos) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(videos);
  });
});

// GET videos from following
router.get('/feed/following', (req, res) => {
  const userId = 1;
  const sql = `
    SELECT videos.*, users.username, users.avatar 
    FROM videos 
    JOIN users ON videos.user_id = users.id 
    WHERE videos.user_id IN (SELECT following_id FROM follows WHERE follower_id = ?)
    ORDER BY videos.created_at DESC
  `;
  db.all(sql, [userId], (err, videos) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(videos);
  });
});

// POST upload video
router.post('/upload', upload.single('video'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No video file uploaded' });
    }

    const result = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        { resource_type: 'video', folder: 'popapp_videos', format: 'mp4' },
        (error, result) => {
          if (error) reject(error);
          else resolve(result);
        }
      );
      uploadStream.end(req.file.buffer);
    });

    const userId = 1;
    const title = req.body.title || 'Untitled Video';
    const description = req.body.description || '';

    const insertSql = "INSERT INTO videos (user_id, title, description, video_url, thumbnail_url, duration) VALUES (?, ?, ?, ?, ?, ?)";
    db.run(insertSql, [userId, title, description, result.secure_url, result.thumbnail_url, Math.floor(result.duration || 0)], function(err) {
      if (err) {
        return res.status(500).json({ error: err.message });
      }
      res.json({ success: true, video: { id: this.lastID, title, description, video_url: result.secure_url, thumbnail_url: result.thumbnail_url } });
    });
  } catch (error) {
    console.error('Upload error:', error);
    res.status(500).json({ error: 'Upload failed: ' + error.message });
  }
});

// GET single video
router.get('/:id', (req, res) => {
  const id = req.params.id;
  const sql = "SELECT videos.*, users.username, users.avatar FROM videos JOIN users ON videos.user_id = users.id WHERE videos.id = ?";
  db.get(sql, [id], (err, video) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    if (!video) {
      return res.status(404).json({ error: 'Video not found' });
    }
    res.json(video);
  });
});

// POST like/unlike a video
router.post('/:id/like', (req, res) => {
  const videoId = req.params.id;
  const userId = 1;
  
  const checkSql = "SELECT * FROM likes WHERE user_id = ? AND video_id = ?";
  db.get(checkSql, [userId, videoId], (err, existing) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    if (existing) {
      const deleteSql = "DELETE FROM likes WHERE user_id = ? AND video_id = ?";
      db.run(deleteSql, [userId, videoId], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        db.run("UPDATE videos SET likes = likes - 1 WHERE id = ?", [videoId]);
        res.json({ liked: false, message: 'Unliked' });
      });
    } else {
      const insertSql = "INSERT INTO likes (user_id, video_id) VALUES (?, ?)";
      db.run(insertSql, [userId, videoId], function(err) {
        if (err) {
          return res.status(500).json({ error: err.message });
        }
        db.run("UPDATE videos SET likes = likes + 1 WHERE id = ?", [videoId]);
        
        const getOwnerSql = "SELECT user_id FROM videos WHERE id = ?";
        db.get(getOwnerSql, [videoId], (err, video) => {
          if (!err && video && video.user_id !== userId) {
            const notifSql = "INSERT INTO notifications (user_id, type, from_user_id, video_id) VALUES (?, 'like', ?, ?)";
            db.run(notifSql, [video.user_id, userId, videoId]);
          }
        });
        
        res.json({ liked: true, message: 'Liked' });
      });
    }
  });
});

// GET comments for a video
router.get('/:id/comments', (req, res) => {
  const videoId = req.params.id;
  const sql = `
    SELECT comments.*, users.username 
    FROM comments 
    JOIN users ON comments.user_id = users.id 
    WHERE comments.video_id = ? 
    ORDER BY comments.created_at DESC
  `;
  db.all(sql, [videoId], (err, comments) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(comments);
  });
});

// POST add a comment
router.post('/:id/comments', (req, res) => {
  const videoId = req.params.id;
  const userId = 1;
  const { content } = req.body;
  
  if (!content || content.trim() === '') {
    return res.status(400).json({ error: 'Comment cannot be empty' });
  }
  
  const sql = "INSERT INTO comments (user_id, video_id, content) VALUES (?, ?, ?)";
  db.run(sql, [userId, videoId, content], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    
    const getOwnerSql = "SELECT user_id FROM videos WHERE id = ?";
    db.get(getOwnerSql, [videoId], (err, video) => {
      if (!err && video && video.user_id !== userId) {
        const notifSql = "INSERT INTO notifications (user_id, type, from_user_id, video_id) VALUES (?, 'comment', ?, ?)";
        db.run(notifSql, [video.user_id, userId, videoId]);
      }
    });
    
    res.json({ id: this.lastID, user_id: userId, video_id: videoId, content, created_at: new Date().toISOString() });
  });
});

// GET videos by user ID
router.get('/user/:userId', (req, res) => {
  const userId = req.params.userId;
  const sql = `
    SELECT videos.*, users.username, users.avatar 
    FROM videos 
    JOIN users ON videos.user_id = users.id 
    WHERE videos.user_id = ?
    ORDER BY videos.created_at DESC
  `;
  db.all(sql, [userId], (err, videos) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(videos);
  });
});

// GET trending hashtags
router.get('/trending/hashtags', (req, res) => {
  const sql = `
    SELECT tags, COUNT(*) as count 
    FROM videos 
    GROUP BY tags 
    ORDER BY count DESC 
    LIMIT 5
  `;
  db.all(sql, [], (err, tags) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(tags);
  });
});

// GET top creators
router.get('/trending/creators', (req, res) => {
  const sql = `
    SELECT users.id, users.username, users.avatar, COUNT(videos.id) as video_count
    FROM users
    JOIN videos ON users.id = videos.user_id
    GROUP BY users.id
    ORDER BY video_count DESC
    LIMIT 5
  `;
  db.all(sql, [], (err, creators) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(creators);
  });
});

// GET trending pop-movies
router.get('/trending/popmovies', (req, res) => {
  const sql = `
    SELECT * FROM videos 
    WHERE title LIKE '%pop-movie%' OR description LIKE '%pop-movie%'
    ORDER BY views DESC 
    LIMIT 4
  `;
  db.all(sql, [], (err, movies) => {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json(movies);
  });
});

// Increment view count
router.post('/:id/view', (req, res) => {
  const videoId = req.params.id;
  const sql = "UPDATE videos SET views = views + 1 WHERE id = ?";
  db.run(sql, [videoId], function(err) {
    if (err) {
      return res.status(500).json({ error: err.message });
    }
    res.json({ success: true });
  });
});

// SEARCH - videos, creators, pop-movies, hashtags
router.get('/search', (req, res) => {
  console.log('🔍 Search route hit! Query:', req.query.q);
  const query = req.query.q;
  if (!query || query.trim() === '') {
    return res.json({ videos: [], creators: [], popMovies: [], hashtags: [] });
  }
  
  const searchTerm = `%${query}%`;
  
  const videoSql = `SELECT videos.*, users.username, users.avatar FROM videos JOIN users ON videos.user_id = users.id WHERE videos.title LIKE ? OR videos.description LIKE ? ORDER BY videos.views DESC LIMIT 15`;
  const creatorSql = `SELECT id, username, avatar, bio, (SELECT COUNT(*) FROM videos WHERE user_id = users.id) as video_count FROM users WHERE username LIKE ? OR bio LIKE ? ORDER BY video_count DESC LIMIT 10`;
  const popMovieSql = `SELECT videos.*, users.username FROM videos JOIN users ON videos.user_id = users.id WHERE (videos.title LIKE ? OR videos.description LIKE ?) AND (videos.title LIKE '%pop-movie%' OR videos.description LIKE '%pop-movie%') ORDER BY videos.views DESC LIMIT 10`;
  const hashtagSql = `SELECT DISTINCT CASE WHEN title LIKE '%#%' THEN SUBSTR(title, INSTR(title, '#')) WHEN description LIKE '%#%' THEN SUBSTR(description, INSTR(description, '#')) END as hashtag, COUNT(*) as count FROM videos WHERE title LIKE ? OR description LIKE ? GROUP BY hashtag ORDER BY count DESC LIMIT 8`;
  
  db.all(videoSql, [searchTerm, searchTerm], (err, videos) => {
    if (err) return res.status(500).json({ error: err.message });
    db.all(creatorSql, [searchTerm, searchTerm], (err, creators) => {
      if (err) return res.status(500).json({ error: err.message });
      db.all(popMovieSql, [searchTerm, searchTerm, searchTerm, searchTerm], (err, popMovies) => {
        if (err) return res.status(500).json({ error: err.message });
        db.all(hashtagSql, [searchTerm, searchTerm], (err, hashtags) => {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ videos, creators, popMovies, hashtags });
        });
      });
    });
  });
});

module.exports = router;