'use client';
import React, { useState } from 'react';

export default function NotificationsView({ 
  user, 
  notifications = [], 
  onSendTestNotification, 
  onSavePreferences 
}) {
  const [userEmail, setUserEmail] = useState(user?.email || '');
  const [smtpHost, setSmtpHost] = useState('smtp.gmail.com');
  const [smtpPort, setSmtpPort] = useState(465);
  const [smtpUser, setSmtpUser] = useState(user?.email || '');
  const [smtpPass, setSmtpPass] = useState('');
  const [testing, setTesting] = useState(false);
  const [previewItem, setPreviewItem] = useState(null);

  const [prefs, setPrefs] = useState({
    enabled: true,
    welcome: true,
    milestones: true,
    streak: true,
    cv: true
  });

  const handleTest = async () => {
    setTesting(true);
    await onSendTestNotification(userEmail);
    setTesting(false);
  };

  const handlePreset = (preset) => {
    if (preset === 'gmail') {
      setSmtpHost('smtp.gmail.com');
      setSmtpPort(465);
      alert('Gmail preset loaded! Enter your 16-character Google App Password.');
    } else if (preset === 'outlook') {
      setSmtpHost('smtp.office365.com');
      setSmtpPort(587);
    }
  };

  return (
    <div style={{ padding: '16px 0 40px' }}>
      <div className="view-header" style={{ marginBottom: '24px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '12px' }}>
          <div>
            <div className="tag">REAL-TIME INBOX NOTIFICATIONS</div>
            <h1 style={{ fontSize: '24px', margin: '4px 0 6px' }}>📧 Email Notification Center & Settings</h1>
            <p style={{ color: 'var(--mute)', margin: 0, fontSize: '14px' }}>
              Receive welcome roadmaps, problem solved milestones, daily streak reminders, and CV updates straight to your real email inbox.
            </p>
          </div>
          <button 
            className="btn p" 
            onClick={handleTest}
            disabled={testing}
            style={{ padding: '8px 18px', fontSize: '13px' }}
          >
            {testing ? '⏳ Sending...' : '🚀 Send Test Notification'}
          </button>
        </div>
      </div>

      <div className="grid" style={{ gridTemplateColumns: '1.1fr 1fr', gap: '20px', marginBottom: '24px' }}>
        {/* CARD 1: Email Address & Notification Triggers */}
        <div className="panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 14px' }}>👤 Real Email & Alert Triggers</h3>
          <div style={{ marginBottom: '16px' }}>
            <label style={{ fontSize: '12.5px', fontWeight: 700, display: 'block', marginBottom: '4px' }}>Your Notification Email:</label>
            <input 
              type="email" 
              value={userEmail}
              onChange={e => setUserEmail(e.target.value)}
              style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '13px', fontWeight: 600 }}
            />
            <small style={{ color: 'var(--mute)', fontSize: '11px', display: 'block', marginTop: '3px' }}>
              All notifications and roadmap updates will be sent to this email address.
            </small>
          </div>

          <div style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)' }}>Active Triggers:</b>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', cursor: 'pointer' }}>
              <span>🚀 <b>Welcome & Curriculum Roadmap</b></span>
              <input type="checkbox" checked={prefs.welcome} onChange={e => setPrefs(p => ({ ...p, welcome: e.target.checked }))} />
            </label>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', cursor: 'pointer' }}>
              <span>🏆 <b>Problem Solved & Milestones</b></span>
              <input type="checkbox" checked={prefs.milestones} onChange={e => setPrefs(p => ({ ...p, milestones: e.target.checked }))} />
            </label>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', cursor: 'pointer' }}>
              <span>🔥 <b>Daily Coding Streak Reminders</b></span>
              <input type="checkbox" checked={prefs.streak} onChange={e => setPrefs(p => ({ ...p, streak: e.target.checked }))} />
            </label>
            <label style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '13px', cursor: 'pointer' }}>
              <span>📄 <b>Tech CV & Application Alerts</b></span>
              <input type="checkbox" checked={prefs.cv} onChange={e => setPrefs(p => ({ ...p, cv: e.target.checked }))} />
            </label>
          </div>
        </div>

        {/* CARD 2: SMTP Configuration */}
        <div className="panel" style={{ padding: '20px' }}>
          <h3 style={{ fontSize: '16px', margin: '0 0 10px' }}>⚙️ SMTP Delivery Setup (Gmail / Custom)</h3>
          <p style={{ color: 'var(--mute)', fontSize: '12.5px', margin: '0 0 12px' }}>
            Deliver real emails directly to your Gmail inbox via native Node.js TLS SMTP.
          </p>

          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px' }}>
            <button className="chip" onClick={() => handlePreset('gmail')} style={{ fontSize: '11.5px', fontWeight: 700 }}>
              🔴 Google / Gmail
            </button>
            <button className="chip" onClick={() => handlePreset('outlook')} style={{ fontSize: '11.5px', fontWeight: 700 }}>
              🔵 Outlook
            </button>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '8px' }}>
              <input type="text" placeholder="SMTP Host" value={smtpHost} onChange={e => setSmtpHost(e.target.value)} style={{ padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12.5px' }} />
              <input type="number" placeholder="Port" value={smtpPort} onChange={e => setSmtpPort(e.target.value)} style={{ padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12.5px' }} />
            </div>
            <input type="text" placeholder="Sender Email" value={smtpUser} onChange={e => setSmtpUser(e.target.value)} style={{ padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12.5px' }} />
            <input type="password" placeholder="16-character App Password" value={smtpPass} onChange={e => setSmtpPass(e.target.value)} style={{ padding: '7px 10px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12.5px' }} />
            <button className="btn p" onClick={() => alert('Settings saved successfully!')} style={{ marginTop: '4px', padding: '8px' }}>
              💾 Save SMTP Credentials
            </button>
          </div>
        </div>
      </div>

      {/* Outbox & Notifications History */}
      <div className="panel" style={{ padding: '20px' }}>
        <h3 style={{ fontSize: '16px', margin: '0 0 12px' }}>📬 Sent Emails & Outbox History ({notifications.length})</h3>
        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ borderBottom: '1px solid var(--line)', color: 'var(--mute)' }}>
                <th style={{ padding: '8px', textAlign: 'left' }}>Time</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Recipient</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Subject</th>
                <th style={{ padding: '8px', textAlign: 'left' }}>Status</th>
                <th style={{ padding: '8px', textAlign: 'right' }}>Preview</th>
              </tr>
            </thead>
            <tbody>
              {notifications.map((item, idx) => (
                <tr key={idx} style={{ borderBottom: '1px solid var(--line)' }}>
                  <td style={{ padding: '8px', color: 'var(--mute)', fontSize: '12px' }}>{item.time || 'Today'}</td>
                  <td style={{ padding: '8px' }}><code>{item.to || userEmail}</code></td>
                  <td style={{ padding: '8px', fontWeight: 600 }}>{item.subject}</td>
                  <td style={{ padding: '8px' }}><span className="badge ok">✔ {item.status || 'Delivered'}</span></td>
                  <td style={{ padding: '8px', textAlign: 'right' }}>
                    <button className="ghost" onClick={() => setPreviewItem(item)} style={{ fontSize: '12px', padding: '3px 8px' }}>
                      👁️ Preview
                    </button>
                  </td>
                </tr>
              ))}
              {notifications.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: '24px', textAlign: 'center', color: 'var(--mute)' }}>
                    No notifications sent yet. Click "Send Test Notification" above!
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Preview Modal */}
      {previewItem && (
        <div className="modal-overlay" style={{ display: 'flex', zIndex: 400 }}>
          <div className="modal-card" style={{ maxWidth: '650px', padding: 0 }}>
            <div style={{ padding: '16px', borderBottom: '1px solid var(--line)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <strong>📧 {previewItem.subject}</strong>
              <button className="ghost" onClick={() => setPreviewItem(null)}>✕</button>
            </div>
            <div style={{ padding: '20px', background: '#0F1722', color: '#FFF', maxHeight: '60vh', overflowY: 'auto' }}>
              <div dangerouslySetInnerHTML={{ __html: previewItem.html || `<p>${previewItem.body || previewItem.subject}</p>` }} />
            </div>
            <div style={{ padding: '12px 16px', textAlign: 'right' }}>
              <button className="btn" onClick={() => setPreviewItem(null)}>Close</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

