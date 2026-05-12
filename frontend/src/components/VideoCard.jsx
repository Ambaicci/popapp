
import { useState, useEffect } from 'react';

function VideoCard({ video, onLike, onComment, onShare, onCreatorClick, onFollow, formatLikes }) {
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    let timeout;
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          timeout = setTimeout(() => {
            fetch(`http://localhost:5000/api/videos/${video.id}/view`, { method: 'POST' })
              .catch(err => console.error('View tracking error:', err));
          }, 1000);
        } else {
          clearTimeout(timeout);
        }
      });
    }, { threshold: 0.5 });
    
    const element = document.getElementById(`video-${video.id}`);
    if (element) observer.observe(element);
    
    return () => {
      observer.disconnect();
      clearTimeout(timeout);
    };
  }, [video.id]);

  return (
    <div className="fi" id={`video-${video.id}`}>
      <div className="fb" style={{ background: 'black' }}></div>
      <div className="fc"></div>
      {video.video_url && (
        <video
          src={video.video_url}
          style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }}
          autoPlay
          loop
          muted
          playsInline
        />
      )}
      
      <div className="fi-inf">
        <div className="fi-cr">
          <div 
            className="fi-hdl" 
            style={{ display: 'flex', alignItems: 'center', gap: '8px', cursor: 'pointer' }}
            onClick={() => onCreatorClick(video.user_id, video.username)}
          >
            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#FF4F2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', fontSize: '14px' }}>
              {video.username?.charAt(1)?.toUpperCase() || 'U'}
            </div>
            <span>{video.username || '@user'}</span>
          </div>
          <span 
            className={`fi-fw ${video.isFollowing ? 'fwing' : ''}`} 
            onClick={() => onFollow(video.user_id)}
            style={{ cursor: 'pointer' }}
          >
            {video.isFollowing ? 'Following' : 'Follow'}
          </span>
        </div>
        
        <p 
          className="fi-tt" 
          onClick={() => setExpanded(!expanded)}
          style={{ cursor: 'pointer', display: '-webkit-box', WebkitLineClamp: expanded ? 'unset' : 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}
        >
          {video.title}
        </p>
        {video.title && video.title.length > 80 && (
          <span 
            onClick={() => setExpanded(!expanded)}
            style={{ color: '#FF4F2E', fontSize: '11px', cursor: 'pointer', marginTop: '4px', display: 'inline-block' }}
          >
            {expanded ? 'show less' : '...more'}
          </span>
        )}
      </div>
      
      <div className="rl" style={{ position: 'absolute', right: '10px', bottom: '100px', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '20px', zIndex: 10 }}>
        
        <div className="rb" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
          <div className="ri" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,.11)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2">
              <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
              <circle cx="12" cy="12" r="3"/>
            </svg>
          </div>
          <span className="rc" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,.82)' }}>{video.views || 0}</span>
        </div>
        
        <div className="rb" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => onLike(video.id)}>
          <div className={`ri ${video.userLiked ? 'lk' : ''}`} style={{ width: '44px', height: '44px', borderRadius: '50%', background: video.userLiked ? 'rgba(255,79,46,.2)' : 'rgba(255,255,255,.11)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill={video.userLiked ? '#FF4F2E' : '#fff'}>
              <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/>
            </svg>
          </div>
          <span className="rc" style={{ fontSize: '10px', fontWeight: '700', color: video.userLiked ? '#FF4F2E' : 'rgba(255,255,255,.82)' }}>{formatLikes(video.likes)}</span>
        </div>
        
        <div className="rb" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => onComment(video.id)}>
          <div className="ri" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,.11)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2">
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/>
            </svg>
          </div>
          <span className="rc" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,.82)' }}>Comment</span>
        </div>
        
        <div className="rb" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px', cursor: 'pointer' }} onClick={() => onShare(video)}>
          <div className="ri" style={{ width: '44px', height: '44px', borderRadius: '50%', background: 'rgba(255,255,255,.11)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="white" strokeWidth="2">
              <circle cx="18" cy="5" r="3"/>
              <circle cx="6" cy="12" r="3"/>
              <circle cx="18" cy="19" r="3"/>
              <line x1="8.59" y1="13.51" x2="15.42" y2="17.49" stroke="white" strokeWidth="2"/>
              <line x1="15.41" y1="6.51" x2="8.59" y2="10.49" stroke="white" strokeWidth="2"/>
            </svg>
          </div>
          <span className="rc" style={{ fontSize: '10px', fontWeight: '700', color: 'rgba(255,255,255,.82)' }}>Share</span>
        </div>
        
      </div>
    </div>
  );
}

export default VideoCard;