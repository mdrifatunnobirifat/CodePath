'use client';
import React, { useState } from 'react';

// 1. Career Role Tracks View
export function TracksView({ tracks = [], onSelectTrack }) {
  return (
    <div style={{ padding: '16px 0 40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 6px' }}>🗺️ Career Role Tracks</h1>
        <p style={{ color: 'var(--mute)', margin: 0, fontSize: '14px' }}>
          Follow focused, end-to-end paths tailored to specific developer roles.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {tracks.map(t => (
          <div key={t.id} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <span className="badge">{t.badge || 'Professional Track'}</span>
                <span className="tag">{(t.modules || []).length} Modules</span>
              </div>
              <h2 style={{ fontSize: '20px', margin: '0 0 8px' }}>{t.title}</h2>
              <p style={{ color: 'var(--mute)', fontSize: '13.5px', lineHeight: 1.5, margin: 0 }}>
                {t.description}
              </p>
            </div>
            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '14px', marginTop: '16px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '12px', color: 'var(--mute)' }}>Progress: 0%</span>
              <button className="btn p" style={{ padding: '6px 14px', fontSize: '13px' }}>Explore Track &rarr;</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 2. Interactive Lessons with "Try It" View
export function LessonsView({ lessons = [] }) {
  const [activeLesson, setActiveLesson] = useState(lessons[0] || null);

  return (
    <div className="sidebar-main-grid" style={{ padding: '16px 0 40px' }}>
      <div className="card" style={{ padding: '14px', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        <h3 style={{ fontSize: '15px', margin: '0 0 12px' }}>📖 Curriculum Lessons</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          {lessons.map(l => (
            <button
              key={l.id}
              onClick={() => setActiveLesson(l)}
              style={{
                textAlign: 'left',
                padding: '10px 12px',
                borderRadius: '6px',
                border: '1px solid',
                borderColor: activeLesson?.id === l.id ? 'var(--acc)' : 'transparent',
                background: activeLesson?.id === l.id ? 'rgba(14, 124, 123, 0.1)' : 'transparent',
                color: 'var(--ink)',
                cursor: 'pointer',
                fontSize: '13px'
              }}
            >
              <b>{l.title}</b>
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ padding: '24px', height: 'calc(100vh - 120px)', overflowY: 'auto' }}>
        {activeLesson ? (
          <div>
            <h1 style={{ fontSize: '24px', margin: '0 0 14px' }}>{activeLesson.title}</h1>
            <div style={{ fontSize: '14px', lineHeight: 1.7, color: 'var(--ink)' }}>
              <p>{activeLesson.content || 'Explore interactive code examples and master foundational techniques.'}</p>
            </div>

            {activeLesson.codeExample && (
              <div style={{ marginTop: '20px', background: 'var(--code)', padding: '16px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mute)', marginBottom: '8px' }}>Runnable Code Example:</div>
                <pre style={{ margin: 0, fontFamily: 'monospace', fontSize: '13px' }}>
                  <code>{activeLesson.codeExample}</code>
                </pre>
              </div>
            )}
          </div>
        ) : (
          <p>Select a lesson from the menu.</p>
        )}
      </div>
    </div>
  );
}

// 3. Quizzes & Timed Mode View
export function QuizzesView({ quizzes = [] }) {
  const [activeQuiz, setActiveQuiz] = useState(quizzes[0] || null);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const handleSelect = (qIdx, optIdx) => {
    if (submitted) return;
    setSelectedAnswers(prev => ({ ...prev, [qIdx]: optIdx }));
  };

  const score = (activeQuiz?.questions || []).filter((q, i) => selectedAnswers[i] === q.correctIndex).length;

  return (
    <div style={{ padding: '16px 0 40px' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', margin: '0 0 4px' }}>⏱️ Technical Knowledge Quizzes</h1>
          <p style={{ color: 'var(--mute)', margin: 0, fontSize: '14px' }}>Test your understanding of core concepts under timed constraints.</p>
        </div>
        <span className="badge" style={{ color: 'var(--warm)', fontWeight: 700 }}>⏳ 15-Minute Mode</span>
      </div>

      <div className="sidebar-main-grid">
        <div className="card" style={{ padding: '14px' }}>
          <b style={{ fontSize: '13px', display: 'block', marginBottom: '10px' }}>Available Quizzes</b>
          {quizzes.map(q => (
            <button
              key={q.id}
              onClick={() => { setActiveQuiz(q); setSelectedAnswers({}); setSubmitted(false); }}
              className="drawer-nav-item"
              aria-current={activeQuiz?.id === q.id ? 'page' : 'false'}
              style={{ width: '100%', marginBottom: '4px' }}
            >
              {q.title}
            </button>
          ))}
        </div>

        <div className="card" style={{ padding: '24px' }}>
          {activeQuiz ? (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                <h2 style={{ fontSize: '18px', margin: 0 }}>{activeQuiz.title}</h2>
                {submitted && (
                  <span className="badge ok">Score: {score} / {activeQuiz.questions.length}</span>
                )}
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                {(activeQuiz.questions || []).map((q, qIdx) => (
                  <div key={qIdx} style={{ background: 'var(--code)', padding: '14px', borderRadius: '8px', border: '1px solid var(--line)' }}>
                    <div style={{ fontWeight: 600, fontSize: '14px', marginBottom: '10px' }}>
                      {qIdx + 1}. {q.prompt}
                    </div>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                      {(q.options || []).map((opt, oIdx) => {
                        const isSelected = selectedAnswers[qIdx] === oIdx;
                        const isCorrect = submitted && q.correctIndex === oIdx;
                        const isWrong = submitted && isSelected && !isCorrect;

                        return (
                          <div
                            key={oIdx}
                            onClick={() => handleSelect(qIdx, oIdx)}
                            style={{
                              padding: '8px 12px',
                              borderRadius: '6px',
                              border: '1px solid',
                              borderColor: isCorrect ? 'var(--ok)' : isWrong ? 'var(--bad)' : isSelected ? 'var(--acc)' : 'var(--line)',
                              background: isCorrect ? 'rgba(27, 138, 75, 0.15)' : isWrong ? 'rgba(192, 57, 43, 0.15)' : isSelected ? 'rgba(14, 124, 123, 0.1)' : 'var(--panel)',
                              cursor: submitted ? 'default' : 'pointer',
                              fontSize: '13px'
                            }}
                          >
                            {opt}
                          </div>
                        );
                      })}
                    </div>
                    {submitted && q.explanation && (
                      <div style={{ marginTop: '10px', fontSize: '12px', color: 'var(--ink)', background: 'rgba(14, 124, 123, 0.08)', borderLeft: '3px solid var(--acc)', padding: '8px 12px', borderRadius: '4px', lineHeight: 1.5 }}>
                        💡 <b>Explanation:</b> {q.explanation}
                      </div>
                    )}
                  </div>
                ))}

                {!submitted ? (
                  <button className="btn p" onClick={() => setSubmitted(true)} style={{ padding: '10px', fontSize: '14px' }}>
                    Submit Answers
                  </button>
                ) : (
                  <button className="btn" onClick={() => { setSelectedAnswers({}); setSubmitted(false); }} style={{ padding: '10px', fontSize: '14px' }}>
                    Retake Quiz
                  </button>
                )}
              </div>
            </div>
          ) : (
            <p>No quiz selected.</p>
          )}
        </div>
      </div>
    </div>
  );
}

// 4. Interview Q&A Bank View
export function InterviewView({ questions = [] }) {
  const [openIdx, setOpenIdx] = useState(null);

  return (
    <div style={{ padding: '16px 0 40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 6px' }}>💡 Technical Interview Q&A Bank</h1>
        <p style={{ color: 'var(--mute)', margin: 0, fontSize: '14px' }}>
          Frequently asked interview questions with senior-level model answers.
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
        {questions.map((q, idx) => (
          <div key={q.id || idx} className="card" style={{ padding: '16px' }}>
            <div 
              style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}
              onClick={() => setOpenIdx(openIdx === idx ? null : idx)}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                <span className="badge">{q.category || 'Core'}</span>
                <strong style={{ fontSize: '15px' }}>{q.question}</strong>
              </div>
              <span style={{ fontSize: '14px', color: 'var(--mute)' }}>{openIdx === idx ? '▲' : '▼'}</span>
            </div>

            {openIdx === idx && (
              <div style={{ marginTop: '14px', paddingTop: '12px', borderTop: '1px solid var(--line)', fontSize: '13.5px', lineHeight: 1.6, color: 'var(--ink)' }}>
                <b>Model Answer:</b>
                <p style={{ marginTop: '4px' }}>{q.answerMarkdown || q.answer}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

// 5. Mini-Projects View
export function ProjectsView({ projects = [] }) {
  const handleCopyReadme = (p) => {
    const text = `# ${p.title}\n\n${p.description}\n\n## Tech Stack\n${(p.technologies || []).join(', ')}\n\n## Setup\n\`\`\`bash\nnpm install\nnpm run dev\n\`\`\``;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(text);
      } else {
        const ta = document.createElement('textarea');
        ta.value = text;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      alert('Recruiter-ready README copied to clipboard!');
    } catch (err) {
      alert('README prepared! You can copy the content.');
    }
  };

  return (
    <div style={{ padding: '16px 0 40px' }}>
      <div style={{ marginBottom: '20px' }}>
        <h1 style={{ fontSize: '24px', margin: '0 0 6px' }}>💼 Guided Mini-Projects & README Generator</h1>
        <p style={{ color: 'var(--mute)', margin: 0, fontSize: '14px' }}>Build production applications that recruiters love to inspect.</p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {projects.map((p, i) => (
          <div key={p.id || i} className="card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                <span className="badge">Project #{i + 1}</span>
                <span className="tag">Portfolio Ready</span>
              </div>
              <h2 style={{ fontSize: '18px', margin: '0 0 8px' }}>{p.title}</h2>
              <p style={{ fontSize: '13px', color: 'var(--mute)', margin: '0 0 12px' }}>{p.description}</p>
              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                {(p.technologies || []).map((t, tIdx) => (
                  <span key={tIdx} className="pill" style={{ fontSize: '11px' }}>{t}</span>
                ))}
              </div>
            </div>

            <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px', marginTop: '16px' }}>
              <button className="btn" onClick={() => handleCopyReadme(p)} style={{ width: '100%', fontSize: '13px' }}>
                📋 Copy Recruiter README
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 6. Developer Job Board View
export function JobsView({ jobs = [] }) {
  const [filterRemote, setFilterRemote] = useState(false);

  const filtered = jobs.filter(j => !filterRemote || j.isRemote);

  return (
    <div style={{ padding: '16px 0 40px' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <div>
          <h1 style={{ fontSize: '22px', margin: '0 0 4px' }}>🏢 Curated Developer Jobs</h1>
          <p style={{ color: 'var(--mute)', margin: 0, fontSize: '14px' }}>Direct openings matched to your learning tech stack.</p>
        </div>
        <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '13px', cursor: 'pointer' }}>
          <input type="checkbox" checked={filterRemote} onChange={e => setFilterRemote(e.target.checked)} />
          Remote Only 🌐
        </label>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {filtered.map(j => (
          <div key={j.id} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px' }}>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                <strong style={{ fontSize: '16px' }}>{j.title}</strong>
                <span className="badge">{j.company}</span>
                {j.isRemote && <span className="pill" style={{ color: 'var(--ok)' }}>Remote</span>}
              </div>
              <div style={{ fontSize: '12.5px', color: 'var(--mute)' }}>
                📍 {j.location} · 💰 {j.salary || '$80,000 - $110,000'} · Tech: {(j.technologies || []).join(', ')}
              </div>
            </div>
            <button className="btn p" onClick={() => alert(`Applied to ${j.title} at ${j.company}!`)} style={{ padding: '6px 16px', fontSize: '13px' }}>
              Apply Now ↗
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. "Am I Ready to Apply?" Readiness View
export function ReadinessView({ solvedCount = 0, onOpenTab }) {
  const pillars = [
    { title: '1. 30+ Problems Solved', current: solvedCount, target: 30, ok: solvedCount >= 30, action: 'practice' },
    { title: '2. Production Mini-Projects', current: 2, target: 2, ok: true, action: 'projects' },
    { title: '3. Professional Tech CV', current: 1, target: 1, ok: true, action: 'cv' },
    { title: '4. Interview Questions Mastered', current: 10, target: 10, ok: true, action: 'interview' }
  ];

  const overallReady = pillars.every(p => p.ok);

  return (
    <div style={{ padding: '16px 0 40px', maxWidth: '800px', margin: '0 auto' }}>
      <div className="card" style={{ textAlign: 'center', padding: '30px', marginBottom: '24px' }}>
        <div style={{ fontSize: '42px', marginBottom: '10px' }}>{overallReady ? '🏆' : '🎯'}</div>
        <h1 style={{ fontSize: '28px', margin: '0 0 8px' }}>"Am I Ready to Apply?" Assessment</h1>
        <p style={{ color: 'var(--mute)', fontSize: '15px', margin: 0 }}>
          {overallReady ? 'You have met all 4 pillars! Start applying to developer roles today.' : 'Track your progress across the 4 key benchmarks required before applying.'}
        </p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
        {pillars.map((p, idx) => (
          <div key={idx} className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '18px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
              <span style={{ fontSize: '22px' }}>{p.ok ? '✅' : '⏳'}</span>
              <div>
                <strong style={{ fontSize: '15px' }}>{p.title}</strong>
                <div style={{ fontSize: '12.5px', color: 'var(--mute)' }}>Progress: {p.current} / {p.target}</div>
              </div>
            </div>
            <button className="ghost" onClick={() => onOpenTab(p.action)} style={{ fontSize: '13px' }}>
              Work on This &rarr;
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

// 8. Public Portfolio & Badges View
export function ProfileView({ user, solvedCount = 0, streak = 1, onOpenTab }) {
  const badges = [
    { icon: '⚔️', name: 'First Blood', desc: 'Solved your first coding problem', earned: solvedCount >= 1 },
    { icon: '🔥', name: '3-Day Fire', desc: 'Maintained a 3-day active streak', earned: streak >= 3 },
    { icon: '⚡', name: 'Unstoppable', desc: 'Maintained a 7-day active streak', earned: streak >= 7 },
    { icon: '🚀', name: 'Shipper', desc: 'Completed mini-projects', earned: true },
    { icon: '🎯', name: 'Theory Master', desc: 'Completed technical quizzes', earned: true },
    { icon: '🏆', name: 'Interview Ready', desc: 'Achieved 4 readiness pillars', earned: solvedCount >= 30 }
  ];

  return (
    <div style={{ padding: '16px 0 40px' }}>
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
          <img 
            src={user?.avatar || 'https://api.dicebear.com/7.x/bottts/svg?seed=learner'} 
            alt="Avatar" 
            style={{ width: '64px', height: '64px', borderRadius: '50%', border: '2px solid var(--acc)' }}
          />
          <div>
            <h1 style={{ fontSize: '22px', margin: 0 }}>{user?.name || 'Demo Learner'}</h1>
            <p style={{ color: 'var(--mute)', fontSize: '13px', margin: '2px 0 0' }}>{user?.email}</p>
          </div>
        </div>
        <button className="btn p" onClick={() => onOpenTab('cv')}>📄 Open Tech CV Builder</button>
      </div>

      <div className="card" style={{ marginBottom: '20px' }}>
        <h2 style={{ fontSize: '17px', margin: '0 0 14px' }}>Earned Achievement Badges</h2>
        <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px' }}>
          {badges.map((b, i) => (
            <div key={i} style={{ padding: '14px', borderRadius: '8px', border: '1px solid var(--line)', background: b.earned ? 'var(--panel)' : 'var(--code)', opacity: b.earned ? 1 : 0.4 }}>
              <div style={{ fontSize: '28px', marginBottom: '4px' }}>{b.icon}</div>
              <strong>{b.name}</strong>
              <p style={{ color: 'var(--mute)', fontSize: '12px', margin: '4px 0 0' }}>{b.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}


