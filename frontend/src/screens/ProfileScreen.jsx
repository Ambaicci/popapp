import { useState, useEffect } from 'react';
import axios from 'axios';

function ProfileScreen({ userId = 1 }) {
  const [user, setUser] = useState(null);
  const [userVideos, setUserVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [editForm, setEditForm] = useState({ username: '', bio: '' });
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [activeTab, setActiveTab] = useState('videos');

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const [userRes, videosRes] = await Promise.all([
          axios.get(`http://localhost:5000/api/auth/profile/${userId}`),
          axios.get(`http://localhost:5000/api/videos/user/${userId}`)
        ]);
        setUser(userRes.data);
        setUserVideos(videosRes.data);
        setEditForm({ username: userRes.data.username, bio: userRes.data.bio || '' });
      } catch (err) {
        console.error('Error fetching user data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleUpdateProfile = async () => {
    try {
      await axios.put(`http://localhost:5000/api/auth/profile/${userId}`, {
        username: editForm.username,
        bio: editForm.bio
      });
      setUser({ ...user, username: editForm.username, bio: editForm.bio });
      setEditing(false);
    } catch (err) {
      console.error('Error updating profile:', err);
    }
  };

  const handleAvatarUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    
    setUploadingAvatar(true);
    const formData = new FormData();
    formData.append('avatar', file);
    
    try {
      const res = await axios.post(`http://localhost:5000/api/auth/profile/${userId}/avatar`, formData);
      setUser({ ...user, avatar: res.data.avatar });
    } catch (err) {
      console.error('Avatar upload error:', err);
    } finally {
      setUploadingAvatar(false);
    }
  };

  const formatNumber = (num) => {
    if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M';
    if (num >= 1000) return (num / 1000).toFixed(1) + 'K';
    return num.toString();
  };

  if (loading) {
    return (
      <div style={{ position: 'absolute', inset: 0, top: '80px', bottom: '70px', background: '#090909', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#FF4F2E', fontSize: '13px', letterSpacing: '1px' }}>Loading</div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={{ position: 'absolute', inset: 0, top: '80px', bottom: '70px', background: '#090909', zIndex: 10, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: '#888', fontSize: '13px' }}>User not found</div>
      </div>
    );
  }

  const totalViews = userVideos.reduce((sum, v) => sum + (v.views || 0), 0);

  return (
    <div style={{ position: 'absolute', inset: 0, top: '80px', bottom: '70px', overflowY: 'auto', background: '#090909', zIndex: 10 }}>
      
      {/* Cover - Minimal gradient */}
      <div style={{ height: '120px', background: 'linear-gradient(135deg, #FF4F2E 0%, #CC3A1E 100%)' }} />
      
      {/* Avatar Section - Centered elegant */}
      <div style={{ padding: '0 20px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginTop: '-40px' }}>
          <div 
            onClick={() => document.getElementById('avatarInput').click()}
            style={{ 
              width: '80px', 
              height: '80px', 
              borderRadius: '50%', 
              background: '#fff',
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center', 
              fontSize: '32px', 
              fontWeight: '500',
              overflow: 'hidden',
              cursor: 'pointer',
              boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
            }}
          >
            {user.avatar ? (
              <img src={user.avatar} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
              <span style={{ color: '#FF4F2E' }}>{user.username?.charAt(0).toUpperCase() || 'U'}</span>
            )}
          </div>
          <button 
            onClick={() => setEditing(!editing)}
            style={{ 
              background: 'transparent', 
              border: '1px solid rgba(255,255,255,0.2)', 
              padding: '6px 16px', 
              borderRadius: '20px', 
              color: '#fff', 
              fontSize: '12px', 
              fontWeight: '400',
              letterSpacing: '0.3px',
              cursor: 'pointer',
              transition: 'opacity 0.2s'
            }}
          >
            {editing ? 'Cancel' : 'Edit'}
          </button>
        </div>
        <input
          id="avatarInput"
          type="file"
          accept="image/*"
          style={{ display: 'none' }}
          onChange={handleAvatarUpload}
        />
        
        {/* Name and Bio */}
        <div style={{ marginTop: '16px' }}>
          {!editing ? (
            <>
              <h1 style={{ fontSize: '22px', fontWeight: '500', color: '#fff', letterSpacing: '-0.3px', marginBottom: '4px' }}>{user.username}</h1>
              {user.bio && <p style={{ fontSize: '13px', color: '#aaa', lineHeight: '1.5', marginTop: '8px' }}>{user.bio}</p>}
            </>
          ) : (
            <div style={{ marginTop: '8px' }}>
              <input
                type="text"
                value={editForm.username}
                onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                placeholder="Username"
                style={{ 
                  width: '100%', 
                  padding: '12px 0', 
                  marginBottom: '12px', 
                  background: 'transparent', 
                  border: 'none', 
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  color: '#fff',
                  fontSize: '18px',
                  fontWeight: '500',
                  outline: 'none'
                }}
              />
              <textarea
                value={editForm.bio}
                onChange={(e) => setEditForm({ ...editForm, bio: e.target.value })}
                placeholder="Bio"
                rows="2"
                style={{ 
                  width: '100%', 
                  padding: '12px 0', 
                  background: 'transparent', 
                  border: 'none', 
                  borderBottom: '1px solid rgba(255,255,255,0.2)',
                  color: '#aaa',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none'
                }}
              />
              <button 
                onClick={handleUpdateProfile}
                style={{ 
                  marginTop: '16px',
                  width: '100%', 
                  padding: '10px', 
                  background: '#FF4F2E', 
                  border: 'none', 
                  borderRadius: '8px', 
                  color: '#fff', 
                  fontSize: '13px',
                  fontWeight: '500',
                  cursor: 'pointer' 
                }}
              >
                Save
              </button>
            </div>
          )}
        </div>
      </div>
      
      {/* Stats - Clean horizontal layout */}
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-around', 
        marginTop: '24px', 
        padding: '16px 20px',
        borderTop: '0.5px solid rgba(255,255,255,0.08)',
        borderBottom: '0.5px solid rgba(255,255,255,0.08)'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '500', color: '#fff' }}>{userVideos.length}</div>
          <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.5px', marginTop: '2px' }}>VIDEOS</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '500', color: '#fff' }}>{formatNumber(totalViews)}</div>
          <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.5px', marginTop: '2px' }}>VIEWS</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '20px', fontWeight: '500', color: '#fff' }}>0</div>
          <div style={{ fontSize: '11px', color: '#666', letterSpacing: '0.5px', marginTop: '2px' }}>FOLLOWERS</div>
        </div>
      </div>
      
      {/* Tab Navigation */}
      <div style={{ display: 'flex', gap: '32px', padding: '0 20px', marginTop: '20px', marginBottom: '16px' }}>
        <button 
          onClick={() => setActiveTab('videos')}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            padding: '8px 0', 
            color: activeTab === 'videos' ? '#FF4F2E' : '#666', 
            fontSize: '13px',
            fontWeight: activeTab === 'videos' ? '500' : '400',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            borderBottom: activeTab === 'videos' ? '2px solid #FF4F2E' : 'none'
          }}
        >
          VIDEOS
        </button>
        <button 
          onClick={() => setActiveTab('liked')}
          style={{ 
            background: 'transparent', 
            border: 'none', 
            padding: '8px 0', 
            color: activeTab === 'liked' ? '#FF4F2E' : '#666', 
            fontSize: '13px',
            fontWeight: activeTab === 'liked' ? '500' : '400',
            letterSpacing: '0.5px',
            cursor: 'pointer',
            borderBottom: activeTab === 'liked' ? '2px solid #FF4F2E' : 'none'
          }}
        >
          LIKED
        </button>
      </div>
      
      {/* Videos Grid */}
      {activeTab === 'videos' && (
        userVideos.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '60px 20px' }}>
            <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>🎬</div>
            <div style={{ color: '#666', fontSize: '13px', letterSpacing: '0.3px' }}>No videos yet</div>
          </div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1px', background: '#111' }}>
            {userVideos.map((video) => (
              <div key={video.id} style={{ aspectRatio: '9/16', position: 'relative', overflow: 'hidden', background: '#1a1a1a' }}>
                {video.video_url && (
                  <video
                    src={video.video_url}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    muted
                  />
                )}
                <div style={{ position: 'absolute', bottom: '6px', left: '6px', fontSize: '10px', color: '#fff', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px', letterSpacing: '0.3px' }}>
                  {video.views || 0} views
                </div>
              </div>
            ))}
          </div>
        )
      )}
      
      {/* Liked Tab */}
      {activeTab === 'liked' && (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px', opacity: 0.5 }}>❤️</div>
          <div style={{ color: '#666', fontSize: '13px', letterSpacing: '0.3px' }}>No liked videos yet</div>
        </div>
      )}
      
    </div>
  );
}

export default ProfileScreen;