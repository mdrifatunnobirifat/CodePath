// CodePath Practice Workspace (FR-P1 to FR-P11, FR-F1 to FR-F3, FR-B1 to FR-B4, SEC-7)
const PracticeView = {
  selectedSlug: 'sum-even',
  activeProblem: null,
  editorInstance: null,
  filters: {
    language: 'All',
    difficulty: 'All',
    status: 'All',
    search: ''
  },
  hintLevel: 0,
  unlockedHints: [],
  testResults: null,

  async render(params = {}) {
    const app = document.getElementById('app');
    if (params.slug) this.selectedSlug = params.slug;

    app.innerHTML = '<div class="notice">Loading coding workspace...</div>';

    try {
      // 1. Fetch filtered problem list
      const queryParams = new URLSearchParams({
        language: this.filters.language,
        difficulty: this.filters.difficulty,
        status: this.filters.status,
        search: this.filters.search
      });
      const listData = await Store.api(`/problems?${queryParams.toString()}`);
      const problems = listData.problems;

      // 2. Fetch active problem
      if (!problems.some(p => p.slug === this.selectedSlug) && problems.length > 0) {
        this.selectedSlug = problems[0].slug;
      }

      const activeRes = await Store.api(`/problems/${this.selectedSlug}`);
      this.activeProblem = activeRes.problem;

      app.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 14px;">
          <!-- Filter Controls -->
          <div class="card" style="padding: 12px 18px;">
            <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
              <div class="chips" style="margin: 0;">
                ${['All', 'JavaScript', 'React', 'Python', 'PHP', 'C#', 'SQL'].map(lang => `
                  <button class="chip" aria-pressed="${this.filters.language === lang}" onclick="PracticeView.setFilter('language', '${lang}')">${lang}</button>
                `).join('')}
              </div>
              <div style="display: flex; gap: 8px; align-items: center;">
                <input type="text" placeholder="Search problems or topics..." value="${this.filters.search}" oninput="PracticeView.setFilter('search', this.value)" style="padding: 6px 12px; border-radius: 8px; border: 1px solid var(--line); font-size: 13px; background: var(--code); color: var(--ink);" />
                <select onchange="PracticeView.setFilter('difficulty', this.value)" style="padding: 6px 10px; border-radius: 8px; border: 1px solid var(--line); font-size: 13px; background: var(--code); color: var(--ink);">
                  <option value="All" ${this.filters.difficulty === 'All' ? 'selected' : ''}>All Difficulties</option>
                  <option value="Easy" ${this.filters.difficulty === 'Easy' ? 'selected' : ''}>Easy</option>
                  <option value="Medium" ${this.filters.difficulty === 'Medium' ? 'selected' : ''}>Medium</option>
                  <option value="Hard" ${this.filters.difficulty === 'Hard' ? 'selected' : ''}>Hard</option>
                </select>
              </div>
            </div>
          </div>

          <!-- 2-Column Split Workspace -->
          <div class="work">
            <!-- Left Pane: Problem Directory -->
            <aside class="card">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <h3>Problems (${problems.length})</h3>
              </div>
              <div class="plist">
                ${problems.length ? problems.map(p => `
                  <button data-slug="${p.slug}" aria-current="${p.slug === this.selectedSlug}" onclick="PracticeView.selectProblem('${p.slug}')">
                    <span>
                      <b>${CodeEditor.escapeHtml(p.title)}</b><br>
                      <span class="tag"><span class="badge ${p.difficulty.toLowerCase()}">${p.difficulty}</span> · ${p.language}</span>
                    </span>
                    ${p.isSolved ? '<span class="done">✓ Solved</span>' : ''}
                  </button>
                `).join('') : '<p class="tag" style="padding: 10px;">No problems match filters.</p>'}
              </div>
            </aside>

            <!-- Right Pane: Active Problem Workspace -->
            <section class="card" id="practice-workspace">
              <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 10px;">
                <div>
                  <h2>${CodeEditor.escapeHtml(this.activeProblem.title)}</h2>
                  <div style="margin-top: 6px;">
                    <span class="badge ${this.activeProblem.difficulty.toLowerCase()}">${this.activeProblem.difficulty}</span>
                    <span class="pill">${this.activeProblem.language}</span>
                    ${(this.activeProblem.topics || []).map(t => `<span class="pill">${t}</span>`).join('')}
                    ${this.activeProblem.isSolved ? '<span class="pill" style="color: var(--ok); font-weight: bold;">Solved ✓</span>' : ''}
                  </div>
                </div>
                <div style="display: flex; gap: 8px;">
                  <button class="ghost" id="reset-code-btn" onclick="PracticeView.resetStarterCode()">Reset Code</button>
                </div>
              </div>

              <!-- Problem Description -->
              <div class="prose" style="margin-top: 14px; padding-bottom: 12px; border-bottom: 1px solid var(--line);">
                ${this.renderDescription(this.activeProblem.descriptionMarkdown)}
              </div>

              <!-- Frontend Live Preview if React / DOM Challenge -->
              ${this.activeProblem.type?.startsWith('frontend') ? `
                <div id="frontend-preview-mount"></div>
              ` : ''}

              <!-- Editor Mount Point -->
              <div id="code-editor-mount"></div>

              <!-- Actions & Hints Row -->
              <div class="row" style="justify-content: space-between;">
                <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                  <button class="btn p" id="run-btn" onclick="PracticeView.runCode()">Run Tests (Ctrl+Enter)</button>
                  <button class="btn success" id="submit-btn" onclick="PracticeView.submitCode()">Submit Solution (Ctrl+Shift+Enter)</button>
                  <button class="btn" id="hint-btn" onclick="PracticeView.revealNextHint()">
                    💡 Hint (${this.hintLevel}/${this.activeProblem.totalHints})
                  </button>
                </div>
                <div>
                  ${this.activeProblem.isSolved || this.hintLevel >= 3 ? `
                    <button class="ghost" onclick="PracticeView.toggleSolution()">
                      ${this.showSolution ? 'Hide Solution' : 'View Reference Solution 🔓'}
                    </button>
                  ` : ''}
                </div>
              </div>

              <!-- Progressive Hints Drawer -->
              <div id="hints-drawer"></div>

              <!-- Reference Solution Container -->
              <div id="solution-container" style="display: none;"></div>

              <!-- Output & Test Results Panel -->
              <div id="results-panel">
                <p class="tag">Press Run tests (Ctrl+Enter) to evaluate against sample test cases.</p>
              </div>
            </section>
          </div>
        </div>
      `;

      // 3. Mount Code Editor
      this.mountEditor();

      // 4. Mount Frontend Preview if applicable
      if (this.activeProblem.type?.startsWith('frontend')) {
        FrontendRunner.renderPreview('frontend-preview-mount', this.editorInstance.getValue(), this.activeProblem.type);
      }
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Error loading practice workspace: ${err.message}</div></div>`;
    }
  },

  mountEditor() {
    this.editorInstance = CodeEditor.render('code-editor-mount', this.activeProblem.draftCode || this.activeProblem.starterCode, {
      language: this.activeProblem.language,
      onRun: () => this.runCode(),
      onSubmit: () => this.submitCode(),
      onChange: (code) => {
        // Debounce autosave
        Store.api(`/problems/${this.activeProblem.slug}/draft`, 'PUT', { code });
        if (this.activeProblem.type?.startsWith('frontend')) {
          FrontendRunner.renderPreview('frontend-preview-mount', code, this.activeProblem.type);
        }
      }
    });
  },

  async selectProblem(slug) {
    this.selectedSlug = slug;
    this.hintLevel = 0;
    this.unlockedHints = [];
    this.showSolution = false;
    this.testResults = null;
    this.render();
  },

  setFilter(key, val) {
    this.filters[key] = val;
    this.render();
  },

  resetStarterCode() {
    if (confirm('Reset code back to original starter template?')) {
      this.editorInstance.setValue(this.activeProblem.starterCode);
      Store.api(`/problems/${this.activeProblem.slug}/draft`, 'PUT', { code: this.activeProblem.starterCode });
      Store.toast('Code reset to starter template');
      if (this.activeProblem.type?.startsWith('frontend')) {
        FrontendRunner.renderPreview('frontend-preview-mount', this.activeProblem.starterCode, this.activeProblem.type);
      }
    }
  },

  async revealNextHint() {
    try {
      const res = await Store.api(`/problems/${this.activeProblem.slug}/hint`, 'POST', { currentLevel: this.hintLevel });
      this.hintLevel = res.level;
      this.unlockedHints = res.hints;

      const drawer = document.getElementById('hints-drawer');
      drawer.innerHTML = this.unlockedHints.map((h, i) => `
        <div class="hint">
          <b>Hint ${i + 1}:</b> ${CodeEditor.escapeHtml(h)}
        </div>
      `).join('');

      document.getElementById('hint-btn').textContent = `💡 Hint (${this.hintLevel}/${this.activeProblem.totalHints})`;

      if (this.hintLevel >= 3) {
        Store.toast('All hints revealed! Reference solution is now unlocked.', 'info');
        this.render();
      }
    } catch (e) {
      Store.toast('No more hints available');
    }
  },

  async toggleSolution() {
    const solContainer = document.getElementById('solution-container');
    this.showSolution = !this.showSolution;
    if (this.showSolution) {
      solContainer.style.display = 'block';
      const sol = this.activeProblem.solutionMarkdown || 'Reference solution unlocked upon completion.';
      solContainer.innerHTML = `
        <div class="solution-box">
          <h4>Reference Solution & Explanation:</h4>
          <div class="prose" style="margin-top: 8px;">
            ${this.renderDescription(sol)}
          </div>
        </div>
      `;
    } else {
      solContainer.style.display = 'none';
    }
  },

  async runCode() {
    const code = this.editorInstance.getValue();
    const resPanel = document.getElementById('results-panel');
    resPanel.innerHTML = '<div class="notice">Executing code in sandbox...</div>';

    try {
      if (this.activeProblem.type?.startsWith('frontend')) {
        // Live client-side DOM assertions
        const checkResults = await FrontendRunner.runChecks('frontend-preview-mount', this.activeProblem.frontendChecks || []);
        this.renderResults(checkResults.results, checkResults.passed);
      } else {
        const res = await Store.api(`/problems/${this.activeProblem.slug}/run`, 'POST', {
          code,
          language: this.activeProblem.language
        });
        this.renderResults(res.results || [], res.passed, res.logs, res.error);
      }
    } catch (err) {
      resPanel.innerHTML = `<div class="res"><div class="no">Execution failed: ${err.message}</div></div>`;
    }
  },

  async submitCode() {
    const code = this.editorInstance.getValue();
    const resPanel = document.getElementById('results-panel');
    resPanel.innerHTML = '<div class="notice">Submitting solution against visible and hidden test suites...</div>';

    try {
      let clientPassed = true;
      if (this.activeProblem.type?.startsWith('frontend')) {
        const checkRes = await FrontendRunner.runChecks('frontend-preview-mount', this.activeProblem.frontendChecks || []);
        clientPassed = checkRes.passed;
        if (!clientPassed) {
          this.renderResults(checkRes.results, false);
          return;
        }
      }

      const res = await Store.api(`/problems/${this.activeProblem.slug}/submit`, 'POST', {
        code,
        language: this.activeProblem.language,
        clientPassed
      });

      if (res.isAccepted) {
        Store.toast('🎉 Accepted! All tests passed! Streak updated.', 'success');
        this.activeProblem.isSolved = true;
        this.render();
      } else {
        resPanel.innerHTML = `
          <div class="res">
            <div class="no">
              <b>Submission Status: ${res.status}</b><br>
              Passed ${res.passedCount} of ${res.totalCount} tests.
              Review test failures and check edge cases.
            </div>
          </div>
        `;
      }
    } catch (err) {
      resPanel.innerHTML = `<div class="res"><div class="no">Submission failed: ${err.message}</div></div>`;
    }
  },

  renderResults(results, allPassed, logs = [], error = null) {
    const resPanel = document.getElementById('results-panel');
    if (error) {
      resPanel.innerHTML = `<div class="res"><div class="no">${CodeEditor.escapeHtml(error)}</div></div>`;
      return;
    }

    const passedCount = results.filter(r => r.ok).length;
    resPanel.innerHTML = `
      <h3 style="margin-top: 12px; color: ${allPassed ? 'var(--ok)' : 'var(--bad)'};">
        ${allPassed ? '✓ All sample tests passed' : `${passedCount} of ${results.length} tests passed`}
      </h3>
      <div class="res">
        ${results.map(r => `
          <div class="${r.ok ? 'ok' : 'no'}">
            <b>${r.ok ? '✓ PASS' : '✗ FAIL'}</b>: 
            Input: <code>${CodeEditor.escapeHtml(JSON.stringify(r.input))}</code> | 
            Expected: <code>${CodeEditor.escapeHtml(JSON.stringify(r.expected))}</code> | 
            Got: <code>${CodeEditor.escapeHtml(JSON.stringify(r.got))}</code>
            ${r.runtimeMs !== undefined ? `<span class="tag" style="float: right;">${r.runtimeMs} ms</span>` : ''}
          </div>
        `).join('')}
      </div>
      ${logs && logs.length > 0 ? `
        <div style="margin-top: 10px; padding: 8px 12px; background: var(--code); border-radius: 6px; font-family: monospace; font-size: 13px;">
          <b>Standard Output:</b><br>${logs.map(l => CodeEditor.escapeHtml(l)).join('<br>')}
        </div>
      ` : ''}
    `;
  },

  renderDescription(md) {
    if (!md) return '';
    return md
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/^#### (.*$)/gim, '<h4>$1</h4>')
      .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
      .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
      .replace(/`([^`]+)`/gim, '<code>$1</code>')
      .replace(/\n\n/gim, '<br>');
  }
};
