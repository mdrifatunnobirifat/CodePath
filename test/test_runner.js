const assert = require('assert');
const http = require('http');
const server = require('../server.js');

const TEST_PORT = 3001;
let passCount = 0;
let failCount = 0;

function test(name, fn) {
  try {
    fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

async function asyncTest(name, fn) {
  try {
    await fn();
    console.log(`  ✓ ${name}`);
    passCount++;
  } catch (err) {
    console.error(`  ✗ ${name}`);
    console.error(`    ${err.message}`);
    failCount++;
  }
}

function request(method, path, body = null, headers = {}) {
  return new Promise((resolve, reject) => {
    const postData = body ? JSON.stringify(body) : '';
    const req = http.request({
      hostname: 'localhost',
      port: TEST_PORT,
      path,
      method,
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData),
        ...headers
      }
    }, res => {
      let resData = '';
      res.on('data', chunk => resData += chunk);
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, data: resData ? JSON.parse(resData) : {} });
        } catch (e) {
          resolve({ status: res.statusCode, data: resData });
        }
      });
    });
    req.on('error', reject);
    if (postData) req.write(postData);
    req.end();
  });
}

async function runAllTests() {
  console.log('\n--- Running CodePath Test Suite ---\n');

  // Unit Test 1: Streak calculation logic
  test('Streak Calculation: increments on consecutive days', () => {
    const calculateStreak = (lastDate, today, currentStreak) => {
      const yesterday = new Date(Date.parse(today) - 864e5).toISOString().slice(0, 10);
      if (lastDate === today) return currentStreak;
      if (lastDate === yesterday) return currentStreak + 1;
      return 1;
    };
    assert.strictEqual(calculateStreak('2026-11-12', '2026-11-13', 3), 4);
    assert.strictEqual(calculateStreak('2026-11-13', '2026-11-13', 4), 4);
    assert.strictEqual(calculateStreak('2026-11-10', '2026-11-13', 4), 1);
  });

  // Unit Test 2: Deep equality comparison for test cases
  test('Test Case Runner: compares primitive and complex values', () => {
    const isDeepEqual = (a, b) => JSON.stringify(a) === JSON.stringify(b);
    assert.strictEqual(isDeepEqual([0, 1], [0, 1]), true);
    assert.strictEqual(isDeepEqual([0, 1], [1, 0]), false);
    assert.strictEqual(isDeepEqual({ a: 1 }, { a: 1 }), true);
  });

  // Unit Test 3: Spaced repetition stage scheduler
  test('Spaced Repetition: computes intervals (1 -> 3 -> 7 -> 14 days)', () => {
    const getNextInterval = (stage) => {
      if (stage === 1) return 3;
      if (stage === 2) return 7;
      return 14;
    };
    assert.strictEqual(getNextInterval(1), 3);
    assert.strictEqual(getNextInterval(2), 7);
    assert.strictEqual(getNextInterval(3), 14);
  });

  // Integration Test 1: GET /api/me returns current user
  await asyncTest('Integration: GET /api/me returns user profile', async () => {
    const res = await request('GET', '/api/me');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.user);
    assert.ok(res.data.profile);
  });

  // Integration Test 2: GET /api/tracks returns track hierarchy
  await asyncTest('Integration: GET /api/tracks returns Frontend, Backend, Fullstack', async () => {
    const res = await request('GET', '/api/tracks');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data.tracks));
    assert.ok(res.data.tracks.length >= 3);
  });

  // Integration Test 3: GET /api/problems lists problems without leaking hidden tests (SEC-7)
  await asyncTest('Integration: GET /api/problems honors SEC-7 (no hidden tests)', async () => {
    const res = await request('GET', '/api/problems');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data.problems));
    assert.strictEqual(res.data.problems[0].hiddenTests, undefined);
  });

  // Integration Test 4: POST /api/problems/:slug/run executes visible tests
  await asyncTest('Integration: POST /api/problems/javascript-p1-sum-two-numbers/run executes JS safely', async () => {
    const res = await request('POST', '/api/problems/javascript-p1-sum-two-numbers/run', {
      code: 'function add(a, b) { return a + b; }',
      language: 'JavaScript'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.passed, true);
    assert.ok(res.data.results.length >= 2);
  });

  // Integration Test 5: Infinite loop protection in JS sandbox
  await asyncTest('Integration: Infinite loop halted safely with timeout message', async () => {
    const res = await request('POST', '/api/problems/javascript-p1-sum-two-numbers/run', {
      code: 'function add(a, b) { while(true) {} }',
      language: 'JavaScript'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.passed, false);
    assert.ok(res.data.results[0].got.includes('Script execution timed out') || res.data.results[0].got.includes('Runtime Error'));
  });

  // Integration Test 6: POST /api/problems/:slug/submit validates both visible and hidden tests
  await asyncTest('Integration: POST /api/problems/javascript-p1-sum-two-numbers/submit passes all tests', async () => {
    const res = await request('POST', '/api/problems/javascript-p1-sum-two-numbers/submit', {
      code: 'function add(a, b) { return a + b; }',
      language: 'JavaScript'
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.status, 'Accepted');
    assert.strictEqual(res.data.isAccepted, true);
  });

  // Integration Test 7: GET /api/dashboard returns stats and today plan
  await asyncTest('Integration: GET /api/dashboard returns plan and stats', async () => {
    const res = await request('GET', '/api/dashboard');
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.stats);
    assert.ok(Array.isArray(res.data.todayPlan));
  });

  // Integration Test 8: GET /api/jobs returns job board listings
  await asyncTest('Integration: GET /api/jobs filters by remote and tech', async () => {
    const res = await request('GET', '/api/jobs?tech=React&remote=true');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data.jobs));
    res.data.jobs.forEach(j => {
      assert.strictEqual(j.isRemote, true);
      assert.ok(j.technologies.includes('React'));
    });
  });

  // Integration Test 9: GET /api/interview returns interview questions
  await asyncTest('Integration: GET /api/interview returns questions & model answers', async () => {
    const res = await request('GET', '/api/interview?tech=JavaScript');
    assert.strictEqual(res.status, 200);
    assert.ok(Array.isArray(res.data.questions));
    assert.ok(res.data.questions.length > 0);
    assert.ok(res.data.questions[0].answerMarkdown);
  });

  // Integration Test 10: Quiz submission and grading
  await asyncTest('Integration: POST /api/quizzes/quiz-js-1/attempt grades correctly', async () => {
    const res = await request('POST', '/api/quizzes/quiz-js-1/attempt', {
      answers: { q1: 1, q2: 1, q3: 1, q4: 0 }
    });
    assert.strictEqual(res.status, 200);
    assert.strictEqual(res.data.score, 4);
    assert.strictEqual(res.data.percent, 100);
  });

  console.log(`\nResults: ${passCount} passed, ${failCount} failed.\n`);
  server.close();
  if (failCount > 0) process.exit(1);
}

server.listen(TEST_PORT, '127.0.0.1', () => {
  runAllTests().catch(err => {
    console.error('Test suite failed:', err);
    server.close();
    process.exit(1);
  });
});

