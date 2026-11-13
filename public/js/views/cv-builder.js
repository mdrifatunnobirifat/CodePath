// CodePath Tech CV & Resume Builder with Top 5 Formats
const CVBuilderView = {
  currentFormat: 'ats-modern', // 'ats-modern' | 'two-column' | 'executive-impact' | 'developer-minimal' | 'frontend-creative'
  cvData: null,

  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="notice">Loading CV builder...</div>';

    try {
      // 1. Fetch saved CV or generate intelligent defaults from profile & projects
      if (!this.cvData) {
        const savedRes = await Store.api('/user/cv');
        if (savedRes.cv) {
          this.cvData = savedRes.cv;
        } else {
          const userRes = await Store.api('/me');
          const projRes = await Store.api('/projects');
          const user = userRes.user || {};
          const profile = userRes.profile || {};
          const projects = projRes.projects || [];
          const completedProjects = projects.filter(p => p.submission);

          this.cvData = {
            name: user.name || 'Alex Morgan',
            title: `${profile.goalTrack ? profile.goalTrack.charAt(0).toUpperCase() + profile.goalTrack.slice(1) : 'Full-Stack'} Software Developer`,
            email: user.email || 'alex.morgan@example.com',
            phone: '+1 (555) 234-5678',
            location: 'Dhaka, Bangladesh · Remote Available',
            github: profile.githubUrl || 'https://github.com/alexmorgan',
            linkedin: 'https://linkedin.com/in/alexmorgan',
            website: 'https://alexmorgan.dev',
            summary: `Results-driven software developer with hands-on experience building full-stack web applications, RESTful APIs, and responsive user interfaces. Proven problem solver with 50+ algorithm challenges completed and a strong foundation in modern engineering architecture.`,
            skills: {
              languages: 'JavaScript (ES6+), TypeScript, Python, SQL, C#, PHP',
              frameworks: 'React, Node.js, Express, ASP.NET Core, Tailwind CSS',
              databases: 'PostgreSQL, SQLite, Redis, MongoDB',
              tools: 'Git, Docker, Linux, REST APIs, Jest, Postman, CI/CD'
            },
            projects: completedProjects.length > 0 ? completedProjects.map(p => ({
              title: p.title,
              technologies: 'React, Node.js, REST API',
              github: p.submission.githubUrl || 'https://github.com/demo/project',
              demo: p.submission.liveDemoUrl || 'https://demo-app.vercel.app',
              bullets: [
                `Architected responsive full-stack application following clean component and state separation.`,
                `Integrated automated client-side testing and persistent local data synchronization.`,
                `Deployed application with 99.9% uptime and sub-second average response time.`
              ]
            })) : [
              {
                title: 'Full-Stack Job Application Tracker',
                technologies: 'React, Node.js, SQLite, Tailwind CSS',
                github: 'https://github.com/alexmorgan/job-tracker',
                demo: 'https://job-tracker-demo.vercel.app',
                bullets: [
                  'Built Kanban-style application tracker managing 5 application stages with drag-and-drop mechanics.',
                  'Implemented JWT authentication, input validation middleware, and relational SQLite schema.',
                  'Achieved 100% test coverage on API endpoints and optimized query load times under 80ms.'
                ]
              },
              {
                title: 'Real-Time Weather Forecast Dashboard',
                technologies: 'JavaScript, OpenWeather API, CSS3',
                github: 'https://github.com/alexmorgan/weather-dashboard',
                demo: 'https://weather-demo.vercel.app',
                bullets: [
                  'Engineered asynchronous weather dashboard fetching 5-day forecasts with debounced autocomplete.',
                  'Implemented animated loading skeletons, dynamic temperature converters, and error fallbacks.'
                ]
              }
            ],
            experience: [
              {
                role: 'Junior Developer Intern',
                company: 'Northwind Software Labs',
                period: '2025 - Present',
                location: 'Remote',
                bullets: [
                  'Collaborated on front-end components and client dashboards in React and TypeScript.',
                  'Participated in code reviews, resolved 35+ Jira tickets, and improved unit test coverage by 20%.'
                ]
              }
            ],
            education: [
              {
                degree: 'B.S. in Computer Science & Engineering',
                institution: 'State University of Technology',
                year: '2022 - 2026',
                details: 'Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Engineering.'
              }
            ]
          };
        }
      }

      const templates = [
        { id: 'ats-modern', name: '1. Modern Tech (ATS-Friendly)', desc: '100% parseable single-column layout favored by FAANG & top tech recruiters' },
        { id: 'two-column', name: '2. Two-Column Engineering', desc: 'Compact high-density split layout with sidebar for technical skills' },
        { id: 'executive-impact', name: '3. Senior Impact Architecture', desc: 'Serif accent headers, quantified metrics, and system design emphasis' },
        { id: 'developer-minimal', name: '4. Developer Minimalist', desc: 'Clean monospace terminal aesthetic with inline repo links' },
        { id: 'frontend-creative', name: '5. Creative Portfolio-Linked', desc: 'Visual project cards with tags, live demo pills, and modern styling' }
      ];

      app.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Top Builder Header & Format Selector -->
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <h2>Tech CV & Resume Builder</h2>
              <p class="tag" style="margin-top: 4px;">Choose from the top 5 industry-standard formats designed to land interviews.</p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn" onclick="CVBuilderView.saveCvData()">💾 Save CV</button>
              <button class="btn" onclick="CVBuilderView.copyMarkdown()">📋 Copy Text/Markdown</button>
              <button class="btn p" onclick="CVBuilderView.printCv()">🖨️ Print / Download PDF</button>
            </div>
          </div>

          <!-- Format Selector Chips -->
          <div class="chips" style="margin: 0;">
            ${templates.map(t => `
              <button class="chip" aria-pressed="${this.currentFormat === t.id}" onclick="CVBuilderView.setFormat('${t.id}')">
                ${t.name}
              </button>
            `).join('')}
          </div>

          <!-- Split Workspace: Form Editor on Left, Live Canvas on Right -->
          <div style="display: grid; grid-template-columns: 420px 1fr; gap: 20px; align-items: start;">
            <!-- Left Form Editor -->
            <div class="card" style="max-height: 820px; overflow-y: auto; padding: 18px;">
              <h3 style="margin-bottom: 14px; font-size: 18px;">Edit Resume Details</h3>

              <!-- Personal Info -->
              <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">
                <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">Personal Information</b>
                <input type="text" placeholder="Full Name" value="${CodeEditor.escapeHtml(this.cvData.name)}" oninput="CVBuilderView.updateField('name', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; width: 100%;" />
                <input type="text" placeholder="Target Job Title" value="${CodeEditor.escapeHtml(this.cvData.title)}" oninput="CVBuilderView.updateField('title', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; width: 100%;" />
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <input type="email" placeholder="Email" value="${CodeEditor.escapeHtml(this.cvData.email)}" oninput="CVBuilderView.updateField('email', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                  <input type="text" placeholder="Phone" value="${CodeEditor.escapeHtml(this.cvData.phone)}" oninput="CVBuilderView.updateField('phone', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                </div>
                <input type="text" placeholder="Location" value="${CodeEditor.escapeHtml(this.cvData.location)}" oninput="CVBuilderView.updateField('location', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <input type="text" placeholder="GitHub URL" value="${CodeEditor.escapeHtml(this.cvData.github)}" oninput="CVBuilderView.updateField('github', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                  <input type="text" placeholder="LinkedIn URL" value="${CodeEditor.escapeHtml(this.cvData.linkedin)}" oninput="CVBuilderView.updateField('linkedin', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                </div>
              </div>

              <!-- Summary -->
              <div style="margin-bottom: 16px;">
                <b style="font-size: 13px; text-transform: uppercase; color: var(--mute); display: block; margin-bottom: 6px;">Professional Summary</b>
                <textarea rows="4" oninput="CVBuilderView.updateField('summary', this.value)" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; font-family: inherit;">${CodeEditor.escapeHtml(this.cvData.summary)}</textarea>
              </div>

              <!-- Skills -->
              <div style="display: flex; flex-direction: column; gap: 8px; margin-bottom: 16px;">
                <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">Technical Skills</b>
                <input type="text" placeholder="Languages (e.g. JavaScript, Python, SQL)" value="${CodeEditor.escapeHtml(this.cvData.skills.languages)}" oninput="CVBuilderView.updateSkill('languages', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                <input type="text" placeholder="Frameworks & Libraries (e.g. React, Node.js)" value="${CodeEditor.escapeHtml(this.cvData.skills.frameworks)}" oninput="CVBuilderView.updateSkill('frameworks', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                <input type="text" placeholder="Databases (e.g. PostgreSQL, Redis)" value="${CodeEditor.escapeHtml(this.cvData.skills.databases)}" oninput="CVBuilderView.updateSkill('databases', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                <input type="text" placeholder="Tools (e.g. Git, Docker, REST APIs)" value="${CodeEditor.escapeHtml(this.cvData.skills.tools)}" oninput="CVBuilderView.updateSkill('tools', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
              </div>

              <!-- Projects -->
              <div style="margin-bottom: 16px;">
                <b style="font-size: 13px; text-transform: uppercase; color: var(--mute); display: block; margin-bottom: 6px;">Featured Project 1</b>
                <input type="text" placeholder="Project Title" value="${CodeEditor.escapeHtml(this.cvData.projects[0]?.title || '')}" oninput="CVBuilderView.updateProject(0, 'title', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; width: 100%; margin-bottom: 6px;" />
                <input type="text" placeholder="Tech Stack" value="${CodeEditor.escapeHtml(this.cvData.projects[0]?.technologies || '')}" oninput="CVBuilderView.updateProject(0, 'technologies', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; width: 100%; margin-bottom: 6px;" />
                <textarea rows="3" placeholder="Bullet points (1 per line)" oninput="CVBuilderView.updateProjectBullets(0, this.value)" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; font-family: inherit;">${(this.cvData.projects[0]?.bullets || []).join('\n')}</textarea>
              </div>

              <!-- Education -->
              <div>
                <b style="font-size: 13px; text-transform: uppercase; color: var(--mute); display: block; margin-bottom: 6px;">Education</b>
                <input type="text" placeholder="Degree" value="${CodeEditor.escapeHtml(this.cvData.education[0]?.degree || '')}" oninput="CVBuilderView.updateEducation(0, 'degree', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; width: 100%; margin-bottom: 6px;" />
                <input type="text" placeholder="Institution & Years" value="${CodeEditor.escapeHtml(this.cvData.education[0]?.institution || '')}" oninput="CVBuilderView.updateEducation(0, 'institution', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; width: 100%;" />
              </div>
            </div>

            <!-- Right Preview Canvas (Printable A4 Sheet) -->
            <div style="display: flex; justify-content: center; overflow-x: auto;">
              <div id="cv-preview-sheet" class="cv-sheet cv-${this.currentFormat}">
                ${this.renderTemplate()}
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Error rendering CV Builder: ${err.message}</div></div>`;
    }
  },

  setFormat(fmt) {
    this.currentFormat = fmt;
    const sheet = document.getElementById('cv-preview-sheet');
    if (sheet) {
      sheet.className = `cv-sheet cv-${fmt}`;
      sheet.innerHTML = this.renderTemplate();
    }
    // Update chip pressed states
    document.querySelectorAll('.chips .chip').forEach(c => {
      c.setAttribute('aria-pressed', c.textContent.toLowerCase().includes(fmt.split('-')[0]));
    });
    this.render();
  },

  updateField(key, val) {
    this.cvData[key] = val;
    this.updatePreview();
  },

  updateSkill(key, val) {
    this.cvData.skills[key] = val;
    this.updatePreview();
  },

  updateProject(idx, key, val) {
    if (!this.cvData.projects[idx]) this.cvData.projects[idx] = { bullets: [] };
    this.cvData.projects[idx][key] = val;
    this.updatePreview();
  },

  updateProjectBullets(idx, val) {
    if (!this.cvData.projects[idx]) this.cvData.projects[idx] = {};
    this.cvData.projects[idx].bullets = val.split('\n').filter(b => b.trim().length > 0);
    this.updatePreview();
  },

  updateEducation(idx, key, val) {
    if (!this.cvData.education[idx]) this.cvData.education[idx] = {};
    this.cvData.education[idx][key] = val;
    this.updatePreview();
  },

  updatePreview() {
    const sheet = document.getElementById('cv-preview-sheet');
    if (sheet) sheet.innerHTML = this.renderTemplate();
  },

  async saveCvData() {
    try {
      await Store.api('/user/cv', 'POST', { cv: this.cvData });
      Store.toast('CV successfully saved to your profile! 💾', 'success');
    } catch (e) {
      Store.toast('Failed to save CV', 'error');
    }
  },

  printCv() {
    window.print();
  },

  copyMarkdown() {
    const d = this.cvData;
    const md = `# ${d.name}
**${d.title}**
${d.email} | ${d.phone} | ${d.location} | [GitHub](${d.github}) | [LinkedIn](${d.linkedin})

## Professional Summary
${d.summary}

## Technical Skills
- **Languages:** ${d.skills.languages}
- **Frameworks & Libraries:** ${d.skills.frameworks}
- **Databases:** ${d.skills.databases}
- **Tools & Platforms:** ${d.skills.tools}

## Featured Projects
${(d.projects || []).map(p => `### ${p.title} (${p.technologies})
${(p.bullets || []).map(b => `- ${b}`).join('\n')}
`).join('\n')}

## Experience
${(d.experience || []).map(e => `### ${e.role} - ${e.company} (${e.period})
${(e.bullets || []).map(b => `- ${b}`).join('\n')}
`).join('\n')}

## Education
${(d.education || []).map(ed => `- **${ed.degree}**, ${ed.institution} (${ed.year || ''})`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    Store.toast('Formatted Markdown copied to clipboard! 📋', 'success');
  },

  // --- TOP 5 RESUME TEMPLATE RENDERERS ---
  renderTemplate() {
    const d = this.cvData;
    if (this.currentFormat === 'two-column') return this.renderTwoColumn(d);
    if (this.currentFormat === 'executive-impact') return this.renderExecutive(d);
    if (this.currentFormat === 'developer-minimal') return this.renderMinimal(d);
    if (this.currentFormat === 'frontend-creative') return this.renderCreative(d);
    return this.renderAtsModern(d); // default format 1
  },

  // 1. Modern Tech ATS-Friendly Format
  renderAtsModern(d) {
    return `
      <div class="ats-wrapper">
        <header class="ats-header">
          <h1 class="ats-name">${CodeEditor.escapeHtml(d.name)}</h1>
          <div class="ats-title">${CodeEditor.escapeHtml(d.title)}</div>
          <div class="ats-contact">
            ${d.email} · ${d.phone} · ${d.location}
            <br>
            <a href="${d.github}" target="_blank">GitHub</a> | 
            <a href="${d.linkedin}" target="_blank">LinkedIn</a> | 
            <a href="${d.website}" target="_blank">Portfolio</a>
          </div>
        </header>

        <section class="ats-section">
          <h2 class="ats-sec-title">PROFESSIONAL SUMMARY</h2>
          <p class="ats-text">${CodeEditor.escapeHtml(d.summary)}</p>
        </section>

        <section class="ats-section">
          <h2 class="ats-sec-title">TECHNICAL SKILLS</h2>
          <div class="ats-skills-list">
            <div><b>Languages:</b> ${d.skills.languages}</div>
            <div><b>Frameworks & Tools:</b> ${d.skills.frameworks}</div>
            <div><b>Databases & Cloud:</b> ${d.skills.databases}</div>
            <div><b>Developer Tools:</b> ${d.skills.tools}</div>
          </div>
        </section>

        <section class="ats-section">
          <h2 class="ats-sec-title">FEATURED PROJECTS</h2>
          ${(d.projects || []).map(p => `
            <div class="ats-item">
              <div class="ats-item-header">
                <b>${CodeEditor.escapeHtml(p.title)}</b> | <i>${CodeEditor.escapeHtml(p.technologies)}</i>
                <span class="ats-links">
                  ${p.github ? `<a href="${p.github}" target="_blank">[Source]</a>` : ''}
                  ${p.demo ? `<a href="${p.demo}" target="_blank">[Demo]</a>` : ''}
                </span>
              </div>
              <ul class="ats-bullets">
                ${(p.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <section class="ats-section">
          <h2 class="ats-sec-title">EXPERIENCE</h2>
          ${(d.experience || []).map(e => `
            <div class="ats-item">
              <div class="ats-item-header">
                <b>${CodeEditor.escapeHtml(e.role)}</b> · ${CodeEditor.escapeHtml(e.company)}
                <span class="ats-date">${e.period}</span>
              </div>
              <ul class="ats-bullets">
                ${(e.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <section class="ats-section">
          <h2 class="ats-sec-title">EDUCATION</h2>
          ${(d.education || []).map(ed => `
            <div class="ats-item">
              <div class="ats-item-header">
                <b>${CodeEditor.escapeHtml(ed.degree)}</b>
                <span class="ats-date">${ed.year || ''}</span>
              </div>
              <div>${CodeEditor.escapeHtml(ed.institution)}</div>
            </div>
          `).join('')}
        </section>
      </div>
    `;
  },

  // 2. Two-Column Engineering Format
  renderTwoColumn(d) {
    return `
      <div class="twocol-wrapper">
        <aside class="twocol-sidebar">
          <h1 class="twocol-name">${CodeEditor.escapeHtml(d.name)}</h1>
          <div class="twocol-title">${CodeEditor.escapeHtml(d.title)}</div>

          <div class="twocol-group">
            <h3>Contact</h3>
            <div>📧 ${d.email}</div>
            <div>📱 ${d.phone}</div>
            <div>📍 ${d.location}</div>
            <div>🔗 <a href="${d.github}" target="_blank">GitHub</a></div>
            <div>🔗 <a href="${d.linkedin}" target="_blank">LinkedIn</a></div>
          </div>

          <div class="twocol-group">
            <h3>Skills</h3>
            <p><b>Languages:</b><br>${d.skills.languages}</p>
            <p><b>Frameworks:</b><br>${d.skills.frameworks}</p>
            <p><b>Databases:</b><br>${d.skills.databases}</p>
            <p><b>Tools:</b><br>${d.skills.tools}</p>
          </div>

          <div class="twocol-group">
            <h3>Education</h3>
            ${(d.education || []).map(ed => `
              <p><b>${ed.degree}</b><br>${ed.institution} (${ed.year || ''})</p>
            `).join('')}
          </div>
        </aside>

        <main class="twocol-main">
          <section>
            <h2 class="twocol-heading">Profile</h2>
            <p style="font-size: 13px; line-height: 1.6;">${CodeEditor.escapeHtml(d.summary)}</p>
          </section>

          <section>
            <h2 class="twocol-heading">Featured Engineering Projects</h2>
            ${(d.projects || []).map(p => `
              <div style="margin-bottom: 14px;">
                <div style="display:flex; justify-content:space-between;">
                  <b>${CodeEditor.escapeHtml(p.title)}</b>
                  <span style="font-size: 11px; color: #666;">${p.technologies}</span>
                </div>
                <ul style="margin: 6px 0 0 16px; font-size: 12px; line-height: 1.5;">
                  ${(p.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </section>

          <section>
            <h2 class="twocol-heading">Work Experience</h2>
            ${(d.experience || []).map(e => `
              <div style="margin-bottom: 12px;">
                <div style="display:flex; justify-content:space-between;">
                  <b>${CodeEditor.escapeHtml(e.role)} · ${CodeEditor.escapeHtml(e.company)}</b>
                  <span style="font-size: 11px; color: #666;">${e.period}</span>
                </div>
                <ul style="margin: 6px 0 0 16px; font-size: 12px; line-height: 1.5;">
                  ${(e.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </section>
        </main>
      </div>
    `;
  },

  // 3. Senior / Executive Impact Architecture Format
  renderExecutive(d) {
    return `
      <div class="exec-wrapper">
        <header class="exec-header">
          <h1>${CodeEditor.escapeHtml(d.name)}</h1>
          <div class="exec-subtitle">${CodeEditor.escapeHtml(d.title)} | System Architecture & Delivery</div>
          <div class="exec-contact-bar">${d.email} · ${d.phone} · ${d.location} · ${d.github}</div>
        </header>

        <section class="exec-section">
          <h2 class="exec-title">EXECUTIVE PROFILE</h2>
          <p class="exec-summary">${CodeEditor.escapeHtml(d.summary)}</p>
        </section>

        <section class="exec-section">
          <h2 class="exec-title">CORE TECHNICAL COMPETENCIES</h2>
          <div class="exec-competencies">
            <div><b>Programming:</b> ${d.skills.languages}</div>
            <div><b>Architecture:</b> ${d.skills.frameworks}</div>
            <div><b>Storage & Infrastructure:</b> ${d.skills.databases}, ${d.skills.tools}</div>
          </div>
        </section>

        <section class="exec-section">
          <h2 class="exec-title">KEY ENGINEERING DELIVERABLES</h2>
          ${(d.projects || []).map(p => `
            <div class="exec-item">
              <div class="exec-item-title">
                <b>${CodeEditor.escapeHtml(p.title)}</b> — <span>${CodeEditor.escapeHtml(p.technologies)}</span>
              </div>
              <ul>
                ${(p.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <section class="exec-section">
          <h2 class="exec-title">EMPLOYMENT HISTORY</h2>
          ${(d.experience || []).map(e => `
            <div class="exec-item">
              <div class="exec-item-title">
                <b>${CodeEditor.escapeHtml(e.role)}</b>, ${CodeEditor.escapeHtml(e.company)}
                <span style="float: right; font-weight: normal;">${e.period}</span>
              </div>
              <ul>
                ${(e.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>
      </div>
    `;
  },

  // 4. Developer Minimalist Monospace Format
  renderMinimal(d) {
    return `
      <div class="minimal-wrapper">
        <div class="minimal-head">
          <div class="minimal-prompt">$ whoami</div>
          <h1 class="minimal-name">${CodeEditor.escapeHtml(d.name)}</h1>
          <div class="minimal-role">&gt; ${CodeEditor.escapeHtml(d.title)}</div>
          <div class="minimal-meta">contact: [ ${d.email} | ${d.phone} | ${d.location} ]</div>
          <div class="minimal-meta">links: [ <a href="${d.github}">github</a> | <a href="${d.linkedin}">linkedin</a> ]</div>
        </div>

        <div class="minimal-sec">
          <div class="minimal-sec-head">## 01. SUMMARY</div>
          <p>${CodeEditor.escapeHtml(d.summary)}</p>
        </div>

        <div class="minimal-sec">
          <div class="minimal-sec-head">## 02. STACK</div>
          <pre><code>lang: ${d.skills.languages}\nframeworks: ${d.skills.frameworks}\ndb: ${d.skills.databases}\ntools: ${d.skills.tools}</code></pre>
        </div>

        <div class="minimal-sec">
          <div class="minimal-sec-head">## 03. PROJECTS</div>
          ${(d.projects || []).map(p => `
            <div style="margin-bottom: 12px;">
              <b>* ${CodeEditor.escapeHtml(p.title)}</b> [${CodeEditor.escapeHtml(p.technologies)}]
              <ul>
                ${(p.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // 5. Creative Frontend / Portfolio-Linked Format
  renderCreative(d) {
    return `
      <div class="creative-wrapper">
        <header class="creative-header">
          <div>
            <h1 class="creative-name">${CodeEditor.escapeHtml(d.name)}</h1>
            <div class="creative-title">${CodeEditor.escapeHtml(d.title)}</div>
          </div>
          <div class="creative-contact">
            <div>${d.email}</div>
            <div>${d.phone}</div>
            <div>${d.location}</div>
          </div>
        </header>

        <section class="creative-section">
          <h3>About Me</h3>
          <p>${CodeEditor.escapeHtml(d.summary)}</p>
        </section>

        <section class="creative-section">
          <h3>Skills & Tools</h3>
          <div class="creative-pills">
            ${(d.skills.languages + ', ' + d.skills.frameworks).split(',').map(s => `<span class="creative-pill">${s.trim()}</span>`).join('')}
          </div>
        </section>

        <section class="creative-section">
          <h3>Featured Projects</h3>
          <div class="creative-projects-grid">
            ${(d.projects || []).map(p => `
              <div class="creative-project-card">
                <b>${CodeEditor.escapeHtml(p.title)}</b>
                <span class="creative-stack">${CodeEditor.escapeHtml(p.technologies)}</span>
                <ul>
                  ${(p.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </section>
      </div>
    `;
  }
};

