import { useState, useEffect } from 'react';

function SettingsModal({ isOpen, onClose }) {
  const [settings, setSettings] = useState({
    darkMode: true,
    autoPlay: true,
    muteVideos: false,
    saveData: false,
    notifications: true
  });

  useEffect(() => {
    const saved = localStorage.getItem('popapp_settings');
    if (saved) {
      setSettings(JSON.parse(saved));
    }
  }, []);

  const saveSettings = (newSettings) => {
    setSettings(newSettings);
    localStorage.setItem('popapp_settings', JSON.stringify(newSettings));
    if (newSettings.darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
  };

  const toggleSetting = (key) => {
    const newSettings = { ...settings, [key]: !settings[key] };
    saveSettings(newSettings);
  };

  if (!isOpen) return null;

  return (
    <div className="veil op" style={{ zIndex: 600, background: 'rgba(0,0,0,0.92)' }} onClick={onClose}>
      <div 
        className="settings-modal"
        style={{ 
          position: 'absolute', 
          bottom: 0,
          left: '50%',
          transform: 'translateX(-50%)',
          maxWidth: '375px',
          width: '100%',
          background: '#0a0a0a',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '20px',
          animation: 'slideUp 0.3s ease'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: '40px', height: '4px', background: '#FF4F2E', borderRadius: '2px', margin: '0 auto 20px' }} />
        
        <div style={{ fontSize: '20px', fontWeight: '700', marginBottom: '20px', color: 'white' }}>Settings</div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div><div style={{ fontWeight: '500', color: 'white' }}>Dark Mode</div><div style={{ fontSize: '11px', color: '#888' }}>Use dark theme across the app</div></div>
          <button onClick={() => toggleSetting('darkMode')} style={{ width: '48px', height: '26px', borderRadius: '13px', background: settings.darkMode ? '#FF4F2E' : '#444', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2px', left: settings.darkMode ? '24px' : '2px', width: '22px', height: '22px', borderRadius: '11px', background: 'white', transition: 'left 0.2s' }} />
          </button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div><div style={{ fontWeight: '500', color: 'white' }}>Auto-Play Videos</div><div style={{ fontSize: '11px', color: '#888' }}>Automatically play videos as you scroll</div></div>
          <button onClick={() => toggleSetting('autoPlay')} style={{ width: '48px', height: '26px', borderRadius: '13px', background: settings.autoPlay ? '#FF4F2E' : '#444', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2px', left: settings.autoPlay ? '24px' : '2px', width: '22px', height: '22px', borderRadius: '11px', background: 'white' }} />
          </button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div><div style={{ fontWeight: '500', color: 'white' }}>Mute by Default</div><div style={{ fontSize: '11px', color: '#888' }}>Start videos muted</div></div>
          <button onClick={() => toggleSetting('muteVideos')} style={{ width: '48px', height: '26px', borderRadius: '13px', background: settings.muteVideos ? '#FF4F2E' : '#444', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2px', left: settings.muteVideos ? '24px' : '2px', width: '22px', height: '22px', borderRadius: '11px', background: 'white' }} />
          </button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div><div style={{ fontWeight: '500', color: 'white' }}>Save Data Mode</div><div style={{ fontSize: '11px', color: '#888' }}>Lower video quality to save bandwidth</div></div>
          <button onClick={() => toggleSetting('saveData')} style={{ width: '48px', height: '26px', borderRadius: '13px', background: settings.saveData ? '#FF4F2E' : '#444', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2px', left: settings.saveData ? '24px' : '2px', width: '22px', height: '22px', borderRadius: '11px', background: 'white' }} />
          </button>
        </div>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 0', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
          <div><div style={{ fontWeight: '500', color: 'white' }}>Push Notifications</div><div style={{ fontSize: '11px', color: '#888' }}>Receive alerts for likes, comments, and follows</div></div>
          <button onClick={() => toggleSetting('notifications')} style={{ width: '48px', height: '26px', borderRadius: '13px', background: settings.notifications ? '#FF4F2E' : '#444', border: 'none', cursor: 'pointer', position: 'relative' }}>
            <div style={{ position: 'absolute', top: '2px', left: settings.notifications ? '24px' : '2px', width: '22px', height: '22px', borderRadius: '11px', background: 'white' }} />
          </button>
        </div>
        
        <button onClick={onClose} style={{ width: '100%', padding: '14px', marginTop: '20px', background: '#FF4F2E', border: 'none', borderRadius: '40px', color: 'white', fontWeight: '600', fontSize: '15px', cursor: 'pointer' }}>Close</button>
      </div>
    </div>
  );
}

export default SettingsModal;