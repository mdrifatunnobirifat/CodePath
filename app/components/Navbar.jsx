'use client';
import React from 'react';

export default function Navbar({ 
  onOpenDrawer, 
  streak = 1, 
  selectedLanguage = 'JavaScript', 
  theme = 'light', 
  onToggleTheme,
  user,
  activeTab,
  onNavigate,
  onLogout,
  onOpenAuth
}) {
  const isAdmin = user && (user.role === 'admin' || user.email === 'admin@email.com');

  const handleLogoClick = () => {
    if (onNavigate) {
      if (isAdmin) {
        onNavigate('admin');
      } else if (user) {
        onNavigate('dashboard');
      } else {
        onNavigate('languages');
      }
    }
  };

  return (
    <header className="header" style={{ position: 'sticky', top: 0, zIndex: 100, backdropFilter: 'blur(8px)' }}>
      <div className="header-left">
        <button 
          className="hamburger-btn" 
          onClick={onOpenDrawer} 
          aria-label="Open Navigation Menu"
          title="Open Navigation Menu"
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', zIndex: 101 }}
        >
          <span className="hamburger-icon" style={{ fontSize: '18px', lineHeight: 1 }}>☰</span>
          <span className="hamburger-text" style={{ fontWeight: 700, fontSize: '13px' }}>Menu</span>
        </button>
        <div 
          className="logo" 
          style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px' }} 
          onClick={handleLogoClick}
          title={isAdmin ? "CodePath Admin Dashboard" : "CodePath Platform"}
        >
          <span>Code<span>Path</span></span>
          {isAdmin && (
            <span className="badge p" style={{ fontSize: '10px', padding: '2px 7px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
              ADMIN
            </span>
          )}
        </div>

        {!isAdmin && (
          <div className="tag" style={{ display: 'none', marginLeft: '6px' }} id="active-lang-badge">
            🌐 <span>{selectedLanguage}</span>
          </div>
        )}
      </div>

      <div className="header-right" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
        
        {/* Direct Admin Dashboard shortcut button for administrators */}
        {isAdmin && onNavigate && (
          <button
            onClick={() => onNavigate('admin')}
            className={`btn ${activeTab === 'admin' ? 'p' : 'ghost'}`}
            style={{ 
              fontSize: '13px', 
              padding: '6px 14px', 
              display: 'flex', 
              alignItems: 'center', 
              gap: '6px',
              border: activeTab === 'admin' ? 'none' : '1px solid var(--acc)'
            }}
            title="Switch to Admin Dashboard"
          >
            <span>🛡️</span>
            <b>Admin Dashboard</b>
          </button>
        )}

        {streak > 0 && !isAdmin && (
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
              style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                border: isAdmin ? '2px solid var(--acc)' : '1.5px solid var(--line)', 
                background: 'var(--code)' 
              }} 
            />
            <div style={{ display: 'flex', flexDirection: 'column', lineHeight: 1.1 }}>
              <span style={{ fontSize: '13px', fontWeight: 700 }}>{user.name.split(' ')[0]}</span>
              {isAdmin && (
                <span style={{ fontSize: '10px', color: 'var(--acc)', fontWeight: 700 }}>System Admin</span>
              )}
            </div>
            <button 
              className="ghost" 
              onClick={onLogout} 
              title="Log Out"
              style={{ fontSize: '12px', padding: '4px 10px', color: 'var(--mute)' }}
            >
              Log Out
            </button>
          </div>
        ) : (
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            <button 
              className="ghost" 
              onClick={() => onOpenAuth('login')} 
              style={{ padding: '6px 12px', fontSize: '13px', fontWeight: 600 }}
            >
              Log In
            </button>
            <button 
              className="btn p" 
              onClick={() => onOpenAuth('signup')} 
              style={{ padding: '6px 14px', fontSize: '13px' }}
            >
              Sign Up 🚀
            </button>
          </div>
        )}
      </div>
    </header>
  );
}
