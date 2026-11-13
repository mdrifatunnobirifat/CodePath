// CodePath Jobs Board View (Preserves User HTML Prototype Design)
const JobsView = {
  selectedTech: 'All',
  remoteOnly: false,

  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="notice">Loading verified developer jobs...</div>';

    try {
      const res = await Store.api(`/jobs?tech=${this.selectedTech}&remote=${this.remoteOnly}`);
      const jobs = res.jobs || [];
      const saved = res.savedJobs || [];

      const techList = ["All", "JavaScript", "React", "Python", "PHP", "C#", ".NET"];

      app.innerHTML = `
        <div>
          <h2>Developer Jobs</h2>
          <p class="notice" style="margin: 10px 0 16px;">
            These curated listings match the skills taught in your chosen role track. Filter by technology and apply directly when you meet the requirements.
          </p>

          <!-- Filter Chips -->
          <div class="chips" role="group" aria-label="Filter by technology">
            ${techList.map(t => `
              <button class="chip" data-k="${t}" aria-pressed="${this.selectedTech === t}" onclick="JobsView.filterTech('${t}')">${t}</button>
            `).join('')}
            <button class="chip" id="rem" aria-pressed="${this.remoteOnly}" onclick="JobsView.toggleRemote()">Remote only</button>
          </div>

          <!-- Jobs Cards -->
          <div class="jobs">
            ${jobs.length ? jobs.map(j => `
              <article class="card job">
                <div>
                  <h3>${CodeEditor.escapeHtml(j.title)}</h3>
                  <div style="font-size: 14px; color: var(--mute); margin-bottom: 6px;">
                    ${CodeEditor.escapeHtml(j.company)} · ${CodeEditor.escapeHtml(j.location)}
                  </div>
                  <div>
                    ${(j.technologies || []).map(k => `<span class="pill">${CodeEditor.escapeHtml(k)}</span>`).join('')}
                    <span class="pill" style="font-weight: 600;">${j.level}</span>
                    ${j.salary ? `<span class="pill" style="color: var(--ok); font-weight: 600;">${j.salary}</span>` : ''}
                  </div>
                </div>

                <div class="row" style="align-items: flex-start; margin: 0;">
                  <span class="tag" style="margin-right: 8px;">${j.daysAgo} days ago</span>
                  <button class="btn" aria-pressed="${saved.includes(j.title)}" onclick="JobsView.toggleSave('${CodeEditor.escapeHtml(j.title)}')">
                    ${saved.includes(j.title) ? '★ Saved' : '☆ Save job'}
                  </button>
                  <button class="btn p" onclick="JobsView.openApplyModal('${j.id}')">Apply Now</button>
                </div>
              </article>
            `).join('') : '<p class="tag">No jobs match these filters. Turn off Remote only or select All.</p>'}
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Error loading jobs: ${err.message}</div></div>`;
    }
  },

  filterTech(tech) {
    this.selectedTech = tech;
    this.render();
  },

  toggleRemote() {
    this.remoteOnly = !this.remoteOnly;
    this.render();
  },

  async toggleSave(jobTitle) {
    try {
      const res = await Store.api('/jobs/save', 'POST', { jobTitle });
      Store.toast(`Job ${res.savedJobs.includes(jobTitle) ? 'saved to' : 'removed from'} your dashboard!`);
      this.render();
    } catch (e) {
      Store.toast('Error saving job', 'error');
    }
  },

  async openApplyModal(jobId) {
    const res = await Store.api(`/jobs`);
    const job = (res.jobs || []).find(j => j.id === jobId);
    if (!job) return;

    const modal = document.getElementById('modal-content');
    modal.innerHTML = `
      <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 12px;">
        <div>
          <h3>${CodeEditor.escapeHtml(job.title)}</h3>
          <span class="tag">${CodeEditor.escapeHtml(job.company)} · ${CodeEditor.escapeHtml(job.location)}</span>
        </div>
        <button class="ghost" onclick="ProjectsView.closeModal()">✕</button>
      </div>

      <div class="prose" style="margin: 14px 0;">
        <p>${CodeEditor.escapeHtml(job.description || 'Full developer job specifications and team overview.')}</p>
        <h4>Application Checklist:</h4>
        <ul>
          <li>Attach your GitHub portfolio link showing 3 completed mini-projects.</li>
          <li>Highlight your solved problems count on CodePath.</li>
          <li>Format your CV to highlight: ${(job.technologies || []).join(', ')}.</li>
        </ul>
      </div>

      <div class="row" style="justify-content: flex-end; gap: 10px;">
        <button class="ghost" onclick="ProjectsView.closeModal()">Close</button>
        <button class="btn p" onclick="Store.toast('Redirecting to partner application portal... 🚀'); ProjectsView.closeModal();">Proceed to Application External Link</button>
      </div>
    `;
    document.getElementById('modal-overlay').style.display = 'flex';
  }
};
