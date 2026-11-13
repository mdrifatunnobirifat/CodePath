'use client';
import React, { useState, useMemo } from 'react';

export default function DashboardView({ 
  selectedLanguage, 
  roadmaps = {}, 
  problems = [], 
  solvedProblemIds = [], 
  onSelectProblem,
  onOpenLanguages 
}) {
  const [activeSegment, setActiveSegment] = useState('practice'); // 'learn' | 'practice'
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [statusFilter, setStatusFilter] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');

  // 1. Get roadmap topics for current language
  const languageRoadmap = useMemo(() => {
    return roadmaps[selectedLanguage] || roadmaps['JavaScript'] || [];
  }, [roadmaps, selectedLanguage]);

  // 2. Filter problems for current language
  const languageProblems = useMemo(() => {
    return problems.filter(p => p.language.toLowerCase() === selectedLanguage.toLowerCase());
  }, [problems, selectedLanguage]);

  // 3. Apply search, difficulty, and solved filters
  const filteredProblems = useMemo(() => {
    return languageProblems.filter(p => {
      const matchDiff = difficultyFilter === 'All' || p.difficulty.toLowerCase() === difficultyFilter.toLowerCase();
      const isSolved = solvedProblemIds.includes(p.id);
      const matchStatus = statusFilter === 'All' 
        ? true 
        : statusFilter === 'solved' 
        ? isSolved 
        : !isSolved;
      const matchSearch = !searchQuery.trim() || 
        p.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (p.topics || []).some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
      return matchDiff && matchStatus && matchSearch;
    });
  }, [languageProblems, difficultyFilter, statusFilter, searchQuery, solvedProblemIds]);

  const solvedInLanguage = languageProblems.filter(p => solvedProblemIds.includes(p.id)).length;
  const progressPercent = languageProblems.length > 0 
    ? Math.round((solvedInLanguage / languageProblems.length) * 100) 
    : 0;

  return (
    <div style={{ padding: '16px 0 40px' }}>
      {/* Dashboard Header Bar */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px', marginBottom: '24px' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h1 style={{ fontSize: '26px', margin: 0 }}>
              {selectedLanguage} Learning & Practice Dashboard
            </h1>
            <span className="badge" style={{ fontSize: '13px' }}>{languageProblems.length}+ Questions</span>
          </div>
          <p style={{ color: 'var(--mute)', margin: '6px 0 0', fontSize: '14px' }}>
            Master core fundamentals to advanced patterns with structured roadmaps and real-world coding problems.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: '12px', color: 'var(--mute)', fontWeight: 600 }}>Solved Progress</div>
            <div style={{ fontSize: '18px', fontWeight: 800, color: 'var(--ok)' }}>
              {solvedInLanguage} / {languageProblems.length} ({progressPercent}%)
            </div>
          </div>
          <button className="ghost" onClick={onOpenLanguages} style={{ fontSize: '13px' }}>
            🔄 Switch Language
          </button>
        </div>
      </div>

      {/* Segment Switcher Navigation Tabs */}
      <div className="chips" style={{ margin: '0 0 24px', display: 'flex', gap: '10px' }}>
        <button 
          className="chip"
          aria-pressed={activeSegment === 'practice'}
          onClick={() => setActiveSegment('practice')}
          style={{ padding: '10px 22px', fontSize: '15px', fontWeight: 700 }}
        >
          ⚡ Segment 2: Practice Questions ({languageProblems.length}+ Problems)
        </button>
        <button 
          className="chip"
          aria-pressed={activeSegment === 'learn'}
          onClick={() => setActiveSegment('learn')}
          style={{ padding: '10px 22px', fontSize: '15px', fontWeight: 700 }}
        >
          📖 Segment 1: Learn Topics (Basic to Strong Roadmap)
        </button>
      </div>

      {/* SEGMENT 1: LEARN TOPICS (BASIC TO STRONG ROADMAP) */}
      {activeSegment === 'learn' && (
        <div>
          <div style={{ marginBottom: '16px' }}>
            <h2 style={{ fontSize: '20px', margin: '0 0 4px' }}>
              Structured Learning Roadmap: {selectedLanguage}
            </h2>
            <p style={{ color: 'var(--mute)', fontSize: '14px', margin: 0 }}>
              Step-by-step curriculum organized from core fundamentals up to production-grade architecture.
            </p>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            {languageRoadmap.map((stage, idx) => (
              <div key={idx} className="panel" style={{ padding: '20px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid var(--line)', paddingBottom: '10px' }}>
                  <div>
                    <span className="tag" style={{ marginRight: '8px' }}>STAGE {idx + 1}</span>
                    <strong style={{ fontSize: '17px' }}>{stage.title}</strong>
                  </div>
                  <span className="badge" style={{ background: 'rgba(14, 124, 123, 0.1)', color: 'var(--acc)' }}>
                    {stage.level || 'Foundations'}
                  </span>
                </div>

                <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '12px' }}>
                  {(stage.topics || []).map((t, tIdx) => (
                    <div 
                      key={tIdx} 
                      style={{ 
                        background: 'var(--code)', 
                        border: '1px solid var(--line)', 
                        borderRadius: '6px', 
                        padding: '12px',
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'space-between'
                      }}
                    >
                      <div>
                        <strong style={{ fontSize: '14px', display: 'block', marginBottom: '4px' }}>
                          {t.name || t}
                        </strong>
                        <p style={{ color: 'var(--mute)', fontSize: '12.5px', margin: 0, lineHeight: 1.4 }}>
                          {t.desc || 'Fundamental concepts, syntax rules, and algorithmic implementation patterns.'}
                        </p>
                      </div>
                      <div style={{ marginTop: '10px', fontSize: '11px', color: 'var(--acc)', fontWeight: 600 }}>
                        ✔ Core Topic Covered
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* SEGMENT 2: PRACTICE QUESTIONS (100+ PROBLEMS PER LANGUAGE) */}
      {activeSegment === 'practice' && (
        <div>
          {/* Filter Bar */}
          <div className="card" style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center', marginBottom: '20px' }}>
            <div style={{ flex: 1, minWidth: '240px' }}>
              <input 
                type="text" 
                placeholder={`Search ${selectedLanguage} problems by title or topic...`}
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                style={{ width: '100%', padding: '9px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '14px' }}
              />
            </div>

            {/* Difficulty Chips */}
            <div className="chips" style={{ margin: 0 }}>
              {['All', 'Easy', 'Medium', 'Hard'].map(diff => (
                <button 
                  key={diff}
                  className="chip"
                  aria-pressed={difficultyFilter === diff}
                  onClick={() => setDifficultyFilter(diff)}
                  style={{ fontSize: '13px' }}
                >
                  {diff}
                </button>
              ))}
            </div>

            {/* Status Filter */}
            <select 
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value)}
              style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '13px' }}
            >
              <option value="All">All Status</option>
              <option value="solved">Solved Only</option>
              <option value="unsolved">Unsolved Only</option>
            </select>
          </div>

          {/* Problem Count */}
          <div style={{ fontSize: '13px', color: 'var(--mute)', marginBottom: '14px', display: 'flex', justifyContent: 'space-between' }}>
            <span>Showing <b>{filteredProblems.length}</b> practice questions</span>
            <span>{solvedInLanguage} solved in {selectedLanguage}</span>
          </div>

          {/* Problem Cards Grid */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            {filteredProblems.map(p => {
              const isSolved = solvedProblemIds.includes(p.id);
              const diffColor = p.difficulty === 'Easy' ? 'var(--ok)' : p.difficulty === 'Medium' ? 'var(--warm)' : 'var(--bad)';

              return (
                <div 
                  key={p.id}
                  className="card"
                  style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center', 
                    padding: '14px 18px',
                    borderLeft: `4px solid ${diffColor}`,
                    cursor: 'pointer'
                  }}
                  onClick={() => onSelectProblem(p)}
                >
                  <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
                    <div style={{ fontSize: '18px' }}>
                      {isSolved ? '✅' : '⚡'}
                    </div>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <strong style={{ fontSize: '15px' }}>{p.title}</strong>
                        <span 
                          style={{ 
                            fontSize: '11px', 
                            fontWeight: 700, 
                            color: diffColor, 
                            textTransform: 'uppercase',
                            background: 'var(--code)',
                            padding: '2px 6px',
                            borderRadius: '4px'
                          }}
                        >
                          {p.difficulty}
                        </span>
                      </div>
                      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                        {(p.topics || []).map((t, i) => (
                          <span key={i} className="pill" style={{ fontSize: '11px', padding: '2px 8px' }}>
                            {t}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>

                  <button 
                    className="btn p"
                    style={{ padding: '6px 14px', fontSize: '13px', whiteSpace: 'nowrap' }}
                    onClick={(e) => { e.stopPropagation(); onSelectProblem(p); }}
                  >
                    {isSolved ? 'Solve Again ↗' : 'Solve Challenge ↗'}
                  </button>
                </div>
              );
            })}

            {filteredProblems.length === 0 && (
              <div className="card" style={{ textAlign: 'center', padding: '36px' }}>
                <p style={{ color: 'var(--mute)', margin: 0 }}>
                  No problems match your current search or filter criteria. Try clearing your filters!
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

