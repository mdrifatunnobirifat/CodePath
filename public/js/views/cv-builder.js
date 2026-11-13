// CodePath Tech CV & Resume Builder with Top 5 Formats & Dynamic Modular Slots
const CVBuilderView = {
  currentFormat: 'ats-modern', // 'ats-modern' | 'two-column' | 'executive-impact' | 'developer-minimal' | 'frontend-creative'
  cvData: null,

  async render() {
    const app = document.getElementById('app');
    if (!app) return;
    app.innerHTML = '<div class="notice">Loading CV builder...</div>';

    try {
      // Fetch saved CV or create comprehensive initial structure
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
            name: user.name || 'Demo Learner',
            title: `${profile.goalTrack ? profile.goalTrack.charAt(0).toUpperCase() + profile.goalTrack.slice(1) : 'Frontend'} Software Developer`,
            email: user.email || 'learner@codepath.dev',
            phone: '+1 (555) 234-5678',
            location: 'Dhaka, Bangladesh · Remote Available',
            github: profile.githubUrl || 'https://github.com/demolearner',
            linkedin: 'https://linkedin.com/in/demolearner',
            website: 'https://demolearner.dev',
            showPhoto: false,
            photoUrl: '',
            summary: `Results-driven software developer with hands-on experience building full-stack web applications, RESTful APIs, and responsive user interfaces. Proven problem solver with 50+ algorithm challenges completed and a strong foundation in modern engineering architecture.`,
            skills: {
              languages: 'JavaScript (ES6+), TypeScript, Python, SQL, C#, PHP',
              frameworks: 'React, Node.js, Express, ASP.NET Core, Tailwind CSS',
              databases: 'PostgreSQL, SQLite, Redis, MongoDB',
              tools: 'Git, Docker, Linux, REST APIs, Jest, Postman, CI/CD'
            },
            customSkills: [],
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
                github: 'https://github.com/demolearner/job-tracker',
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
                github: 'https://github.com/demolearner/weather-dashboard',
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
            ],
            references: [
              {
                name: 'Dr. Jane Smith',
                role: 'Engineering Lead',
                company: 'Northwind Labs',
                contact: 'jane.smith@northwind.dev · +1 (555) 987-6543'
              }
            ],
            referencesUponRequest: false,
            signature: {
              enabled: true,
              typedName: user.name || 'Demo Learner',
              date: new Date().toISOString().slice(0, 10),
              place: 'Dhaka, Bangladesh',
              declaration: 'I hereby declare that all the information provided above is true and correct to the best of my knowledge.'
            }
          };
        }
      }

      // Ensure data structure integrity
      if (!this.cvData.customSkills) this.cvData.customSkills = [];
      if (!this.cvData.references) this.cvData.references = [];
      if (!this.cvData.signature) {
        this.cvData.signature = {
          enabled: true,
          typedName: this.cvData.name,
          date: new Date().toISOString().slice(0, 10),
          place: this.cvData.location ? this.cvData.location.split('·')[0].trim() : '',
          declaration: 'I hereby declare that all the information provided above is true and correct.'
        };
      }

      const templates = [
        { id: 'ats-modern', name: '1. Modern Tech (ATS-Friendly)' },
        { id: 'two-column', name: '2. Two-Column Engineering' },
        { id: 'executive-impact', name: '3. Senior Impact Architecture' },
        { id: 'developer-minimal', name: '4. Developer Minimalist' },
        { id: 'frontend-creative', name: '5. Creative Portfolio-Linked' }
      ];

      const d = this.cvData;

      app.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <!-- Top Builder Header & Format Selector -->
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px;">
            <div>
              <h2>Tech CV & Resume Builder (Modular Slots)</h2>
              <p class="tag" style="margin-top: 4px;">
                Customize unlimited education, experience, projects, skills, plus photo, references, and signature.
              </p>
            </div>
            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
              <button class="btn" onclick="CVBuilderView.loadSampleFull()">✨ Reset Sample</button>
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

          <!-- Split Workspace: Form Editor on Left (Scrollable), Live Sheet Canvas on Right -->
          <div style="display: grid; grid-template-columns: 460px 1fr; gap: 20px; align-items: start;">
            
            <!-- LEFT FORM EDITOR (MODULAR SLOTS) -->
            <div class="card" style="max-height: 880px; overflow-y: auto; padding: 18px;">
              <h3 style="margin-bottom: 14px; font-size: 18px;">Edit Resume Details</h3>

              <!-- SECTION 1: Personal Info & Accounts -->
              <div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 18px; border-bottom: 1px solid var(--line); padding-bottom: 16px;">
                <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">Personal Information</b>
                
                <input type="text" placeholder="Full Name" value="${CodeEditor.escapeHtml(d.name)}" oninput="CVBuilderView.updateField('name', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; width: 100%; font-weight:600;" />
                <input type="text" placeholder="Target Job Title (e.g. Senior Frontend Engineer)" value="${CodeEditor.escapeHtml(d.title)}" oninput="CVBuilderView.updateField('title', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; width: 100%;" />
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 8px;">
                  <input type="email" placeholder="Email Address" value="${CodeEditor.escapeHtml(d.email)}" oninput="CVBuilderView.updateField('email', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                  <input type="text" placeholder="Phone Number" value="${CodeEditor.escapeHtml(d.phone)}" oninput="CVBuilderView.updateField('phone', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                </div>
                
                <input type="text" placeholder="Location (e.g. Dhaka, Bangladesh · Remote Available)" value="${CodeEditor.escapeHtml(d.location)}" oninput="CVBuilderView.updateField('location', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                
                <!-- Social & Professional Links -->
                <div style="background: var(--code); border: 1px solid var(--line); border-radius: 6px; padding: 10px; display: flex; flex-direction: column; gap: 8px;">
                  <b style="font-size: 12px; color: var(--mute);">🌐 Professional Accounts & Links:</b>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 14px;">🐙</span>
                    <input type="text" placeholder="GitHub URL (https://github.com/...)" value="${CodeEditor.escapeHtml(d.github || '')}" oninput="CVBuilderView.updateField('github', this.value)" style="flex:1; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 14px;">💼</span>
                    <input type="text" placeholder="LinkedIn URL (https://linkedin.com/in/...)" value="${CodeEditor.escapeHtml(d.linkedin || '')}" oninput="CVBuilderView.updateField('linkedin', this.value)" style="flex:1; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                  </div>
                  <div style="display: flex; align-items: center; gap: 6px;">
                    <span style="font-size: 14px;">🔗</span>
                    <input type="text" placeholder="Personal Website / Portfolio URL" value="${CodeEditor.escapeHtml(d.website || '')}" oninput="CVBuilderView.updateField('website', this.value)" style="flex:1; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                  </div>
                </div>

                <!-- Profile Photo Slot (Optional) -->
                <div style="background: var(--code); border: 1px solid var(--line); border-radius: 6px; padding: 10px;">
                  <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                    <b style="font-size: 12px; color: var(--mute);">📸 Profile Photo (Optional):</b>
                    <label style="font-size: 12px; display: flex; align-items: center; gap: 4px; cursor: pointer;">
                      <input type="checkbox" ${d.showPhoto ? 'checked' : ''} onchange="CVBuilderView.updateField('showPhoto', this.checked); CVBuilderView.render();" />
                      Show on CV
                    </label>
                  </div>
                  <div style="display: flex; gap: 8px; align-items: center;">
                    ${d.photoUrl ? `
                      <img src="${d.photoUrl}" style="width: 44px; height: 44px; border-radius: 50%; object-fit: cover; border: 1px solid var(--acc);" />
                    ` : ''}
                    <label class="btn" style="padding: 5px 10px; font-size: 12px; cursor: pointer; background: var(--panel); border: 1px solid var(--line);">
                      📁 Upload Photo
                      <input type="file" accept="image/*" style="display: none;" onchange="CVBuilderView.handlePhotoUpload(this)" />
                    </label>
                    <input type="text" placeholder="Or paste image URL" value="${d.photoUrl || ''}" oninput="CVBuilderView.updateField('photoUrl', this.value)" style="flex: 1; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                    ${d.photoUrl ? `
                      <button class="cv-del-btn" onclick="CVBuilderView.removePhoto()" title="Remove photo">✕</button>
                    ` : ''}
                  </div>
                </div>
              </div>

              <!-- SECTION 2: Professional Summary -->
              <div style="margin-bottom: 18px; border-bottom: 1px solid var(--line); padding-bottom: 16px;">
                <b style="font-size: 13px; text-transform: uppercase; color: var(--mute); display: block; margin-bottom: 6px;">Professional Summary</b>
                <textarea rows="4" oninput="CVBuilderView.updateField('summary', this.value)" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px; font-family: inherit;">${CodeEditor.escapeHtml(d.summary)}</textarea>
              </div>

              <!-- SECTION 3: Technical Skills & Custom Groups -->
              <div style="margin-bottom: 18px; border-bottom: 1px solid var(--line); padding-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">Technical Skills</b>
                  <button class="ghost" onclick="CVBuilderView.addCustomSkill()" style="font-size: 11px; padding: 2px 8px;">+ Add Skill Group</button>
                </div>
                <div style="display: flex; flex-direction: column; gap: 8px;">
                  <input type="text" placeholder="Languages (e.g. JavaScript, Python, SQL, C#)" value="${CodeEditor.escapeHtml(d.skills.languages)}" oninput="CVBuilderView.updateSkill('languages', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                  <input type="text" placeholder="Frameworks & Libraries (e.g. React, Node.js, Express)" value="${CodeEditor.escapeHtml(d.skills.frameworks)}" oninput="CVBuilderView.updateSkill('frameworks', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                  <input type="text" placeholder="Databases (e.g. PostgreSQL, Redis, MongoDB)" value="${CodeEditor.escapeHtml(d.skills.databases)}" oninput="CVBuilderView.updateSkill('databases', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                  <input type="text" placeholder="Tools (e.g. Git, Docker, REST APIs, Linux)" value="${CodeEditor.escapeHtml(d.skills.tools)}" oninput="CVBuilderView.updateSkill('tools', this.value)" style="padding: 7px 10px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); font-size: 13px;" />
                  
                  <!-- Additional Custom Skill Slots -->
                  ${(d.customSkills || []).map((cs, idx) => `
                    <div style="display: flex; gap: 6px; align-items: center;">
                      <input type="text" placeholder="Category" value="${CodeEditor.escapeHtml(cs.category)}" oninput="CVBuilderView.updateCustomSkill(${idx}, 'category', this.value)" style="width: 120px; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--code); font-size: 12px; font-weight: 600;" />
                      <input type="text" placeholder="Skills list (comma separated)" value="${CodeEditor.escapeHtml(cs.items)}" oninput="CVBuilderView.updateCustomSkill(${idx}, 'items', this.value)" style="flex:1; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--code); font-size: 12px;" />
                      <button class="cv-del-btn" onclick="CVBuilderView.removeCustomSkill(${idx})" title="Remove group">✕</button>
                    </div>
                  `).join('')}
                </div>
              </div>

              <!-- SECTION 4: Featured Projects (Dynamic Slots) -->
              <div style="margin-bottom: 18px; border-bottom: 1px solid var(--line); padding-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">Featured Projects (${(d.projects || []).length})</b>
                  <button class="ghost" onclick="CVBuilderView.addProject()" style="font-size: 11px; padding: 2px 8px;">+ Add Project</button>
                </div>

                ${(d.projects || []).map((p, idx) => `
                  <div class="cv-slot-card">
                    <div class="cv-slot-header">
                      <strong style="font-size: 12px; color: var(--acc);">Project #${idx + 1}</strong>
                      <button class="cv-del-btn" onclick="CVBuilderView.removeProject(${idx})" title="Delete project">🗑️</button>
                    </div>
                    <input type="text" placeholder="Project Title" value="${CodeEditor.escapeHtml(p.title)}" oninput="CVBuilderView.updateProject(${idx}, 'title', this.value)" style="width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px; margin-bottom: 6px; font-weight:600;" />
                    <input type="text" placeholder="Technologies Used (e.g. React, Node.js, SQLite)" value="${CodeEditor.escapeHtml(p.technologies)}" oninput="CVBuilderView.updateProject(${idx}, 'technologies', this.value)" style="width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px; margin-bottom: 6px;" />
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
                      <input type="text" placeholder="GitHub Repository URL" value="${CodeEditor.escapeHtml(p.github || '')}" oninput="CVBuilderView.updateProject(${idx}, 'github', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                      <input type="text" placeholder="Live Demo URL" value="${CodeEditor.escapeHtml(p.demo || '')}" oninput="CVBuilderView.updateProject(${idx}, 'demo', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                    </div>
                    <textarea rows="3" placeholder="Achievements & bullet points (1 per line)" oninput="CVBuilderView.updateProjectBullets(${idx}, this.value)" style="width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px; font-family: inherit;">${(p.bullets || []).join('\n')}</textarea>
                  </div>
                `).join('')}

                <button class="cv-add-btn" onclick="CVBuilderView.addProject()">
                  <span>+</span> Add Another Project Slot
                </button>
              </div>

              <!-- SECTION 5: Work Experience (Dynamic Slots) -->
              <div style="margin-bottom: 18px; border-bottom: 1px solid var(--line); padding-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">Work Experience (${(d.experience || []).length})</b>
                  <button class="ghost" onclick="CVBuilderView.addExperience()" style="font-size: 11px; padding: 2px 8px;">+ Add Experience</button>
                </div>

                ${(d.experience || []).map((e, idx) => `
                  <div class="cv-slot-card">
                    <div class="cv-slot-header">
                      <strong style="font-size: 12px; color: var(--acc);">Position #${idx + 1}</strong>
                      <button class="cv-del-btn" onclick="CVBuilderView.removeExperience(${idx})" title="Delete experience">🗑️</button>
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
                      <input type="text" placeholder="Job Title / Role" value="${CodeEditor.escapeHtml(e.role)}" oninput="CVBuilderView.updateExperience(${idx}, 'role', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px; font-weight:600;" />
                      <input type="text" placeholder="Company Name" value="${CodeEditor.escapeHtml(e.company)}" oninput="CVBuilderView.updateExperience(${idx}, 'company', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
                      <input type="text" placeholder="Period (e.g. 2024 - Present)" value="${CodeEditor.escapeHtml(e.period)}" oninput="CVBuilderView.updateExperience(${idx}, 'period', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                      <input type="text" placeholder="Location (e.g. Remote / Onsite)" value="${CodeEditor.escapeHtml(e.location || '')}" oninput="CVBuilderView.updateExperience(${idx}, 'location', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                    </div>
                    <textarea rows="3" placeholder="Key responsibilities & accomplishments (1 per line)" oninput="CVBuilderView.updateExperienceBullets(${idx}, this.value)" style="width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px; font-family: inherit;">${(e.bullets || []).join('\n')}</textarea>
                  </div>
                `).join('')}

                <button class="cv-add-btn" onclick="CVBuilderView.addExperience()">
                  <span>+</span> Add Another Work Experience Slot
                </button>
              </div>

              <!-- SECTION 6: Education (Dynamic Slots) -->
              <div style="margin-bottom: 18px; border-bottom: 1px solid var(--line); padding-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">Education Degrees (${(d.education || []).length})</b>
                  <button class="ghost" onclick="CVBuilderView.addEducation()" style="font-size: 11px; padding: 2px 8px;">+ Add Education</button>
                </div>

                ${(d.education || []).map((ed, idx) => `
                  <div class="cv-slot-card">
                    <div class="cv-slot-header">
                      <strong style="font-size: 12px; color: var(--acc);">Education #${idx + 1}</strong>
                      <button class="cv-del-btn" onclick="CVBuilderView.removeEducation(${idx})" title="Delete education">🗑️</button>
                    </div>
                    <input type="text" placeholder="Degree (e.g. B.S. in Computer Science)" value="${CodeEditor.escapeHtml(ed.degree)}" oninput="CVBuilderView.updateEducation(${idx}, 'degree', this.value)" style="width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px; margin-bottom: 6px; font-weight:600;" />
                    <div style="display: grid; grid-template-columns: 2fr 1fr; gap: 6px; margin-bottom: 6px;">
                      <input type="text" placeholder="Institution / University" value="${CodeEditor.escapeHtml(ed.institution)}" oninput="CVBuilderView.updateEducation(${idx}, 'institution', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                      <input type="text" placeholder="Years (e.g. 2022 - 2026)" value="${CodeEditor.escapeHtml(ed.year || '')}" oninput="CVBuilderView.updateEducation(${idx}, 'year', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                    </div>
                    <input type="text" placeholder="Details / Major / CGPA / Coursework" value="${CodeEditor.escapeHtml(ed.details || '')}" oninput="CVBuilderView.updateEducation(${idx}, 'details', this.value)" style="width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                  </div>
                `).join('')}

                <button class="cv-add-btn" onclick="CVBuilderView.addEducation()">
                  <span>+</span> Add Another Education Slot
                </button>
              </div>

              <!-- SECTION 7: Professional References (Dynamic Slots) -->
              <div style="margin-bottom: 18px; border-bottom: 1px solid var(--line); padding-bottom: 16px;">
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">References (${(d.references || []).length})</b>
                  <label style="font-size: 11px; display: flex; align-items: center; gap: 4px; cursor: pointer;">
                    <input type="checkbox" ${d.referencesUponRequest ? 'checked' : ''} onchange="CVBuilderView.updateField('referencesUponRequest', this.checked); CVBuilderView.render();" />
                    Available upon request
                  </label>
                </div>

                ${!d.referencesUponRequest ? `
                  ${(d.references || []).map((ref, idx) => `
                    <div class="cv-slot-card">
                      <div class="cv-slot-header">
                        <strong style="font-size: 12px; color: var(--acc);">Reference #${idx + 1}</strong>
                        <button class="cv-del-btn" onclick="CVBuilderView.removeReference(${idx})" title="Delete reference">🗑️</button>
                      </div>
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 6px;">
                        <input type="text" placeholder="Referee Name" value="${CodeEditor.escapeHtml(ref.name)}" oninput="CVBuilderView.updateReference(${idx}, 'name', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px; font-weight:600;" />
                        <input type="text" placeholder="Designation / Role" value="${CodeEditor.escapeHtml(ref.role)}" oninput="CVBuilderView.updateReference(${idx}, 'role', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                      </div>
                      <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px;">
                        <input type="text" placeholder="Company / Institution" value="${CodeEditor.escapeHtml(ref.company)}" oninput="CVBuilderView.updateReference(${idx}, 'company', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                        <input type="text" placeholder="Contact Email / Phone" value="${CodeEditor.escapeHtml(ref.contact)}" oninput="CVBuilderView.updateReference(${idx}, 'contact', this.value)" style="padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                      </div>
                    </div>
                  `).join('')}

                  <button class="cv-add-btn" onclick="CVBuilderView.addReference()">
                    <span>+</span> Add Another Reference Slot
                  </button>
                ` : `
                  <div style="padding: 10px; background: var(--code); border-radius: 6px; font-size: 12px; color: var(--mute);">
                    ✔ "References available upon request" will be displayed on the CV.
                  </div>
                `}
              </div>

              <!-- SECTION 8: Digital Signature & Declaration -->
              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                  <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">Digital Signature & Declaration</b>
                  <label style="font-size: 12px; display: flex; align-items: center; gap: 4px; cursor: pointer;">
                    <input type="checkbox" ${d.signature?.enabled ? 'checked' : ''} onchange="CVBuilderView.updateSignature('enabled', this.checked); CVBuilderView.render();" />
                    Include on CV
                  </label>
                </div>

                ${d.signature?.enabled ? `
                  <div class="cv-slot-card">
                    <div style="margin-bottom: 8px;">
                      <label style="font-size: 11px; color: var(--mute); display: block; margin-bottom: 3px;">Declaration Statement:</label>
                      <input type="text" value="${CodeEditor.escapeHtml(d.signature.declaration || '')}" oninput="CVBuilderView.updateSignature('declaration', this.value)" style="width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                    </div>
                    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; margin-bottom: 8px;">
                      <div>
                        <label style="font-size: 11px; color: var(--mute); display: block; margin-bottom: 3px;">Date:</label>
                        <input type="date" value="${d.signature.date || ''}" oninput="CVBuilderView.updateSignature('date', this.value)" style="width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                      </div>
                      <div>
                        <label style="font-size: 11px; color: var(--mute); display: block; margin-bottom: 3px;">Place / City:</label>
                        <input type="text" placeholder="e.g. Dhaka" value="${CodeEditor.escapeHtml(d.signature.place || '')}" oninput="CVBuilderView.updateSignature('place', this.value)" style="width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 12px;" />
                      </div>
                    </div>
                    <div>
                      <label style="font-size: 11px; color: var(--mute); display: block; margin-bottom: 3px;">Typed Digital Signature (renders in script font):</label>
                      <input type="text" placeholder="Your full legal name" value="${CodeEditor.escapeHtml(d.signature.typedName || d.name)}" oninput="CVBuilderView.updateSignature('typedName', this.value)" style="width: 100%; padding: 6px 8px; border-radius: 4px; border: 1px solid var(--line); background: var(--panel); font-size: 13px; font-weight:600;" />
                    </div>
                  </div>
                ` : `
                  <div style="padding: 10px; background: var(--code); border-radius: 6px; font-size: 12px; color: var(--mute);">
                    Signature section is currently hidden. Check the box above to enable it.
                  </div>
                `}
              </div>

            </div>

            <!-- RIGHT PREVIEW CANVAS (PRINTABLE A4 SHEET) -->
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

  // --- ACTIONS & SLOT MANIPULATION ---
  setFormat(fmt) {
    this.currentFormat = fmt;
    const sheet = document.getElementById('cv-preview-sheet');
    if (sheet) {
      sheet.className = `cv-sheet cv-${fmt}`;
      sheet.innerHTML = this.renderTemplate();
    }
    document.querySelectorAll('.chips .chip').forEach(c => {
      c.setAttribute('aria-pressed', c.textContent.toLowerCase().includes(fmt.split('-')[0]));
    });
  },

  updateField(key, val) {
    this.cvData[key] = val;
    this.updatePreview();
  },

  updateSkill(key, val) {
    this.cvData.skills[key] = val;
    this.updatePreview();
  },

  // Dynamic Education Slots
  addEducation() {
    if (!this.cvData.education) this.cvData.education = [];
    this.cvData.education.push({
      degree: '',
      institution: '',
      year: '',
      details: ''
    });
    this.render();
  },

  removeEducation(idx) {
    this.cvData.education.splice(idx, 1);
    this.render();
  },

  updateEducation(idx, field, val) {
    if (!this.cvData.education[idx]) this.cvData.education[idx] = {};
    this.cvData.education[idx][field] = val;
    this.updatePreview();
  },

  // Dynamic Work Experience Slots
  addExperience() {
    if (!this.cvData.experience) this.cvData.experience = [];
    this.cvData.experience.push({
      role: '',
      company: '',
      period: '',
      location: '',
      bullets: ['']
    });
    this.render();
  },

  removeExperience(idx) {
    this.cvData.experience.splice(idx, 1);
    this.render();
  },

  updateExperience(idx, field, val) {
    if (!this.cvData.experience[idx]) this.cvData.experience[idx] = { bullets: [] };
    this.cvData.experience[idx][field] = val;
    this.updatePreview();
  },

  updateExperienceBullets(idx, val) {
    if (!this.cvData.experience[idx]) this.cvData.experience[idx] = {};
    this.cvData.experience[idx].bullets = val.split('\n').filter(b => b.trim().length > 0);
    this.updatePreview();
  },

  // Dynamic Project Slots
  addProject() {
    if (!this.cvData.projects) this.cvData.projects = [];
    this.cvData.projects.push({
      title: '',
      technologies: '',
      github: '',
      demo: '',
      bullets: ['']
    });
    this.render();
  },

  removeProject(idx) {
    this.cvData.projects.splice(idx, 1);
    this.render();
  },

  updateProject(idx, field, val) {
    if (!this.cvData.projects[idx]) this.cvData.projects[idx] = { bullets: [] };
    this.cvData.projects[idx][field] = val;
    this.updatePreview();
  },

  updateProjectBullets(idx, val) {
    if (!this.cvData.projects[idx]) this.cvData.projects[idx] = {};
    this.cvData.projects[idx].bullets = val.split('\n').filter(b => b.trim().length > 0);
    this.updatePreview();
  },

  // Dynamic Custom Skill Groups
  addCustomSkill() {
    if (!this.cvData.customSkills) this.cvData.customSkills = [];
    this.cvData.customSkills.push({ category: 'Cloud & DevOps', items: 'AWS, Docker, CI/CD' });
    this.render();
  },

  removeCustomSkill(idx) {
    this.cvData.customSkills.splice(idx, 1);
    this.render();
  },

  updateCustomSkill(idx, field, val) {
    if (!this.cvData.customSkills[idx]) this.cvData.customSkills[idx] = {};
    this.cvData.customSkills[idx][field] = val;
    this.updatePreview();
  },

  // Dynamic References Slots
  addReference() {
    if (!this.cvData.references) this.cvData.references = [];
    this.cvData.references.push({ name: '', role: '', company: '', contact: '' });
    this.render();
  },

  removeReference(idx) {
    this.cvData.references.splice(idx, 1);
    this.render();
  },

  updateReference(idx, field, val) {
    if (!this.cvData.references[idx]) this.cvData.references[idx] = {};
    this.cvData.references[idx][field] = val;
    this.updatePreview();
  },

  // Signature Updates
  updateSignature(field, val) {
    if (!this.cvData.signature) this.cvData.signature = {};
    this.cvData.signature[field] = val;
    this.updatePreview();
  },

  // Photo Upload Handler (FileReader Base64)
  handlePhotoUpload(input) {
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      this.cvData.photoUrl = e.target.result;
      this.cvData.showPhoto = true;
      this.render();
      Store.toast('Photo uploaded successfully! 📸', 'success');
    };
    reader.readAsDataURL(file);
  },

  removePhoto() {
    this.cvData.photoUrl = '';
    this.cvData.showPhoto = false;
    this.render();
    Store.toast('Photo removed');
  },

  loadSampleFull() {
    this.cvData = null;
    this.render();
    Store.toast('Loaded sample tech resume data', 'info');
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
      Store.toast('Failed to save CV: ' + e.message, 'error');
    }
  },

  printCv() {
    window.print();
  },

  copyMarkdown() {
    const d = this.cvData;
    const md = `# ${d.name}
**${d.title}**
${d.email} | ${d.phone} | ${d.location} | [GitHub](${d.github}) | [LinkedIn](${d.linkedin}) ${d.website ? `| [Portfolio](${d.website})` : ''}

## Professional Summary
${d.summary}

## Technical Skills
- **Languages:** ${d.skills.languages}
- **Frameworks & Libraries:** ${d.skills.frameworks}
- **Databases:** ${d.skills.databases}
- **Tools & Platforms:** ${d.skills.tools}
${(d.customSkills || []).map(cs => `- **${cs.category}:** ${cs.items}`).join('\n')}

## Featured Projects
${(d.projects || []).map(p => `### ${p.title} (${p.technologies})
${p.github ? `Source: ${p.github} ` : ''}${p.demo ? `Demo: ${p.demo}` : ''}
${(p.bullets || []).map(b => `- ${b}`).join('\n')}
`).join('\n')}

## Work Experience
${(d.experience || []).map(e => `### ${e.role} - ${e.company} (${e.period})
${e.location ? `Location: ${e.location}\n` : ''}${(e.bullets || []).map(b => `- ${b}`).join('\n')}
`).join('\n')}

## Education
${(d.education || []).map(ed => `- **${ed.degree}**, ${ed.institution} (${ed.year || ''}) ${ed.details ? `\n  ${ed.details}` : ''}`).join('\n')}

## References
${d.referencesUponRequest ? 'References available upon request.' : (d.references || []).map(r => `- **${r.name}**, ${r.role} at ${r.company} (${r.contact})`).join('\n')}

${d.signature?.enabled ? `\n---\n*${d.signature.declaration}*\n**Signature:** ${d.signature.typedName} | **Date:** ${d.signature.date} | **Place:** ${d.signature.place}` : ''}
`;
    navigator.clipboard.writeText(md);
    Store.toast('Formatted Markdown copied to clipboard! 📋', 'success');
  },

  // Helper: Common Signature block HTML
  renderSignatureHtml(d) {
    if (!d.signature || !d.signature.enabled) return '';
    return `
      <div class="cv-signature-block">
        <div>
          <div style="font-style: italic; color: #555; margin-bottom: 6px; font-size: 11px;">"${CodeEditor.escapeHtml(d.signature.declaration || 'I hereby declare that all information is true.')}"</div>
          <div><b>Date:</b> ${d.signature.date || new Date().toISOString().slice(0, 10)} &nbsp;&nbsp;|&nbsp;&nbsp; <b>Place:</b> ${CodeEditor.escapeHtml(d.signature.place || '')}</div>
        </div>
        <div style="text-align: right;">
          <div class="cv-signature-font">${CodeEditor.escapeHtml(d.signature.typedName || d.name)}</div>
          <div style="border-top: 1px solid #14213D; font-weight: 700; font-size: 11px; margin-top: 3px; padding-top: 2px;">
            ${CodeEditor.escapeHtml(d.name)}
          </div>
        </div>
      </div>
    `;
  },

  // Helper: Common References block HTML
  renderReferencesHtml(d) {
    if (d.referencesUponRequest) {
      return `
        <div style="font-size: 12px; font-style: italic; color: #555;">
          References available upon request.
        </div>
      `;
    }
    if (!d.references || d.references.length === 0) return '';
    return `
      <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 10px; font-size: 12px;">
        ${d.references.map(r => `
          <div style="background: #F8FAFC; border: 1px solid #E2E8F0; padding: 8px 10px; border-radius: 4px;">
            <b>${CodeEditor.escapeHtml(r.name)}</b><br>
            <span>${CodeEditor.escapeHtml(r.role)} · ${CodeEditor.escapeHtml(r.company)}</span><br>
            <span style="color: #64748B; font-size: 11px;">${CodeEditor.escapeHtml(r.contact)}</span>
          </div>
        `).join('')}
      </div>
    `;
  },

  // --- TOP 5 RESUME TEMPLATE RENDERERS ---
  renderTemplate() {
    const d = this.cvData;
    if (this.currentFormat === 'two-column') return this.renderTwoColumn(d);
    if (this.currentFormat === 'executive-impact') return this.renderExecutive(d);
    if (this.currentFormat === 'developer-minimal') return this.renderMinimal(d);
    if (this.currentFormat === 'frontend-creative') return this.renderCreative(d);
    return this.renderAtsModern(d);
  },

  // 1. Modern Tech ATS-Friendly Format
  renderAtsModern(d) {
    return `
      <div class="ats-wrapper">
        <header class="ats-header" style="${d.showPhoto && d.photoUrl ? 'display: flex; justify-content: space-between; align-items: center; text-align: left;' : ''}">
          <div style="flex: 1;">
            <h1 class="ats-name">${CodeEditor.escapeHtml(d.name)}</h1>
            <div class="ats-title">${CodeEditor.escapeHtml(d.title)}</div>
            <div class="ats-contact">
              ${d.email} · ${d.phone} · ${d.location}
              <br>
              ${d.github ? `<a href="${d.github}" target="_blank">🐙 GitHub: ${d.github.replace('https://', '')}</a> | ` : ''}
              ${d.linkedin ? `<a href="${d.linkedin}" target="_blank">💼 LinkedIn</a> | ` : ''}
              ${d.website ? `<a href="${d.website}" target="_blank">🌐 Portfolio</a>` : ''}
            </div>
          </div>
          ${d.showPhoto && d.photoUrl ? `
            <img src="${d.photoUrl}" class="cv-photo-circle" alt="Photo" style="margin-left: 16px;" />
          ` : ''}
        </header>

        <section class="ats-section">
          <h2 class="ats-sec-title">PROFESSIONAL SUMMARY</h2>
          <p class="ats-text" style="font-size: 12.5px; line-height: 1.55; margin: 0;">${CodeEditor.escapeHtml(d.summary)}</p>
        </section>

        <section class="ats-section">
          <h2 class="ats-sec-title">TECHNICAL SKILLS</h2>
          <div class="ats-skills-list">
            <div><b>Languages:</b> ${d.skills.languages}</div>
            <div><b>Frameworks & Libraries:</b> ${d.skills.frameworks}</div>
            <div><b>Databases:</b> ${d.skills.databases}</div>
            <div><b>Developer Tools:</b> ${d.skills.tools}</div>
            ${(d.customSkills || []).map(cs => `<div><b>${CodeEditor.escapeHtml(cs.category)}:</b> ${CodeEditor.escapeHtml(cs.items)}</div>`).join('')}
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
                  ${p.demo ? `<a href="${p.demo}" target="_blank">[Live Demo]</a>` : ''}
                </span>
              </div>
              <ul class="ats-bullets">
                ${(p.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <section class="ats-section">
          <h2 class="ats-sec-title">WORK EXPERIENCE</h2>
          ${(d.experience || []).map(e => `
            <div class="ats-item">
              <div class="ats-item-header">
                <b>${CodeEditor.escapeHtml(e.role)}</b> · ${CodeEditor.escapeHtml(e.company)} ${e.location ? `(${e.location})` : ''}
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
              <div>${CodeEditor.escapeHtml(ed.institution)} ${ed.details ? `— <span style="color:#555;">${CodeEditor.escapeHtml(ed.details)}</span>` : ''}</div>
            </div>
          `).join('')}
        </section>

        ${(d.referencesUponRequest || (d.references && d.references.length > 0)) ? `
          <section class="ats-section">
            <h2 class="ats-sec-title">REFERENCES</h2>
            ${this.renderReferencesHtml(d)}
          </section>
        ` : ''}

        ${this.renderSignatureHtml(d)}
      </div>
    `;
  },

  // 2. Two-Column Engineering Format
  renderTwoColumn(d) {
    return `
      <div class="twocol-wrapper">
        <aside class="twocol-sidebar">
          ${d.showPhoto && d.photoUrl ? `
            <div style="text-align: center; margin-bottom: 12px;">
              <img src="${d.photoUrl}" class="cv-photo-circle" style="margin: 0 auto;" />
            </div>
          ` : ''}
          <h1 class="twocol-name">${CodeEditor.escapeHtml(d.name)}</h1>
          <div class="twocol-title">${CodeEditor.escapeHtml(d.title)}</div>

          <div class="twocol-group">
            <h3>Contact</h3>
            <div>📧 ${d.email}</div>
            <div>📱 ${d.phone}</div>
            <div>📍 ${d.location}</div>
            ${d.github ? `<div>🐙 <a href="${d.github}" target="_blank">GitHub</a></div>` : ''}
            ${d.linkedin ? `<div>💼 <a href="${d.linkedin}" target="_blank">LinkedIn</a></div>` : ''}
            ${d.website ? `<div>🌐 <a href="${d.website}" target="_blank">Portfolio</a></div>` : ''}
          </div>

          <div class="twocol-group">
            <h3>Skills & Tools</h3>
            <p><b>Languages:</b><br>${d.skills.languages}</p>
            <p><b>Frameworks:</b><br>${d.skills.frameworks}</p>
            <p><b>Databases:</b><br>${d.skills.databases}</p>
            <p><b>Tools:</b><br>${d.skills.tools}</p>
            ${(d.customSkills || []).map(cs => `<p><b>${CodeEditor.escapeHtml(cs.category)}:</b><br>${CodeEditor.escapeHtml(cs.items)}</p>`).join('')}
          </div>

          <div class="twocol-group">
            <h3>Education</h3>
            ${(d.education || []).map(ed => `
              <p style="margin-bottom: 8px;">
                <b>${CodeEditor.escapeHtml(ed.degree)}</b><br>
                ${CodeEditor.escapeHtml(ed.institution)} <span style="color:#64748B;">(${ed.year || ''})</span>
                ${ed.details ? `<br><small style="color:#64748B;">${CodeEditor.escapeHtml(ed.details)}</small>` : ''}
              </p>
            `).join('')}
          </div>

          ${(d.referencesUponRequest || (d.references && d.references.length > 0)) ? `
            <div class="twocol-group">
              <h3>References</h3>
              ${d.referencesUponRequest ? '<p style="font-size:11px;font-style:italic;">Available upon request.</p>' : (d.references || []).map(r => `
                <p style="font-size: 11px; margin-bottom: 6px;">
                  <b>${CodeEditor.escapeHtml(r.name)}</b> (${CodeEditor.escapeHtml(r.role)} - ${CodeEditor.escapeHtml(r.company)})<br>
                  <span style="color: #64748B;">${CodeEditor.escapeHtml(r.contact)}</span>
                </p>
              `).join('')}
            </div>
          ` : ''}
        </aside>

        <main class="twocol-main">
          <section>
            <h2 class="twocol-heading">Profile Summary</h2>
            <p style="font-size: 12.5px; line-height: 1.6; margin: 0;">${CodeEditor.escapeHtml(d.summary)}</p>
          </section>

          <section>
            <h2 class="twocol-heading">Featured Engineering Projects</h2>
            ${(d.projects || []).map(p => `
              <div style="margin-bottom: 14px;">
                <div style="display:flex; justify-content:space-between; align-items: baseline;">
                  <b>${CodeEditor.escapeHtml(p.title)}</b>
                  <span style="font-size: 11px; color: #64748B;">${CodeEditor.escapeHtml(p.technologies)}</span>
                </div>
                <div style="font-size: 11px; margin: 2px 0;">
                  ${p.github ? `<a href="${p.github}" target="_blank">GitHub Repo ↗</a> &nbsp;` : ''}
                  ${p.demo ? `<a href="${p.demo}" target="_blank">Live Demo ↗</a>` : ''}
                </div>
                <ul style="margin: 4px 0 0 16px; font-size: 12px; line-height: 1.5;">
                  ${(p.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </section>

          <section>
            <h2 class="twocol-heading">Work Experience</h2>
            ${(d.experience || []).map(e => `
              <div style="margin-bottom: 14px;">
                <div style="display:flex; justify-content:space-between;">
                  <b>${CodeEditor.escapeHtml(e.role)} · ${CodeEditor.escapeHtml(e.company)}</b>
                  <span style="font-size: 11px; color: #64748B;">${e.period}</span>
                </div>
                <ul style="margin: 4px 0 0 16px; font-size: 12px; line-height: 1.5;">
                  ${(e.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </section>

          ${this.renderSignatureHtml(d)}
        </main>
      </div>
    `;
  },

  // 3. Senior / Executive Impact Architecture Format
  renderExecutive(d) {
    return `
      <div class="exec-wrapper">
        <header class="exec-header" style="${d.showPhoto && d.photoUrl ? 'display: flex; justify-content: space-between; align-items: center;' : ''}">
          <div>
            <h1>${CodeEditor.escapeHtml(d.name)}</h1>
            <div class="exec-subtitle">${CodeEditor.escapeHtml(d.title)} | System Architecture & Delivery</div>
            <div class="exec-contact-bar">
              ${d.email} · ${d.phone} · ${d.location}
              ${d.github ? `· <a href="${d.github}" target="_blank">GitHub</a>` : ''}
              ${d.linkedin ? `· <a href="${d.linkedin}" target="_blank">LinkedIn</a>` : ''}
              ${d.website ? `· <a href="${d.website}" target="_blank">Portfolio</a>` : ''}
            </div>
          </div>
          ${d.showPhoto && d.photoUrl ? `
            <img src="${d.photoUrl}" class="cv-photo-square" alt="Photo" style="margin-left: 16px;" />
          ` : ''}
        </header>

        <section class="exec-section">
          <h2 class="exec-title">EXECUTIVE PROFILE</h2>
          <p class="exec-summary" style="font-size: 12.5px; line-height: 1.6; margin: 0;">${CodeEditor.escapeHtml(d.summary)}</p>
        </section>

        <section class="exec-section">
          <h2 class="exec-title">CORE TECHNICAL COMPETENCIES</h2>
          <div class="exec-competencies" style="font-size: 12.5px; line-height: 1.6;">
            <div><b>Programming & Languages:</b> ${d.skills.languages}</div>
            <div><b>Architecture & Frameworks:</b> ${d.skills.frameworks}</div>
            <div><b>Databases & Infrastructure:</b> ${d.skills.databases}, ${d.skills.tools}</div>
            ${(d.customSkills || []).map(cs => `<div><b>${CodeEditor.escapeHtml(cs.category)}:</b> ${CodeEditor.escapeHtml(cs.items)}</div>`).join('')}
          </div>
        </section>

        <section class="exec-section">
          <h2 class="exec-title">KEY ENGINEERING DELIVERABLES</h2>
          ${(d.projects || []).map(p => `
            <div class="exec-item">
              <div class="exec-item-title">
                <b>${CodeEditor.escapeHtml(p.title)}</b> — <span>${CodeEditor.escapeHtml(p.technologies)}</span>
                <span style="float: right; font-size: 11px;">
                  ${p.github ? `<a href="${p.github}">[Code]</a> ` : ''}
                  ${p.demo ? `<a href="${p.demo}">[Demo]</a>` : ''}
                </span>
              </div>
              <ul style="margin: 4px 0 0 18px; font-size: 12px; line-height: 1.5;">
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
                <b>${CodeEditor.escapeHtml(e.role)}</b>, ${CodeEditor.escapeHtml(e.company)} ${e.location ? `(${e.location})` : ''}
                <span style="float: right; font-weight: normal; font-size: 12px;">${e.period}</span>
              </div>
              <ul style="margin: 4px 0 0 18px; font-size: 12px; line-height: 1.5;">
                ${(e.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <section class="exec-section">
          <h2 class="exec-title">ACADEMIC CREDENTIALS</h2>
          ${(d.education || []).map(ed => `
            <div style="margin-bottom: 8px; font-size: 12.5px;">
              <b>${CodeEditor.escapeHtml(ed.degree)}</b> — ${CodeEditor.escapeHtml(ed.institution)}
              <span style="float: right; font-size: 11.5px; color: #555;">${ed.year || ''}</span>
              ${ed.details ? `<div style="font-size: 11.5px; color: #64748B;">${CodeEditor.escapeHtml(ed.details)}</div>` : ''}
            </div>
          `).join('')}
        </section>

        ${(d.referencesUponRequest || (d.references && d.references.length > 0)) ? `
          <section class="exec-section">
            <h2 class="exec-title">REFERENCES</h2>
            ${this.renderReferencesHtml(d)}
          </section>
        ` : ''}

        ${this.renderSignatureHtml(d)}
      </div>
    `;
  },

  // 4. Developer Minimalist Monospace Format
  renderMinimal(d) {
    return `
      <div class="minimal-wrapper">
        <div class="minimal-head" style="${d.showPhoto && d.photoUrl ? 'display: flex; justify-content: space-between; align-items: center;' : ''}">
          <div>
            <div class="minimal-prompt">$ whoami</div>
            <h1 class="minimal-name">${CodeEditor.escapeHtml(d.name)}</h1>
            <div class="minimal-role">&gt; ${CodeEditor.escapeHtml(d.title)}</div>
            <div class="minimal-meta">contact: [ ${d.email} | ${d.phone} | ${d.location} ]</div>
            <div class="minimal-meta">
              links: [ 
              ${d.github ? `<a href="${d.github}">github</a> | ` : ''}
              ${d.linkedin ? `<a href="${d.linkedin}">linkedin</a>` : ''}
              ${d.website ? ` | <a href="${d.website}">portfolio</a>` : ''}
              ]
            </div>
          </div>
          ${d.showPhoto && d.photoUrl ? `
            <img src="${d.photoUrl}" class="cv-photo-square" alt="Photo" style="filter: grayscale(80%);" />
          ` : ''}
        </div>

        <div class="minimal-sec">
          <div class="minimal-sec-head">## 01. SUMMARY</div>
          <p style="margin: 0;">${CodeEditor.escapeHtml(d.summary)}</p>
        </div>

        <div class="minimal-sec">
          <div class="minimal-sec-head">## 02. STACK</div>
          <pre><code>languages: ${d.skills.languages}\nframeworks: ${d.skills.frameworks}\ndatabases: ${d.skills.databases}\ntools: ${d.skills.tools}${(d.customSkills || []).map(cs => `\n${cs.category.toLowerCase()}: ${cs.items}`).join('')}</code></pre>
        </div>

        <div class="minimal-sec">
          <div class="minimal-sec-head">## 03. PROJECTS (${(d.projects || []).length})</div>
          ${(d.projects || []).map(p => `
            <div style="margin-bottom: 10px;">
              <b>* ${CodeEditor.escapeHtml(p.title)}</b> [${CodeEditor.escapeHtml(p.technologies)}]
              ${p.github ? `&lt;<a href="${p.github}">repo</a>&gt;` : ''}
              <ul style="margin: 3px 0 0 16px;">
                ${(p.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div class="minimal-sec">
          <div class="minimal-sec-head">## 04. EXPERIENCE</div>
          ${(d.experience || []).map(e => `
            <div style="margin-bottom: 10px;">
              <b>* ${CodeEditor.escapeHtml(e.role)} @ ${CodeEditor.escapeHtml(e.company)}</b> [${e.period}]
              <ul style="margin: 3px 0 0 16px;">
                ${(e.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </div>

        <div class="minimal-sec">
          <div class="minimal-sec-head">## 05. EDUCATION</div>
          ${(d.education || []).map(ed => `
            <div style="margin-bottom: 6px;">
              * <b>${CodeEditor.escapeHtml(ed.degree)}</b>, ${CodeEditor.escapeHtml(ed.institution)} (${ed.year || ''})
              ${ed.details ? `<br>&nbsp;&nbsp;↳ <span style="color:#666;">${CodeEditor.escapeHtml(ed.details)}</span>` : ''}
            </div>
          `).join('')}
        </div>

        ${(d.referencesUponRequest || (d.references && d.references.length > 0)) ? `
          <div class="minimal-sec">
            <div class="minimal-sec-head">## 06. REFERENCES</div>
            ${this.renderReferencesHtml(d)}
          </div>
        ` : ''}

        ${this.renderSignatureHtml(d)}
      </div>
    `;
  },

  // 5. Creative Frontend / Portfolio-Linked Format
  renderCreative(d) {
    return `
      <div class="creative-wrapper">
        <header class="creative-header">
          <div style="display: flex; align-items: center; gap: 16px;">
            ${d.showPhoto && d.photoUrl ? `
              <img src="${d.photoUrl}" class="cv-photo-circle" alt="Photo" />
            ` : ''}
            <div>
              <h1 class="creative-name">${CodeEditor.escapeHtml(d.name)}</h1>
              <div class="creative-title">${CodeEditor.escapeHtml(d.title)}</div>
            </div>
          </div>
          <div class="creative-contact">
            <div>📧 ${d.email}</div>
            <div>📱 ${d.phone}</div>
            <div>📍 ${d.location}</div>
            <div style="margin-top: 4px;">
              ${d.github ? `<a href="${d.github}" target="_blank">GitHub</a> ` : ''}
              ${d.linkedin ? `· <a href="${d.linkedin}" target="_blank">LinkedIn</a> ` : ''}
              ${d.website ? `· <a href="${d.website}" target="_blank">Portfolio</a>` : ''}
            </div>
          </div>
        </header>

        <section class="creative-section">
          <h3>About Me</h3>
          <p style="font-size: 13px; line-height: 1.6; margin: 0;">${CodeEditor.escapeHtml(d.summary)}</p>
        </section>

        <section class="creative-section">
          <h3>Skills & Frameworks</h3>
          <div class="creative-pills">
            ${(d.skills.languages + ', ' + d.skills.frameworks + ', ' + d.skills.databases + ', ' + d.skills.tools).split(',').map(s => `<span class="creative-pill">${s.trim()}</span>`).join('')}
            ${(d.customSkills || []).map(cs => cs.items.split(',').map(ci => `<span class="creative-pill" style="border-color: #0E7C7B; color: #0E7C7B;">${ci.trim()}</span>`).join('')).join('')}
          </div>
        </section>

        <section class="creative-section">
          <h3>Featured Projects (${(d.projects || []).length})</h3>
          <div class="creative-projects-grid">
            ${(d.projects || []).map(p => `
              <div class="creative-project-card">
                <b>${CodeEditor.escapeHtml(p.title)}</b>
                <span class="creative-stack">${CodeEditor.escapeHtml(p.technologies)}</span>
                <div style="font-size: 11px; margin-bottom: 6px;">
                  ${p.github ? `<a href="${p.github}" target="_blank">Code ↗</a> &nbsp;` : ''}
                  ${p.demo ? `<a href="${p.demo}" target="_blank">Live Demo ↗</a>` : ''}
                </div>
                <ul style="margin: 0 0 0 16px; font-size: 12px; line-height: 1.45;">
                  ${(p.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
                </ul>
              </div>
            `).join('')}
          </div>
        </section>

        <section class="creative-section">
          <h3>Work Experience</h3>
          ${(d.experience || []).map(e => `
            <div style="margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between;">
                <b>${CodeEditor.escapeHtml(e.role)} · <span style="color:#0E7C7B;">${CodeEditor.escapeHtml(e.company)}</span></b>
                <span style="font-size: 12px; color: #64748B;">${e.period}</span>
              </div>
              <ul style="margin: 4px 0 0 16px; font-size: 12px; line-height: 1.5;">
                ${(e.bullets || []).map(b => `<li>${CodeEditor.escapeHtml(b)}</li>`).join('')}
              </ul>
            </div>
          `).join('')}
        </section>

        <section class="creative-section">
          <h3>Education</h3>
          ${(d.education || []).map(ed => `
            <div style="margin-bottom: 8px;">
              <div style="display: flex; justify-content: space-between;">
                <b>${CodeEditor.escapeHtml(ed.degree)}</b>
                <span style="font-size: 12px; color: #64748B;">${ed.year || ''}</span>
              </div>
              <div style="font-size: 12px;">${CodeEditor.escapeHtml(ed.institution)} ${ed.details ? `— ${CodeEditor.escapeHtml(ed.details)}` : ''}</div>
            </div>
          `).join('')}
        </section>

        ${(d.referencesUponRequest || (d.references && d.references.length > 0)) ? `
          <section class="creative-section">
            <h3>References</h3>
            ${this.renderReferencesHtml(d)}
          </section>
        ` : ''}

        ${this.renderSignatureHtml(d)}
      </div>
    `;
  }
};
