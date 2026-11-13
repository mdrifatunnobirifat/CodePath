// CodePath Email Notifications & Real-Time Alert Settings View
const NotificationsView = {
  data: {
    email: '',
    emailPreferences: {
      enabled: true,
      welcomeEmail: true,
      problemSolved: true,
      dailyStreak: true,
      jobReadiness: true
    },
    smtpConfig: {
      smtpHost: '',
      smtpPort: 465,
      smtpUser: '',
      smtpFrom: '',
      isConfigured: false,
      hasResend: false
    },
    history: []
  },

  async render() {
    const app = document.getElementById('app');
    if (!app) return;

    app.innerHTML = `
      <div class="view-header" style="margin-bottom: 24px;">
        <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
          <div>
            <div class="tag">REAL-TIME INBOX NOTIFICATIONS</div>
            <h2 style="margin: 4px 0 6px;">📧 Email Notification Center & Real-Time Alerts</h2>
            <p style="color: var(--mute); margin: 0; font-size: 14px;">
              Get roadmaps, daily streak reminders, problem solved achievements, and CV updates sent directly to your real email inbox.
            </p>
          </div>
          <div style="display: flex; gap: 8px;">
            <button class="btn" id="notif-test-btn" style="background: var(--acc); color: white;">
              🚀 Send Test Notification to My Email
            </button>
            <button class="ghost" id="notif-refresh-btn" title="Refresh notification history">
              🔄 Refresh
            </button>
          </div>
        </div>
      </div>

      <!-- Live Notification Status Alert Banner -->
      <div id="notif-status-banner" style="margin-bottom: 24px;"></div>

      <div class="grid" style="grid-template-columns: 1.1fr 1fr; gap: 24px; margin-bottom: 28px;">
        
        <!-- CARD 1: Real Email & Notification Triggers -->
        <div class="panel" style="padding: 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px;">
            <h3 style="margin: 0; font-size: 17px;">👤 Your Notification Email & Triggers</h3>
            <span class="badge" id="notif-conn-badge">Checking...</span>
          </div>

          <form id="notif-prefs-form" onsubmit="event.preventDefault(); NotificationsView.savePreferences();">
            <div style="margin-bottom: 18px;">
              <label style="font-size: 13px; font-weight: 700; display: block; margin-bottom: 6px;">Your Verified Real Email Address:</label>
              <div style="display: flex; gap: 8px;">
                <input type="email" id="notif-user-email" style="flex: 1; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--code); color: var(--ink); font-weight: 600;" required />
                <button type="submit" class="btn p" style="white-space: nowrap;">Save Email</button>
              </div>
              <small style="color: var(--mute); font-size: 12px; margin-top: 4px; display: block;">All notifications, milestones, and streak alerts will be delivered to this address.</small>
            </div>

            <div style="border-top: 1px solid var(--line); padding-top: 16px; margin-bottom: 18px;">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <div>
                  <strong>Enable All Email Notifications</strong>
                  <div style="color: var(--mute); font-size: 12px;">Master switch for receiving real email updates</div>
                </div>
                <input type="checkbox" id="pref-master-enabled" style="transform: scale(1.3); cursor: pointer;" checked />
              </div>

              <div style="background: var(--code); border-radius: 8px; padding: 14px; display: flex; flex-direction: column; gap: 12px;">
                <label style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; cursor: pointer;">
                  <span>🚀 <b>Welcome & Curriculum Roadmap</b><br><small style="color:var(--mute)">Sent on signup and whenever you choose a new language</small></span>
                  <input type="checkbox" id="pref-welcome" style="transform: scale(1.2);" checked />
                </label>
                <label style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; cursor: pointer;">
                  <span>🏆 <b>Problem Solved & Milestones</b><br><small style="color:var(--mute)">Receive celebration email when you pass all tests for a problem</small></span>
                  <input type="checkbox" id="pref-problem" style="transform: scale(1.2);" checked />
                </label>
                <label style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; cursor: pointer;">
                  <span>🔥 <b>Daily Coding Streak Reminders</b><br><small style="color:var(--mute)">Gentle reminder before midnight so you don't break your streak</small></span>
                  <input type="checkbox" id="pref-streak" style="transform: scale(1.2);" checked />
                </label>
                <label style="display: flex; align-items: center; justify-content: space-between; font-size: 13px; cursor: pointer;">
                  <span>📄 <b>Tech CV & Job Readiness Alerts</b><br><small style="color:var(--mute)">Confirmation when you export or update your Tech CV</small></span>
                  <input type="checkbox" id="pref-readiness" style="transform: scale(1.2);" checked />
                </label>
              </div>
            </div>

            <button type="submit" class="btn" style="width: 100%; background: var(--panel); border: 1px solid var(--line); font-weight: 700;">
              💾 Save Notification Preferences
            </button>
          </form>
        </div>

        <!-- CARD 2: SMTP & Real Email Delivery Setup -->
        <div class="panel" style="padding: 22px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <h3 style="margin: 0; font-size: 17px;">⚙️ Real Email Delivery Setup (SMTP / Gmail)</h3>
            <span class="tag" style="font-size: 11px;">Zero Dependencies</span>
          </div>

          <p style="font-size: 13px; color: var(--mute); margin-bottom: 14px;">
            To deliver real emails directly into your Gmail or corporate inbox, configure your mail provider below:
          </p>

          <!-- Quick Provider Buttons -->
          <div style="display: flex; gap: 6px; margin-bottom: 14px; flex-wrap: wrap;">
            <button class="chip" onclick="NotificationsView.setProviderPreset('gmail')" style="font-size: 12px; font-weight: 700;">
              🔴 Google / Gmail
            </button>
            <button class="chip" onclick="NotificationsView.setProviderPreset('outlook')" style="font-size: 12px; font-weight: 700;">
              🔵 Outlook / O365
            </button>
            <button class="chip" onclick="NotificationsView.setProviderPreset('resend')" style="font-size: 12px; font-weight: 700;">
              ⚡ Resend API
            </button>
            <button class="chip" onclick="NotificationsView.setProviderPreset('custom')" style="font-size: 12px; font-weight: 700;">
              ⚙️ Custom SMTP
            </button>
          </div>

          <!-- Step-by-step Gmail App Password Guide Callout -->
          <div id="smtp-helper-box" style="background: rgba(14, 124, 123, 0.08); border-left: 3px solid var(--acc); padding: 10px 14px; border-radius: 6px; font-size: 12px; margin-bottom: 16px; line-height: 1.5;">
            <strong>💡 How to connect your Gmail in 30 seconds:</strong><br>
            1. Go to your <a href="https://myaccount.google.com/apppasswords" target="_blank" style="color: var(--acc); font-weight: 700;">Google Account &rarr; App Passwords</a>.<br>
            2. Name it <em>"CodePath"</em> and copy the 16-character generated password.<br>
            3. Paste your Gmail address and 16-character App Password below.
          </div>

          <form id="smtp-config-form" onsubmit="event.preventDefault(); NotificationsView.saveSmtp();">
            <div id="smtp-fields-group">
              <div class="grid" style="grid-template-columns: 2fr 1fr; gap: 10px; margin-bottom: 10px;">
                <div>
                  <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px;">SMTP Host Server:</label>
                  <input type="text" id="smtp-host" placeholder="smtp.gmail.com" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink); font-size: 13px;" />
                </div>
                <div>
                  <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px;">Port:</label>
                  <input type="number" id="smtp-port" placeholder="465" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink); font-size: 13px;" />
                </div>
              </div>

              <div style="margin-bottom: 10px;">
                <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px;">SMTP Username / Sender Email:</label>
                <input type="email" id="smtp-user" placeholder="your-email@gmail.com" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink); font-size: 13px;" />
              </div>

              <div style="margin-bottom: 10px;">
                <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px;">SMTP Password / Gmail App Password:</label>
                <input type="password" id="smtp-pass" placeholder="16-character App Password" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink); font-size: 13px;" />
              </div>

              <div style="margin-bottom: 14px;">
                <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px;">Sender Display Name (Optional):</label>
                <input type="text" id="smtp-from" placeholder="CodePath Learning" style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink); font-size: 13px;" />
              </div>
            </div>

            <!-- Resend API Key Field (Alternative) -->
            <div id="resend-field-group" style="display: none; margin-bottom: 14px;">
              <label style="font-size: 12px; font-weight: 700; display: block; margin-bottom: 4px;">Resend API Key:</label>
              <input type="password" id="smtp-resend-key" placeholder="re_1234567890..." style="width: 100%; padding: 8px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink); font-size: 13px;" />
              <small style="color: var(--mute); font-size: 11px;">Create a free key at <a href="https://resend.com" target="_blank" style="color:var(--acc);">resend.com</a> for instant HTTP delivery without SMTP passwords.</small>
            </div>

            <div style="display: flex; gap: 8px;">
              <button type="submit" class="btn p" style="flex: 1; padding: 10px;">
                💾 Save SMTP Settings
              </button>
              <button type="button" class="ghost" onclick="NotificationsView.resetSmtp()" style="padding: 10px 14px;">
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- CARD 3: Notification Outbox & Delivered History -->
      <div class="panel" style="padding: 22px;">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; flex-wrap: wrap; gap: 10px;">
          <div>
            <h3 style="margin: 0; font-size: 17px;">📬 Sent Emails & Outbox History</h3>
            <p style="color: var(--mute); font-size: 13px; margin: 3px 0 0;">
              Every email notification generated for your account is tracked here. Click <strong>"Preview Email"</strong> to view the exact HTML layout.
            </p>
          </div>
          <div style="font-size: 13px; color: var(--mute);" id="notif-count-text">0 notifications</div>
        </div>

        <div style="overflow-x: auto;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
            <thead>
              <tr style="border-bottom: 1px solid var(--line); color: var(--mute);">
                <th style="padding: 10px 8px;">Time</th>
                <th style="padding: 10px 8px;">Recipient</th>
                <th style="padding: 10px 8px;">Type</th>
                <th style="padding: 10px 8px;">Subject</th>
                <th style="padding: 10px 8px;">Status</th>
                <th style="padding: 10px 8px; text-align: right;">Action</th>
              </tr>
            </thead>
            <tbody id="notif-history-tbody">
              <tr>
                <td colspan="6" style="padding: 24px; text-align: center; color: var(--mute);">Loading notification records...</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `;

    // Connect event listeners
    document.getElementById('notif-test-btn')?.addEventListener('click', () => this.sendTestEmail());
    document.getElementById('notif-refresh-btn')?.addEventListener('click', () => this.loadData());

    // Master enabled toggle listener
    document.getElementById('pref-master-enabled')?.addEventListener('change', (e) => {
      const isChecked = e.target.checked;
      ['pref-welcome', 'pref-problem', 'pref-streak', 'pref-readiness'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.disabled = !isChecked;
      });
    });

    // Load live data from server
    await this.loadData();
  },

  async loadData() {
    try {
      const [settingsRes, historyRes] = await Promise.all([
        Store.api('/notifications/settings'),
        Store.api('/notifications/history')
      ]);

      this.data.email = settingsRes.email || Store.state.user?.email || '';
      this.data.emailPreferences = settingsRes.emailPreferences || this.data.emailPreferences;
      this.data.smtpConfig = settingsRes.smtpConfig || this.data.smtpConfig;
      this.data.history = historyRes.history || [];

      this.populateForm();
      this.renderHistory();
      this.renderStatusBanner();
    } catch (err) {
      Store.toast('Failed to load email settings: ' + err.message, 'error');
    }
  },

  populateForm() {
    const emailInput = document.getElementById('notif-user-email');
    if (emailInput) emailInput.value = this.data.email;

    const prefs = this.data.emailPreferences;
    const masterEl = document.getElementById('pref-master-enabled');
    if (masterEl) masterEl.checked = Boolean(prefs.enabled);

    const welcomeEl = document.getElementById('pref-welcome');
    if (welcomeEl) welcomeEl.checked = Boolean(prefs.welcomeEmail !== false);

    const probEl = document.getElementById('pref-problem');
    if (probEl) probEl.checked = Boolean(prefs.problemSolved !== false);

    const streakEl = document.getElementById('pref-streak');
    if (streakEl) streakEl.checked = Boolean(prefs.dailyStreak !== false);

    const readEl = document.getElementById('pref-readiness');
    if (readEl) readEl.checked = Boolean(prefs.jobReadiness !== false);

    const smtp = this.data.smtpConfig;
    const hostEl = document.getElementById('smtp-host');
    if (hostEl) hostEl.value = smtp.smtpHost || '';

    const portEl = document.getElementById('smtp-port');
    if (portEl) portEl.value = smtp.smtpPort || 465;

    const userEl = document.getElementById('smtp-user');
    if (userEl) userEl.value = smtp.smtpUser || '';

    const fromEl = document.getElementById('smtp-from');
    if (fromEl) fromEl.value = smtp.smtpFrom || '';
  },

  renderStatusBanner() {
    const banner = document.getElementById('notif-status-banner');
    const badge = document.getElementById('notif-conn-badge');
    if (!banner) return;

    const isConfigured = this.data.smtpConfig.isConfigured || this.data.smtpConfig.hasResend;

    if (isConfigured) {
      if (badge) {
        badge.textContent = 'Live Inbox Delivery Active';
        badge.className = 'badge ok';
      }
      banner.innerHTML = `
        <div style="background: rgba(27, 138, 75, 0.12); border: 1px solid var(--ok); border-radius: 8px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 22px;">✅</span>
            <div>
              <strong style="color: var(--ok);">Live Email Delivery Active</strong>
              <div style="font-size: 13px; color: var(--mute);">
                CodePath will send real emails directly to <code>${this.data.email}</code> when you achieve milestones, maintain your streak, or update your CV.
              </div>
            </div>
          </div>
          <button class="btn" onclick="NotificationsView.sendTestEmail()" style="font-size: 13px; background: var(--ok); color: white; padding: 6px 14px;">
            Test Real Send
          </button>
        </div>
      `;
    } else {
      if (badge) {
        badge.textContent = 'Outbox Mode';
        badge.className = 'badge warm';
      }
      banner.innerHTML = `
        <div style="background: rgba(183, 121, 31, 0.12); border: 1px solid var(--warm); border-radius: 8px; padding: 14px 18px; display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px;">
          <div style="display: flex; align-items: center; gap: 10px;">
            <span style="font-size: 22px;">ℹ️</span>
            <div>
              <strong style="color: var(--warm);">Currently Operating in In-App Outbox Mode</strong>
              <div style="font-size: 13px; color: var(--mute);">
                All email notifications are generated and logged in your Outbox below. To deliver them <strong>directly into your real Gmail/inbox</strong>, enter your Gmail App Password in the right panel!
              </div>
            </div>
          </div>
          <button class="btn" onclick="NotificationsView.setProviderPreset('gmail')" style="font-size: 13px; background: var(--warm); color: white; padding: 6px 14px;">
            Configure Gmail in 30s &rarr;
          </button>
        </div>
      `;
    }
  },

  renderHistory() {
    const tbody = document.getElementById('notif-history-tbody');
    const countEl = document.getElementById('notif-count-text');
    if (!tbody) return;

    if (countEl) {
      countEl.textContent = `${this.data.history.length} notifications logged`;
    }

    if (this.data.history.length === 0) {
      tbody.innerHTML = `
        <tr>
          <td colspan="6" style="padding: 28px; text-align: center; color: var(--mute);">
            No email notifications generated yet. Click <strong>"Send Test Notification"</strong> above to see one in action!
          </td>
        </tr>
      `;
      return;
    }

    tbody.innerHTML = this.data.history.map(item => {
      const isDelivered = item.status === 'delivered';
      const statusBadge = isDelivered 
        ? `<span class="badge ok" title="Delivered directly to real email inbox">✔ Delivered</span>` 
        : item.status === 'queued_needs_smtp_config'
        ? `<span class="badge warm" title="Logged in outbox. Add SMTP to send to inbox">📁 In Outbox</span>`
        : `<span class="badge bad" title="${item.error || 'Failed'}">✖ Error</span>`;

      const timeStr = item.createdAt ? new Date(item.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', month: 'short', day: 'numeric' }) : 'Just now';

      return `
        <tr style="border-bottom: 1px solid var(--line);">
          <td style="padding: 10px 8px; white-space: nowrap; color: var(--mute); font-size: 12px;">${timeStr}</td>
          <td style="padding: 10px 8px; font-weight: 600;"><code>${item.userEmail || this.data.email}</code></td>
          <td style="padding: 10px 8px;"><span class="tag" style="font-size: 11px;">${item.type}</span></td>
          <td style="padding: 10px 8px; font-weight: 600; max-width: 280px; overflow: hidden; text-overflow: ellipsis; white-space: nowrap;">${item.subject}</td>
          <td style="padding: 10px 8px;">${statusBadge}</td>
          <td style="padding: 10px 8px; text-align: right;">
            <button class="ghost" onclick="NotificationsView.previewEmail('${item.id}')" style="padding: 4px 10px; font-size: 12px;">
              👁️ Preview Email
            </button>
          </td>
        </tr>
      `;
    }).join('');
  },

  setProviderPreset(preset) {
    const hostEl = document.getElementById('smtp-host');
    const portEl = document.getElementById('smtp-port');
    const userEl = document.getElementById('smtp-user');
    const fromEl = document.getElementById('smtp-from');
    const fieldsGroup = document.getElementById('smtp-fields-group');
    const resendGroup = document.getElementById('resend-field-group');
    const helperBox = document.getElementById('smtp-helper-box');

    if (preset === 'gmail') {
      if (fieldsGroup) fieldsGroup.style.display = 'block';
      if (resendGroup) resendGroup.style.display = 'none';
      if (hostEl) hostEl.value = 'smtp.gmail.com';
      if (portEl) portEl.value = '465';
      if (fromEl) fromEl.value = 'CodePath Learning';
      if (helperBox) {
        helperBox.innerHTML = `
          <strong>🔴 Gmail Quick Setup:</strong><br>
          1. Go to <a href="https://myaccount.google.com/apppasswords" target="_blank" style="color:var(--acc); font-weight:700;">Google Account &rarr; App Passwords</a>.<br>
          2. Type <em>"CodePath"</em>, click Generate, and copy the 16 letters.<br>
          3. Enter your Gmail address and 16-character password below, then click Save.
        `;
      }
      Store.toast('Gmail preset loaded (smtp.gmail.com:465 TLS)', 'info');
    } else if (preset === 'outlook') {
      if (fieldsGroup) fieldsGroup.style.display = 'block';
      if (resendGroup) resendGroup.style.display = 'none';
      if (hostEl) hostEl.value = 'smtp.office365.com';
      if (portEl) portEl.value = '587';
      if (fromEl) fromEl.value = 'CodePath Learning';
      if (helperBox) {
        helperBox.innerHTML = `<strong>🔵 Outlook / Office 365:</strong> Enter your Microsoft account email and password / App Password. Port 587 STARTTLS enabled.`;
      }
      Store.toast('Outlook preset loaded (smtp.office365.com:587)', 'info');
    } else if (preset === 'resend') {
      if (fieldsGroup) fieldsGroup.style.display = 'none';
      if (resendGroup) resendGroup.style.display = 'block';
      if (helperBox) {
        helperBox.innerHTML = `<strong>⚡ Resend HTTP API:</strong> Get your free API key at <a href="https://resend.com" target="_blank" style="color:var(--acc);">resend.com</a>. No SMTP ports or app passwords needed!`;
      }
      Store.toast('Resend API mode active', 'info');
    } else {
      if (fieldsGroup) fieldsGroup.style.display = 'block';
      if (resendGroup) resendGroup.style.display = 'none';
      if (helperBox) {
        helperBox.innerHTML = `<strong>⚙️ Custom SMTP:</strong> Enter your server credentials (e.g., Mailgun, SendGrid, Amazon SES, or private Postfix server).`;
      }
    }
  },

  async savePreferences() {
    const userEmail = document.getElementById('notif-user-email')?.value.trim();
    if (!userEmail) {
      return Store.toast('Please enter a valid email address', 'error');
    }

    const emailPreferences = {
      enabled: document.getElementById('pref-master-enabled')?.checked,
      welcomeEmail: document.getElementById('pref-welcome')?.checked,
      problemSolved: document.getElementById('pref-problem')?.checked,
      dailyStreak: document.getElementById('pref-streak')?.checked,
      jobReadiness: document.getElementById('pref-readiness')?.checked
    };

    try {
      await Store.api('/notifications/settings', 'POST', {
        userEmail,
        emailPreferences
      });
      this.data.email = userEmail;
      this.data.emailPreferences = emailPreferences;
      if (Store.state.user) Store.state.user.email = userEmail;
      Store.toast('Notification preferences saved successfully! ✔', 'success');
      this.renderStatusBanner();
    } catch (err) {
      Store.toast('Failed to save preferences: ' + err.message, 'error');
    }
  },

  async saveSmtp() {
    const smtpHost = document.getElementById('smtp-host')?.value.trim();
    const smtpPort = document.getElementById('smtp-port')?.value;
    const smtpUser = document.getElementById('smtp-user')?.value.trim();
    const smtpPass = document.getElementById('smtp-pass')?.value.trim();
    const smtpFrom = document.getElementById('smtp-from')?.value.trim();
    const resendApiKey = document.getElementById('smtp-resend-key')?.value.trim();

    try {
      await Store.api('/notifications/settings', 'POST', {
        smtpConfig: {
          smtpHost,
          smtpPort,
          smtpUser,
          smtpPass,
          smtpFrom,
          resendApiKey
        }
      });
      Store.toast('SMTP & Email Delivery credentials saved! 🚀', 'success');
      await this.loadData();
    } catch (err) {
      Store.toast('Failed to save SMTP: ' + err.message, 'error');
    }
  },

  resetSmtp() {
    ['smtp-host', 'smtp-user', 'smtp-pass', 'smtp-from', 'smtp-resend-key'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.value = '';
    });
    const portEl = document.getElementById('smtp-port');
    if (portEl) portEl.value = '465';
    Store.toast('Reset fields', 'info');
  },

  async sendTestEmail() {
    const email = document.getElementById('notif-user-email')?.value.trim() || this.data.email;
    if (!email) {
      return Store.toast('Please specify your real email address first', 'error');
    }

    const testBtn = document.getElementById('notif-test-btn');
    if (testBtn) {
      testBtn.disabled = true;
      testBtn.textContent = '⏳ Sending test notification...';
    }

    try {
      const res = await Store.api('/notifications/test', 'POST', { targetEmail: email });
      if (res.success) {
        Store.toast(`🎉 Real email delivered to ${email}! Check your inbox.`, 'success');
      } else {
        Store.toast(res.message || 'Notification recorded in outbox.', 'info');
      }
      await this.loadData();
    } catch (err) {
      Store.toast('Test email failed: ' + err.message, 'error');
    } finally {
      if (testBtn) {
        testBtn.disabled = false;
        testBtn.textContent = '🚀 Send Test Notification to My Email';
      }
    }
  },

  previewEmail(id) {
    const item = this.data.history.find(h => h.id === id);
    if (!item) return;

    const overlay = document.getElementById('modal-overlay');
    const content = document.getElementById('modal-content');
    if (!overlay || !content) return;

    content.style.maxWidth = '680px';
    content.style.padding = '0';
    content.style.overflow = 'hidden';

    content.innerHTML = `
      <div style="background: var(--panel); padding: 16px 20px; border-bottom: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center;">
        <div>
          <strong style="font-size: 15px;">📧 Email Preview: ${item.subject}</strong>
          <div style="font-size: 12px; color: var(--mute);">To: <code>${item.userEmail}</code> • Sent: ${new Date(item.createdAt).toLocaleString()}</div>
        </div>
        <button class="ghost" onclick="document.getElementById('modal-overlay').style.display='none'" style="font-size: 16px; padding: 4px 8px;">✕</button>
      </div>
      <div style="max-height: 75vh; overflow-y: auto; background: #0F1722; padding: 10px;">
        <iframe srcdoc="${item.html.replace(/"/g, '&quot;')}" style="width: 100%; height: 500px; border: none; border-radius: 8px; background: #0F1722;"></iframe>
      </div>
      <div style="background: var(--panel); padding: 12px 20px; border-top: 1px solid var(--line); display: flex; justify-content: space-between; align-items: center;">
        <span class="tag">Delivery Status: ${item.status}</span>
        <button class="btn" onclick="document.getElementById('modal-overlay').style.display='none'">Close Preview</button>
      </div>
    `;
    overlay.style.display = 'flex';
  }
};
