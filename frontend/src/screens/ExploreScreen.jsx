import { useState, useEffect } from 'react';
import axios from 'axios';

function ExploreScreen() {
  const [trendingHashtags, setTrendingHashtags] = useState([]);
  const [topCreators, setTopCreators] = useState([]);
  const [trendingMovies, setTrendingMovies] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchExploreData = async () => {
      try {
        const [hashtagsRes, creatorsRes, moviesRes] = await Promise.all([
          axios.get('http://localhost:5000/api/videos/trending/hashtags'),
          axios.get('http://localhost:5000/api/videos/trending/creators'),
          axios.get('http://localhost:5000/api/videos/trending/popmovies')
        ]);
        setTrendingHashtags(hashtagsRes.data);
        setTopCreators(creatorsRes.data);
        setTrendingMovies(moviesRes.data);
      } catch (err) {
        console.error('Error fetching explore data:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchExploreData();
  }, []);

  if (loading) {
    return (
      <div style={{ position: 'absolute', inset: 0, top: '80px', bottom: '70px', overflowY: 'auto', padding: '0 14px', background: '#090909', zIndex: 10 }}>
        <div style={{ color: 'white', textAlign: 'center', padding: '40px' }}>Loading explore...</div>
      </div>
    );
  }

  return (
    <div style={{ position: 'absolute', inset: 0, top: '80px', bottom: '70px', overflowY: 'auto', padding: '0 14px', background: '#090909', zIndex: 10 }}>
      
      {/* Trending Hashtags */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '16px 0 10px' }}>
        <span style={{ fontSize: '9.5px', fontWeight: '800', color: 'rgba(255,255,255,0.34)' }}>TRENDING HASHTAGS</span>
        <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF4F2E' }}>See all</span>
      </div>
      <div>
        {trendingHashtags.map((tag, index) => (
          <div key={index} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '10px 0', borderBottom: '0.5px solid rgba(255,255,255,0.07)' }}>
            <span style={{ fontFamily: 'Syne', fontSize: '17px', fontWeight: '800', color: index < 3 ? '#FF4F2E' : 'rgba(255,255,255,0.12)', width: '24px' }}>#{index + 1}</span>
            <div style={{ width: '44px', height: '44px', borderRadius: '9px', background: '#FF4F2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <span style={{ fontSize: '18px' }}>#</span>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: '12.5px', fontWeight: '700', color: 'white' }}>#{tag.tags || `trending_${index + 1}`}</div>
              <div style={{ fontSize: '9.5px', color: 'rgba(255,255,255,0.34)' }}>{tag.count || 0} posts</div>
            </div>
          </div>
        ))}
      </div>

      {/* Top Creators */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '24px 0 10px' }}>
        <span style={{ fontSize: '9.5px', fontWeight: '800', color: 'rgba(255,255,255,0.34)' }}>TOP CREATORS</span>
        <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF4F2E' }}>See all</span>
      </div>
      <div style={{ display: 'flex', gap: '12px', overflowX: 'auto', paddingBottom: '10px' }}>
        {topCreators.map((creator) => (
          <div key={creator.id} style={{ textAlign: 'center', minWidth: '80px', cursor: 'pointer' }}>
            <div style={{ width: '60px', height: '60px', borderRadius: '50%', background: '#FF4F2E', margin: '0 auto 8px', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '20px', fontWeight: 'bold' }}>
              {creator.username?.charAt(0).toUpperCase() || 'U'}
            </div>
            <div style={{ fontSize: '11px', color: 'white' }}>@{creator.username}</div>
            <div style={{ fontSize: '9px', color: '#888' }}>{creator.video_count} videos</div>
          </div>
        ))}
      </div>

      {/* Trending Pop-Movies */}
      <div style={{ display: 'flex', justifyContent: 'space-between', margin: '24px 0 10px' }}>
        <span style={{ fontSize: '9.5px', fontWeight: '800', color: 'rgba(255,255,255,0.34)' }}>TRENDING POP-MOVIES</span>
        <span style={{ fontSize: '10.5px', fontWeight: '700', color: '#FF4F2E' }}>See all</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '20px' }}>
        {trendingMovies.map((movie) => (
          <div key={movie.id} style={{ borderRadius: '12px', overflow: 'hidden', cursor: 'pointer', border: '0.5px solid rgba(255,255,255,0.07)', aspectRatio: '9/14', position: 'relative', background: '#1a1a1a' }}>
            <div style={{ position: 'absolute', inset: 0, background: `linear-gradient(135deg, #1a0533, #8B1A4A)` }}></div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '8px', background: 'linear-gradient(to bottom, transparent, rgba(0,0,0,0.9))' }}>
              <div style={{ fontSize: '10.5px', fontWeight: '700', color: 'white', marginBottom: '4px' }}>{movie.title.substring(0, 30)}</div>
              <div style={{ fontSize: '9px', color: 'rgba(255,255,255,0.5)' }}>{movie.views || 0} views</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ExploreScreen;