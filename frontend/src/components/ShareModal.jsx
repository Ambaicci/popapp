import { useState } from 'react';

function ShareModal({ isOpen, onClose, videoUrl, videoTitle, videoCreator }) {
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const shareLinks = {
    whatsapp: `https://wa.me/?text=Check out "${videoTitle}" by ${videoCreator} on PopApp! ${videoUrl}`,
    twitter: `https://twitter.com/intent/tweet?text=Check out "${videoTitle}" by ${videoCreator} on PopApp!&url=${encodeURIComponent(videoUrl)}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(videoUrl)}`,
    telegram: `https://t.me/share/url?url=${encodeURIComponent(videoUrl)}&text=Check out "${videoTitle}" by ${videoCreator} on PopApp!`,
    email: `mailto:?subject=Check out this video on PopApp&body=I thought you'd enjoy "${videoTitle}" by ${videoCreator}. Watch it here: ${videoUrl}`
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(videoUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      alert('Failed to copy link');
    }
  };

  const openShare = (url) => {
    window.open(url, '_blank', 'width=600,height=400');
  };

  return (
    <div className="veil op" style={{ zIndex: 600, background: 'rgba(0,0,0,0.92)' }} onClick={onClose}>
      <div 
        className="share-modal"
        style={{ 
          position: 'absolute', 
          bottom: 0,
          left: 0,
          right: 0,
          background: '#0a0a0a',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          overflow: 'hidden',
          animation: 'slideUp 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Handle */}
        <div style={{ width: '40px', height: '4px', background: '#FF4F2E', borderRadius: '2px', margin: '14px auto 12px' }} />
        
        {/* Header */}
        <div style={{ padding: '0 20px 16px', borderBottom: '0.5px solid rgba(255,79,46,0.15)' }}>
          <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.2px', color: 'white', fontFamily: "'Syne', system-ui" }}>Share</div>
          <div style={{ fontSize: '13px', color: '#888', marginTop: '4px' }}>Spread the moment</div>
        </div>
        
        <div style={{ padding: '20px' }}>
          
          {/* Video Info */}
          <div style={{ 
            background: '#111', 
            borderRadius: '16px', 
            padding: '12px', 
            marginBottom: '20px',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}>
            <div style={{ 
              width: '48px', 
              height: '48px', 
              background: '#FF4F2E', 
              borderRadius: '10px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'center',
              flexShrink: 0
            }}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="3" width="20" height="14" rx="3"/>
                <polygon points="10,8 16,10 10,12" fill="white"/>
              </svg>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontWeight: '600', color: 'white', fontSize: '14px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {videoTitle || 'Untitled video'}
              </div>
              <div style={{ fontSize: '12px', color: '#888' }}>by {videoCreator || 'Creator'}</div>
            </div>
          </div>
          
          {/* Copy Link Button */}
          <div 
            onClick={handleCopyLink}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '16px',
              background: '#111',
              borderRadius: '16px',
              marginBottom: '20px',
              cursor: 'pointer',
              transition: 'background 0.15s',
              border: '0.5px solid rgba(255,79,46,0.2)'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#111'}
          >
            <div style={{ width: '44px', height: '44px', background: '#FF4F2E', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="9" y="9" width="13" height="13" rx="2" />
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>{copied ? 'Copied!' : 'Copy link'}</div>
              <div style={{ fontSize: '12px', color: '#888' }}>Share link with anyone</div>
            </div>
            {copied && <div style={{ color: '#FF4F2E', fontSize: '14px' }}>✓</div>}
          </div>
          
          <div style={{ fontSize: '13px', fontWeight: '500', color: 'white', marginBottom: '12px' }}>Share via</div>
          
          {/* Social Share Options - Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '12px', marginBottom: '20px' }}>
            
            {/* WhatsApp */}
            <div 
              onClick={() => openShare(shareLinks.whatsapp)}
              style={{
                textAlign: 'center',
                padding: '12px 8px',
                background: '#111',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#111'}
            >
              <div style={{ width: '44px', height: '44px', background: '#25D366', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.149-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.372-.025-.521-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.095 3.2 5.076 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z"/>
                </svg>
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>WhatsApp</div>
            </div>
            
            {/* Twitter */}
            <div 
              onClick={() => openShare(shareLinks.twitter)}
              style={{
                textAlign: 'center',
                padding: '12px 8px',
                background: '#111',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#111'}
            >
              <div style={{ width: '44px', height: '44px', background: '#1DA1F2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z"/>
                </svg>
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>Twitter</div>
            </div>
            
            {/* Facebook */}
            <div 
              onClick={() => openShare(shareLinks.facebook)}
              style={{
                textAlign: 'center',
                padding: '12px 8px',
                background: '#111',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#111'}
            >
              <div style={{ width: '44px', height: '44px', background: '#1877F2', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
                </svg>
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>Facebook</div>
            </div>
            
            {/* Telegram */}
            <div 
              onClick={() => openShare(shareLinks.telegram)}
              style={{
                textAlign: 'center',
                padding: '12px 8px',
                background: '#111',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#111'}
            >
              <div style={{ width: '44px', height: '44px', background: '#26A5E4', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 8px' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="white">
                  <path d="M21.5 4.5L2.5 10.5L8.5 13.5L13.5 17.5L16.5 22.5L21.5 4.5Z"/>
                </svg>
              </div>
              <div style={{ fontSize: '11px', color: '#aaa' }}>Telegram</div>
            </div>
            
          </div>
          
          {/* Email Option */}
          <div 
            onClick={() => openShare(shareLinks.email)}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '16px',
              padding: '14px',
              background: '#111',
              borderRadius: '16px',
              marginBottom: '20px',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#111'}
          >
            <div style={{ width: '44px', height: '44px', background: '#666', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                <rect x="2" y="4" width="20" height="16" rx="2" />
                <polyline points="22,7 12,13 2,7" />
              </svg>
            </div>
            <div style={{ flex: 1 }}>
              <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>Email</div>
              <div style={{ fontSize: '12px', color: '#888' }}>Share via email</div>
            </div>
            <div style={{ color: '#FF4F2E' }}>→</div>
          </div>
          
          {/* Close Button */}
          <button
            onClick={onClose}
            style={{
              width: '100%',
              padding: '14px',
              background: '#1a1a1a',
              border: 'none',
              borderRadius: '40px',
              color: '#aaa',
              fontWeight: '500',
              fontSize: '15px',
              cursor: 'pointer',
              transition: 'background 0.15s'
            }}
            onMouseEnter={(e) => e.currentTarget.style.background = '#222'}
            onMouseLeave={(e) => e.currentTarget.style.background = '#1a1a1a'}
          >
            Close
          </button>
          
        </div>
      </div>
    </div>
  );
}

export default ShareModal;