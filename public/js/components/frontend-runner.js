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

    let htmlContent = '';
    if (type === 'frontend-react') {
      htmlContent = `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1">
          <style>
            * { box-sizing: border-box; }
            body {
              font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
              margin: 0;
              padding: 16px;
              color: #1e293b;
              background: #ffffff;
              line-height: 1.5;
            }
            h1, h2, h3, h4, h5, h6 { margin-top: 0; color: #0f172a; }
            button {
              background: #0E7C7B;
              color: #ffffff;
              border: none;
              padding: 8px 16px;
              border-radius: 6px;
              cursor: pointer;
              font-weight: 600;
              font-size: 13.5px;
              margin: 4px;
              transition: background 0.15s ease;
            }
            button:hover { background: #0b6362; }
            button:active { transform: scale(0.98); }
            input, select, textarea {
              border: 1px solid #cbd5e1;
              padding: 8px 12px;
              border-radius: 6px;
              font-size: 14px;
              margin: 4px 0;
              outline: none;
            }
            input:focus, select:focus, textarea:focus {
              border-color: #0E7C7B;
              box-shadow: 0 0 0 2px rgba(14, 124, 123, 0.2);
            }
            .p-4 { padding: 16px; }
            .card, .counter-card {
              border: 1px solid #e2e8f0;
              padding: 16px;
              border-radius: 8px;
              background: #f8fafc;
              margin-bottom: 12px;
            }
          </style>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react/18.3.1/umd/react.production.min.js" onerror="this.onerror=null;this.src='https://unpkg.com/react@18/umd/react.production.min.js';"><\/script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/react-dom/18.3.1/umd/react-dom.production.min.js" onerror="this.onerror=null;this.src='https://unpkg.com/react-dom@18/umd/react-dom.production.min.js';"><\/script>
          <script src="https://cdnjs.cloudflare.com/ajax/libs/babel-standalone/7.24.7/babel.min.js" onerror="this.onerror=null;this.src='https://unpkg.com/@babel/standalone/babel.min.js';"><\/script>
        </head>
        <body>
          <div id="root">
            <div style="display:flex;align-items:center;gap:8px;color:#64748b;font-size:13px;padding:12px;">
              <span>⏳</span> Loading React component preview...
            </div>
          </div>
          <script>
            (function() {
              var userCode = ${JSON.stringify(code)};

              function executeComponent() {
                if (!window.React || !window.ReactDOM || !window.Babel) {
                  setTimeout(executeComponent, 35);
                  return;
                }

                var rootEl = document.getElementById('root');

                try {
                  // Transform JSX with Babel Standalone
                  var compiled = Babel.transform(userCode, {
                    presets: ['react'],
                    filename: 'preview.jsx'
                  }).code;

                  // Find candidate component identifiers (e.g. Component30, Counter, Accordion)
                  var matchResults = [...userCode.matchAll(/(?:function|class|const|let|var)\\s+([A-Z][a-zA-Z0-9_]*)/g)];
                  var detectedName = matchResults.length > 0 ? matchResults[matchResults.length - 1][1] : '';

                  var runner = new Function('React', 'ReactDOM',
                    compiled + '\\n' +
                    (detectedName ? 'if (typeof ' + detectedName + ' === "function") return ' + detectedName + ';\\n' : '') +
                    'if (typeof Component30 === "function") return Component30;\\n' +
                    'if (typeof Counter === "function") return Counter;\\n' +
                    'if (typeof Accordion === "function") return Accordion;\\n' +
                    'if (typeof App === "function") return App;\\n' +
                    'return null;'
                  );

                  var Component = runner(window.React, window.ReactDOM);

                  if (Component) {
                    if (!window.__reactRoot) {
                      window.__reactRoot = ReactDOM.createRoot(rootEl);
                    }
                    window.__reactRoot.render(React.createElement(Component));
                  } else {
                    rootEl.innerHTML = '<div style="padding: 20px; text-align: center; color: #64748b;">' +
                      '<div style="font-size: 24px; margin-bottom: 6px;">⚛️</div>' +
                      '<b>React Component Ready</b><br>' +
                      '<small style="font-size: 12px;">Define your component function to preview it live.</small>' +
                      '</div>';
                  }
                } catch (err) {
                  rootEl.innerHTML = '<div style="color: #b91c1c; background: #fef2f2; border: 1px solid #fecaca; border-radius: 6px; padding: 12px; font-family: monospace; font-size: 12.5px; white-space: pre-wrap;"><b>Preview Render Error:</b>\\n' + (err.message || String(err)) + '</div>';
                }
              }

              if (document.readyState === 'complete' || document.readyState === 'interactive') {
                executeComponent();
              } else {
                window.addEventListener('load', executeComponent);
              }
            })();
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

    try {
      iframe.srcdoc = htmlContent;
    } catch (e) {
      const doc = iframe.contentDocument || iframe.contentWindow.document;
      doc.open();
      doc.write(htmlContent);
      doc.close();
    }
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

