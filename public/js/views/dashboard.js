// CodePath Two-Segment Dashboard: Learn (Basic to Strong) & Practice (100 Questions)
const DashboardView = {
  activeSegment: 'learn', // 'learn' | 'practice'
  practiceFilter: {
    difficulty: 'All',
    topic: 'All',
    search: '',
    page: 1,
    pageSize: 20
  },

  async render(params = {}) {
    const app = document.getElementById('app');
    const activeLang = Store.state.selectedLanguage || 'JavaScript';

    app.innerHTML = '<div class="notice">Loading your tailored language dashboard...</div>';

    try {
      // 1. Fetch topics roadmap from basic to strong
      const topicsRes = await Store.api(`/curriculum/topics?language=${activeLang}`);
      const topics = topicsRes.topics || [];

      // 2. Fetch problems for this language
      const problemsRes = await Store.api(`/problems?language=${activeLang}`);
      const problems = problemsRes.problems || [];
      const solvedCount = problems.filter(p => p.isSolved).length;

      app.innerHTML = `
        <div class="segment-container">
          <!-- Top Language Hero Header -->
          <div class="card" style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 14px; background: linear-gradient(135deg, var(--panel) 0%, var(--code) 100%);">
            <div>
              <div style="display: flex; align-items: center; gap: 10px;">
                <h2 style="font-size: 26px;">${activeLang} Job-Ready Hub</h2>
                <span class="badge easy">${problems.length} Practice Problems</span>
              </div>
              <p class="tag" style="margin-top: 4px;">
                Tailored 60-day curriculum designed to build your foundational confidence and crack technical interviews.
              </p>
            </div>
            <div style="display: flex; gap: 10px; align-items: center;">
              <button class="ghost" onclick="navigate('languages')" style="font-size: 13px;">🌐 Switch Language</button>
            </div>
          </div>

          <!-- Quick Progress Metrics -->
          <div class="stats">
            <div class="card">
              <b>${solvedCount}/${problems.length}</b>
              <span class="tag">Questions Solved</span>
              <div class="bar" style="margin-top: 8px;"><i style="width: ${Math.round((solvedCount / Math.max(problems.length, 1)) * 100)}%;"></i></div>
            </div>
            <div class="card">
              <b style="color: var(--warm);">${Store.state.streak.n || 1} Days</b>
              <span class="tag">Active Streak 🔥</span>
              <div class="tag" style="margin-top: 8px;">Keep momentum today!</div>
            </div>
            <div class="card">
              <b>${topics.length} Topics</b>
              <span class="tag">Basic to Job-Ready 📚</span>
              <div class="tag" style="margin-top: 8px;">Structured learning</div>
            </div>
            <div class="card">
              <b>${problems.filter(p => p.difficulty === 'Easy').length} / ${problems.filter(p => p.difficulty === 'Medium').length} / ${problems.filter(p => p.difficulty === 'Hard').length}</b>
              <span class="tag">Easy / Med / Hard</span>
              <div class="tag" style="margin-top: 8px;">Full spectrum practice</div>
            </div>
          </div>

          <!-- Segment Switcher Tabs -->
          <div class="segment-tabs">
            <button class="segment-tab-btn ${this.activeSegment === 'learn' ? 'active' : ''}" onclick="DashboardView.switchSegment('learn')">
              <div>
                <h3>📚 Segment 1: Learn Topics</h3>
                <span class="sub">Structured concepts from Basic fundamentals to Strong advanced patterns</span>
              </div>
              <span class="badge ${this.activeSegment === 'learn' ? 'easy' : ''}">${topics.length} Topics</span>
            </button>

            <button class="segment-tab-btn ${this.activeSegment === 'practice' ? 'active' : ''}" onclick="DashboardView.switchSegment('practice')">
              <div>
                <h3>⚡ Segment 2: Practice Questions</h3>
                <span class="sub">100+ job-ready coding problems across Basic, Intermediate & Hard tiers</span>
              </div>
              <span class="badge ${this.activeSegment === 'practice' ? 'easy' : ''}">${problems.length} Questions</span>
            </button>
          </div>

          <!-- Segment Content Mount Point -->
          <div id="segment-view-mount">
            ${this.activeSegment === 'learn' ? this.renderLearnSegment(topics, activeLang) : this.renderPracticeSegment(problems, activeLang)}
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Error loading language dashboard: ${err.message}</div></div>`;
    }
  },

  switchSegment(seg) {
    this.activeSegment = seg;
    this.render();
  },

  // --- SEGMENT 1: LEARN (Topics from Basic to Strong) ---
  renderLearnSegment(topics, activeLang) {
    const levels = ['Basic', 'Intermediate', 'Advanced', 'Job-Ready'];
    return `
      <div style="display: flex; flex-direction: column; gap: 20px;">
        <div style="display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h3>${activeLang} Learning Roadmap (Basic to Strong)</h3>
            <p class="tag">Master these core topics in sequence to build unshakeable coding fundamentals.</p>
          </div>
        </div>

        <div style="display: flex; flex-direction: column; gap: 14px;">
          ${topics.map((t, idx) => `
            <div class="card" style="border-left: 4px solid ${t.level === 'Basic' ? 'var(--ok)' : (t.level === 'Intermediate' ? 'var(--warm)' : 'var(--acc)')};">
              <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
                <div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="badge ${t.level === 'Basic' ? 'easy' : (t.level === 'Intermediate' ? 'medium' : 'hard')}">${t.level}</span>
                    <h4 style="font-size: 17px;">${t.title}</h4>
                  </div>
                  <p style="font-size: 14px; color: var(--mute); margin: 6px 0 0;">${t.desc}</p>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button class="ghost" onclick="DashboardView.openTopicPractice('${t.title}')">Practice Topic Questions ⚡</button>
                  <button class="btn p" onclick="navigate('lessons')">Read Lesson & Try It 📖</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  // --- SEGMENT 2: PRACTICE (100 Questions: Basic, Intermediate, Hard) ---
  renderPracticeSegment(problems, activeLang) {
    // Apply client filters
    let list = problems;
    if (this.practiceFilter.difficulty !== 'All') {
      list = list.filter(p => p.difficulty === this.practiceFilter.difficulty);
    }
    if (this.practiceFilter.search) {
      const s = this.practiceFilter.search.toLowerCase();
      list = list.filter(p => p.title.toLowerCase().includes(s) || (p.topics || []).some(t => t.toLowerCase().includes(s)));
    }

    const totalCount = list.length;
    const startIndex = (this.practiceFilter.page - 1) * this.practiceFilter.pageSize;
    const pagedList = list.slice(startIndex, startIndex + this.practiceFilter.pageSize);
    const totalPages = Math.ceil(totalCount / this.practiceFilter.pageSize);

    return `
      <div style="display: flex; flex-direction: column; gap: 16px;">
        <!-- Filters & Search Toolbar -->
        <div class="card" style="padding: 12px 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px;">
            <!-- Difficulty Chips -->
            <div class="chips" style="margin: 0;">
              ${['All', 'Easy', 'Medium', 'Hard'].map(d => `
                <button class="chip" aria-pressed="${this.practiceFilter.difficulty === d}" onclick="DashboardView.filterDifficulty('${d}')">
                  ${d === 'All' ? `All (${problems.length})` : (d === 'Easy' ? `Basic (${problems.filter(p => p.difficulty === 'Easy').length})` : (d === 'Medium' ? `Intermediate (${problems.filter(p => p.difficulty === 'Medium').length})` : `Hard (${problems.filter(p => p.difficulty === 'Hard').length})`))}
                </button>
              `).join('')}
            </div>

            <!-- Search Bar -->
            <div>
              <input type="text" placeholder="Search questions..." value="${this.practiceFilter.search}" oninput="DashboardView.searchQuestions(this.value)" style="padding: 7px 12px; border-radius: 8px; border: 1px solid var(--line); font-size: 13px; background: var(--code); color: var(--ink); width: 220px;" />
            </div>
          </div>
        </div>

        <!-- Questions Table / Grid -->
        <div class="card" style="padding: 14px 18px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 12px;">
            <b style="font-size: 14px; color: var(--mute);">Showing ${startIndex + 1}–${Math.min(startIndex + this.practiceFilter.pageSize, totalCount)} of ${totalCount} questions</b>
            <span class="tag">Page ${this.practiceFilter.page} of ${Math.max(totalPages, 1)}</span>
          </div>

          <div style="overflow-x: auto;">
            <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
              <thead>
                <tr style="border-bottom: 2px solid var(--line); text-align: left;">
                  <th style="padding: 10px 8px; width: 60px;">#</th>
                  <th style="padding: 10px 8px;">Question Title</th>
                  <th style="padding: 10px 8px; width: 120px;">Difficulty</th>
                  <th style="padding: 10px 8px; width: 140px;">Category</th>
                  <th style="padding: 10px 8px; width: 100px;">Status</th>
                  <th style="padding: 10px 8px; width: 110px; text-align: right;">Action</th>
                </tr>
              </thead>
              <tbody>
                ${pagedList.map((p, idx) => `
                  <tr style="border-bottom: 1px solid var(--line);">
                    <td style="padding: 10px 8px; color: var(--mute); font-family: monospace;">${startIndex + idx + 1}</td>
                    <td style="padding: 10px 8px;">
                      <a href="javascript:void(0)" onclick="navigate('practice', { slug: '${p.slug}' })" style="color: var(--ink); font-weight: 600; text-decoration: none;">
                        ${CodeEditor.escapeHtml(p.title)}
                      </a>
                    </td>
                    <td style="padding: 10px 8px;">
                      <span class="badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span>
                    </td>
                    <td style="padding: 10px 8px;">
                      <span class="pill" style="margin: 0;">${(p.topics || [])[0] || 'Logic'}</span>
                    </td>
                    <td style="padding: 10px 8px;">
                      ${p.isSolved ? '<span class="done">✓ Solved</span>' : '<span class="tag">Unsolved</span>'}
                    </td>
                    <td style="padding: 10px 8px; text-align: right;">
                      <button class="btn p" style="padding: 5px 12px; font-size: 12px;" onclick="navigate('practice', { slug: '${p.slug}' })">
                        ${p.isSolved ? 'Review' : 'Solve ▶'}
                      </button>
                    </td>
                  </tr>
                `).join('')}
              </tbody>
            </table>
          </div>

          <!-- Pagination Bar -->
          ${totalPages > 1 ? `
            <div style="display: flex; justify-content: center; gap: 8px; margin-top: 18px;">
              <button class="ghost" ${this.practiceFilter.page === 1 ? 'disabled' : ''} onclick="DashboardView.setPage(${this.practiceFilter.page - 1})">← Previous</button>
              ${Array.from({ length: totalPages }, (_, i) => i + 1).map(pNum => `
                <button class="ghost ${pNum === this.practiceFilter.page ? 'btn p' : ''}" style="padding: 6px 12px; min-width: 36px;" onclick="DashboardView.setPage(${pNum})">${pNum}</button>
              `).join('')}
              <button class="ghost" ${this.practiceFilter.page === totalPages ? 'disabled' : ''} onclick="DashboardView.setPage(${this.practiceFilter.page + 1})">Next →</button>
            </div>
          ` : ''}
        </div>
      </div>
    `;
  },

  filterDifficulty(diff) {
    this.practiceFilter.difficulty = diff;
    this.practiceFilter.page = 1;
    this.render();
  },

  searchQuestions(q) {
    this.practiceFilter.search = q;
    this.practiceFilter.page = 1;
    this.render();
  },

  setPage(p) {
    this.practiceFilter.page = p;
    this.render();
  },

  openTopicPractice(topicTitle) {
    this.switchSegment('practice');
    this.searchQuestions(topicTitle.split('.')[1]?.trim().split(' ')[0] || '');
  }
};
