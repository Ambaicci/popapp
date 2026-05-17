import { useState, useEffect } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

function MomentsScreen({ onClose }) {
  const [moments, setMoments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedMoment, setSelectedMoment] = useState(null);
  const { user } = useAuth();
  const { showToast } = useToast();

  useEffect(() => {
    fetchMoments();
  }, []);

  const fetchMoments = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/moments/feed');
      setMoments(res.data);
    } catch (err) {
      console.error('Error fetching moments:', err);
    } finally {
      setLoading(false);
    }
  };

   const createMoment = async () => {
    // Open file picker for video
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'video/*';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      
      const formData = new FormData();
      formData.append('video', file);
      
      try {
        const res = await axios.post('http://localhost:5000/api/moments/create', formData);
        if (res.data.success) {
          showToast('Moment created! It will disappear in 24 hours', 'success');
          fetchMoments();
        }
      } catch (err) {
        console.error('Error creating moment:', err);
        showToast('Failed to create moment', 'error');
      }
    };
    input.click();
  };
  return (
    <div style={{ position: 'absolute', inset: 0, top: '80px', bottom: '70px', overflowY: 'auto', background: '#090909', zIndex: 10 }}>
      
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px 20px', borderBottom: '0.5px solid rgba(255,255,255,0.08)' }}>
        <button onClick={onClose} style={{ background: 'transparent', border: 'none', color: '#FF4F2E', fontSize: '16px', cursor: 'pointer' }}>← Back</button>
        <div style={{ fontSize: '18px', fontWeight: '600', color: 'white' }}>Moments</div>
        <button onClick={createMoment} style={{ background: '#FF4F2E', border: 'none', borderRadius: '20px', padding: '6px 14px', color: 'white', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}>+ Create</button>
      </div>

      {/* Moments Grid */}
      {moments.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px' }}>
          <div style={{ fontSize: '48px', marginBottom: '16px' }}>📸</div>
          <div style={{ color: '#888', fontSize: '14px' }}>No moments yet</div>
          <div style={{ color: '#666', fontSize: '12px', marginTop: '8px' }}>Create a moment that disappears in 24 hours</div>
          <button onClick={createMoment} style={{ marginTop: '20px', background: '#FF4F2E', border: 'none', borderRadius: '30px', padding: '10px 24px', color: 'white', fontWeight: '600', cursor: 'pointer' }}>Create your first moment</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2px', padding: '2px' }}>
          {moments.map((moment) => (
            <div 
              key={moment.id} 
              onClick={() => setSelectedMoment(moment)}
              style={{ 
                aspectRatio: '9/16', 
                position: 'relative', 
                overflow: 'hidden', 
                background: '#1a1a1a',
                cursor: 'pointer'
              }}
            >
              {moment.video_url && (
                <video
                  src={moment.video_url}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  muted
                  loop
                />
              )}
              <div style={{ 
                position: 'absolute', 
                bottom: '6px', 
                left: '6px', 
                right: '6px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div style={{ fontSize: '10px', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
                  {moment.username || 'User'}
                </div>
                <div style={{ fontSize: '9px', color: 'white', background: 'rgba(0,0,0,0.5)', padding: '2px 6px', borderRadius: '4px' }}>
                  {new Date(moment.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Fullscreen Moment Viewer */}
      {selectedMoment && (
        <div className="veil op" style={{ zIndex: 700, background: '#000' }} onClick={() => setSelectedMoment(null)}>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }} onClick={(e) => e.stopPropagation()}>
            <video
              src={selectedMoment.video_url}
              autoPlay
              loop
              playsInline
              style={{ width: '100%', height: '100%', objectFit: 'contain' }}
            />
            <button 
              onClick={() => setSelectedMoment(null)}
              style={{ position: 'absolute', top: '50px', right: '20px', background: 'rgba(0,0,0,0.6)', border: 'none', borderRadius: '30px', padding: '8px 16px', color: 'white', cursor: 'pointer' }}
            >
              ✕ Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default MomentsScreen;