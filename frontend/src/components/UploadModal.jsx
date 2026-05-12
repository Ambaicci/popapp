import { useState, useRef } from 'react';

function UploadModal({ isOpen, onClose, onUpload, onMakePop, onGoLive, uploading }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const fileInputRef = useRef(null);

  const handleFileSelect = (e) => {
    const file = e.target.files[0];
    if (file && file.type.startsWith('video/')) {
      setSelectedFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
      setShowForm(true);
    } else if (file) {
      alert('Please select a video file');
    }
  };

  const handleUpload = () => {
    if (!selectedFile) {
      alert('Please select a video file');
      return;
    }
    const finalTitle = title.trim() || selectedFile.name.replace(/\.[^/.]+$/, '');
    onUpload(selectedFile, finalTitle, description);
  };

  const resetForm = () => {
    setTitle('');
    setDescription('');
    setSelectedFile(null);
    setPreviewUrl(null);
    setShowForm(false);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const openFilePicker = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="veil op" style={{ zIndex: 600, background: 'rgba(0,0,0,0.92)' }} onClick={handleClose}>
      <div 
        className="upload-modal"
        style={{ 
          position: 'absolute', 
          bottom: 0,
          left: 0,
          right: 0,
          maxHeight: '85%',
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
        
        {/* Header with Back button when in form view */}
        <div style={{ padding: '0 20px 16px', borderBottom: '0.5px solid rgba(255,79,46,0.15)', display: 'flex', alignItems: 'center', gap: '12px' }}>
          {showForm && (
            <button 
              onClick={() => { resetForm(); setShowForm(false); }}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#FF4F2E',
                fontSize: '16px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                padding: 0
              }}
            >
              ←
            </button>
          )}
          <div style={{ fontSize: '22px', fontWeight: '600', letterSpacing: '-0.2px', color: 'white', fontFamily: "'Syne', system-ui" }}>
            {showForm ? 'New post' : 'Create'}
          </div>
        </div>
        
        {!showForm ? (
          /* Options List - Vertical */
          <div style={{ padding: '8px 16px 24px' }}>
            
            {/* Upload from Device */}
            <div 
              onClick={openFilePicker}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: '#111',
                borderRadius: '16px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#111'}
            >
              <div style={{ width: '44px', height: '44px', background: '#FF4F2E', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="3"/>
                  <polygon points="10,8 16,10 10,12" fill="white"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>Upload from device</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Select a video from your gallery</div>
              </div>
              <div style={{ color: '#FF4F2E' }}>→</div>
            </div>
            
            {/* Hidden file input */}
            <input
              ref={fileInputRef}
              type="file"
              accept="video/*"
              style={{ display: 'none' }}
              onChange={handleFileSelect}
            />
            
            {/* Make a Pop */}
            <div 
              onClick={() => { onMakePop(); handleClose(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: '#111',
                borderRadius: '16px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#111'}
            >
              <div style={{ width: '44px', height: '44px', background: '#FF4F2E', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="10"/>
                  <polygon points="10,8 16,12 10,16" fill="white"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>Make a Pop</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Record a short, loopable video</div>
              </div>
              <div style={{ color: '#FF4F2E' }}>→</div>
            </div>
            
            {/* Go Live */}
            <div 
              onClick={() => { onGoLive(); handleClose(); }}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '16px',
                padding: '16px',
                background: '#111',
                borderRadius: '16px',
                marginBottom: '8px',
                cursor: 'pointer',
                transition: 'background 0.15s'
              }}
              onMouseEnter={(e) => e.currentTarget.style.background = '#1a1a1a'}
              onMouseLeave={(e) => e.currentTarget.style.background = '#111'}
            >
              <div style={{ width: '44px', height: '44px', background: '#FF4F2E', borderRadius: '12px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <circle cx="12" cy="12" r="3"/>
                  <path d="M19 10c0-4-3-7-7-7s-7 3-7 7M5 14h14M12 17v4"/>
                </svg>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: '600', color: 'white', fontSize: '15px' }}>Go Live</div>
                <div style={{ fontSize: '12px', color: '#888' }}>Stream to your followers in real-time</div>
              </div>
              <div style={{ color: '#FF4F2E' }}>→</div>
            </div>
            
          </div>
        ) : (
          /* Upload Form */
          <div style={{ padding: '20px', overflowY: 'auto', maxHeight: 'calc(85vh - 100px)' }}>
            
            {/* Video Preview */}
            {previewUrl && (
              <div style={{ marginBottom: '20px' }}>
                <div style={{ position: 'relative', borderRadius: '16px', overflow: 'hidden', background: '#000' }}>
                  <video
                    src={previewUrl}
                    style={{ width: '100%', height: 'auto', maxHeight: '200px', objectFit: 'cover' }}
                    controls
                  />
                  <button
                    onClick={() => { setPreviewUrl(null); setSelectedFile(null); }}
                    style={{
                      position: 'absolute',
                      top: '8px',
                      right: '8px',
                      background: '#FF4F2E',
                      border: 'none',
                      borderRadius: '20px',
                      padding: '4px 12px',
                      color: 'white',
                      fontSize: '11px',
                      cursor: 'pointer'
                    }}
                  >
                    Change
                  </button>
                </div>
              </div>
            )}
            
            {/* Title Input */}
            <div style={{ marginBottom: '16px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'white', marginBottom: '8px' }}>Title</div>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Give your video a title"
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#111',
                  border: '0.5px solid rgba(255,79,46,0.2)',
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '14px',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF4F2E'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,79,46,0.2)'}
              />
            </div>
            
            {/* Description Input */}
            <div style={{ marginBottom: '24px' }}>
              <div style={{ fontSize: '13px', fontWeight: '500', color: 'white', marginBottom: '8px' }}>Description</div>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Tell the story behind this video..."
                rows="3"
                style={{
                  width: '100%',
                  padding: '14px',
                  background: '#111',
                  border: '0.5px solid rgba(255,79,46,0.2)',
                  borderRadius: '14px',
                  color: 'white',
                  fontSize: '13px',
                  fontFamily: 'inherit',
                  resize: 'none',
                  outline: 'none'
                }}
                onFocus={(e) => e.target.style.borderColor = '#FF4F2E'}
                onBlur={(e) => e.target.style.borderColor = 'rgba(255,79,46,0.2)'}
              />
            </div>
            
            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button
                onClick={handleClose}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: '#1a1a1a',
                  border: 'none',
                  borderRadius: '40px',
                  color: '#aaa',
                  fontWeight: '500',
                  fontSize: '15px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>
              <button
                onClick={handleUpload}
                disabled={uploading || !selectedFile}
                style={{
                  flex: 1,
                  padding: '14px',
                  background: (!selectedFile || uploading) ? '#4a2a1e' : '#FF4F2E',
                  border: 'none',
                  borderRadius: '40px',
                  color: 'white',
                  fontWeight: '600',
                  fontSize: '15px',
                  cursor: (!selectedFile || uploading) ? 'not-allowed' : 'pointer'
                }}
              >
                {uploading ? 'Uploading...' : 'Post to Feed'}
              </button>
            </div>
            
          </div>
        )}
        
      </div>
    </div>
  );
}

export default UploadModal;