import { useState, useEffect } from 'react';
import axios from 'axios';

function NotificationsScreen({ userId = 1 }) {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const res = await axios.get(`http://localhost:5000/api/auth/notifications/${userId}`);
        setNotifications(res.data);
      } catch (err) {
        console.error('Error fetching notifications:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchNotifications();
  }, [userId]);

  const getNotificationText = (notif) => {
    switch (notif.type) {
      case 'like':
        return `${notif.from_username} liked your video${notif.video_title ? ` "${notif.video_title.substring(0, 30)}${notif.video_title.length > 30 ? '...' : ''}"` : ''}`;
      case 'comment':
        return `${notif.from_username} commented on your video${notif.video_title ? ` "${notif.video_title.substring(0, 30)}${notif.video_title.length > 30 ? '...' : ''}"` : ''}`;
      case 'follow':
        return `${notif.from_username} started following you`;
      default:
        return 'New notification';
    }
  };

  const getNotificationIcon = (type) => {
    switch (type) {
      case 'like':
        return '❤️';
      case 'comment':
        return '💬';
      case 'follow':
        return '👤';
      default:
        return '🔔';
    }
  };

  const formatTime = (dateStr) => {
    const date = new Date(dateStr);
    const now = new Date();
    const diff = Math.floor((now - date) / 1000);
    
    if (diff < 60) return `${diff}s ago`;
    if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
    if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
    return `${Math.floor(diff / 86400)}d ago`;
  };

  if (loading) {
    return (
      <div style={{ position: 'absolute', inset: 0, top: '80px', bottom: '70px', overflowY: 'auto', padding: '0 14px', background: '#090909', zIndex: 10 }}>
        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Loading notifications...</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, top: '80px', bottom: '70px', overflowY: 'auto', padding: '0 14px', background: '#090909', zIndex: 10 }}>
      <div style={{ fontSize: '23px', fontWeight: '800', marginBottom: '16px' }}>Notifications</div>
      {notifications.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '40px', color: '#888' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔔</div>
          <div>No notifications yet</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>When someone likes, comments, or follows you, you'll see it here</div>
        </div>
      ) : (
        notifications.map((notif) => (
          <div 
            key={notif.id} 
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '12px', 
              padding: '12px 0', 
              borderBottom: '0.5px solid rgba(255,255,255,0.07)',
              opacity: notif.read ? 0.6 : 1
            }}
          >
            <div style={{ fontSize: '24px' }}>{getNotificationIcon(notif.type)}</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '13px', color: 'white' }}>{getNotificationText(notif)}</div>
              <div style={{ fontSize: '10px', color: '#888', marginTop: '4px' }}>{formatTime(notif.created_at)}</div>
            </div>
            {!notif.read && (
              <div style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#FF4F2E' }}></div>
            )}
          </div>
        ))
      )}
    </div>
  );
}

export default NotificationsScreen;