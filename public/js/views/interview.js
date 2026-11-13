// CodePath Technical Interview Q&A Bank (FR-Q2)
const InterviewView = {
  selectedTech: 'All',
  expandedId: null,

  async render(params = {}) {
    const app = document.getElementById('app');
    app.innerHTML = '<div class="notice">Loading interview question bank...</div>';

    try {
      const res = await Store.api(`/interview?tech=${this.selectedTech}`);
      const questions = res.questions || [];

      app.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: flex-start; flex-wrap: wrap; gap: 12px;">
            <div>
              <h2>Technical Interview Q&A Bank</h2>
              <p class="tag">Curated questions, model answers, and follow-ups asked by top engineering hiring managers.</p>
            </div>
          </div>

          <!-- Technology Filter Chips -->
          <div class="chips">
            ${['All', 'JavaScript', 'React', 'Python', 'C#', '.NET', 'SQL'].map(t => `
              <button class="chip" aria-pressed="${this.selectedTech === t}" onclick="InterviewView.filterTech('${t}')">${t}</button>
            `).join('')}
          </div>

          <!-- Questions List -->
          <div style="display: flex; flex-direction: column; gap: 12px;">
            ${questions.map((q, idx) => `
              <div class="card" style="border-left: 4px solid var(--acc);">
                <div style="display: flex; justify-content: space-between; align-items: center; cursor: pointer;" onclick="InterviewView.toggleExpand('${q.id}')">
                  <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="font-weight: 700; color: var(--mute);">Q${idx + 1}.</span>
                    <h4 style="font-size: 16px;">${CodeEditor.escapeHtml(q.question)}</h4>
                  </div>
                  <div style="display: flex; align-items: center; gap: 8px;">
                    <span class="pill">${q.technology}</span>
                    <span class="badge ${q.difficulty.toLowerCase().includes('junior') ? 'easy' : 'medium'}">${q.difficulty}</span>
                    <span style="font-size: 14px; color: var(--mute);">${this.expandedId === q.id ? '▲' : '▼'}</span>
                  </div>
                </div>

                ${this.expandedId === q.id ? `
                  <div style="margin-top: 14px; padding-top: 12px; border-top: 1px solid var(--line);">
                    <div class="prose">
                      ${LessonsView.renderMarkdown ? LessonsView.renderMarkdown(q.answerMarkdown) : q.answerMarkdown}
                    </div>

                    ${(q.followUps || []).length > 0 ? `
                      <div style="margin-top: 14px; padding: 12px; border-radius: 8px; background: var(--code); border: 1px dashed var(--line);">
                        <b style="color: var(--warm); font-size: 13px; text-transform: uppercase;">Follow-Up Questions You Might Get:</b>
                        <ul style="margin: 8px 0 0 20px; padding: 0; font-size: 14px;">
                          ${q.followUps.map(f => `<li>${CodeEditor.escapeHtml(f)}</li>`).join('')}
                        </ul>
                      </div>
                    ` : ''}
                  </div>
                ` : ''}
              </div>
            `).join('')}
          </div>
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Error loading interview questions: ${err.message}</div></div>`;
    }
  },

  filterTech(tech) {
    this.selectedTech = tech;
    this.render();
  },

  toggleExpand(qId) {
    this.expandedId = this.expandedId === qId ? null : qId;
    this.render();
  }
};
