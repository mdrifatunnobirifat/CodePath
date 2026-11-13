// CodePath Profile & Public Portfolio View (FR-A4, FR-A5)
const ProfileView = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="notice">Loading public portfolio...</div>';

    try {
      const userRes = await Store.api('/me');
      const dashRes = await Store.api('/dashboard');
      const projRes = await Store.api('/projects');

      const user = userRes.user;
      const profile = userRes.profile;
      const stats = dashRes.stats;
      const radar = dashRes.skillRadar || {};
      const completedProjects = (projRes.projects || []).filter(p => p.submission);

      const badges = [
        { id: 'first-solve', name: 'First Blood', desc: 'Solved your first coding problem', icon: '⚔️', earned: stats.solvedCount >= 1 },
        { id: 'streak-3', name: '3-Day Fire', desc: 'Maintained a 3-day active streak', icon: '🔥', earned: stats.streak >= 3 },
        { id: 'streak-7', name: 'Unstoppable', desc: 'Maintained a 7-day active streak', icon: '⚡', earned: stats.streak >= 7 },
        { id: 'project-builder', name: 'Shipper', desc: 'Completed and submitted a mini-project', icon: '🚀', earned: stats.completedProjects >= 1 },
        { id: 'quiz-ace', name: 'Theory Master', desc: 'Mastered technical quizzes', icon: '🎯', earned: true },
        { id: 'job-ready', name: 'Interview Ready', desc: 'Completed core readiness goals', icon: '🏆', earned: stats.solvedCount >= 3 }
      ];

      app.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Public Profile Header Card -->
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 16px;">
            <div style="display: flex; align-items: center; gap: 16px;">
              <img src="${user.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=learner'}" alt="Avatar" style="width: 72px; height: 72px; border-radius: 50%; border: 2px solid var(--acc); background: var(--code);" />
              <div>
                <h2>${CodeEditor.escapeHtml(user.name)}</h2>
                <span class="tag">${profile.bio || 'Aspiring Software Developer'}</span>
                <div style="margin-top: 6px;">
                  <span class="pill" style="background: var(--code);">🎯 ${profile.goalTrack ? profile.goalTrack.toUpperCase() : 'FRONTEND'} Track</span>
                  <span class="pill" style="color: var(--warm); font-weight: 700;">🔥 ${stats.streak} Days Streak</span>
                </div>
              </div>
            </div>

            <div style="display: flex; gap: 10px;">
              <button class="btn p" onclick="ProfileView.copyShareableLink()">Share Portfolio Link 🔗</button>
            </div>
          </div>

          <!-- Solved Stats & Achievements -->
          <div class="stats">
            <div class="card">
              <b>${stats.solvedCount}</b>
              <span class="tag">Algorithms Solved</span>
            </div>
            <div class="card">
              <b>${stats.completedProjects}</b>
              <span class="tag">Mini-Projects Shipped</span>
            </div>
            <div class="card">
              <b>${stats.lessonsCompleted}</b>
              <span class="tag">Lessons Mastered</span>
            </div>
            <div class="card">
              <b>${badges.filter(b => b.earned).length}/${badges.length}</b>
              <span class="tag">Badges Unlocked</span>
            </div>
          </div>

          <!-- Badges Showcase (FR-G3) -->
          <div class="card">
            <h3>Earned Achievement Badges</h3>
            <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 14px;">
              ${badges.map(b => `
                <div style="padding: 12px; border-radius: 8px; border: 1px solid var(--line); background: ${b.earned ? 'var(--panel)' : 'var(--code)'}; opacity: ${b.earned ? '1' : '0.45'};">
                  <div style="font-size: 28px; margin-bottom: 6px;">${b.icon}</div>
                  <b style="font-size: 14px;">${b.name}</b>
                  <p style="font-size: 12px; color: var(--mute); margin: 4px 0 0;">${b.desc}</p>
                </div>
              `).join('')}
            </div>
          </div>

          <!-- Completed Projects with GitHub links -->
          <div class="card">
            <h3>Completed Mini-Projects & Source Repositories</h3>
            ${completedProjects.length ? `
              <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
                ${completedProjects.map(p => `
                  <div style="display: flex; justify-content: space-between; align-items: center; padding: 12px; border-radius: 8px; border: 1px solid var(--line); background: var(--code);">
                    <div>
                      <b>${CodeEditor.escapeHtml(p.title)}</b>
                      <span class="tag" style="display: block;">${p.trackId.toUpperCase()}</span>
                    </div>
                    <div style="display: flex; gap: 8px;">
                      <a href="${p.submission.githubUrl}" target="_blank" class="btn" style="padding: 6px 12px; font-size: 13px;">View GitHub Code ↗</a>
                    </div>
                  </div>
                `).join('')}
              </div>
            ` : `
              <p class="tag" style="margin-top: 10px;">No mini-projects submitted yet. Visit the Mini-Projects tab to submit your first repository!</p>
            `}
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Error loading profile: ${err.message}</div></div>`;
    }
  },

  copyShareableLink() {
    const url = window.location.origin + '#portfolio';
    navigator.clipboard.writeText(url);
    Store.toast('Public portfolio link copied to clipboard! 📋', 'success');
  }
};
