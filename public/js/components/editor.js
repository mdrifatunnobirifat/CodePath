// CodePath Custom In-Browser Code Editor Component
const CodeEditor = {
  render(containerId, initialCode, options = {}) {
    const container = document.getElementById(containerId);
    if (!container) return;

    const lang = options.language || 'JavaScript';
    const onRun = options.onRun || (() => {});
    const onSubmit = options.onSubmit || (() => {});
    const onChange = options.onChange || (() => {});

    container.innerHTML = `
      <div class="editor-container">
        <div class="editor-toolbar">
          <span><b>${lang}</b> Editor · Autosaving draft</span>
          <span class="tag">Run: <b>Ctrl+Enter</b> · Submit: <b>Ctrl+Shift+Enter</b></span>
        </div>
        <div class="editor-wrapper">
          <div class="line-numbers" id="${containerId}-lines">1</div>
          <textarea class="code-ed" id="${containerId}-textarea" spellcheck="false">${this.escapeHtml(initialCode || '')}</textarea>
        </div>
      </div>
    `;

    const ed = document.getElementById(`${containerId}-textarea`);
    const linesEl = document.getElementById(`${containerId}-lines`);

    const updateLineNumbers = () => {
      const lineCount = ed.value.split('\n').length;
      linesEl.innerHTML = Array.from({ length: Math.max(lineCount, 1) }, (_, i) => i + 1).join('<br>');
    };

    updateLineNumbers();

    // Tab key indentation handling
    ed.addEventListener('keydown', (e) => {
      if (e.key === 'Tab' && !e.shiftKey) {
        e.preventDefault();
        const start = ed.selectionStart;
        const end = ed.selectionEnd;
        ed.setRangeText('  ', start, end, 'end');
        updateLineNumbers();
        onChange(ed.value);
      }

      // Run Shortcut: Ctrl+Enter or Cmd+Enter
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && !e.shiftKey) {
        e.preventDefault();
        onRun(ed.value);
      }

      // Submit Shortcut: Ctrl+Shift+Enter
      if (e.key === 'Enter' && (e.ctrlKey || e.metaKey) && e.shiftKey) {
        e.preventDefault();
        onSubmit(ed.value);
      }
    });

    let debounceTimer;
    ed.addEventListener('input', () => {
      updateLineNumbers();
      clearTimeout(debounceTimer);
      debounceTimer = setTimeout(() => {
        onChange(ed.value);
      }, 500);
    });

    return {
      getValue: () => ed.value,
      setValue: (val) => {
        ed.value = val;
        updateLineNumbers();
        onChange(val);
      }
    };
  },

  escapeHtml(str) {
    return String(str).replace(/[&<>"']/g, c => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#39;'
    }[c]));
  }
};
