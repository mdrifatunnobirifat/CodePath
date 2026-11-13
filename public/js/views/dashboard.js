// CodePath Dashboard View (Section 5.9 & Section 4)
const DashboardView = {
  async render() {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="notice">Loading dashboard insights...</div>';

    try {
      const data = await Store.api('/dashboard');
      const stats = data.stats;
      const radar = data.skillRadar || {};
      const plan = data.todayPlan || [];
      const profile = data.profile || {};

      let planDoneCount = plan.filter(t => t.done).length;
      let planPercent = plan.length > 0 ? Math.round((planDoneCount / plan.length) * 100) : 0;

      app.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 20px;">
          <!-- Welcome & Streak Banner -->
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; background: linear-gradient(135deg, var(--panel) 0%, var(--code) 100%);">
            <div>
              <h2>Welcome back, ${profile.userId ? 'Developer' : 'Guest'} 👋</h2>
              <p class="tag" style="margin-top: 4px;">Goal: <b>${profile.goalTrack ? profile.goalTrack.toUpperCase() : 'FRONTEND'}</b> Track · Target Date: <b>${profile.targetDate || '60 Days'}</b></p>
            </div>
            <div style="display: flex; gap: 10px;">
              <button class="btn p" onclick="navigate('practice')">Continue Practice 🚀</button>
              <button class="btn" onclick="navigate('readiness')">Check Job Readiness 📋</button>
            </div>
          </div>

          <!-- Top Stats Overview -->
          <div class="stats">
            <div class="card">
              <b>${stats.solvedCount}/${stats.totalProblems}</b>
              <span class="tag">Problems Solved</span>
              <div class="bar" style="margin-top: 8px;"><i style="width: ${Math.round((stats.solvedCount / Math.max(stats.totalProblems, 1)) * 100)}%;"></i></div>
            </div>
            <div class="card">
              <b style="color: var(--warm);">${stats.streak} Days</b>
              <span class="tag">Active Streak 🔥</span>
              <div class="tag" style="margin-top: 8px;">Keep momentum today!</div>
            </div>
            <div class="card">
              <b>${stats.completedProjects}/6</b>
              <span class="tag">Mini-Projects Built 💼</span>
              <div class="tag" style="margin-top: 8px;">GitHub Ready</div>
            </div>
            <div class="card">
              <b>${stats.lessonsCompleted}</b>
              <span class="tag">Lessons Mastered 📚</span>
              <div class="tag" style="margin-top: 8px;">Learn then practice</div>
            </div>
          </div>

          <div style="display: grid; grid-template-columns: 1.2fr 1fr; gap: 20px;">
            <!-- Today's 60-Day Plan Checklist -->
            <div class="card">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
                <h3>Today's 60-Day Plan</h3>
                <span class="badge ${planPercent === 100 ? 'easy' : 'medium'}">${planDoneCount}/${plan.length} Completed (${planPercent}%)</span>
              </div>
              <p class="tag">Complete your 4 daily milestones to stay on schedule for your 60-day goal.</p>
              
              <div style="display: flex; flex-direction: column; gap: 10px; margin-top: 14px;">
                ${plan.map(task => `
                  <div style="display: flex; align-items: center; justify-content: space-between; padding: 10px 12px; border-radius: 8px; border: 1px solid var(--line); background: ${task.done ? 'var(--code)' : 'var(--panel)'};">
                    <label style="display: flex; align-items: center; gap: 10px; cursor: pointer; flex: 1;">
                      <input type="checkbox" ${task.done ? 'checked' : ''} onchange="DashboardView.toggleTask('${task.id}')" style="width: 18px; height: 18px; accent-color: var(--acc);" />
                      <span style="${task.done ? 'text-decoration: line-through; color: var(--mute);' : 'font-weight: 600;'}">
                        ${task.type === 'lesson' ? '📖 ' : task.type === 'revision' ? '🔄 ' : '⚡ '} ${task.title}
                      </span>
                    </label>
                    <button class="ghost" style="padding: 4px 10px; font-size: 12px;" onclick="DashboardView.openTask('${task.type}', '${task.refId}')">Open</button>
                  </div>
                `).join('')}
              </div>
            </div>

            <!-- Skill Radar / Topic Strengths -->
            <div class="card">
              <h3>Skill Radar by Topic</h3>
              <p class="tag" style="margin-bottom: 14px;">Track your strengths and identify focus areas for upcoming interviews.</p>
              
              <div style="display: flex; flex-direction: column; gap: 12px;">
                ${Object.entries(radar).map(([topic, val]) => `
                  <div>
                    <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                      <b>${topic}</b>
                      <span class="tag">${val.solved} of ${val.total} solved</span>
                    </div>
                    <div class="bar"><i style="width: ${val.total > 0 ? (val.solved / val.total) * 100 : 0}%;"></i></div>
                  </div>
                `).join('')}
              </div>
            </div>
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Failed to load dashboard: ${err.message}</div></div>`;
    }
  },

  async toggleTask(taskId) {
    try {
      await Store.api('/plan/task/toggle', 'POST', { taskId });
      DashboardView.render();
    } catch (e) {
      Store.toast('Error updating task status', 'error');
    }
  },

  openTask(type, refId) {
    if (type === 'lesson') {
      navigate('lessons', { lessonId: refId });
    } else if (type === 'problem') {
      navigate('practice', { slug: refId });
    } else if (type === 'revision') {
      navigate('quizzes');
    }
  }
};
