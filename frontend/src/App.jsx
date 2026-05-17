import { useState, useEffect } from 'react';
import { useVideos } from './hooks/useVideos';
import { useComments } from './hooks/useComments';
import HomeScreen from './screens/HomeScreen';
import ExploreScreen from './screens/ExploreScreen';
import ProfileScreen from './screens/ProfileScreen';
import NotificationsScreen from './screens/NotificationsScreen';
import SearchResultsScreen from './screens/SearchResultsScreen';
import SettingsModal from './components/SettingsModal';
import UploadModal from './components/UploadModal';
import PopCamera from './components/PopCamera';
import ShareModal from './components/ShareModal';
import AuthPrompt from './components/AuthPrompt';
import './App.css';

function App() {
  const [currentScreen, setCurrentScreen] = useState('home');
  const [feedType, setFeedType] = useState('for-you');
  const [showUpload, setShowUpload] = useState(false);
  const [showComments, setShowComments] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [showSearch, setShowSearch] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showPopCamera, setShowPopCamera] = useState(false);
  const [showShare, setShowShare] = useState(false);
  const [showAuthPrompt, setShowAuthPrompt] = useState(false);
  const [shareVideo, setShareVideo] = useState(null);
  const [selectedVideoId, setSelectedVideoId] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [searchResults, setSearchResults] = useState(null);
  const [uploading, setUploading] = useState(false);
  
  const [isGuest, setIsGuest] = useState(true);
  const [interactionCount, setInteractionCount] = useState(0);

  const { videos, loading, loadVideos, loadFollowingVideos, loadMomentsVideos, handleLike, uploadVideo, toggleFollow } = useVideos();
  const { comments, loadComments, postComment } = useComments();

  const formatLikes = (count) => {
    if (!count) return '0';
    if (count >= 1000000) return (count / 1000000).toFixed(1) + 'M';
    if (count >= 1000) return (count / 1000).toFixed(1) + 'K';
    return count.toString();
  };

  const trackInteraction = () => {
    if (isGuest) {
      const newCount = interactionCount + 1;
      setInteractionCount(newCount);
      if (newCount >= 5 && !showAuthPrompt) {
        setShowAuthPrompt(true);
      }
    }
  };

  useEffect(() => {
    if (feedType === 'for-you') {
      loadVideos();
    } else if (feedType === 'following') {
      loadFollowingVideos();
    } else if (feedType === 'moments') {
      loadMomentsVideos();
    }
  }, [feedType, loadVideos, loadFollowingVideos, loadMomentsVideos]);

  const openComments = async (videoId) => {
    setSelectedVideoId(videoId);
    await loadComments(videoId);
    setShowComments(true);
  };

  const openCreatorProfile = (creatorId, creatorName) => {
    setCurrentScreen('profile');
  };

  const handlePostComment = async () => {
    const success = await postComment(selectedVideoId, commentText);
    if (success) {
      setCommentText('');
      await loadComments(selectedVideoId);
      trackInteraction();
    }
  };

  const handleShare = (video) => {
    setShareVideo(video);
    setShowShare(true);
    trackInteraction();
  };

  const handleFollow = async (creatorId) => {
    const result = await toggleFollow(creatorId);
    if (result.following !== undefined) {
      if (feedType === 'for-you') {
        loadVideos();
      } else if (feedType === 'following') {
        loadFollowingVideos();
      } else if (feedType === 'moments') {
        loadMomentsVideos();
      }
      trackInteraction();
    }
  };

  const handleLikeWithTracking = async (videoId) => {
    await handleLike(videoId);
    trackInteraction();
  };

  const uploadAndRefresh = async (file, title) => {
    setUploading(true);
    const result = await uploadVideo(file, title);
    if (result.success) {
      alert('Upload successful!');
      setShowUpload(false);
      if (feedType === 'for-you') {
        loadVideos();
      } else if (feedType === 'following') {
        loadFollowingVideos();
      } else if (feedType === 'moments') {
        loadMomentsVideos();
      }
      trackInteraction();
    } else {
      alert('Upload failed: ' + result.error);
    }
    setUploading(false);
  };

  const handleSearch = () => {
    if (searchInput.trim()) {
      setSearchResults(searchInput);
      setShowSearch(false);
    }
  };

  return (
    <div className="wrap">
      <div className="phone">
        <div className="notch"></div>

        <div className="sb">
          <span>9:41</span>
          <div className="sb-ic">
            <svg width="15" height="10" viewBox="0 0 16 11" fill="white">
              <rect x="0" y="3" width="3" height="8" rx="1" opacity="0.4"/>
              <rect x="4" y="2" width="3" height="9" rx="1" opacity="0.6"/>
              <rect x="8" y="0" width="3" height="11" rx="1" opacity="0.8"/>
              <rect x="12" y="0" width="3" height="11" rx="1"/>
            </svg>
            <div className="batt"></div>
          </div>
        </div>

        <div className="fh">
          <div className="fh-br">
            <div className="fh-dot">
              <svg viewBox="0 0 30 30">
                <circle cx="15" cy="13" r="8" fill="#FFF6EF"/>
                <circle cx="11" cy="10" r="2.5" fill="#1a0a00"/>
                <circle cx="19" cy="10" r="2.5" fill="#1a0a00"/>
              </svg>
            </div>
            <span className="fh-nm">popapp</span>
          </div>
          <div className="fh-r">
            <div className="fhb" onClick={() => setShowSearch(!showSearch)}>
              <svg viewBox="0 0 24 24" stroke="white" strokeWidth="2" fill="none">
                <circle cx="11" cy="11" r="7"/>
                <line x1="16.5" y1="16.5" x2="22" y2="22"/>
              </svg>
            </div>
            <div className="fhb" onClick={() => setShowMenu(true)}>
              <svg viewBox="0 0 24 24" stroke="white" strokeWidth="2" fill="none">
                <line x1="3" y1="6" x2="21" y2="6"/>
                <line x1="3" y1="12" x2="21" y2="12"/>
                <line x1="3" y1="18" x2="21" y2="18"/>
              </svg>
            </div>
          </div>
        </div>

        {showSearch && (
          <div style={{ padding: '8px 14px', background: '#090909', borderBottom: '0.5px solid #222' }}>
            <div style={{ display: 'flex', gap: '8px' }}>
              <input
                type="text"
                placeholder="Search..."
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                onKeyPress={(e) => {
                  if (e.key === 'Enter') {
                    handleSearch();
                  }
                }}
                autoFocus
                style={{ flex: 1, padding: '10px', borderRadius: '20px', background: '#222', border: 'none', color: 'white', outline: 'none' }}
              />
              <button onClick={handleSearch} style={{ background: '#FF4F2E', border: 'none', borderRadius: '20px', padding: '0 16px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Search</button>
            </div>
          </div>
        )}

        {!searchResults && (
          <div className="ftabs">
            <div className={`ft ${feedType === 'for-you' ? 'on' : ''}`} onClick={() => setFeedType('for-you')}>For you</div>
            <div className={`ft ${feedType === 'following' ? 'on' : ''}`} onClick={() => setFeedType('following')}>Following</div>
            <div className={`ft ${feedType === 'moments' ? 'on' : ''}`} onClick={() => setFeedType('moments')}>Moments</div>
            <div className="ft" onClick={() => alert('pop-movies - Coming soon')}>pop-movies</div>
          </div>
        )}

        {searchResults && (
          <SearchResultsScreen 
            query={searchResults}
            onClose={() => setSearchResults(null)}
            onLike={handleLikeWithTracking}
            onComment={openComments}
            onShare={handleShare}
            onCreatorClick={openCreatorProfile}
            onFollow={handleFollow}
            formatLikes={formatLikes}
          />
        )}

        {!searchResults && (
          <>
            {currentScreen === 'home' && (
              <HomeScreen 
                videos={videos}
                loading={loading}
                onUpload={() => setShowUpload(true)}
                onLike={handleLikeWithTracking}
                onComment={openComments}
                onShare={handleShare}
                onCreatorClick={openCreatorProfile}
                onFollow={handleFollow}
                formatLikes={formatLikes}
              />
            )}

            {currentScreen === 'explore' && <ExploreScreen />}

            {currentScreen === 'profile' && <ProfileScreen userId={1} />}

            {currentScreen === 'inbox' && <NotificationsScreen userId={1} />}
          </>
        )}

        <nav className="bnav">
          <div className={`bn ${currentScreen === 'home' ? 'on' : ''}`} onClick={() => setCurrentScreen('home')}>
            <div className="bn-ic"><svg viewBox="0 0 24 24"><path d="M3 12L12 3l9 9v9a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-9z"/></svg></div>
            <span className="bn-l">Home</span>
          </div>
          <div className={`bn ${currentScreen === 'explore' ? 'on' : ''}`} onClick={() => setCurrentScreen('explore')}>
            <div className="bn-ic"><svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="10" fill="none" stroke="currentColor" strokeWidth="2"/><polygon points="12,6 13.5,10.5 18,12 13.5,13.5 12,18 10.5,13.5 6,12 10.5,10.5" fill="currentColor"/></svg></div>
            <span className="bn-l">Explore</span>
          </div>
          <div className="bn-cre" onClick={() => setShowUpload(true)}>
            <div className="bn-pill"><svg viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="3" fill="white"/><polygon points="10,8 16,10 10,12" fill="#FF4F2E"/></svg></div>
            <span className="bn-cl">Upload</span>
          </div>
          <div className={`bn ${currentScreen === 'inbox' ? 'on' : ''}`} onClick={() => setCurrentScreen('inbox')}>
            <div className="bn-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg></div>
            <span className="bn-l">Inbox</span>
          </div>
          <div className={`bn ${currentScreen === 'profile' ? 'on' : ''}`} onClick={() => setCurrentScreen('profile')}>
            <div className="bn-ic"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg></div>
            <span className="bn-l">Profile</span>
          </div>
        </nav>

        <UploadModal 
          isOpen={showUpload}
          onClose={() => setShowUpload(false)}
          onUpload={async (file, title, description) => {
            setShowUpload(false);
            await uploadAndRefresh(file, title);
          }}
          onMakePop={() => setShowPopCamera(true)}
          onGoLive={() => alert('Go Live - Coming soon!')}
          uploading={uploading}
        />

        {showComments && (
          <div className="veil op" style={{ zIndex: 500 }} onClick={() => setShowComments(false)}>
            <div className="csh op" onClick={(e) => e.stopPropagation()}>
              <div className="csh-h"></div>
              <div className="csh-tl">Comments</div>
              <div className="csh-ls">
                {comments.length === 0 ? (
                  <div style={{ textAlign: 'center', padding: '20px', color: '#888' }}>No comments yet</div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment.id} className="cm">
                      <div className="cm-av">{comment.username?.charAt(0).toUpperCase() || 'U'}</div>
                      <div className="cm-mt">
                        <div className="cm-nm">{comment.username || 'user'}</div>
                        <div className="cm-tx">{comment.content}</div>
                        <div className="cm-tm">{new Date(comment.created_at).toLocaleString()}</div>
                      </div>
                    </div>
                  ))
                )}
              </div>
              <div className="csh-ir">
                <input
                  className="csh-if"
                  placeholder="Add a comment..."
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handlePostComment()}
                />
                <button onClick={handlePostComment} style={{ background: '#FF4F2E', border: 'none', borderRadius: '20px', padding: '10px 20px', color: 'white', fontWeight: 'bold', cursor: 'pointer' }}>Post</button>
              </div>
            </div>
          </div>
        )}

        <ShareModal 
          isOpen={showShare}
          onClose={() => setShowShare(false)}
          videoUrl={shareVideo?.video_url || ''}
          videoTitle={shareVideo?.title || ''}
          videoCreator={shareVideo?.username || ''}
        />

        {showMenu && (
          <div className="veil op" onClick={() => setShowMenu(false)}>
            <div className="menu-dropdown" onClick={(e) => e.stopPropagation()}>
              <div className="menu-item" onClick={() => { setFeedType('for-you'); setShowMenu(false); }}>For You</div>
              <div className="menu-item" onClick={() => { setFeedType('following'); setShowMenu(false); }}>Following</div>
              <div className="menu-item" onClick={() => { setFeedType('moments'); setShowMenu(false); }}>Moments</div>
              <div className="menu-item" onClick={() => { alert('pop-movies · Coming soon'); setShowMenu(false); }}>pop-movies</div>
              <div className="menu-item" onClick={() => { alert('pop-STUDIO · Coming soon'); setShowMenu(false); }}>pop-STUDIO</div>
              <div className="menu-item" onClick={() => { setShowMenu(false); setShowSettings(true); }}>Settings</div>
            </div>
          </div>
        )}

        <SettingsModal isOpen={showSettings} onClose={() => setShowSettings(false)} />

        <PopCamera isOpen={showPopCamera} onClose={() => setShowPopCamera(false)} onComplete={async (videoBlob) => {
          setShowPopCamera(false);
          const fileName = `pop_${Date.now()}.mp4`;
          const file = new File([videoBlob], fileName, { type: 'video/mp4' });
          await uploadAndRefresh(file, `Pop - ${new Date().toLocaleTimeString()}`);
        }} />

        <AuthPrompt 
          isOpen={showAuthPrompt}
          onClose={() => setShowAuthPrompt(false)}
          onSignup={async ({ email, username, password }) => {
            alert(`Welcome ${username}! Signup coming soon.`);
            setShowAuthPrompt(false);
            setIsGuest(false);
          }}
          onLogin={async ({ email, password }) => {
            alert('Login coming soon!');
            setShowAuthPrompt(false);
            setIsGuest(false);
          }}
        />

      </div>
    </div>
  );
}

export default App;