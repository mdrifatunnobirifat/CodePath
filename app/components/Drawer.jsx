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

  const navItems = [
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
    { id: 'notifications', icon: '📧', label: 'Email Notifications & Alerts', bold: true },
    { id: 'portfolio', icon: '👤', label: 'Public Portfolio & Badges' },
    { id: 'admin', icon: '🛡️', label: 'Admin Content Management' }
  ];

  return (
    <>
      {isOpen && (
        <div 
          className="drawer-backdrop" 
          onClick={onClose} 
          style={{ display: 'block', zIndex: 199 }}
        />
      )}

      <aside className={`drawer-menu ${isOpen ? 'open' : ''}`} style={{ zIndex: 200 }}>
        {/* Drawer Header */}
        <div className="drawer-header">
          <div className="drawer-user-info">
            <div className="drawer-avatar">
              <img 
                src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=learner'} 
                alt="Avatar" 
                style={{ width: '100%', height: '100%', borderRadius: '50%' }}
              />
            </div>
            <div>
              <div className="drawer-user-name">{user?.name || 'Welcome! Please Sign In'}</div>
              <div className="drawer-user-status">
                {user ? (user.role === 'admin' || user.email === 'admin@email.com' ? '🛡️ System Administrator' : `Signed in (${user.role || 'Learner'})`) : 'Sign up or log in to track progress'}
              </div>
            </div>
          </div>
          <button className="ghost drawer-close-btn" onClick={onClose} title="Close Menu">✕</button>
        </div>

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
            {navItems.map(item => (
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

        {/* Drawer Footer with Logout / Auth */}
        <div className="drawer-footer">
          {user ? (
            <button className="drawer-auth-btn" onClick={onLogout}>
              <span className="nav-icon">🚪</span>
              <span>Log Out</span>
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

