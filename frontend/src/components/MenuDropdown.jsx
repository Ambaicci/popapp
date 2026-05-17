function MenuDropdown({ showMenu, setShowMenu, feedType, setFeedType, user, logout, setShowAuthPrompt, setCurrentScreen, setShowSettings, showToast }) {
  if (!showMenu) return null;

  return (
    <div 
      className="menu-dropdown" 
      style={{ 
        position: 'absolute', 
        top: '60px', 
        right: '12px', 
        width: '180px', 
        background: 'rgba(18, 18, 18, 0.98)', 
        backdropFilter: 'blur(20px)', 
        borderRadius: '16px', 
        border: '1px solid rgba(255, 79, 46, 0.2)', 
        boxShadow: '0 8px 20px rgba(0, 0, 0, 0.4)', 
        zIndex: 501, 
        padding: '8px 4px' 
      }}
    >
      <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
        <div onClick={() => { setFeedType('for-you'); setShowMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#FF4F2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M3 12L12 3l9 9v9a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-9z"/></svg>
          </div>
          <span style={{ flex: 1, color: 'white', fontSize: '13px' }}>For You</span>
        </div>
        
        <div onClick={() => { setFeedType('following'); setShowMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#1D9E75', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </div>
          <span style={{ flex: 1, color: 'white', fontSize: '13px' }}>Following</span>
        </div>
        
        <div style={{ height: '0.5px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 8px' }} />
        
        <div onClick={() => { showToast('pop-movies · Coming soon', 'info'); setShowMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#8B5CF6', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><rect x="2" y="3" width="20" height="14" rx="3"/><polygon points="10,8 16,10 10,12" fill="#FF4F2E"/></svg>
          </div>
          <span style={{ flex: 1, color: 'white', fontSize: '13px' }}>pop-movies</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>soon</span>
        </div>
        
        <div onClick={() => { showToast('pop-STUDIO · Coming soon', 'info'); setShowMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#FF4F2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M4 4l16 8-16 8V4z"/></svg>
          </div>
          <span style={{ flex: 1, color: 'white', fontSize: '13px' }}>pop-STUDIO</span>
          <span style={{ color: 'rgba(255,255,255,0.3)', fontSize: '9px' }}>soon</span>
        </div>
        
        <div style={{ height: '0.5px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 8px' }} />
        
        {!user && (
          <div onClick={() => { setShowMenu(false); setShowAuthPrompt(true); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(255,79,46,0.1)' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#FF4F2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
            </div>
            <span style={{ flex: 1, color: 'white', fontSize: '13px' }}>Sign In</span>
            <span style={{ color: '#FF4F2E', fontSize: '11px' }}>→</span>
          </div>
        )}
        
        {user && (
          <div onClick={() => { setCurrentScreen('profile'); setShowMenu(false); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', background: 'rgba(255,79,46,0.05)' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '50%', background: '#FF4F2E', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '10px', fontWeight: 'bold', color: 'white' }}>
              {user.username?.charAt(0).toUpperCase()}
            </div>
            <span style={{ flex: 1, color: 'white', fontSize: '12px' }}>{user.username}</span>
            <span style={{ color: '#FF4F2E', fontSize: '11px' }}>→</span>
          </div>
        )}
        
        {user && (
          <div onClick={() => { setShowMenu(false); logout(); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer', marginTop: '2px' }}>
            <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#FF4F2E', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
            </div>
            <span style={{ flex: 1, color: '#FF4F2E', fontSize: '13px' }}>Logout</span>
          </div>
        )}
        
        <div style={{ height: '0.5px', background: 'rgba(255, 255, 255, 0.08)', margin: '4px 8px' }} />
        
        <div onClick={() => { setShowMenu(false); setShowSettings(true); }} style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '8px 12px', borderRadius: '10px', cursor: 'pointer' }}>
          <div style={{ width: '22px', height: '22px', borderRadius: '6px', background: '#6B7280', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <svg width="13" height="13" viewBox="0 0 24 24" fill="white"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 01-2.83 2.83l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-4 0v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 010-4h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 012.83-2.83l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 014 0v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 010 4h-.09a1.65 1.65 0 00-1.51 1z"/></svg>
          </div>
          <span style={{ flex: 1, color: 'white', fontSize: '13px' }}>Settings</span>
        </div>
      </div>
    </div>
  );
}

export default MenuDropdown;