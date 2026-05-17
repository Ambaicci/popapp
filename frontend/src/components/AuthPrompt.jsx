import { useState } from 'react';
import { useToast } from '../context/ToastContext';

function AuthPrompt({ isOpen, onClose, onSignup, onLogin }) {
  const [mode, setMode] = useState('prompt');
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSignup = () => {
    if (!email || !username || !password) {
      setError('All fields are required');
      return;
    }
    if (password.length < 6) {
      setError('Password must be at least 6 characters');
      return;
    }
    setError('');
    onSignup({ email, username, password });
  };

  const handleLogin = () => {
    if (!email || !password) {
      setError('Email and password required');
      return;
    }
    setError('');
    onLogin({ email, password });
  };

  return (
    <div className="veil op" style={{ zIndex: 700, background: 'rgba(0,0,0,0.95)' }} onClick={onClose}>
      <div 
        style={{ 
          position: 'absolute', 
          bottom: 0,
          left: 0,
          right: 0,
          background: '#0a0a0a',
          borderTopLeftRadius: '28px',
          borderTopRightRadius: '28px',
          padding: '24px 20px 32px',
          animation: 'slideUp 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
        }} 
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{ width: '40px', height: '4px', background: '#FF4F2E', borderRadius: '2px', margin: '0 auto 16px' }} />
        
        {mode === 'prompt' && (
          <>
            <div style={{ fontSize: '22px', fontWeight: '600', color: 'white', marginBottom: '8px', fontFamily: "'Syne', system-ui" }}>
              Welcome
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
              Sign in to save your progress and follow creators
            </div>
            
            <button
              onClick={() => { setError(''); setMode('login'); }}
              style={{
                width: '100%',
                padding: '14px',
                background: '#FF4F2E',
                border: 'none',
                borderRadius: '40px',
                color: 'white',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              Sign In
            </button>
            
            <button
              onClick={() => { setError(''); setMode('signup'); }}
              style={{
                width: '100%',
                padding: '14px',
                background: 'transparent',
                border: '1px solid rgba(255,79,46,0.3)',
                borderRadius: '40px',
                color: '#FF4F2E',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                marginBottom: '16px'
              }}
            >
              Create Account
            </button>
            
            <button
              onClick={onClose}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: 'none',
                color: '#666',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Continue as Guest
            </button>
          </>
        )}
        
        {mode === 'signup' && (
          <>
            <div style={{ fontSize: '22px', fontWeight: '600', color: 'white', marginBottom: '4px', fontFamily: "'Syne', system-ui" }}>
              Create account
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
              Join the PopApp community
            </div>
            
            {error && <div style={{ color: '#FF4F2E', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>{error}</div>}
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#111',
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
              type="text"
              placeholder="Username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#111',
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
            
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  paddingRight: '50px',
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            <button
              onClick={handleSignup}
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
  padding: '24px 20px 32px',
  animation: 'slideUp 0.35s cubic-bezier(0.2, 0.9, 0.4, 1.1)'
}} 
            >
              Create account
            </button>
            
            <button
              onClick={() => { setMode('prompt'); setError(''); }}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: 'none',
                color: '#666',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
          </>
        )}
        
        {mode === 'login' && (
          <>
            <div style={{ fontSize: '22px', fontWeight: '600', color: 'white', marginBottom: '4px', fontFamily: "'Syne', system-ui" }}>
              Sign in
            </div>
            <div style={{ fontSize: '13px', color: '#888', marginBottom: '24px' }}>
              Welcome back
            </div>
            
            {error && <div style={{ color: '#FF4F2E', fontSize: '12px', marginBottom: '12px', textAlign: 'center' }}>{error}</div>}
            
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              style={{
                width: '100%',
                padding: '14px',
                background: '#111',
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
            
            <div style={{ position: 'relative', marginBottom: '24px' }}>
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={{
                  width: '100%',
                  padding: '14px',
                  paddingRight: '50px',
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
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  background: 'transparent',
                  border: 'none',
                  color: '#888',
                  cursor: 'pointer',
                  fontSize: '14px'
                }}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
            
            <button
              onClick={handleLogin}
              style={{
                width: '100%',
                padding: '14px',
                background: '#FF4F2E',
                border: 'none',
                borderRadius: '40px',
                color: 'white',
                fontWeight: '600',
                fontSize: '15px',
                cursor: 'pointer',
                marginBottom: '12px'
              }}
            >
              Sign in
            </button>
            
            <button
              onClick={() => { setMode('prompt'); setError(''); }}
              style={{
                width: '100%',
                padding: '12px',
                background: 'transparent',
                border: 'none',
                color: '#666',
                fontSize: '13px',
                cursor: 'pointer'
              }}
            >
              Back
            </button>
          </>
        )}
      </div>
    </div>
  );
}

export default AuthPrompt;