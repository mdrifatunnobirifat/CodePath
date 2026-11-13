// CodePath Admin Panel (FR-AD1 to FR-AD5)
const AdminView = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="notice">Checking administrator credentials...</div>';

    try {
      const userRes = await Store.api('/me');
      const currentUser = userRes.user;

      if (currentUser.role !== 'admin') {
        app.innerHTML = `
          <div class="card" style="max-width: 480px; margin: 40px auto; text-align: center;">
            <h3>Admin Access Required</h3>
            <p class="tag" style="margin: 10px 0 16px;">You are currently signed in as a Learner. Switch to the Admin account to manage content and inspect telemetry.</p>
            <button class="btn p" onclick="AdminView.loginAsAdmin()">Switch to Admin Role 🔑</button>
          </div>
        `;
        return;
      }

      const adminData = await Store.api('/admin/data');

      app.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <div>
              <h2>Admin Content Management</h2>
              <span class="badge easy">Role: Administrator</span>
            </div>
            <div style="display: flex; gap: 8px;">
              <button class="btn" onclick="AdminView.exportDatabase()">Export JSON 📥</button>
              <button class="btn p" onclick="AdminView.openCreateProblemModal()">+ Create New Problem</button>
            </div>
          </div>

          <!-- Platform Statistics (FR-AD5) -->
          <div class="stats">
            <div class="card">
              <b>${adminData.userCount}</b>
              <span class="tag">Registered Learners</span>
            </div>
            <div class="card">
              <b>${adminData.problemCount}</b>
              <span class="tag">Published Problems</span>
            </div>
            <div class="card">
              <b>${adminData.lessonCount}</b>
              <span class="tag">Curriculum Lessons</span>
            </div>
            <div class="card">
              <b>${adminData.submissionCount}</b>
              <span class="tag">Test Submissions</span>
            </div>
          </div>

          <!-- Problems Management Table -->
          <div class="card">
            <h3>Manage Problems (${adminData.problems.length})</h3>
            <div style="overflow-x: auto; margin-top: 14px;">
              <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
                <thead>
                  <tr style="border-bottom: 2px solid var(--line); text-align: left;">
                    <th style="padding: 10px;">Title</th>
                    <th style="padding: 10px;">Language</th>
                    <th style="padding: 10px;">Difficulty</th>
                    <th style="padding: 10px;">Type</th>
                    <th style="padding: 10px; text-align: right;">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  ${adminData.problems.map(p => `
                    <tr style="border-bottom: 1px solid var(--line);">
                      <td style="padding: 10px;"><b>${CodeEditor.escapeHtml(p.title)}</b></td>
                      <td style="padding: 10px;"><span class="pill">${p.language}</span></td>
                      <td style="padding: 10px;"><span class="badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span></td>
                      <td style="padding: 10px;"><span class="tag">${p.type}</span></td>
                      <td style="padding: 10px; text-align: right;">
                        <button class="ghost" style="padding: 4px 8px; font-size: 12px;" onclick="navigate('practice', { slug: '${p.slug}' })">Preview</button>
                        <button class="ghost" style="padding: 4px 8px; font-size: 12px; color: var(--bad);" onclick="AdminView.deleteProblem('${p.id}')">Delete</button>
                      </td>
                    </tr>
                  `).join('')}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Admin panel error: ${err.message}</div></div>`;
    }
  },

  async loginAsAdmin() {
    try {
      await Store.api('/auth/login', 'POST', {
        email: 'admin@codepath.dev',
        password: 'admin'
      });
      Store.toast('Switched to Admin Role! 🛡️', 'success');
      await Store.fetchUser();
      this.render();
    } catch (e) {
      Store.toast('Admin login failed: ' + e.message, 'error');
    }
  },

  openCreateProblemModal() {
    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
        <h3>Create New Practice Problem</h3>
        <button class="ghost" onclick="ProjectsView.closeModal()">✕</button>
      </div>

      <div style="display: flex; flex-direction: column; gap: 10px; font-size: 14px;">
        <label>
          <b>Problem Title:</b>
          <input type="text" id="new-prob-title" placeholder="e.g. Find Max Subarray" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink);" />
        </label>
        <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 10px;">
          <label>
            <b>Language:</b>
            <select id="new-prob-lang" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink);">
              <option value="JavaScript">JavaScript</option>
              <option value="Python">Python</option>
              <option value="React">React</option>
              <option value="SQL">SQL</option>
              <option value="C#">C#</option>
              <option value="PHP">PHP</option>
            </select>
          </label>
          <label>
            <b>Difficulty:</b>
            <select id="new-prob-diff" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink);">
              <option value="Easy">Easy</option>
              <option value="Medium">Medium</option>
              <option value="Hard">Hard</option>
            </select>
          </label>
        </div>
        <label>
          <b>Function Name:</b>
          <input type="text" id="new-prob-fn" placeholder="e.g. maxSubArray" style="width: 100%; padding: 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink);" />
        </label>
        <label>
          <b>Description (Markdown):</b>
          <textarea id="new-prob-desc" style="width: 100%; min-height: 100px; padding: 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink); font-family: monospace;" placeholder="Problem prompt..."></textarea>
        </label>
        <label>
          <b>Starter Code:</b>
          <textarea id="new-prob-starter" style="width: 100%; min-height: 80px; padding: 8px; border-radius: 6px; border: 1px solid var(--line); background: var(--code); color: var(--ink); font-family: monospace;">function solution(input) {\n  \n}\n</textarea>
        </label>
      </div>

      <div class="row" style="justify-content: flex-end; margin-top: 14px;">
        <button class="btn p" onclick="AdminView.saveProblem()">Publish Problem 🚀</button>
      </div>
    `;
    document.getElementById('modal-overlay').style.display = 'flex';
  },

  async saveProblem() {
    const title = document.getElementById('new-prob-title').value;
    const lang = document.getElementById('new-prob-lang').value;
    const diff = document.getElementById('new-prob-diff').value;
    const fn = document.getElementById('new-prob-fn').value;
    const desc = document.getElementById('new-prob-desc').value;
    const starter = document.getElementById('new-prob-starter').value;

    if (!title || !fn) {
      Store.toast('Title and function name are required', 'error');
      return;
    }

    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    const newProblem = {
      id: 'p-' + Date.now(),
      slug,
      title,
      language: lang,
      difficulty: diff,
      type: 'algorithm',
      fn,
      descriptionMarkdown: desc || `### ${title}\n\nImplement \`${fn}\`.`,
      starterCode: starter,
      topics: ['Algorithms'],
      visibleTests: [{ input: [[1, 2]], expected: 3 }],
      hiddenTests: [{ input: [[5, 10]], expected: 15 }],
      hints: ['Check array bounds.', 'Iterate carefully.'],
      solutionMarkdown: `\`\`\`javascript\n${starter}\n\`\`\``
    };

    try {
      await Store.api('/admin/problems', 'POST', newProblem);
      Store.toast('New problem created successfully! 🎉', 'success');
      ProjectsView.closeModal();
      this.render();
    } catch (e) {
      Store.toast('Error creating problem: ' + e.message, 'error');
    }
  },

  async deleteProblem(id) {
    if (confirm('Are you sure you want to delete this problem?')) {
      try {
        await Store.api(`/admin/problems/${id}`, 'DELETE');
        Store.toast('Problem deleted');
        this.render();
      } catch (e) {
        Store.toast('Failed to delete problem', 'error');
      }
    }
  },

  async exportDatabase() {
    try {
      const data = await Store.api('/admin/export');
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = `codepath-database-backup-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      Store.toast('Database exported! 📥', 'success');
    } catch (e) {
      Store.toast('Export failed', 'error');
    }
  }
};
