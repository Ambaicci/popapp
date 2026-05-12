import { useState } from 'react';
import axios from 'axios';

function AuthModal({ isOpen, onClose, onSuccess, mode = 'login' }) {
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(mode === 'login');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async () => {
    setError('');
    setLoading(true);

    try {
      let response;
      if (isLogin) {
        response = await axios.post('http://localhost:5000/api/auth/login', { email, password });
      } else {
        response = await axios.post('http://localhost:5000/api/auth/signup', { username, email, password });
      }
      
      if (response.data.token) {
        localStorage.setItem('token', response.data.token);
        localStorage.setItem('user', JSON.stringify(response.data.user));
        onSuccess(response.data.user);
        onClose();
      }
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="veil op" style={{ zIndex: 700, background: 'rgba(0,0,0,0.95)', backdropFilter: 'blur(8px)' }} onClick={onClose}>
      <div 
        className="auth-modal"
        style={{ 
          position: 'absolute', 
          top: '50%', 
          left: '50%', 
          transform: 'translate(-50%, -50%)',
          width: '300px',
          background: '#111',
          borderRadius: '28px',
          padding: '24px',
          animation: 'fadeIn 0.25s ease'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: '24px' }}>
          <div style={{ 
            width: '48px', 
            height: '48px', 
            background: '#FF4F2E', 
            borderRadius: '16px', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            margin: '0 auto 12px'
          }}>
            <svg width="24" height="24" viewBox="0 0 30 30" fill="white">
              <circle cx="15" cy="13" r="8" fill="#FFF6EF"/>
              <circle cx="11" cy="10" r="2.5" fill="#1a0a00"/>
              <circle cx="19" cy="10" r="2.5" fill="#1a0a00"/>
            </svg>
          </div>
          <div style={{ fontSize: '20px', fontWeight: '600', color: 'white' }}>popapp</div>
        </div>
        
        <div style={{ fontSize: '18px', fontWeight: '600', color: 'white', marginBottom: '4px' }}>
          {isLogin ? 'Welcome back' : 'Join popapp'}
        </div>
        <div style={{ fontSize: '12px', color: '#888', marginBottom: '20px' }}>
          {isLogin ? 'Sign in to continue' : 'Create an account to save your progress'}
        </div>
        
        {!isLogin && (
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            style={{
              width: '100%',
              padding: '14px',
              background: '#1a1a1a',
              border: '0.5px solid rgba(255,79,46,0.2)',
              borderRadius: '14px',
              color: 'white',
              fontSize: '14px',
              marginBottom: '12px',
              outline: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = '#FF4F2E'}
            onBlur={(e) => e.target.style.borderColor = 'rgba(255,79,46,0.2)'}
          />
        )}
        
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          style={{
            width: '100%',
            padding: '14px',
            background: '#1a1a1a',
            border: '0.5px solid rgba(255,79,46,0.2)',
            borderRadius: '14px',
            color: 'white',
            fontSize: '14px',
            marginBottom: '12px',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#FF4F2E'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,79,46,0.2)'}
        />
        
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
          style={{
            width: '100%',
            padding: '14px',
            background: '#1a1a1a',
            border: '0.5px solid rgba(255,79,46,0.2)',
            borderRadius: '14px',
            color: 'white',
            fontSize: '14px',
            marginBottom: '16px',
            outline: 'none'
          }}
          onFocus={(e) => e.target.style.borderColor = '#FF4F2E'}
          onBlur={(e) => e.target.style.borderColor = 'rgba(255,79,46,0.2)'}
        />
        
        {error && (
          <div style={{ color: '#FF4F2E', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>
            {error}
          </div>
        )}
        
        <button
          onClick={handleSubmit}
          disabled={loading}
          style={{
            width: '100%',
            padding: '14px',
            background: '#FF4F2E',
            border: 'none',
            borderRadius: '40px',
            color: 'white',
            fontWeight: '600',
            fontSize: '15px',
            cursor: loading ? 'not-allowed' : 'pointer',
            marginBottom: '16px'
          }}
        >
          {loading ? 'Please wait...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>
        
        <div style={{ textAlign: 'center', fontSize: '12px', color: '#666' }}>
          <span onClick={() => setIsLogin(!isLogin)} style={{ color: '#FF4F2E', cursor: 'pointer' }}>
            {isLogin ? 'Create an account' : 'Already have an account?'}
          </span>
        </div>
        
        <button
          onClick={onClose}
          style={{
            width: '100%',
            padding: '10px',
            background: 'transparent',
            border: 'none',
            color: '#888',
            fontSize: '13px',
            cursor: 'pointer',
            marginTop: '12px'
          }}
        >
          Continue as guest
        </button>
      </div>
    </div>
  );
}

export default AuthModal;