// CodePath Interactive Lessons View (FR-L1, FR-L2, FR-L3)
const LessonsView = {
  currentLessonId: 'js-variables-scope',

  async render(params = {}) {
    const app = document.getElementById('app');
    if (params.lessonId) this.currentLessonId = params.lessonId;

    app.innerHTML = '<div class="notice">Loading lesson content...</div>';

    try {
      const res = await Store.api(`/lessons/${this.currentLessonId}`);
      const lesson = res.lesson;

      // Basic Markdown parser for headings, code blocks, lists and alerts
      const renderMarkdown = (md) => {
        let html = md
          .replace(/^### (.*$)/gim, '<h3>$1</h3>')
          .replace(/^## (.*$)/gim, '<h2>$1</h2>')
          .replace(/^# (.*$)/gim, '<h1>$1</h1>')
          .replace(/\*\*(.*?)\*\*/gim, '<b>$1</b>')
          .replace(/\*(.*?)\*/gim, '<i>$1</i>')
          .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
          .replace(/`([^`]+)`/gim, '<code>$1</code>')
          .replace(/\n\n/gim, '<br>');
        return html;
      };

      app.innerHTML = `
        <div style="display: flex; flex-direction: column; gap: 16px;">
          <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 10px;">
            <button class="ghost" onclick="navigate('tracks')">← Back to Tracks</button>
            <div style="display: flex; gap: 10px; align-items: center;">
              ${lesson.isCompleted ? '<span class="done">✓ Lesson Completed</span>' : ''}
              <button class="btn p" id="complete-btn" onclick="LessonsView.markComplete('${lesson.id}')">
                ${lesson.isCompleted ? 'Mark as Incomplete' : 'Mark as Complete ✓'}
              </button>
            </div>
          </div>

          <div class="card prose">
            ${renderMarkdown(lesson.contentMarkdown)}
          </div>

          <!-- Embedded "Try it" Sandbox (FR-L2) -->
          ${lesson.sampleCode ? `
            <div class="card" style="border-top: 3px solid var(--acc);">
              <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
                <h3>Interactive "Try It" Playground</h3>
                <span class="tag">Run this lesson's sample code in the browser</span>
              </div>
              <textarea id="lesson-try-code" style="min-height: 140px; font-family: ui-monospace, Menlo, monospace; padding: 10px; border-radius: 8px; border: 1px solid var(--line); background: var(--code); width: 100%;">${lesson.sampleCode}</textarea>
              <div class="row">
                <button class="btn p" onclick="LessonsView.runTryIt()">Run Code ▶</button>
              </div>
              <div id="lesson-try-out" class="res" style="display: none;"></div>
            </div>
          ` : ''}
        </div>
      `;
    } catch (err) {
      app.innerHTML = `<div class="res"><div class="no">Error loading lesson: ${err.message}</div></div>`;
    }
  },

  async markComplete(lessonId) {
    try {
      await Store.api(`/lessons/${lessonId}/complete`, 'POST');
      Store.toast('Lesson marked as completed! 🎉', 'success');
      this.render();
    } catch (e) {
      Store.toast('Failed to update lesson status', 'error');
    }
  },

  runTryIt() {
    const code = document.getElementById('lesson-try-code').value;
    const outEl = document.getElementById('lesson-try-out');
    outEl.style.display = 'flex';
    outEl.innerHTML = '';

    const logs = [];
    const originalLog = console.log;
    console.log = (...args) => logs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '));

    try {
      const result = new Function(code)();
      console.log = originalLog;
      outEl.innerHTML = `
        <div class="ok">
          <b>Output:</b><br>
          ${logs.length ? logs.map(l => CodeEditor.escapeHtml(l)).join('<br>') : 'Executed without console logs.'}
          ${result !== undefined ? `<br><b>Returned:</b> ${CodeEditor.escapeHtml(JSON.stringify(result))}` : ''}
        </div>
      `;
    } catch (err) {
      console.log = originalLog;
      outEl.innerHTML = `<div class="no">Error: ${CodeEditor.escapeHtml(err.message)}</div>`;
    }
  }
};
