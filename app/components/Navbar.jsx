'use client';
import React from 'react';

export default function Navbar({ 
  onOpenDrawer, 
  streak = 1, 
  selectedLanguage = 'JavaScript', 
  theme = 'light', 
  onToggleTheme,
  user,
  onOpenAuth
}) {
  return (
    <header className="header" style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
      <div className="header-left">
        <button 
          className="hamburger-btn" 
          onClick={onOpenDrawer} 
          aria-label="Open Navigation Menu"
          title="Open Menu"
        >
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
          <span className="hamburger-line"></span>
        </button>
        <div className="logo" style={{ cursor: 'pointer' }} onClick={() => window.location.hash = 'languages'}>
          Code<span>Path</span>
        </div>
        <div className="tag" style={{ display: 'none', marginLeft: '6px' }} id="active-lang-badge">
          🌐 <span>{selectedLanguage}</span>
        </div>
      </div>

      <div className="header-right">
        {streak > 0 && (
          <div className="pill" style={{ color: 'var(--warm)', fontWeight: 700, fontSize: '13px' }}>
            🔥 Streak: {streak} {streak === 1 ? 'day' : 'days'}
          </div>
        )}

        <button 
          className="ghost" 
          onClick={onToggleTheme} 
          title="Toggle Dark / Light Theme"
          style={{ fontSize: '14px', padding: '6px 12px' }}
        >
          {theme === 'dark' ? '☀️ Light' : '🌙 Dark'}
        </button>

        {user ? (
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <img 
              src={user.avatar || `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(user.name)}`} 
              alt={user.name} 
              style={{ width: '32px', height: '32px', borderRadius: '50%', border: '1.5px solid var(--acc)', background: 'var(--code)' }} 
            />
            <span style={{ fontSize: '13px', fontWeight: 600, display: 'inline-block' }}>{user.name.split(' ')[0]}</span>
          </div>
        ) : (
          <button className="btn p" onClick={() => onOpenAuth('login')} style={{ padding: '6px 14px', fontSize: '13px' }}>
            Log In 🔑
          </button>
        )}
      </div>
    </header>
  );
}

