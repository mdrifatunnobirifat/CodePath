// CodePath Guided Mini-Projects & GitHub Portfolio Builder (FR-M1 to FR-M4)
const ProjectsView = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="notice">Loading mini-projects...</div>';

    try {
      const res = await Store.api('/projects');
      const projects = res.projects || [];

      app.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <div>
            <h2>Guided Mini-Projects</h2>
            <p class="tag">Build proof of your skills. Complete 3 polished projects to pass the Job-Ready Application Checklist.</p>
          </div>

          <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(340px, 1fr)); gap: 16px;">
            ${projects.map(p => `
              <div class="card" style="display: flex; flex-direction: column; justify-content: space-between; border-top: 4px solid var(--acc);">
                <div>
                  <div style="display: flex; justify-content: space-between; align-items: flex-start; gap: 8px;">
                    <h3>${CodeEditor.escapeHtml(p.title)}</h3>
                    <span class="badge ${p.difficulty.toLowerCase() === 'beginner' ? 'easy' : 'medium'}">${p.difficulty}</span>
                  </div>
                  <span class="tag" style="margin: 6px 0 10px; display: block;">⏱️ Est. ${p.estimatedHours} hours · ${p.trackId.toUpperCase()}</span>
                  <p style="font-size: 14px; color: var(--ink); margin-bottom: 12px;">${CodeEditor.escapeHtml(p.description)}</p>

                  <!-- Requirements Preview -->
                  <div style="background: var(--code); padding: 10px; border-radius: 6px; font-size: 13px; margin-bottom: 12px;">
                    <b>Key Requirements:</b>
                    <ul style="margin: 6px 0 0 18px; padding: 0;">
                      ${(p.requirements || []).slice(0, 3).map(r => `<li>${CodeEditor.escapeHtml(r)}</li>`).join('')}
                    </ul>
                  </div>
                </div>

                <div>
                  ${p.submission ? `
                    <div style="margin-bottom: 10px; padding: 8px 10px; background: rgba(27, 138, 75, 0.12); border-radius: 6px; font-size: 13px; color: var(--ok);">
                      ✓ Completed! <a href="${p.submission.githubUrl}" target="_blank" style="color: var(--ok); font-weight: bold; text-decoration: underline;">GitHub Repository</a>
                    </div>
                  ` : ''}

                  <div class="row" style="margin: 0; justify-content: space-between;">
                    <button class="ghost" onclick="ProjectsView.openReadmeGenerator('${p.id}')">📄 Generate README</button>
                    <button class="btn p" onclick="ProjectsView.openSubmitModal('${p.id}')">
                      ${p.submission ? 'Update Submission' : 'Submit GitHub Link'}
                    </button>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Error loading projects: ${err.message}</div></div>`;
    }
  },

  async openReadmeGenerator(projId) {
    const res = await Store.api('/projects');
    const project = (res.projects || []).find(p => p.id === projId);
    if (!project) return;

    const readmeTemplate = `# ${project.title}

[![License: MIT](https://img.shields.io/badge/License-MIT-teal.svg)](https://opensource.org/licenses/MIT)
[![CodePath Verified](https://img.shields.io/badge/CodePath-60--Day--Project-0E7C7B)](https://github.com)

## 📌 Project Overview
${project.description}

## 🚀 Key Features & Requirements
${(project.requirements || []).map(r => `- [x] ${r}`).join('\n')}

## 🛠️ Tech Stack & Architecture
- **Language / Framework:** Modern Web Architecture
- **State Management:** Local persistence & structured models
- **Testing:** Unit test assertions and validation

## 📂 Suggested Directory Structure
\`\`\`
${project.suggestedStructure || 'src/\n├── index.js\n└── README.md'}
\`\`\`

## ⚡ Quick Start Guide
\`\`\`bash
# 1. Clone repository
git clone https://github.com/your-username/${projId}.git

# 2. Open project
cd ${projId}

# 3. Launch application or server
npm start
\`\`\`

## 👤 Author
Developed as part of the **CodePath 60-Day Job-Readiness Curriculum**.
`;

    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3>recruiter-ready README Generator</h3>
        <button class="ghost" onclick="ProjectsView.closeModal()">✕ Close</button>
      </div>
      <p class="tag">Copy this Markdown into your GitHub repository's README.md to impress hiring managers.</p>
      <textarea id="generated-readme-text" style="width: 100%; min-height: 280px; font-family: monospace; font-size: 13px; margin: 12px 0; padding: 12px; background: var(--code); border: 1px solid var(--line); border-radius: 8px;">${readmeTemplate}</textarea>
      <div class="row" style="justify-content: flex-end;">
        <button class="btn p" onclick="ProjectsView.copyReadme()">Copy to Clipboard 📋</button>
      </div>
    `;
    document.getElementById('modal-overlay').style.display = 'flex';
  },

  openSubmitModal(projId) {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3>Submit Project for Review</h3>
        <button class="ghost" onclick="ProjectsView.closeModal()">✕ Close</button>
      </div>
      <p class="tag">Provide your GitHub repository link. This will be showcased on your Public Portfolio page.</p>
      
      <div style="display: flex; flex-direction: column; gap: 12px; margin: 16px 0;">
        <label>
          <span style="font-size: 13px; font-weight: 600;">GitHub Repository URL:</span>
          <input type="url" id="proj-github-url" placeholder="https://github.com/your-username/my-project" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--code); color: var(--ink); margin-top: 4px;" required />
        </label>
        <label>
          <span style="font-size: 13px; font-weight: 600;">Live Demo URL (Optional):</span>
          <input type="url" id="proj-demo-url" placeholder="https://my-project.vercel.app" style="width: 100%; padding: 8px 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--code); color: var(--ink); margin-top: 4px;" />
        </label>
      </div>

      <div class="row" style="justify-content: flex-end;">
        <button class="btn p" onclick="ProjectsView.submitProject('${projId}')">Submit & Mark Complete ✓</button>
      </div>
    `;
    document.getElementById('modal-overlay').style.display = 'flex';
  },

  async submitProject(projId) {
    const githubUrl = document.getElementById('proj-github-url').value;
    const liveDemoUrl = document.getElementById('proj-demo-url').value;
    if (!githubUrl) {
      Store.toast('Please provide a valid GitHub URL', 'error');
      return;
    }

    try {
      await Store.api(`/projects/${projId}/submit`, 'POST', { githubUrl, liveDemoUrl });
      Store.toast('Project submitted successfully! 🎉', 'success');
      this.closeModal();
      this.render();
    } catch (e) {
      Store.toast('Failed to submit project', 'error');
    }
  },

  copyReadme() {
    const text = document.getElementById('generated-readme-text');
    text.select();
    navigator.clipboard.writeText(text.value);
    Store.toast('README copied to clipboard! 📋', 'success');
  },

  closeModal() {
    document.getElementById('modal-overlay').style.display = 'none';
  }
};
