// CodePath Tracks & Modules View (FR-T1, FR-T2, FR-T3, FR-T5)
const TracksView = {
  selectedTrackId: 'frontend',

  async render(params = {}) {
    const app = document.getElementById('app');
    if (params.trackId) this.selectedTrackId = params.trackId;

    app.innerHTML = '<div class="notice">Loading tracks curriculum...</div>';

    try {
      const tracksRes = await Store.api('/tracks');
      const trackDetailRes = await Store.api(`/tracks/${this.selectedTrackId}`);
      const tracks = tracksRes.tracks;
      const currentTrack = trackDetailRes.track;

      app.innerHTML = `
        <div>
          <h2>Career Role Tracks</h2>
          <p class="tag" style="margin-top: 4px; margin-bottom: 16px;">
            Structured end-to-end paths designed to make you job-ready in 60 days.
          </p>

          <!-- Track Selector Tabs -->
          <div class="chips" role="tablist">
            ${tracks.map(t => `
              <button class="chip" aria-pressed="${t.id === this.selectedTrackId}" onclick="TracksView.selectTrack('${t.id}')">
                ${t.title} (${t.progressPercent}%)
              </button>
            `).join('')}
          </div>

          <!-- Active Track Banner -->
          <div class="card" style="margin-bottom: 20px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
              <div>
                <h3>${currentTrack.title}</h3>
                <p style="margin: 6px 0; color: var(--mute); font-size: 15px;">${currentTrack.description}</p>
                <span class="pill" style="background: var(--code);">Award: 🏅 ${currentTrack.badge}</span>
              </div>
              <div style="min-width: 180px;">
                <div style="display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 4px;">
                  <b>Track Completion</b>
                  <span>${currentTrack.progressPercent || 0}%</span>
                </div>
                <div class="bar"><i style="width: ${currentTrack.progressPercent || 0}%;"></i></div>
              </div>
            </div>
          </div>

          <!-- Modules List -->
          <h3>Curriculum Modules</h3>
          <div style="display: flex; flex-direction: column; gap: 16px; margin-top: 12px;">
            ${(currentTrack.moduleDetails || []).map((m, idx) => `
              <div class="card" style="border-left: 4px solid var(--acc);">
                <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                  <div>
                    <h4>Module ${idx + 1}: ${m.title}</h4>
                    <span class="tag">${m.language} · ${m.description}</span>
                  </div>
                  ${m.quizId ? `
                    <button class="btn" onclick="navigate('quizzes', { quizId: '${m.quizId}' })">
                      Take Module Quiz 📝
                    </button>
                  ` : ''}
                </div>

                <!-- Lessons & Problems under Module -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px; margin-top: 14px;">
                  <!-- Lessons -->
                  <div style="background: var(--code); padding: 12px; border-radius: 8px;">
                    <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">Lessons (Learn First)</b>
                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
                      ${(m.lessonItems || []).map(l => `
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px;">
                          <span>${l.isCompleted ? '✅' : '📄'} ${l.title}</span>
                          <button class="ghost" style="padding: 2px 8px; font-size: 12px;" onclick="navigate('lessons', { lessonId: '${l.id}' })">Read</button>
                        </div>
                      `).join('')}
                    </div>
                  </div>

                  <!-- Problems -->
                  <div style="background: var(--code); padding: 12px; border-radius: 8px;">
                    <b style="font-size: 13px; text-transform: uppercase; color: var(--mute);">Practice Exercises</b>
                    <div style="display: flex; flex-direction: column; gap: 6px; margin-top: 8px;">
                      ${(m.problemItems || []).map(p => `
                        <div style="display: flex; justify-content: space-between; align-items: center; font-size: 14px;">
                          <span>${p.isSolved ? '✅' : '⚡'} ${p.title}</span>
                          <span class="badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                          <button class="ghost" style="padding: 2px 8px; font-size: 12px;" onclick="navigate('practice', { slug: '${p.slug}' })">Solve</button>
                        </div>
                      `).join('')}
                    </div>
                  </div>
                </div>
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Error loading tracks: ${err.message}</div></div>`;
    }
  },

  selectTrack(trackId) {
    this.selectedTrackId = trackId;
    this.render();
  }
};
