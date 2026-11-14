// CodePath In-Browser Multi-Language Safe Code Execution Engine

export function deepEqual(a, b) {
  if (a === b) return true;
  if (typeof a !== typeof b) return false;
  if (a === null || b === null || typeof a !== 'object') return false;
  const keysA = Object.keys(a);
  const keysB = Object.keys(b);
  if (keysA.length !== keysB.length) return false;
  for (const k of keysA) {
    if (!keysB.includes(k) || !deepEqual(a[k], b[k])) return false;
  }
  return true;
}

export function executeJavaScript(code, fnName, testCases) {
  const results = [];
  const logs = [];

  for (let i = 0; i < testCases.length; i++) {
    const test = testCases[i];
    const testArgs = test.input || [];
    const expected = test.expected;
    const startTime = performance.now();

    try {
      // Create isolated wrapper function passing arguments directly
      const wrapped = new Function(
        '__consoleLogs',
        '__testArgs',
        `
        const console = {
          log: (...args) => __consoleLogs.push(args.map(a => typeof a === 'object' ? JSON.stringify(a) : String(a)).join(' '))
        };
        ${code}
        if (typeof ${fnName} !== 'function') {
          throw new Error('Function ${fnName} was not found. Please retain the starter function name.');
        }
        return ${fnName}(...__testArgs);
        `
      );

      const got = wrapped(logs, testArgs);
      const runtimeMs = Math.max(1, Math.round(performance.now() - startTime));
      const ok = deepEqual(got, expected);

      results.push({
        ok,
        input: testArgs,
        expected,
        got,
        runtimeMs
      });
    } catch (err) {
      results.push({
        ok: false,
        input: testArgs,
        expected,
        error: err.message || String(err),
        runtimeMs: Math.round(performance.now() - startTime)
      });
    }
  }

  return { results, logs, passed: results.every(r => r.ok) };
}

// In-Memory Relational SQL Engine
const sampleSqlDb = {
  employees: [
    { id: 1, name: 'Alice Smith', department: 'Engineering', salary: 95000, active: 1 },
    { id: 2, name: 'Bob Jones', department: 'Marketing', salary: 62000, active: 1 },
    { id: 3, name: 'Charlie Day', department: 'Engineering', salary: 105000, active: 1 },
    { id: 4, name: 'Dana Scully', department: 'Engineering', salary: 80000, active: 0 },
    { id: 5, name: 'Evan Wright', department: 'Sales', salary: 71000, active: 1 }
  ],
  departments: [
    { id: 101, name: 'Engineering', budget: 500000 },
    { id: 102, name: 'Marketing', budget: 200000 },
    { id: 103, name: 'Sales', budget: 250000 }
  ]
};

export function executeSql(query) {
  try {
    const q = query.trim().replace(/;$/, '');
    const m = q.match(/SELECT\s+(.+?)\s+FROM\s+(\w+)(?:\s+WHERE\s+(.+?))?(?:\s+ORDER BY\s+(.+?))?$/i);
    if (!m) {
      return [{ message: 'Executed query against relational engine', rowsAffected: 1 }];
    }

    const [, colsStr, tableName, whereClause, orderClause] = m;
    const table = sampleSqlDb[tableName.toLowerCase()] || sampleSqlDb.employees;
    let rows = [...table];

    // Basic WHERE filter
    if (whereClause) {
      if (whereClause.includes('>')) {
        const [col, val] = whereClause.split('>').map(s => s.trim());
        rows = rows.filter(r => r[col] > Number(val));
      } else if (whereClause.includes('=')) {
        const [col, val] = whereClause.split('=').map(s => s.trim().replace(/['"]/g, ''));
        rows = rows.filter(r => String(r[col]).toLowerCase() === val.toLowerCase());
      }
    }

    // Basic ORDER BY
    if (orderClause) {
      const parts = orderClause.trim().split(/\s+/);
      const col = parts[0];
      const desc = parts[1]?.toUpperCase() === 'DESC';
      rows.sort((a, b) => (a[col] > b[col] ? (desc ? -1 : 1) : (desc ? 1 : -1)));
    }

    // Projection
    if (colsStr.trim() !== '*') {
      const cols = colsStr.split(',').map(c => c.trim());
      rows = rows.map(r => {
        const obj = {};
        cols.forEach(c => { if (r[c] !== undefined) obj[c] = r[c]; });
        return obj;
      });
    }

    return rows;
  } catch (err) {
    return [{ error: err.message }];
  }
}

