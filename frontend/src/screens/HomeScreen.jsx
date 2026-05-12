import VideoCard from '../components/VideoCard';

function HomeScreen({ videos, loading, onUpload, onLike, onComment, onShare, onCreatorClick, onFollow, formatLikes }) { 
 return (
    <div className="fs" style={{ marginTop: '8px' }}>
      {loading ? (
        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Loading videos...</div>
      ) : videos.length === 0 ? (
        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>
          <p>No videos yet</p>
          <button onClick={onUpload} style={{ background: '#FF4F2E', padding: '10px 20px', border: 'none', borderRadius: '8px', color: 'white', marginTop: '10px', cursor: 'pointer' }}>
            Upload your first video
          </button>
        </div>
      ) : (
        videos.map((video) => (
<VideoCard 
  key={video.id} 
  video={video} 
  onLike={onLike} 
  onComment={onComment} 
  onShare={onShare}
  onCreatorClick={onCreatorClick}
  onFollow={onFollow}
  formatLikes={formatLikes} 
/>        ))
      )}
    </div>
  );
}

export default HomeScreen;