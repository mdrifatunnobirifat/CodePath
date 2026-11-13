// Frontend Live Preview & Automated DOM/React Test Runner (FR-F1, FR-F2, FR-F3)
const FrontendRunner = {
  renderPreview(containerId, code, type = 'frontend-react') {
    const container = document.getElementById(containerId);
    if (!container) return;

    container.innerHTML = `
      <div class="preview-container">
        <div class="preview-bar">
          <span>Live Interactive Preview (${type === 'frontend-react' ? 'React Component' : 'HTML/CSS/JS'})</span>
          <span class="tag">Sandboxed Preview</span>
        </div>
        <iframe id="${containerId}-frame" class="preview-frame" sandbox="allow-scripts allow-modals allow-same-origin"></iframe>
      </div>
    `;

    const iframe = document.getElementById(`${containerId}-frame`);
    const doc = iframe.contentDocument || iframe.contentWindow.document;

    let htmlContent = '';
    if (type === 'frontend-react') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>
            body { font-family: system-ui, sans-serif; margin: 16px; color: #14213D; }
            button { background: #0E7C7B; color: #fff; border: 0; padding: 8px 14px; border-radius: 6px; cursor: pointer; font-weight: 600; margin: 4px; }
            button:hover { opacity: 0.9; }
            .counter-card { border: 1px solid #D5DDE7; padding: 16px; border-radius: 8px; background: #F7F9FC; }
          </style>
          <script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>
          <script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>
          <script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>
        </head>
        <body>
          <div id="root"></div>
          <script type="text/babel">
            try {
              ${code}
              const comp = typeof Counter !== 'undefined' ? Counter : (typeof Accordion !== 'undefined' ? Accordion : null);
              if (comp) {
                ReactDOM.createRoot(document.getElementById('root')).render(React.createElement(comp));
              }
            } catch (err) {
              document.getElementById('root').innerHTML = '<div style="color:red; font-family:monospace;">Render Error: ' + err.message + '</div>';
            }
          <\/script>
        </body>
        </html>
      `;
    } else {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <style>body { font-family: system-ui, sans-serif; margin: 16px; color: #14213D; }</style>
        </head>
        <body>
          ${code}
        </body>
        </html>
      `;
    }

    doc.open();
    doc.write(htmlContent);
    doc.close();
  },

  async runChecks(containerId, frontendChecks = []) {
    const iframe = document.getElementById(`${containerId}-frame`);
    if (!iframe) return { passed: false, results: [] };

    // Wait 300ms for iframe render
    await new Promise(r => setTimeout(r, 350));

    const iwin = iframe.contentWindow;
    const idoc = iframe.contentDocument || iwin.document;
    const results = [];

    for (const check of frontendChecks) {
      try {
        const assert = (condition) => {
          if (!condition) throw new Error('Assertion failed');
        };
        const testFn = new Function('document', 'window', 'assert', check.test);
        testFn.call(iwin, idoc, iwin, assert);

        results.push({
          ok: true,
          input: [check.name],
          expected: 'Passed',
          got: 'Passed'
        });
      } catch (err) {
        results.push({
          ok: false,
          input: [check.name],
          expected: 'Passed',
          got: `Failed: ${err.message}`
        });
      }
    }

    const allPassed = results.length > 0 && results.every(r => r.ok);
    return { passed: allPassed, results };
  }
};

