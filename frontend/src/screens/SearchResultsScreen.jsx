import { useState, useEffect } from 'react';
import axios from 'axios';
import VideoCard from '../components/VideoCard';

function SearchResultsScreen({ query, onClose, onLike, onComment, onShare, onCreatorClick, onFollow, formatLikes }) {
  const [results, setResults] = useState({ videos: [], creators: [], popMovies: [], hashtags: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    const search = async () => {
      if (!query || query.trim() === '') {
        setLoading(false);
        return;
      }
      try {
        const res = await axios.get(`http://localhost:5000/api/videos/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search error:', err);
      } finally {
        setLoading(false);
      }
    };
    search();
  }, [query]);

  const getTotalCount = () => {
    return (results.videos?.length || 0) + (results.creators?.length || 0) + 
           (results.popMovies?.length || 0) + (results.hashtags?.length || 0);
  };

  if (loading) {
    return (
      <div style={{ position: 'absolute', inset: 0, top: '120px', bottom: '70px', overflowY: 'auto', padding: '0 14px', background: '#090909', zIndex: 10 }}>
        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Searching...</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, top: '120px', bottom: '70px', overflowY: 'auto', padding: '0 14px', background: '#090909', zIndex: 10 }}>
      
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
        <div style={{ fontSize: '20px', fontWeight: '800', color: 'white' }}>Results for "{query}"</div>
        <button onClick={onClose} style={{ background: '#222', border: 'none', borderRadius: '20px', padding: '6px 14px', color: '#aaa', cursor: 'pointer' }}>Back</button>
      </div>
      
      <div style={{ fontSize: '13px', color: '#888', marginBottom: '16px' }}>{getTotalCount()} results found</div>
      
      <div style={{ display: 'flex', gap: '8px', marginBottom: '20px', borderBottom: '0.5px solid #222', paddingBottom: '10px', overflowX: 'auto' }}>
        {['all', 'videos', 'creators', 'pop-movies', 'hashtags'].map(tab => (
          <button key={tab} onClick={() => setActiveTab(tab)} style={{ background: activeTab === tab ? '#FF4F2E' : 'transparent', border: activeTab === tab ? 'none' : '1px solid #333', padding: '6px 16px', borderRadius: '20px', color: activeTab === tab ? 'white' : '#aaa', fontSize: '12px', fontWeight: '600', cursor: 'pointer', whiteSpace: 'nowrap' }}>
            {tab.charAt(0).toUpperCase() + tab.slice(1)} ({activeTab === 'all' ? getTotalCount() : 
              activeTab === 'videos' ? (results.videos?.length || 0) :
              activeTab === 'creators' ? (results.creators?.length || 0) :
              activeTab === 'pop-movies' ? (results.popMovies?.length || 0) :
              (results.hashtags?.length || 0)})
          </button>
        ))}
      </div>
      
      {(activeTab === 'all' || activeTab === 'videos') && results.videos?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>📹 Videos</div>
          {results.videos.slice(0, activeTab === 'all' ? 5 : results.videos.length).map(video => (
            <VideoCard key={video.id} video={video} onLike={onLike} onComment={onComment} onShare={onShare} onCreatorClick={onCreatorClick} onFollow={onFollow} formatLikes={formatLikes} />
          ))}
          {activeTab === 'all' && results.videos.length > 5 && (
            <button onClick={() => setActiveTab('videos')} style={{ color: '#FF4F2E', background: 'none', border: 'none', marginTop: '8px', cursor: 'pointer' }}>See all {results.videos.length} videos →</button>
          )}
        </div>
      )}
      
      {(activeTab === 'all' || activeTab === 'creators') && results.creators?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>👤 Creators</div>
          {results.creators.slice(0, activeTab === 'all' ? 3 : results.creators.length).map(creator => (
            <div key={creator.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px', background: '#111', borderRadius: '12px', cursor: 'pointer', marginBottom: '8px' }} onClick={() => onCreatorClick(creator.id, creator.username)}>
              <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: '#FF4F2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px', fontWeight: 'bold' }}>{creator.username?.charAt(0).toUpperCase()}</div>
              <div style={{ flex: 1 }}><div style={{ fontWeight: 'bold', color: 'white' }}>@{creator.username}</div><div style={{ fontSize: '11px', color: '#888' }}>{creator.video_count || 0} videos</div></div>
            </div>
          ))}
        </div>
      )}
      
      {(activeTab === 'all' || activeTab === 'pop-movies') && results.popMovies?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}>🎬 Pop-Movies</div>
          {results.popMovies.slice(0, activeTab === 'all' ? 3 : results.popMovies.length).map(movie => (
            <VideoCard key={movie.id} video={movie} onLike={onLike} onComment={onComment} onShare={onShare} onCreatorClick={onCreatorClick} onFollow={onFollow} formatLikes={formatLikes} />
          ))}
        </div>
      )}
      
      {(activeTab === 'all' || activeTab === 'hashtags') && results.hashtags?.length > 0 && (
        <div style={{ marginBottom: '24px' }}>
          <div style={{ fontSize: '14px', fontWeight: '700', marginBottom: '12px' }}># Hashtags</div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
            {results.hashtags.map((tag, idx) => (
              <div key={idx} style={{ background: '#222', padding: '6px 14px', borderRadius: '20px', fontSize: '13px', color: '#FF4F2E', cursor: 'pointer' }}>{tag.hashtag} ({tag.count})</div>
            ))}
          </div>
        </div>
      )}
      
      {getTotalCount() === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: '#888' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
          <div>No results found for "{query}"</div>
          <div style={{ fontSize: '12px', marginTop: '8px' }}>Try different keywords</div>
        </div>
      )}
    </div>
  );
}

export default SearchResultsScreen;