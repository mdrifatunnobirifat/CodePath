// SQL Query Result Formatter & Table Renderer
const SqlEngine = {
  renderTable(rows) {
    if (!rows || !Array.isArray(rows) || rows.length === 0) {
      return '<div class="res"><div class="no">No records returned or empty query.</div></div>';
    }

    const headers = Object.keys(rows[0]);
    let html = `
      <div style="overflow-x: auto; margin-top: 8px;">
        <table style="width: 100%; border-collapse: collapse; font-size: 13px; font-family: ui-monospace, Menlo, monospace;">
          <thead>
            <tr style="background: var(--code); border-bottom: 2px solid var(--line);">
              ${headers.map(h => `<th style="padding: 8px 12px; text-align: left; color: var(--mute);">${h}</th>`).join('')}
            </tr>
          </thead>
          <tbody>
            ${rows.map(r => `
              <tr style="border-bottom: 1px solid var(--line);">
                ${headers.map(h => `<td style="padding: 8px 12px;">${r[h] !== undefined ? r[h] : 'NULL'}</td>`).join('')}
              </tr>
            `).join('')}
          </tbody>
        </table>
      </div>
    `;
    return html;
  }
};
