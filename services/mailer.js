// CodePath - Universal Email Notification Service
// Zero-dependency native SMTP (TLS/SSL 465 & STARTTLS 587) + HTTP API (Resend) + In-App Outbox

const tls = require('tls');
const net = require('net');
const crypto = require('crypto');

// Styled HTML email layout wrapper
function wrapEmailHtml({ title, preheader, bodyContent, ctaUrl, ctaText }) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${title}</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0F1722; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #E8EDF3; }
    .wrapper { max-width: 600px; margin: 0 auto; background: #172230; border-radius: 12px; overflow: hidden; border: 1px solid #2A3A4D; margin-top: 24px; margin-bottom: 24px; }
    .header { background: linear-gradient(135deg, #0E7C7B, #1B4965); padding: 28px 24px; text-align: center; }
    .logo { font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: -0.5px; margin: 0; }
    .logo span { color: #3CC6BF; }
    .subtitle { color: rgba(255,255,255,0.85); font-size: 14px; margin-top: 6px; }
    .content { padding: 32px 28px; line-height: 1.6; font-size: 15px; color: #D5DDE7; }
    .highlight-card { background: #0F1722; border: 1px solid #2A3A4D; border-left: 4px solid #0E7C7B; padding: 16px 20px; border-radius: 8px; margin: 20px 0; }
    .btn { display: inline-block; background: #0E7C7B; color: #FFFFFF !important; font-weight: 700; text-decoration: none; padding: 12px 28px; border-radius: 8px; font-size: 15px; text-align: center; margin-top: 18px; }
    .footer { background: #0B111A; padding: 20px 24px; text-align: center; font-size: 12px; color: #7B8794; border-top: 1px solid #2A3A4D; }
    .badge { display: inline-block; background: rgba(14, 124, 123, 0.2); color: #3CC6BF; padding: 3px 10px; border-radius: 12px; font-size: 12px; font-weight: 600; }
  </style>
</head>
<body>
  <div style="display:none;font-size:1px;color:#333;line-height:1px;max-height:0px;max-width:0px;opacity:0;overflow:hidden;">
    ${preheader || title}
  </div>
  <table role="presentation" width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0F1722; padding: 20px 0;">
    <tr>
      <td align="center">
        <div class="wrapper">
          <div class="header">
            <h1 class="logo">Code<span>Path</span></h1>
            <div class="subtitle">Accelerated Coding Practice & Job-Readiness Platform</div>
          </div>
          <div class="content">
            ${bodyContent}
            ${ctaUrl && ctaText ? `
              <div style="text-align: center; margin-top: 24px;">
                <a href="${ctaUrl}" class="btn" target="_blank">${ctaText} &rarr;</a>
              </div>
            ` : ''}
          </div>
          <div class="footer">
            <p style="margin: 0 0 6px 0;">Sent by CodePath Learning Systems • Preparing learners for developer roles in 60 days</p>
            <p style="margin: 0;">You received this because email notifications are enabled in your CodePath profile settings.</p>
          </div>
        </div>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

// Built-in Email Templates
const templates = {
  welcome: ({ name, email, language = 'JavaScript', goalTrack = 'Frontend' }) => {
    const title = `Welcome to CodePath 🚀 Let's master ${language}!`;
    const bodyContent = `
      <h2 style="color: #FFFFFF; margin-top: 0; font-size: 22px;">Welcome aboard, ${name}! 👋</h2>
      <p>Thank you for signing up for <strong>CodePath</strong> with your email (<code>${email}</code>). You are now enrolled in the <strong>60-Day Developer Job Readiness Program</strong>.</p>
      
      <div class="highlight-card">
        <div style="font-weight: 700; color: #3CC6BF; margin-bottom: 8px;">🎯 Your Selected Focus:</div>
        <div><strong>Core Language:</strong> <span class="badge">${language}</span></div>
        <div style="margin-top: 6px;"><strong>Career Track:</strong> ${goalTrack} Engineer</div>
        <div style="margin-top: 6px;"><strong>Practice Curriculum:</strong> 100 Job-Ready Coding Questions (Basic, Intermediate, Hard)</div>
        <div style="margin-top: 6px;"><strong>Target Timeline:</strong> 60 Days to First Job Interviews</div>
      </div>

      <h3 style="color: #FFFFFF; font-size: 16px; margin-top: 24px;">What's next for you?</h3>
      <ol style="padding-left: 20px; line-height: 1.8;">
        <li><strong>Segment 1: Learn Topics:</strong> Follow the roadmap from language basics to production patterns.</li>
        <li><strong>Segment 2: Practice Questions:</strong> Solve hands-on algorithmic and real-world coding problems with live tests.</li>
        <li><strong>Tech CV Builder:</strong> Build your ATS-optimized resume using our Top 5 industry templates.</li>
      </ol>
      <p style="margin-top: 16px;">We will email you milestone alerts when you pass challenging problem sets and keep your streak alive!</p>
    `;
    return {
      subject: `Welcome to CodePath 🚀 Your ${language} Coding Journey Starts Today!`,
      html: wrapEmailHtml({
        title,
        preheader: `Welcome to CodePath, ${name}! Your ${language} curriculum and 60-day roadmap are ready.`,
        bodyContent,
        ctaUrl: 'http://localhost:3000/#dashboard',
        ctaText: 'Open My Learning Dashboard'
      }),
      text: `Hi ${name},\n\nWelcome to CodePath! Your selected language is ${language}. You have access to 100+ job-ready practice problems, structured learning roadmaps, and the Tech CV Builder.\n\nOpen your dashboard: http://localhost:3000/#dashboard`
    };
  },

  problemSolved: ({ name, problemTitle, difficulty, language, streakCount, totalSolved }) => {
    const title = `🎉 Problem Solved: ${problemTitle}`;
    const diffColor = difficulty === 'Easy' ? '#1B8A4B' : difficulty === 'Medium' ? '#B7791F' : '#C0392B';
    const bodyContent = `
      <h2 style="color: #FFFFFF; margin-top: 0; font-size: 22px;">Outstanding work, ${name}! 🏆</h2>
      <p>You just successfully solved a coding problem on CodePath and passed all test suites:</p>
      
      <div class="highlight-card">
        <div style="font-size: 18px; font-weight: 700; color: #FFFFFF; margin-bottom: 6px;">${problemTitle}</div>
        <div>
          <span style="display:inline-block; background:${diffColor}; color:#FFF; font-size:11px; font-weight:700; padding:2px 8px; border-radius:4px; text-transform:uppercase;">${difficulty}</span>
          <span class="badge" style="margin-left:6px;">${language}</span>
        </div>
        <div style="margin-top: 12px; font-size: 14px; border-top: 1px solid #2A3A4D; padding-top: 10px;">
          <strong>🔥 Coding Streak:</strong> ${streakCount} Day${streakCount === 1 ? '' : 's'} &nbsp;|&nbsp; 
          <strong>✅ Total Problems Solved:</strong> ${totalSolved}
        </div>
      </div>

      <p>Consistency is what sets top developers apart in technical interviews. Keep going!</p>
    `;
    return {
      subject: `🎉 Solved: ${problemTitle} (${difficulty} - ${language}) | CodePath Streak: ${streakCount}d`,
      html: wrapEmailHtml({
        title,
        preheader: `Great job ${name}! You solved ${problemTitle} on CodePath.`,
        bodyContent,
        ctaUrl: 'http://localhost:3000/#practice',
        ctaText: 'Solve Next Challenge'
      }),
      text: `Hi ${name},\n\nGreat job! You solved "${problemTitle}" (${difficulty} - ${language}) on CodePath.\nYour streak is ${streakCount} days, with ${totalSolved} problems solved.\n\nContinue practicing: http://localhost:3000/#practice`
    };
  },

  streakAlert: ({ name, streakCount, language }) => {
    const title = `🔥 Day ${streakCount} Coding Streak!`;
    const bodyContent = `
      <h2 style="color: #FFFFFF; margin-top: 0; font-size: 22px;">Keep the fire burning, ${name}! 🔥</h2>
      <p>You have a <strong>${streakCount}-day active streak</strong> on CodePath. Don't let today slip by without writing a few lines of code!</p>
      
      <div class="highlight-card">
        <div style="font-weight: 700; color: #3CC6BF; margin-bottom: 6px;">Today's Daily Target:</div>
        <div>• Solve 1 ${language || 'coding'} practice problem</div>
        <div>• Review 1 Spaced Repetition card</div>
        <div>• Maintain your 60-day interview readiness trajectory</div>
      </div>
    `;
    return {
      subject: `🔥 Day ${streakCount} Streak! Keep your momentum on CodePath`,
      html: wrapEmailHtml({
        title,
        preheader: `You're on a ${streakCount}-day streak on CodePath! Keep it going today.`,
        bodyContent,
        ctaUrl: 'http://localhost:3000/#dashboard',
        ctaText: 'Practice Today’s Problem'
      }),
      text: `Hi ${name},\n\nYou have an active ${streakCount}-day streak on CodePath! Head over to your dashboard to complete today's practice: http://localhost:3000/#dashboard`
    };
  },

  cvReady: ({ name, formatName = 'ATS Modern' }) => {
    const title = `📄 Your Tech CV (${formatName}) is Ready!`;
    const bodyContent = `
      <h2 style="color: #FFFFFF; margin-top: 0; font-size: 22px;">Resume Updated, ${name}! 📄</h2>
      <p>Your technical CV has been saved in the <strong>${formatName}</strong> format.</p>
      
      <div class="highlight-card">
        <div style="font-weight: 700; color: #3CC6BF; margin-bottom: 8px;">Next Steps for Job Applications:</div>
        <div>1. Open the <strong>Tech CV Builder</strong> in CodePath.</div>
        <div>2. Click <strong>Print / Save as PDF</strong> to generate an A4 document.</div>
        <div>3. Complete the other 3 pillars in the <em>"Am I Ready to Apply?"</em> checklist.</div>
      </div>
    `;
    return {
      subject: `📄 Your Tech CV (${formatName}) is Ready for Job Applications!`,
      html: wrapEmailHtml({
        title,
        preheader: `Your Tech CV (${formatName}) is saved and ready to export as PDF.`,
        bodyContent,
        ctaUrl: 'http://localhost:3000/#cv-builder',
        ctaText: 'View & Export CV'
      }),
      text: `Hi ${name},\n\nYour Tech CV (${formatName}) is updated and ready in CodePath.\nView & Export: http://localhost:3000/#cv-builder`
    };
  },

  test: ({ name, email }) => {
    const title = `✅ CodePath Email Notifications Active!`;
    const bodyContent = `
      <h2 style="color: #FFFFFF; margin-top: 0; font-size: 22px;">Success! Email notifications are working 🎉</h2>
      <p>Hello <strong>${name}</strong>,</p>
      <p>This test email confirms that your email address (<code>${email}</code>) is successfully configured to receive real-time updates from <strong>CodePath</strong>.</p>
      
      <div class="highlight-card">
        <div style="font-weight: 700; color: #1B8A4B; margin-bottom: 6px;">✔ Notification Features Connected:</div>
        <div>• 🚀 <strong>Curriculum & Roadmap alerts</strong></div>
        <div>• 🏆 <strong>Problem solved milestones & test results</strong></div>
        <div>• 🔥 <strong>Daily coding streak reminders</strong></div>
        <div>• 💼 <strong>Curated developer job match alerts</strong></div>
      </div>

      <p>You can customize which notifications you receive anytime in your Profile & Email Settings.</p>
    `;
    return {
      subject: `✅ CodePath Email Notifications Active for ${email}`,
      html: wrapEmailHtml({
        title,
        preheader: `Email verification successful for ${email}. Real-time notifications are active!`,
        bodyContent,
        ctaUrl: 'http://localhost:3000/#dashboard',
        ctaText: 'Go to CodePath'
      }),
      text: `Hi ${name},\n\nSuccess! Your email address (${email}) is connected to CodePath notifications.\nVisit CodePath: http://localhost:3000/#dashboard`
    };
  }
};

// Pure Zero-Dependency Direct SSL/TLS SMTP Sender (Port 465, e.g. Gmail)
function sendSmtpTls({ host, port = 465, user, pass, from, to, subject, html, text }) {
  return new Promise((resolve, reject) => {
    const socket = tls.connect({
      host,
      port: Number(port),
      rejectUnauthorized: false,
      timeout: 12000
    });

    let step = 0;
    let buffer = '';

    socket.setEncoding('utf8');

    function send(cmd) {
      socket.write(cmd + '\r\n');
    }

    socket.on('data', (data) => {
      buffer += data;
      const lines = buffer.split('\r\n');
      const lastLine = lines[lines.length - 2] || lines[lines.length - 1];
      if (!/^\d{3}\s/.test(lastLine)) {
        return; // wait for full multi-line response
      }
      const code = parseInt(lastLine.slice(0, 3), 10);
      buffer = '';

      if (code >= 400) {
        socket.end();
        return reject(new Error(`SMTP Error ${code}: ${lastLine}`));
      }

      switch (step) {
        case 0: // 220 Greeting
          step = 1;
          send('EHLO localhost');
          break;
        case 1: // 250 EHLO OK
          step = 2;
          send('AUTH LOGIN');
          break;
        case 2: // 334 Username prompt
          step = 3;
          send(Buffer.from(user).toString('base64'));
          break;
        case 3: // 334 Password prompt
          step = 4;
          send(Buffer.from(pass).toString('base64'));
          break;
        case 4: // 235 Authentication successful
          step = 5;
          send(`MAIL FROM:<${from || user}>`);
          break;
        case 5: // 250 Sender OK
          step = 6;
          send(`RCPT TO:<${to}>`);
          break;
        case 6: // 250 Recipient OK
          step = 7;
          send('DATA');
          break;
        case 7: // 354 Start mail input
          step = 8;
          const boundary = '----=_Part_' + Date.now() + '_' + crypto.randomBytes(4).toString('hex');
          const mime = [
            `From: ${from ? (from.includes('<') ? from : `"${from}" <${user}>`) : `"CodePath Learning" <${user}>`}`,
            `To: ${to}`,
            `Subject: ${subject}`,
            'MIME-Version: 1.0',
            `Content-Type: multipart/alternative; boundary="${boundary}"`,
            '',
            `--${boundary}`,
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 7bit',
            '',
            text || html.replace(/<[^>]+>/g, ' '),
            '',
            `--${boundary}`,
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: 7bit',
            '',
            html,
            '',
            `--${boundary}--`,
            '.'
          ].join('\r\n');
          send(mime);
          break;
        case 8: // 250 Message accepted
          step = 9;
          send('QUIT');
          break;
        case 9: // 221 Bye
          socket.end();
          resolve({ success: true, messageId: `<${Date.now()}@codepath>` });
          break;
      }
    });

    socket.on('timeout', () => {
      socket.destroy();
      reject(new Error('SMTP connection timed out after 12 seconds'));
    });

    socket.on('error', (err) => {
      reject(err);
    });
  });
}

// Zero-Dependency STARTTLS SMTP Sender (Port 587, e.g. Outlook/Custom)
function sendSmtpStartTls({ host, port = 587, user, pass, from, to, subject, html, text }) {
  return new Promise((resolve, reject) => {
    const rawSocket = net.createConnection({ host, port: Number(port), timeout: 12000 });
    let buffer = '';
    let step = 0;
    let tlsSocket = null;

    rawSocket.setEncoding('utf8');

    function sendRaw(cmd) {
      rawSocket.write(cmd + '\r\n');
    }

    rawSocket.on('data', (data) => {
      buffer += data;
      const lines = buffer.split('\r\n');
      const lastLine = lines[lines.length - 2] || lines[lines.length - 1];
      if (!/^\d{3}\s/.test(lastLine)) return;
      const code = parseInt(lastLine.slice(0, 3), 10);
      buffer = '';

      if (code >= 400) {
        rawSocket.destroy();
        return reject(new Error(`STARTTLS Error ${code}: ${lastLine}`));
      }

      if (step === 0) { // Greeting
        step = 1;
        sendRaw('EHLO localhost');
      } else if (step === 1) { // EHLO
        step = 2;
        sendRaw('STARTTLS');
      } else if (step === 2) { // STARTTLS 220
        // Upgrade to TLS
        tlsSocket = tls.connect({
          socket: rawSocket,
          host,
          rejectUnauthorized: false
        }, () => {
          // Handshake complete, resume SMTP on TLS socket
          sendTlsSmtpFlow(tlsSocket, { user, pass, from, to, subject, html, text })
            .then(resolve)
            .catch(reject);
        });
        tlsSocket.on('error', reject);
      }
    });

    rawSocket.on('timeout', () => {
      rawSocket.destroy();
      reject(new Error('STARTTLS connection timed out'));
    });
    rawSocket.on('error', reject);
  });
}

function sendTlsSmtpFlow(socket, { user, pass, from, to, subject, html, text }) {
  return new Promise((resolve, reject) => {
    let step = 0;
    let buffer = '';
    socket.setEncoding('utf8');
    function send(cmd) { socket.write(cmd + '\r\n'); }

    send('EHLO localhost');

    socket.on('data', (data) => {
      buffer += data;
      const lines = buffer.split('\r\n');
      const lastLine = lines[lines.length - 2] || lines[lines.length - 1];
      if (!/^\d{3}\s/.test(lastLine)) return;
      const code = parseInt(lastLine.slice(0, 3), 10);
      buffer = '';

      if (code >= 400) {
        socket.end();
        return reject(new Error(`SMTP Error ${code}: ${lastLine}`));
      }

      switch (step) {
        case 0: // EHLO response
          step = 1;
          send('AUTH LOGIN');
          break;
        case 1:
          step = 2;
          send(Buffer.from(user).toString('base64'));
          break;
        case 2:
          step = 3;
          send(Buffer.from(pass).toString('base64'));
          break;
        case 3: // Auth success
          step = 4;
          send(`MAIL FROM:<${from || user}>`);
          break;
        case 4:
          step = 5;
          send(`RCPT TO:<${to}>`);
          break;
        case 5:
          step = 6;
          send('DATA');
          break;
        case 6:
          step = 7;
          const boundary = '----=_Part_' + Date.now();
          const mime = [
            `From: ${from ? (from.includes('<') ? from : `"${from}" <${user}>`) : `"CodePath Learning" <${user}>`}`,
            `To: ${to}`,
            `Subject: ${subject}`,
            'MIME-Version: 1.0',
            `Content-Type: multipart/alternative; boundary="${boundary}"`,
            '',
            `--${boundary}`,
            'Content-Type: text/plain; charset=UTF-8',
            'Content-Transfer-Encoding: 7bit',
            '',
            text || html.replace(/<[^>]+>/g, ' '),
            '',
            `--${boundary}`,
            'Content-Type: text/html; charset=UTF-8',
            'Content-Transfer-Encoding: 7bit',
            '',
            html,
            '',
            `--${boundary}--`,
            '.'
          ].join('\r\n');
          send(mime);
          break;
        case 7:
          step = 8;
          send('QUIT');
          break;
        case 8:
          socket.end();
          resolve({ success: true, messageId: `<${Date.now()}@codepath>` });
          break;
      }
    });
  });
}

// HTTP API Delivery (Resend API)
async function sendViaResend({ apiKey, from, to, subject, html, text }) {
  if (typeof fetch !== 'function') {
    throw new Error('Global fetch is not available in this Node version');
  }
  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${apiKey}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      from: from || 'CodePath <onboarding@resend.dev>',
      to: [to],
      subject,
      html,
      text
    })
  });
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.message || 'Resend API returned error status ' + response.status);
  }
  return { success: true, messageId: data.id };
}

// Master Send Notification Function
async function sendNotification({ db, type, user, payload = {}, force = false }) {
  if (!user || !user.email) return { skipped: true, reason: 'No user email' };

  // Check user notification preferences
  const profile = (db.profiles && db.profiles[user.id]) || {};
  const emailPrefs = profile.emailPreferences || {
    enabled: true,
    welcomeEmail: true,
    problemSolved: true,
    dailyStreak: true,
    jobReadiness: true
  };

  if (!force && !emailPrefs.enabled) {
    return { skipped: true, reason: 'Notifications disabled by user' };
  }

  // Generate content from template
  const templateFn = templates[type];
  if (!templateFn) {
    throw new Error(`Unknown email template type: ${type}`);
  }
  const emailData = templateFn({
    name: user.name || 'Developer',
    email: user.email,
    ...payload
  });

  // Check configured SMTP settings from DB or ENV
  const settings = (db.systemSettings && db.systemSettings.email) || {};
  const smtpHost = settings.smtpHost || process.env.SMTP_HOST;
  const smtpPort = settings.smtpPort || process.env.SMTP_PORT || 465;
  const smtpUser = settings.smtpUser || process.env.SMTP_USER;
  const smtpPass = settings.smtpPass || process.env.SMTP_PASS;
  const smtpFrom = settings.smtpFrom || process.env.SMTP_FROM || smtpUser;
  const resendApiKey = settings.resendApiKey || process.env.RESEND_API_KEY;

  const outboxEntry = {
    id: 'em-' + Date.now() + '-' + crypto.randomBytes(3).toString('hex'),
    userId: user.id,
    userEmail: user.email,
    userName: user.name,
    type,
    subject: emailData.subject,
    html: emailData.html,
    text: emailData.text,
    status: 'queued',
    createdAt: new Date().toISOString(),
    deliveryMethod: 'none',
    error: null
  };

  if (!db.emailNotifications) {
    db.emailNotifications = [];
  }

  // Try real email delivery if configured
  try {
    if (resendApiKey) {
      outboxEntry.deliveryMethod = 'resend';
      const result = await sendViaResend({
        apiKey: resendApiKey,
        from: smtpFrom,
        to: user.email,
        subject: emailData.subject,
        html: emailData.html,
        text: emailData.text
      });
      outboxEntry.status = 'delivered';
      outboxEntry.messageId = result.messageId;
      outboxEntry.deliveredAt = new Date().toISOString();
      console.log(`[CodePath Mailer] Email delivered to ${user.email} via Resend (${outboxEntry.subject})`);
    } else if (smtpHost && smtpUser && smtpPass) {
      outboxEntry.deliveryMethod = `smtp-${smtpPort}`;
      let result;
      if (Number(smtpPort) === 465) {
        result = await sendSmtpTls({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass,
          from: smtpFrom,
          to: user.email,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text
        });
      } else {
        result = await sendSmtpStartTls({
          host: smtpHost,
          port: smtpPort,
          user: smtpUser,
          pass: smtpPass,
          from: smtpFrom,
          to: user.email,
          subject: emailData.subject,
          html: emailData.html,
          text: emailData.text
        });
      }
      outboxEntry.status = 'delivered';
      outboxEntry.messageId = result.messageId;
      outboxEntry.deliveredAt = new Date().toISOString();
      console.log(`[CodePath Mailer] Real email delivered to ${user.email} via SMTP ${smtpHost} (${outboxEntry.subject})`);
    } else {
      outboxEntry.status = 'queued_needs_smtp_config';
      outboxEntry.error = 'SMTP credentials not configured. Please enter your Gmail/SMTP App Password in Email Settings to deliver real emails to your inbox.';
      console.log(`[CodePath Mailer] Notification recorded for ${user.email} (Queued in app outbox. Add SMTP in Email Settings to send to inbox).`);
    }
  } catch (err) {
    outboxEntry.status = 'failed';
    outboxEntry.error = err.message || String(err);
    console.error(`[CodePath Mailer] Delivery error for ${user.email}:`, err.message);
  }

  // Add to database outbox (keep last 100 entries)
  db.emailNotifications.unshift(outboxEntry);
  if (db.emailNotifications.length > 100) {
    db.emailNotifications = db.emailNotifications.slice(0, 100);
  }

  return outboxEntry;
}

module.exports = {
  templates,
  sendNotification,
  sendSmtpTls,
  sendSmtpStartTls,
  sendViaResend
};

