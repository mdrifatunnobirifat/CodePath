'use client';
import React, { useState } from 'react';

export default function AuthModal({ isOpen, onClose, onLogin, onSignup, initialMode = 'signup' }) {
  const [mode, setMode] = useState(initialMode);
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      if (mode === 'signup') {
        if (!name.trim()) throw new Error('Please enter your full name.');
        if (!email.trim() || !password.trim()) throw new Error('Email and password are required.');
        await onSignup(name.trim(), email.trim(), password.trim());
      } else {
        if (!email.trim() || !password.trim()) throw new Error('Email and password are required.');
        await onLogin(email.trim(), password.trim());
      }
      onClose();
    } catch (err) {
      setError(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" style={{ display: 'flex', zIndex: 300 }}>
      <div className="modal-card auth-modal-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
          <div className="logo" style={{ fontSize: '22px' }}>Code<span>Path</span></div>
          <button className="ghost" onClick={onClose} style={{ padding: '4px 8px' }}>✕</button>
        </div>

        <h3 style={{ marginBottom: '6px' }}>
          {mode === 'signup' ? 'Create your CodePath Account' : 'Welcome back! Log in to continue'}
        </h3>
        <p className="tag" style={{ marginBottom: '16px' }}>
          {mode === 'signup' 
            ? 'Sign up to track your 60-day plan, keep your daily streak, and solve practice problems.'
            : 'Access your saved drafts, streak, and interview portfolio.'}
        </p>

        {/* Tab Switcher */}
        <div className="chips" style={{ margin: '0 0 16px' }}>
          <button 
            type="button"
            className="chip" 
            aria-pressed={mode === 'signup'}
            onClick={() => { setMode('signup'); setError(''); }}
          >
            Create Account
          </button>
          <button 
            type="button"
            className="chip" 
            aria-pressed={mode === 'login'}
            onClick={() => { setMode('login'); setError(''); }}
          >
            Log In
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {mode === 'signup' && (
            <div style={{ marginBottom: '12px' }}>
              <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Full Name:</label>
              <input 
                type="text" 
                placeholder="Alex Morgan"
                value={name}
                onChange={e => setName(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)' }}
                required 
              />
            </div>
          )}

          <div style={{ marginBottom: '12px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Email Address:</label>
            <input 
              type="email" 
              placeholder="alex@example.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)' }}
              required 
            />
            <small style={{ color: 'var(--mute)', fontSize: '11px', display: 'block', marginTop: '3px' }}>
              Enter your real email to receive 60-day roadmaps, problem milestones & streak alerts!
            </small>
          </div>

          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '13px', fontWeight: 600, display: 'block', marginBottom: '4px' }}>Password:</label>
            <input 
              type="password" 
              placeholder="••••••••"
              value={password}
              onChange={e => setPassword(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)' }}
              required 
            />
          </div>

          {error && (
            <div className="res" style={{ marginBottom: '12px' }}>
              <div className="no">{error}</div>
            </div>
          )}

          <button 
            type="submit" 
            className="btn p" 
            disabled={loading}
            style={{ width: '100%', padding: '11px', fontSize: '15px' }}
          >
            {loading ? 'Processing...' : (mode === 'signup' ? 'Create Free Account & Start Learning 🚀' : 'Log In to My Account 🔑')}
          </button>
        </form>
      </div>
    </div>
  );
}

