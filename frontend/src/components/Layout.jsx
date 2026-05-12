import { useState } from 'react';
import './Layout.css';

function Layout({ children, currentTab, onTabChange }) {
  return (
    <div className="phone-shell">
      <div className="notch"></div>
      <div className="screen">
        <div className="status-bar">
          <span>9:41</span>
          <div className="status-icons">
            <svg width="15" height="10" viewBox="0 0 16 11" fill="white">
              <rect x="0" y="3" width="3" height="8" rx="1" opacity="0.4"/>
              <rect x="4" y="2" width="3" height="9" rx="1" opacity="0.6"/>
              <rect x="8" y="0" width="3" height="11" rx="1" opacity="0.8"/>
              <rect x="12" y="0" width="3" height="11" rx="1"/>
            </svg>
            <div className="battery"></div>
          </div>
        </div>

        <div className="app-bar">
          <div className="app-brand">
            <div className="app-dot">
              <svg viewBox="0 0 30 30" fill="none">
                <circle cx="15" cy="13" r="8" fill="#FFF6EF"/>
                <circle cx="11" cy="10" r="2.5" fill="#1a0a00"/>
                <circle cx="19" cy="10" r="2.5" fill="#1a0a00"/>
                <ellipse cx="15" cy="14" rx="1.5" ry="1" fill="#c08070"/>
              </svg>
            </div>
            <span className="app-name">pop</span>
            <span className="app-tag">STUDIO</span>
          </div>
          <div className="app-bar-right">
            <div className="mode-pill easy">
              <div className="mode-dot"></div>
              <span>Easy</span>
            </div>
            <div className="avatar">K</div>
          </div>
        </div>

        <div className="page-content">
          {children}
        </div>

        <div className="bottom-tabs">
          <div className={`bottom-tab ${currentTab === 'home' ? 'active' : ''}`} onClick={() => onTabChange('home')}>
            <div className="tab-icon">
              <svg viewBox="0 0 24 24" fill="currentColor">
                <path d="M3 12L12 3l9 9v9a1 1 0 01-1 1h-5v-5H9v5H4a1 1 0 01-1-1v-9z"/>
              </svg>
            </div>
            <span className="tab-label">Home</span>
          </div>
          <div className={`bottom-tab ${currentTab === 'explore' ? 'active' : ''}`} onClick={() => onTabChange('explore')}>
            <div className="tab-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <polygon points="12,6 13.5,10.5 18,12 13.5,13.5 12,18 10.5,13.5 6,12 10.5,10.5" fill="currentColor"/>
              </svg>
            </div>
            <span className="tab-label">Explore</span>
          </div>
          <div className="bottom-tab center-tab" onClick={() => onTabChange('create')}>
            <div className="tab-pill">
              <svg viewBox="0 0 24 24" width="18" height="18" fill="white">
                <rect x="2" y="3" width="20" height="14" rx="3"/>
                <polygon points="10,8 16,10 10,12" fill="#FF4F2E"/>
              </svg>
            </div>
            <span className="tab-label">Create</span>
          </div>
          <div className={`bottom-tab ${currentTab === 'inbox' ? 'active' : ''}`} onClick={() => onTabChange('inbox')}>
            <div className="tab-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
                <polyline points="22,6 12,13 2,6"/>
              </svg>
            </div>
            <span className="tab-label">Inbox</span>
          </div>
          <div className={`bottom-tab ${currentTab === 'profile' ? 'active' : ''}`} onClick={() => onTabChange('profile')}>
            <div className="tab-icon">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
                <circle cx="12" cy="7" r="4"/>
              </svg>
            </div>
            <span className="tab-label">Profile</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Layout;