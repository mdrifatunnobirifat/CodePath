'use client';
import React from 'react';

export default function LanguagesView({ onSelectLanguage }) {
  const languageCards = [
    {
      id: 'JavaScript',
      name: 'JavaScript',
      badge: 'Web & Full-Stack',
      icon: '⚡',
      color: '#F7DF1E',
      desc: 'Master closures, event loop, functional array transformations, and asynchronous coding.',
      topics: ['Primitive Types & Scope', 'Arrays & Map/Filter/Reduce', 'Async/Await & Promises', 'DOM & Event Mechanics', 'Algorithmic Optimization'],
      totalProblems: 100
    },
    {
      id: 'React',
      name: 'React',
      badge: 'Frontend Architecture',
      icon: '⚛️',
      color: '#61DAFB',
      desc: 'Build component architecture, hooks (useState, useEffect), state lifting, and interactive DOM tests.',
      topics: ['Component JSX & Props', 'Hooks (State & Effect)', 'Custom Reusable Hooks', 'Context & State Management', 'Performance & Memoization'],
      totalProblems: 100
    },
    {
      id: 'Python',
      name: 'Python',
      badge: 'Backend & Data',
      icon: '🐍',
      color: '#3776AB',
      desc: 'Learn Pythonic data structures, algorithm patterns, list comprehension, and backend scripting.',
      topics: ['Data Types & Slicing', 'Lists, Dicts & Sets', 'List Comprehensions', 'OOP & Classes', 'Sorting & Search Algorithms'],
      totalProblems: 100
    },
    {
      id: 'SQL',
      name: 'Relational SQL',
      badge: 'Databases & Systems',
      icon: '🗄️',
      color: '#00758F',
      desc: 'Master SELECT, WHERE filters, GROUP BY, aggregations, INNER/LEFT joins, and performance indexing.',
      topics: ['SELECT & Filtering', 'Aggregations & Math', 'GROUP BY & HAVING', 'Multi-Table JOINs', 'Subqueries & Windows'],
      totalProblems: 100
    },
    {
      id: 'C#',
      name: 'C# & .NET',
      badge: 'Enterprise & API',
      icon: '🔷',
      color: '#239120',
      desc: 'Object-oriented programming, generic collections, LINQ declarative querying, and ASP.NET Core.',
      topics: ['OOP & Inheritance', 'Generic Collections', 'LINQ Query Syntax', 'Interfaces & Abstraction', 'ASP.NET Core REST APIs'],
      totalProblems: 100
    },
    {
      id: 'PHP',
      name: 'PHP',
      badge: 'Backend Web',
      icon: '🐘',
      color: '#777BB4',
      desc: 'Modern backend logic, array manipulation, string compression, and RESTful API data flows.',
      topics: ['Arrays & Associative Maps', 'String & Regex Processing', 'OOP & Classes', 'REST API Payloads', 'Database Interop & PDO'],
      totalProblems: 100
    }
  ];

  return (
    <div style={{ padding: '24px 0 40px' }}>
      <div style={{ textAlign: 'center', maxWidth: '780px', margin: '0 auto 36px' }}>
        <div className="pill" style={{ display: 'inline-block', marginBottom: '12px', fontSize: '13px' }}>
          🎯 60-Day Developer Job Preparation Plan
        </div>
        <h1 style={{ fontSize: '36px', letterSpacing: '-1px', margin: '0 0 12px' }}>
          Choose Your Language Track
        </h1>
        <p style={{ color: 'var(--mute)', fontSize: '16px', lineHeight: 1.6, margin: 0 }}>
          Select the programming language you want to master. You will get a personalized two-segment dashboard with <b>Basic-to-Strong Lessons</b> and <b>100+ Job-Ready Coding Problems</b>.
        </p>
      </div>

      <div className="grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '20px' }}>
        {languageCards.map(c => (
          <div 
            key={c.id} 
            className="card" 
            style={{ 
              display: 'flex', 
              flexDirection: 'column', 
              justifyContent: 'space-between',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              border: '1px solid var(--line)'
            }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--acc)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--line)'}
            onClick={() => onSelectLanguage(c.id)}
          >
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
                <span style={{ fontSize: '32px' }}>{c.icon}</span>
                <span className="badge">{c.badge}</span>
              </div>
              <h2 style={{ fontSize: '22px', margin: '0 0 8px' }}>{c.name}</h2>
              <p style={{ color: 'var(--mute)', fontSize: '14px', lineHeight: 1.5, margin: '0 0 16px' }}>
                {c.desc}
              </p>

              <div style={{ borderTop: '1px solid var(--line)', paddingTop: '12px', marginBottom: '16px' }}>
                <div style={{ fontSize: '12px', fontWeight: 700, color: 'var(--mute)', marginBottom: '8px', textTransform: 'uppercase' }}>
                  Roadmap Highlights:
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '5px' }}>
                  {c.topics.map((t, i) => (
                    <div key={i} style={{ fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                      <span style={{ color: 'var(--acc)', fontSize: '11px' }}>✔</span> {t}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
              <span className="tag" style={{ fontWeight: 600 }}>⚡ {c.totalProblems}+ Practice Problems</span>
              <button 
                className="btn p" 
                style={{ padding: '8px 16px', fontSize: '13px' }}
                onClick={(e) => { e.stopPropagation(); onSelectLanguage(c.id); }}
              >
                Start Learning &rarr;
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

