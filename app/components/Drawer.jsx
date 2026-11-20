'use client';
import React from 'react';

export default function Drawer({ 
  isOpen, 
  onClose, 
  activeTab, 
  onNavigate, 
  user, 
  selectedLanguage, 
  onSelectLanguage, 
  onLogout,
  onOpenAuth 
}) {
  const languages = ['JavaScript', 'Python', 'React', 'SQL', 'C#', 'PHP'];
  const isAdmin = user && (user.role === 'admin' || user.email === 'admin@email.com');

  // Core navigation items for learners
  const learnerNavItems = [
    { id: 'dashboard', icon: '📊', label: 'Dashboard (Learn & Practice)', bold: true },
    { id: 'practice', icon: '⚡', label: 'Practice Questions (100+ Problems)', bold: true },
    { id: 'languages', icon: '🌐', label: 'Change Language Path', bold: true },
    { id: 'tracks', icon: '🗺️', label: 'Career Role Tracks' },
    { id: 'quizzes', icon: '⏱️', label: 'Quizzes & Timed Mode' },
    { id: 'interview', icon: '💡', label: 'Interview Q&A Bank' },
    { id: 'projects', icon: '💼', label: 'Mini-Projects & README Generator' },
    { id: 'jobs', icon: '🏢', label: 'Developer Jobs Board' },
    { id: 'readiness', icon: '📋', label: '"Am I Ready to Apply?" Checklist' },
    { id: 'cv', icon: '📄', label: 'Tech CV & Resume Builder (Top 5)', bold: true },
    { id: 'notifications', icon: '📧', label: 'Email Notifications & Alerts' },
    { id: 'portfolio', icon: '👤', label: 'Public Portfolio & Badges' }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="drawer-backdrop" 
          onClick={onClose} 
          style={{ display: 'block', zIndex: 9998 }}
        />
      )}

      <aside 
        className={`drawer-menu ${isOpen ? 'open' : ''}`} 
        style={{ 
          zIndex: 9999, 
          display: 'flex', 
          flexDirection: 'column',
          pointerEvents: isOpen ? 'auto' : 'none'
        }}
        aria-hidden={!isOpen}
      >
        
        {/* Drawer Header */}
        <div className="drawer-header" style={{ padding: '16px 20px', borderBottom: '1px solid var(--line)' }}>
          <div className="drawer-user-info" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <div className="drawer-avatar" style={{ width: '42px', height: '42px' }}>
              <img 
                src={user?.avatar || (isAdmin ? 'https://api.dicebear.com/7.x/bottts/svg?seed=admin' : 'https://api.dicebear.com/7.x/bottts/svg?seed=learner')} 
                alt="Avatar" 
                style={{ 
                  width: '100%', 
                  height: '100%', 
                  borderRadius: '50%',
                  border: isAdmin ? '2px solid var(--acc)' : '1px solid var(--line)'
                }}
              />
            </div>
            <div>
              <div className="drawer-user-name" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontWeight: 700, fontSize: '15px' }}>{user?.name || 'Welcome to CodePath'}</span>
                {isAdmin && (
                  <span className="badge p" style={{ fontSize: '9px', padding: '1px 6px' }}>ADMIN</span>
                )}
              </div>
              <div className="drawer-user-status" style={{ fontSize: '12px', color: isAdmin ? 'var(--acc)' : 'var(--mute)', fontWeight: isAdmin ? 600 : 400 }}>
                {user ? (isAdmin ? '🛡️ Master System Administrator' : `Signed in as Learner`) : 'Sign in or register to save progress'}
              </div>
            </div>
          </div>
          <button className="ghost drawer-close-btn" onClick={onClose} title="Close Menu">✕</button>
        </div>

        {/* Scrollable Navigation Body */}
        <div style={{ flex: 1, overflowY: 'auto' }}>
          
          {/* =========================================
              ADMINISTRATOR DEDICATED NAVIGATION SUITE
             ========================================= */}
          {isAdmin ? (
            <>
              <div className="drawer-section" style={{ borderBottom: '1px solid var(--line)', paddingBottom: '14px' }}>
                <div className="drawer-section-title" style={{ color: 'var(--acc)', fontWeight: 800, letterSpacing: '0.5px' }}>
                  🛡️ Master Admin Suite
                </div>
                <nav className="drawer-nav">
                  <button 
                    className="drawer-nav-item"
                    aria-current={activeTab === 'admin' ? 'page' : 'false'}
                    onClick={() => onNavigate('admin')}
                    style={{ 
                      background: activeTab === 'admin' ? 'rgba(14, 124, 123, 0.15)' : 'transparent',
                      borderLeft: activeTab === 'admin' ? '3px solid var(--acc)' : '3px solid transparent'
                    }}
                  >
                    <span className="nav-icon">📊</span>
                    <span className="nav-label">
                      <b>Admin Analytics & Telemetry</b>
                    </span>
                  </button>

                  <button 
                    className="drawer-nav-item"
                    onClick={() => onNavigate('admin')}
                  >
                    <span className="nav-icon">👥</span>
                    <span className="nav-label">
                      <b>User Registry & Access Control</b>
                    </span>
                  </button>

                  <button 
                    className="drawer-nav-item"
                    aria-current={activeTab === 'notifications' ? 'page' : 'false'}
                    onClick={() => onNavigate('notifications')}
                  >
                    <span className="nav-icon">📧</span>
                    <span className="nav-label">
                      <b>System Alerts & Dispatches</b>
                    </span>
                  </button>
                </nav>
              </div>

              {/* Admin: Preview Learner Experience */}
              <div className="drawer-section">
                <div className="drawer-section-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span>👁️ Preview Learner Experience</span>
                  <span className="tag" style={{ fontSize: '10px' }}>Preview Mode</span>
                </div>

                <div className="drawer-lang-selector" style={{ marginBottom: '14px' }}>
                  {languages.map(lang => (
                    <button 
                      key={lang}
                      className={`drawer-lang-btn ${selectedLanguage === lang ? 'active' : ''}`}
                      onClick={() => onSelectLanguage(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>

                <nav className="drawer-nav">
                  {learnerNavItems.map(item => (
                    <button 
                      key={item.id}
                      className="drawer-nav-item"
                      aria-current={activeTab === item.id ? 'page' : 'false'}
                      onClick={() => onNavigate(item.id)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">
                        {item.bold ? <b>{item.label}</b> : item.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </>
          ) : (
            /* =========================================
                STANDARD LEARNER NAVIGATION
               ========================================= */
            <>
              {/* Quick Language Switcher */}
              <div className="drawer-section">
                <div className="drawer-section-title">Active Language Path</div>
                <div className="drawer-lang-selector">
                  {languages.map(lang => (
                    <button 
                      key={lang}
                      className={`drawer-lang-btn ${selectedLanguage === lang ? 'active' : ''}`}
                      onClick={() => onSelectLanguage(lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>

              {/* Navigation Items */}
              <div className="drawer-section">
                <div className="drawer-section-title">Core Features</div>
                <nav className="drawer-nav">
                  {learnerNavItems.map(item => (
                    <button 
                      key={item.id}
                      className="drawer-nav-item"
                      aria-current={activeTab === item.id ? 'page' : 'false'}
                      onClick={() => onNavigate(item.id)}
                    >
                      <span className="nav-icon">{item.icon}</span>
                      <span className="nav-label">
                        {item.bold ? <b>{item.label}</b> : item.label}
                      </span>
                    </button>
                  ))}
                </nav>
              </div>
            </>
          )}

        </div>

        {/* Drawer Footer with Logout / Auth */}
        <div className="drawer-footer" style={{ borderTop: '1px solid var(--line)', padding: '14px 20px' }}>
          {user ? (
            <button className="drawer-auth-btn" onClick={onLogout}>
              <span className="nav-icon">🚪</span>
              <span>Log Out ({((user?.name || user?.email || 'Learner')).split(' ')[0]})</span>
            </button>
          ) : (
            <button className="drawer-auth-btn" onClick={() => onOpenAuth('signup')}>
              <span className="nav-icon">🔑</span>
              <span>Sign Up / Log In</span>
            </button>
          )}
        </div>

      </aside>
    </>
  );
}
