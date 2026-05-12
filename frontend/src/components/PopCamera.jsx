import { useState, useRef, useEffect } from 'react';

function PopCamera({ isOpen, onClose, onComplete }) {
  if (!isOpen) return null;

  const [hasPermission, setHasPermission] = useState(false);
  const [cameraError, setCameraError] = useState(false);
  const [recording, setRecording] = useState(false);
  const [duration, setDuration] = useState(0);
  const [selectedDuration, setSelectedDuration] = useState(15);
  const [previewUrl, setPreviewUrl] = useState(null);
  const [step, setStep] = useState('camera');
  const videoRef = useRef(null);
  const mediaRecorderRef = useRef(null);
  const chunksRef = useRef([]);
  const timerRef = useRef(null);

  const durationOptions = [15, 30, 60];

  useEffect(() => {
    startCamera();
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
      if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
        mediaRecorderRef.current.stop();
      }
    };
  }, []);

  const startCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      setHasPermission(true);
      setCameraError(false);
    } catch (err) {
      console.error('Camera error:', err);
      setCameraError(true);
      setHasPermission(false);
    }
  };

  const startRecording = () => {
    const stream = videoRef.current.srcObject;
    if (!stream) return;

    const mediaRecorder = new MediaRecorder(stream);
    mediaRecorderRef.current = mediaRecorder;
    chunksRef.current = [];

    mediaRecorder.ondataavailable = (e) => {
      if (e.data.size > 0) {
        chunksRef.current.push(e.data);
      }
    };

    mediaRecorder.onstop = () => {
      const blob = new Blob(chunksRef.current, { type: 'video/mp4' });
      const url = URL.createObjectURL(blob);
      setPreviewUrl(url);
      setStep('preview');
      if (timerRef.current) clearInterval(timerRef.current);
    };

    mediaRecorder.start();
    setRecording(true);
    setDuration(0);

    timerRef.current = setInterval(() => {
      setDuration(prev => {
        if (prev + 1 >= selectedDuration) {
          stopRecording();
          return prev;
        }
        return prev + 1;
      });
    }, 1000);
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      setRecording(false);
      if (timerRef.current) clearInterval(timerRef.current);
    }
  };

  const handleRecordTouchStart = () => {
    if (!recording) {
      startRecording();
    }
  };

  const handleRecordTouchEnd = () => {
    if (recording) {
      stopRecording();
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handlePost = () => {
    fetch(previewUrl)
      .then(res => res.blob())
      .then(blob => {
        onComplete(blob);
      });
  };

  if (cameraError) {
    return (
      <div className="veil op" style={{ zIndex: 700, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', textAlign: 'center', padding: '20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📷</div>
          <div style={{ fontSize: '18px', fontWeight: '600', marginBottom: '8px' }}>Camera not found</div>
          <div style={{ fontSize: '14px', color: '#888', marginBottom: '24px' }}>Your device doesn't have a camera or camera access was denied.</div>
          <button onClick={onClose} style={{ background: '#FF4F2E', border: 'none', padding: '12px 24px', borderRadius: '30px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Go Back</button>
        </div>
      </div>
    );
  }

  if (!hasPermission) {
    return (
      <div className="veil op" style={{ zIndex: 700, background: '#000', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ color: 'white', textAlign: 'center' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎥</div>
          <div>Requesting camera access...</div>
          <button onClick={onClose} style={{ marginTop: '24px', background: '#FF4F2E', border: 'none', padding: '10px 24px', borderRadius: '30px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Go Back</button>
        </div>
      </div>
    );
  }

  return (
    <div className="veil op" style={{ zIndex: 700, background: '#000' }} onClick={onClose}>
      <div style={{ position: 'absolute', inset: 0 }} onClick={(e) => e.stopPropagation()}>
        
        {step === 'camera' && (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              muted
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, padding: '50px 20px 20px', background: 'linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)', zIndex: 10 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <button onClick={onClose} style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '30px', padding: '8px 16px', color: 'white', fontSize: '14px', cursor: 'pointer' }}>Cancel</button>
                <div style={{ color: 'white', fontSize: '18px', fontWeight: '600' }}>Make a Pop</div>
                <div style={{ width: '60px' }} />
              </div>
            </div>
            
            <div style={{ position: 'absolute', top: '120px', right: '16px', background: 'rgba(0,0,0,0.6)', borderRadius: '30px', padding: '8px', zIndex: 10 }}>
              {durationOptions.map(opt => (
                <button
                  key={opt}
                  onClick={() => setSelectedDuration(opt)}
                  style={{
                    background: selectedDuration === opt ? '#FF4F2E' : 'transparent',
                    border: 'none',
                    padding: '8px 16px',
                    borderRadius: '24px',
                    color: 'white',
                    fontSize: '12px',
                    fontWeight: '600',
                    cursor: 'pointer',
                    margin: '0 2px'
                  }}
                >
                  {opt}s
                </button>
              ))}
            </div>
            
            {recording && (
              <div style={{ position: 'absolute', top: '120px', left: '50%', transform: 'translateX(-50%)', background: 'rgba(0,0,0,0.7)', padding: '6px 16px', borderRadius: '30px', zIndex: 10 }}>
                <span style={{ color: '#FF4F2E', fontSize: '18px', fontWeight: '700' }}>{formatTime(duration)}</span>
                <span style={{ color: 'white', fontSize: '14px' }}> / {selectedDuration}s</span>
              </div>
            )}
            
            <div style={{ position: 'absolute', bottom: '40px', left: 0, right: 0, display: 'flex', justifyContent: 'center', zIndex: 10 }}>
              <div
                onMouseDown={handleRecordTouchStart}
                onMouseUp={handleRecordTouchEnd}
                onTouchStart={handleRecordTouchStart}
                onTouchEnd={handleRecordTouchEnd}
                style={{
                  width: '80px',
                  height: '80px',
                  borderRadius: '50%',
                  background: recording ? '#FF4F2E' : 'white',
                  border: '3px solid rgba(255,255,255,0.8)',
                  cursor: 'pointer',
                  transition: 'transform 0.1s, background 0.2s',
                  boxShadow: '0 0 20px rgba(255,79,46,0.5)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}
              >
                {!recording && (
                  <div style={{ 
                    width: '30px', 
                    height: '30px', 
                    borderRadius: '50%', 
                    background: '#FF4F2E'
                  }} />
                )}
                {recording && (
                  <div style={{ 
                    width: '20px', 
                    height: '20px', 
                    background: 'white'
                  }} />
                )}
              </div>
            </div>
            
            <div style={{ position: 'absolute', bottom: '55px', right: '30px', zIndex: 10 }}>
              <button style={{ background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '40px', padding: '10px', cursor: 'pointer' }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2">
                  <rect x="2" y="3" width="20" height="14" rx="3"/>
                  <polygon points="10,8 16,10 10,12" fill="#FF4F2E"/>
                </svg>
              </button>
            </div>
          </>
        )}
        
        {step === 'preview' && previewUrl && (
          <div style={{ position: 'absolute', inset: 0, background: '#000' }}>
            <video
              src={previewUrl}
              autoPlay
              loop
              playsInline
              style={{
                position: 'absolute',
                inset: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
            
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, padding: '20px', background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)' }}>
              <div style={{ display: 'flex', gap: '12px' }}>
                <button onClick={() => setStep('camera')} style={{ flex: 1, padding: '14px', background: 'rgba(255,255,255,0.2)', border: 'none', borderRadius: '30px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Retake</button>
                <button onClick={handlePost} style={{ flex: 1, padding: '14px', background: '#FF4F2E', border: 'none', borderRadius: '30px', color: 'white', fontWeight: '700', cursor: 'pointer' }}>Post to Feed</button>
              </div>
            </div>
          </div>
        )}
        
      </div>
    </div>
  );
}

export default PopCamera;