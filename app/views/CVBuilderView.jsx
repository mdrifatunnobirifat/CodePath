'use client';
import React, { useState, useEffect } from 'react';

// URL sanitizer to guarantee all links open externally in web and offline PDF/HTML
export function safeUrl(url) {
  if (!url) return '';
  const trimmed = String(url).trim();
  if (!trimmed) return '';
  if (/^(https?:\/\/|mailto:|tel:)/i.test(trimmed)) {
    return trimmed;
  }
  return `https://${trimmed}`;
}

export default function CVBuilderView({ initialCvData, onSaveCv, user }) {
  const [currentFormat, setCurrentFormat] = useState('ats-modern');

  useEffect(() => {
    const savedFormat = localStorage.getItem('cp_cv_format');
    if (savedFormat) setCurrentFormat(savedFormat);
  }, []);

  const defaultCv = {
    name: user?.name || 'Alex Morgan',
    title: 'Full-Stack Software Developer',
    email: user?.email || 'alex.morgan@example.com',
    phone: '+1 (555) 234-5678',
    location: 'Dhaka, Bangladesh · Remote Available',
    github: 'https://github.com/alexmorgan',
    linkedin: 'https://linkedin.com/in/alexmorgan',
    website: 'https://alexmorgan.dev',
    showPhoto: false,
    photoUrl: '',
    summary: 'Results-driven software developer with hands-on experience building full-stack web applications, RESTful APIs, and responsive user interfaces. Proven problem solver with 50+ algorithm challenges completed and a strong foundation in modern engineering architecture.',
    skills: {
      languages: 'JavaScript (ES6+), TypeScript, Python, SQL, C#, PHP',
      frameworks: 'React, Node.js, Express, ASP.NET Core, Tailwind CSS',
      databases: 'PostgreSQL, SQLite, Redis, MongoDB',
      tools: 'Git, Docker, Linux, REST APIs, Jest, Postman, CI/CD'
    },
    customSkills: [],
    projects: [
      {
        title: 'Full-Stack Job Application Tracker',
        technologies: 'React, Node.js, SQLite, Tailwind CSS',
        github: 'https://github.com/alexmorgan/job-tracker',
        demo: 'https://job-tracker-demo.vercel.app',
        bullets: [
          'Built Kanban-style application tracker managing 5 application stages with drag-and-drop mechanics.',
          'Implemented JWT authentication, input validation middleware, and relational SQLite schema.',
          'Achieved 100% test coverage on API endpoints and optimized query load times under 80ms.'
        ]
      },
      {
        title: 'Real-Time Weather Forecast Dashboard',
        technologies: 'JavaScript, OpenWeather API, CSS3',
        github: 'https://github.com/alexmorgan/weather-dashboard',
        demo: 'https://weather-demo.vercel.app',
        bullets: [
          'Engineered asynchronous weather dashboard fetching 5-day forecasts with debounced autocomplete.',
          'Implemented animated loading skeletons, dynamic temperature converters, and error fallbacks.'
        ]
      }
    ],
    experience: [
      {
        role: 'Junior Developer Intern',
        company: 'Northwind Software Labs',
        period: '2025 - Present',
        location: 'Remote',
        bullets: [
          'Collaborated on front-end components and client dashboards in React and TypeScript.',
          'Participated in code reviews, resolved 35+ Jira tickets, and improved unit test coverage by 20%.'
        ]
      }
    ],
    education: [
      {
        degree: 'B.S. in Computer Science & Engineering',
        institution: 'State University of Technology',
        year: '2022 - 2026',
        details: 'Relevant Coursework: Data Structures, Algorithms, Database Systems, Web Engineering.'
      }
    ],
    references: [
      {
        name: 'Dr. Jane Smith',
        role: 'Engineering Lead',
        company: 'Northwind Labs',
        contact: 'jane.smith@northwind.dev · +1 (555) 987-6543'
      }
    ],
    referencesUponRequest: false,
    signature: {
      enabled: true,
      typedName: 'Alex Morgan',
      date: new Date().toISOString().slice(0, 10),
      place: 'Dhaka, Bangladesh',
      declaration: 'I hereby declare that all the information provided above is true and correct to the best of my knowledge.'
    }
  };

  const [cvData, setCvData] = useState(() => {
    return initialCvData || defaultCv;
  });

  const templates = [
    { id: 'ats-modern', name: '1. Modern Tech (ATS-Friendly)' },
    { id: 'two-column', name: '2. Two-Column Engineering' },
    { id: 'executive-impact', name: '3. Senior Impact Architecture' },
    { id: 'developer-minimal', name: '4. Developer Minimalist' },
    { id: 'frontend-creative', name: '5. Creative Portfolio-Linked' }
  ];

  const handleSelectFormat = (formatId) => {
    setCurrentFormat(formatId);
    localStorage.setItem('cp_cv_format', formatId);
  };

  // Helper updates
  const updateField = (key, val) => {
    setCvData(prev => ({ ...prev, [key]: val }));
  };

  const updateSkill = (key, val) => {
    setCvData(prev => ({
      ...prev,
      skills: { ...prev.skills, [key]: val }
    }));
  };

  // Projects
  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        { title: '', technologies: '', github: '', demo: '', bullets: [''] }
      ]
    }));
  };

  const removeProject = (idx) => {
    setCvData(prev => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== idx)
    }));
  };

  const updateProject = (idx, field, val) => {
    setCvData(prev => {
      const p = [...prev.projects];
      p[idx] = { ...p[idx], [field]: val };
      return { ...prev, projects: p };
    });
  };

  const addProjectBullet = (pIdx) => {
    setCvData(prev => {
      const p = [...prev.projects];
      p[pIdx].bullets = [...(p[pIdx].bullets || []), ''];
      return { ...prev, projects: p };
    });
  };

  const updateProjectBullet = (pIdx, bIdx, val) => {
    setCvData(prev => {
      const p = [...prev.projects];
      const b = [...p[pIdx].bullets];
      b[bIdx] = val;
      p[pIdx].bullets = b;
      return { ...prev, projects: p };
    });
  };

  const removeProjectBullet = (pIdx, bIdx) => {
    setCvData(prev => {
      const p = [...prev.projects];
      p[pIdx].bullets = p[pIdx].bullets.filter((_, i) => i !== bIdx);
      return { ...prev, projects: p };
    });
  };

  // Experience
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        { role: '', company: '', period: '', location: '', bullets: [''] }
      ]
    }));
  };

  const removeExperience = (idx) => {
    setCvData(prev => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== idx)
    }));
  };

  const updateExperience = (idx, field, val) => {
    setCvData(prev => {
      const exp = [...prev.experience];
      exp[idx] = { ...exp[idx], [field]: val };
      return { ...prev, experience: exp };
    });
  };

  const addExpBullet = (eIdx) => {
    setCvData(prev => {
      const exp = [...prev.experience];
      exp[eIdx].bullets = [...(exp[eIdx].bullets || []), ''];
      return { ...prev, experience: exp };
    });
  };

  const updateExpBullet = (eIdx, bIdx, val) => {
    setCvData(prev => {
      const exp = [...prev.experience];
      const b = [...exp[eIdx].bullets];
      b[bIdx] = val;
      exp[eIdx].bullets = b;
      return { ...prev, experience: exp };
    });
  };

  const removeExpBullet = (eIdx, bIdx) => {
    setCvData(prev => {
      const exp = [...prev.experience];
      exp[eIdx].bullets = exp[eIdx].bullets.filter((_, i) => i !== bIdx);
      return { ...prev, experience: exp };
    });
  };

  // Education
  const addEducation = () => {
    setCvData(prev => ({
      ...prev,
      education: [...(prev.education || []), { degree: '', institution: '', year: '', details: '' }]
    }));
  };

  const removeEducation = (idx) => {
    setCvData(prev => ({
      ...prev,
      education: prev.education.filter((_, i) => i !== idx)
    }));
  };

  const updateEducation = (idx, field, val) => {
    setCvData(prev => {
      const ed = [...prev.education];
      ed[idx] = { ...ed[idx], [field]: val };
      return { ...prev, education: ed };
    });
  };

  // Custom skills
  const addCustomSkill = () => {
    setCvData(prev => ({
      ...prev,
      customSkills: [...(prev.customSkills || []), { category: 'Cloud & DevOps', items: 'AWS, Docker, CI/CD' }]
    }));
  };

  const removeCustomSkill = (idx) => {
    setCvData(prev => ({
      ...prev,
      customSkills: prev.customSkills.filter((_, i) => i !== idx)
    }));
  };

  const updateCustomSkill = (idx, field, val) => {
    setCvData(prev => {
      const cs = [...prev.customSkills];
      cs[idx] = { ...cs[idx], [field]: val };
      return { ...prev, customSkills: cs };
    });
  };

  // References
  const addReference = () => {
    setCvData(prev => ({
      ...prev,
      references: [...(prev.references || []), { name: '', role: '', company: '', contact: '' }]
    }));
  };

  const removeReference = (idx) => {
    setCvData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== idx)
    }));
  };

  const updateReference = (idx, field, val) => {
    setCvData(prev => {
      const ref = [...prev.references];
      ref[idx] = { ...ref[idx], [field]: val };
      return { ...prev, references: ref };
    });
  };

  // Signature
  const updateSignature = (field, val) => {
    setCvData(prev => ({
      ...prev,
      signature: { ...prev.signature, [field]: val }
    }));
  };

  // Photo
  const handlePhotoUpload = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (uploadEvent) => {
      setCvData(prev => ({ ...prev, photoUrl: uploadEvent.target.result, showPhoto: true }));
    };
    reader.readAsDataURL(file);
  };

  const handleSave = () => {
    onSaveCv(cvData);
  };

  const handleCopyMarkdown = () => {
    const d = cvData;
    const md = `# ${d.name}
**${d.title}**
${d.email} | ${d.phone} | ${d.location} | [GitHub](${safeUrl(d.github)}) | [LinkedIn](${safeUrl(d.linkedin)})

## Professional Summary
${d.summary}

## Technical Skills
- **Languages:** ${d.skills?.languages}
- **Frameworks & Libraries:** ${d.skills?.frameworks}
- **Databases:** ${d.skills?.databases}
- **Tools:** ${d.skills?.tools}
${(d.customSkills || []).map(cs => `- **${cs.category}:** ${cs.items}`).join('\n')}

## Featured Projects
${(d.projects || []).map(p => `### ${p.title} (${p.technologies})
${p.github ? `Source: [${p.github}](${safeUrl(p.github)})` : ''} ${p.demo ? `| Demo: [${p.demo}](${safeUrl(p.demo)})` : ''}
${(p.bullets || []).map(b => `- ${b}`).join('\n')}
`).join('\n')}

## Work Experience
${(d.experience || []).map(e => `### ${e.role} - ${e.company} (${e.period})
${(e.bullets || []).map(b => `- ${b}`).join('\n')}
`).join('\n')}

## Education
${(d.education || []).map(ed => `- **${ed.degree}**, ${ed.institution} (${ed.year || ''})`).join('\n')}
`;
    try {
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(md);
      } else {
        const ta = document.createElement('textarea');
        ta.value = md;
        document.body.appendChild(ta);
        ta.select();
        document.execCommand('copy');
        document.body.removeChild(ta);
      }
      alert('Formatted Markdown copied to clipboard!');
    } catch (err) {
      alert('Markdown prepared! You can copy it directly from the editor.');
    }
  };

  const d = cvData;

  // Print or Download PDF with sanitized document.title
  const handlePrintPdf = () => {
    const originalTitle = document.title;
    const sanitizedName = (d.name || 'Developer').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    document.title = `${sanitizedName}_Resume_${currentFormat}`;
    window.print();
    setTimeout(() => {
      document.title = originalTitle;
    }, 1200);
  };

  // Export standalone offline HTML file with clickable links and embedded styles
  const handleDownloadHtml = () => {
    const sheetEl = document.getElementById('cv-preview-sheet');
    if (!sheetEl) return;
    const sanitizedName = (d.name || 'Developer').trim().replace(/[^a-zA-Z0-9_-]/g, '_');
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${d.name || 'Developer'} - Resume</title>
  <style>
    * { box-sizing: border-box; }
    body {
      margin: 0;
      padding: 24px;
      background: #eef2f6;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      display: flex;
      flex-direction: column;
      align-items: center;
      color: #14213d;
    }
    .offline-toolbar {
      width: 100%;
      max-width: 820px;
      margin-bottom: 16px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: #ffffff;
      padding: 12px 20px;
      border-radius: 8px;
      box-shadow: 0 2px 8px rgba(0,0,0,0.06);
    }
    .offline-btn {
      background: #0E7C7B;
      color: #ffffff;
      border: none;
      padding: 8px 18px;
      border-radius: 6px;
      font-weight: 600;
      cursor: pointer;
      font-size: 13px;
    }
    .cv-sheet {
      width: 100%;
      max-width: 820px;
      min-height: 1050px;
      background: #ffffff;
      padding: 36px 44px;
      box-shadow: 0 4px 20px rgba(0,0,0,0.08);
      border-radius: 4px;
      font-size: 13px;
      line-height: 1.55;
    }
    a {
      color: #0E7C7B !important;
      text-decoration: underline;
      font-weight: 600;
    }
    /* Template 1: ATS Modern */
    .ats-wrapper { display: flex; flex-direction: column; gap: 14px; }
    .ats-header { text-align: center; border-bottom: 2px solid #14213d; padding-bottom: 12px; }
    .ats-name { font-size: 26px; margin: 0; text-transform: uppercase; color: #14213d; }
    .ats-title { font-size: 15px; font-weight: 600; color: #5b6678; margin: 4px 0; }
    .ats-contact { font-size: 12px; color: #5b6678; }
    .ats-sec-title { font-size: 13px; font-weight: 800; letter-spacing: 0.5px; text-transform: uppercase; border-bottom: 1.5px solid #14213d; padding-bottom: 3px; margin: 10px 0 8px; }
    .ats-skills-list { display: flex; flex-direction: column; gap: 4px; font-size: 12.5px; }
    .ats-item { margin-bottom: 10px; }
    .ats-item-header { display: flex; justify-content: space-between; font-size: 13px; margin-bottom: 3px; }
    .ats-bullets { margin: 4px 0 0 18px; padding: 0; font-size: 12.5px; line-height: 1.5; }
    /* Template 2: Two-Column */
    .twocol-wrapper { display: grid; grid-template-columns: 240px 1fr; gap: 24px; }
    .twocol-sidebar { background: #f8fafc; padding: 18px; border-radius: 6px; border-right: 1px solid #e2e8f0; }
    .twocol-name { font-size: 20px; margin: 0; color: #0E7C7B; }
    .twocol-title { font-size: 12px; font-weight: 600; color: #64748b; margin-bottom: 14px; }
    .twocol-group { margin-bottom: 16px; font-size: 12px; }
    .twocol-group h3 { font-size: 12px; text-transform: uppercase; color: #0E7C7B; border-bottom: 1px solid #cbd5e1; padding-bottom: 2px; margin-bottom: 6px; }
    .twocol-heading { font-size: 14px; text-transform: uppercase; border-bottom: 1.5px solid #0E7C7B; padding-bottom: 2px; margin: 12px 0 8px; color: #14213d; }
    /* Template 3: Executive Impact */
    .exec-header { border-bottom: 2px double #14213d; padding-bottom: 10px; margin-bottom: 14px; }
    .exec-header h1 { font-family: Georgia, serif; font-size: 26px; margin: 0; color: #14213d; }
    .exec-subtitle { font-size: 14px; font-style: italic; color: #5b6678; margin: 4px 0; }
    .exec-contact-bar { font-size: 12px; color: #5b6678; }
    .exec-title { font-family: Georgia, serif; font-size: 14px; letter-spacing: 0.8px; border-bottom: 1px solid #94a3b8; padding-bottom: 3px; margin: 12px 0 6px; }
    /* Template 4: Minimalist */
    .minimal-wrapper { font-family: ui-monospace, Menlo, Consolas, monospace; font-size: 12px; line-height: 1.6; }
    .minimal-head { border-bottom: 1px dashed #64748b; padding-bottom: 12px; margin-bottom: 12px; }
    .minimal-prompt { color: #0E7C7B; font-weight: 700; }
    .minimal-name { font-size: 22px; margin: 2px 0; }
    .minimal-sec { margin-bottom: 14px; }
    .minimal-sec-head { font-weight: 700; color: #0E7C7B; margin-bottom: 4px; }
    /* Template 5: Creative Frontend */
    .creative-header { display: flex; justify-content: space-between; align-items: flex-start; border-left: 5px solid #0E7C7B; padding-left: 14px; margin-bottom: 16px; }
    .creative-name { font-size: 24px; margin: 0; color: #14213d; }
    .creative-title { font-size: 14px; color: #0E7C7B; font-weight: 700; }
    .creative-contact { font-size: 12px; text-align: right; color: #64748b; }
    .creative-section h3 { font-size: 14px; text-transform: uppercase; color: #0E7C7B; border-bottom: 1px solid #e2e8f0; padding-bottom: 4px; margin: 12px 0 8px; }
    .creative-pills { display: flex; flex-wrap: wrap; gap: 6px; }
    .creative-pill { background: #eef2f6; border: 1px solid #cbd5e1; padding: 3px 8px; border-radius: 4px; font-size: 11px; font-weight: 600; }
    .creative-projects-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
    .creative-project-card { border: 1px solid #e2e8f0; padding: 10px; border-radius: 6px; background: #f8fafc; }
    .cv-photo-circle { width: 78px; height: 78px; border-radius: 50%; object-fit: cover; border: 2px solid #0E7C7B; }
    .cv-photo-square { width: 72px; height: 72px; border-radius: 8px; object-fit: cover; border: 1.5px solid #cbd5e1; }
    .cv-signature-block { margin-top: 18px; padding-top: 12px; border-top: 1px dashed #cbd5e1; display: flex; justify-content: space-between; align-items: flex-end; font-size: 11.5px; }
    .cv-signature-font { font-family: 'Brush Script MT', 'Dancing Script', 'Caveat', cursive; font-size: 26px; line-height: 1.1; }
    @media print {
      body { background: #fff; padding: 0; }
      .offline-toolbar { display: none !important; }
      .cv-sheet { box-shadow: none; padding: 0; width: 100%; max-width: 100%; }
    }
  </style>
</head>
<body>
  <div class="offline-toolbar">
    <div><b>${d.name}</b> — Offline Standalone Resume (${currentFormat})</div>
    <button class="offline-btn" onclick="window.print()">🖨️ Print / Save PDF</button>
  </div>
  ${sheetEl.outerHTML}
</body>
</html>`;

    const blob = new Blob([htmlContent], { type: 'text/html;charset=utf-8' });
    const downloadUrl = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = downloadUrl;
    a.download = `${sanitizedName}_CV_${currentFormat}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(downloadUrl);
  };

  // Render Signature Component
  const renderSignature = () => {
    if (!d.signature?.enabled) return null;
    return (
      <div className="cv-signature-block">
        <div>
          <div style={{ fontStyle: 'italic', color: '#555', marginBottom: '6px', fontSize: '11px' }}>
            "{d.signature.declaration}"
          </div>
          <div><b>Date:</b> {d.signature.date} &nbsp;|&nbsp; <b>Place:</b> {d.signature.place}</div>
        </div>
        <div style={{ textAlign: 'right' }}>
          <div className="cv-signature-font">{d.signature.typedName || d.name}</div>
          <div style={{ borderTop: '1px solid #14213D', fontWeight: 700, fontSize: '11px', marginTop: '3px', paddingTop: '2px' }}>
            {d.name}
          </div>
        </div>
      </div>
    );
  };

  // Render References Component
  const renderReferences = () => {
    if (d.referencesUponRequest) {
      return <div style={{ fontSize: '12px', fontStyle: 'italic', color: '#555' }}>References available upon request.</div>;
    }
    if (!d.references || d.references.length === 0) return null;
    return (
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '8px', fontSize: '12px' }}>
        {d.references.map((r, i) => (
          <div key={i} style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px', borderRadius: '4px' }}>
            <b>{r.name}</b><br />
            <span>{r.role} · {r.company}</span><br />
            <span style={{ color: '#64748B', fontSize: '11px' }}>{r.contact}</span>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div style={{ padding: '16px 0 40px' }}>
      {/* Top Header Card */}
      <div className="card" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '14px', marginBottom: '16px' }}>
        <div>
          <h2 style={{ margin: '0 0 4px' }}>Tech CV & Resume Builder (React & Next.js)</h2>
          <p className="tag" style={{ margin: 0 }}>
            Choose from the top 5 industry formats with live hyperlinks, photo, references, and signature.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => setCvData(defaultCv)}>✨ Reset Sample</button>
          <button className="btn" onClick={handleSave}>💾 Save CV</button>
          <button className="btn" onClick={handleCopyMarkdown}>📋 Copy Markdown</button>
          <button className="btn" onClick={handleDownloadHtml} title="Download an offline standalone HTML file with clickable links">📥 Download Offline (.html)</button>
          <button className="btn p" onClick={handlePrintPdf} title="Print or Save as PDF with working clickable hyperlinks">🖨️ Print / Save PDF</button>
        </div>
      </div>

      {/* Format Switcher */}
      <div className="chips" style={{ margin: '0 0 20px' }}>
        {templates.map(t => (
          <button 
            key={t.id}
            className="chip"
            aria-pressed={currentFormat === t.id}
            onClick={() => handleSelectFormat(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Split Workspace */}
      <div className="cv-workspace-grid">
        
        {/* LEFT FORM EDITOR */}
        <div className="card" style={{ maxHeight: '880px', overflowY: 'auto', padding: '18px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '18px' }}>Edit Resume Details</h3>

          {/* Personal Info */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)' }}>Personal Information</b>
            <input 
              type="text" 
              placeholder="Full Name"
              value={d.name || ''} 
              onChange={e => updateField('name', e.target.value)} 
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '13px', fontWeight: 600 }}
            />
            <input 
              type="text" 
              placeholder="Target Title" 
              value={d.title || ''} 
              onChange={e => updateField('title', e.target.value)} 
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '13px' }}
            />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <input 
                type="email" 
                placeholder="Email" 
                value={d.email || ''} 
                onChange={e => updateField('email', e.target.value)} 
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '13px' }}
              />
              <input 
                type="text" 
                placeholder="Phone" 
                value={d.phone || ''} 
                onChange={e => updateField('phone', e.target.value)} 
                style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '13px' }}
              />
            </div>
            <input 
              type="text" 
              placeholder="Location" 
              value={d.location || ''} 
              onChange={e => updateField('location', e.target.value)} 
              style={{ padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '13px' }}
            />

            {/* Online Links */}
            <div style={{ background: 'var(--code)', border: '1px solid var(--line)', borderRadius: '6px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <b style={{ fontSize: '11.5px', color: 'var(--mute)' }}>🌐 Online Profiles (Full URLs or domains):</b>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🐙</span>
                <input 
                  type="text" 
                  placeholder="GitHub URL (e.g. github.com/username)" 
                  value={d.github || ''} 
                  onChange={e => updateField('github', e.target.value)} 
                  style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>💼</span>
                <input 
                  type="text" 
                  placeholder="LinkedIn URL (e.g. linkedin.com/in/username)" 
                  value={d.linkedin || ''} 
                  onChange={e => updateField('linkedin', e.target.value)} 
                  style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔗</span>
                <input 
                  type="text" 
                  placeholder="Portfolio / Website URL (e.g. username.dev)" 
                  value={d.website || ''} 
                  onChange={e => updateField('website', e.target.value)} 
                  style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }}
                />
              </div>
            </div>

            {/* Profile Photo */}
            <div style={{ background: 'var(--code)', border: '1px solid var(--line)', borderRadius: '6px', padding: '10px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                <b style={{ fontSize: '11.5px', color: 'var(--mute)' }}>📸 Profile Photo:</b>
                <label style={{ fontSize: '12px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                  <input 
                    type="checkbox" 
                    checked={Boolean(d.showPhoto)} 
                    onChange={e => updateField('showPhoto', e.target.checked)} 
                  />
                  Show on CV
                </label>
              </div>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                {d.photoUrl && (
                  <img src={d.photoUrl} alt="Photo" style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} />
                )}
                <input 
                  type="file" 
                  accept="image/*" 
                  onChange={handlePhotoUpload} 
                  style={{ fontSize: '11px' }}
                />
              </div>
            </div>
          </div>

          {/* Professional Summary */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)', display: 'block', marginBottom: '4px' }}>Professional Summary</b>
            <textarea 
              rows={4} 
              value={d.summary || ''} 
              onChange={e => updateField('summary', e.target.value)} 
              style={{ width: '100%', padding: '7px 10px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '12.5px', lineHeight: 1.5 }}
            />
          </div>

          {/* Technical Skills */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)', display: 'block', marginBottom: '8px' }}>Technical Skills</b>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="text" placeholder="Languages (e.g. JavaScript, Python, SQL)" value={d.skills?.languages || ''} onChange={e => updateSkill('languages', e.target.value)} style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '12px' }} />
              <input type="text" placeholder="Frameworks (e.g. React, Node.js, Next.js)" value={d.skills?.frameworks || ''} onChange={e => updateSkill('frameworks', e.target.value)} style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '12px' }} />
              <input type="text" placeholder="Databases (e.g. PostgreSQL, SQLite, MongoDB)" value={d.skills?.databases || ''} onChange={e => updateSkill('databases', e.target.value)} style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '12px' }} />
              <input type="text" placeholder="Tools (e.g. Git, Docker, REST APIs)" value={d.skills?.tools || ''} onChange={e => updateSkill('tools', e.target.value)} style={{ padding: '6px 10px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '12px' }} />
            </div>

            {/* Custom Skills */}
            {(d.customSkills || []).map((cs, i) => (
              <div key={i} style={{ display: 'flex', gap: '6px', marginTop: '6px' }}>
                <input type="text" placeholder="Category" value={cs.category} onChange={e => updateCustomSkill(i, 'category', e.target.value)} style={{ width: '130px', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12px' }} />
                <input type="text" placeholder="Skills" value={cs.items} onChange={e => updateCustomSkill(i, 'items', e.target.value)} style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12px' }} />
                <button className="cv-del-btn" onClick={() => removeCustomSkill(i)}>🗑️</button>
              </div>
            ))}
            <button className="cv-add-btn" onClick={addCustomSkill} style={{ marginTop: '8px' }}>+ Add Custom Skill Category</button>
          </div>

          {/* Featured Projects */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)', display: 'block', marginBottom: '8px' }}>Featured Projects</b>
            {(d.projects || []).map((p, pIdx) => (
              <div key={pIdx} className="cv-slot-card">
                <div className="cv-slot-header">
                  <strong style={{ fontSize: '13px', color: 'var(--acc)' }}>Project #{pIdx + 1}</strong>
                  <button className="cv-del-btn" onClick={() => removeProject(pIdx)}>🗑️</button>
                </div>
                <input type="text" placeholder="Project Title" value={p.title} onChange={e => updateProject(pIdx, 'title', e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12.5px', fontWeight: 600, marginBottom: '6px' }} />
                <input type="text" placeholder="Technologies (e.g. React, Node.js, SQLite)" value={p.technologies} onChange={e => updateProject(pIdx, 'technologies', e.target.value)} style={{ width: '100%', padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', marginBottom: '6px' }} />
                
                {/* Project Links */}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  <input type="text" placeholder="Source URL (github.com/...)" value={p.github || ''} onChange={e => updateProject(pIdx, 'github', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '11.5px' }} />
                  <input type="text" placeholder="Live Demo URL (demo.com)" value={p.demo || ''} onChange={e => updateProject(pIdx, 'demo', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '11.5px' }} />
                </div>

                {/* Bullets */}
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(p.bullets || []).map((b, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', gap: '4px' }}>
                      <input type="text" placeholder="Impact / Result bullet point" value={b} onChange={e => updateProjectBullet(pIdx, bIdx, e.target.value)} style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '11.5px' }} />
                      <button className="cv-del-btn" onClick={() => removeProjectBullet(pIdx, bIdx)}>✕</button>
                    </div>
                  ))}
                  <button className="ghost" onClick={() => addProjectBullet(pIdx)} style={{ fontSize: '11px', padding: '2px', textAlign: 'left', color: 'var(--acc)' }}>+ Add Bullet Point</button>
                </div>
              </div>
            ))}
            <button className="cv-add-btn" onClick={addProject}>+ Add Another Project Slot</button>
          </div>

          {/* Work Experience */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)', display: 'block', marginBottom: '8px' }}>Work Experience</b>
            {(d.experience || []).map((exp, eIdx) => (
              <div key={eIdx} className="cv-slot-card">
                <div className="cv-slot-header">
                  <strong style={{ fontSize: '13px', color: 'var(--acc)' }}>Role #{eIdx + 1}</strong>
                  <button className="cv-del-btn" onClick={() => removeExperience(eIdx)}>🗑️</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                  <input type="text" placeholder="Job Title" value={exp.role} onChange={e => updateExperience(eIdx, 'role', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', fontWeight: 600 }} />
                  <input type="text" placeholder="Company Name" value={exp.company} onChange={e => updateExperience(eIdx, 'company', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '8px' }}>
                  <input type="text" placeholder="Period (e.g. 2024 - Present)" value={exp.period} onChange={e => updateExperience(eIdx, 'period', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                  <input type="text" placeholder="Location (e.g. Remote)" value={exp.location || ''} onChange={e => updateExperience(eIdx, 'location', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  {(exp.bullets || []).map((b, bIdx) => (
                    <div key={bIdx} style={{ display: 'flex', gap: '4px' }}>
                      <input type="text" placeholder="Achievement bullet point" value={b} onChange={e => updateExpBullet(eIdx, bIdx, e.target.value)} style={{ flex: 1, padding: '4px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '11.5px' }} />
                      <button className="cv-del-btn" onClick={() => removeExpBullet(eIdx, bIdx)}>✕</button>
                    </div>
                  ))}
                  <button className="ghost" onClick={() => addExpBullet(eIdx)} style={{ fontSize: '11px', padding: '2px', textAlign: 'left', color: 'var(--acc)' }}>+ Add Bullet Point</button>
                </div>
              </div>
            ))}
            <button className="cv-add-btn" onClick={addExperience}>+ Add Another Experience Slot</button>
          </div>

          {/* Education */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)', display: 'block', marginBottom: '8px' }}>Education & Degree</b>
            {(d.education || []).map((ed, i) => (
              <div key={i} className="cv-slot-card">
                <div className="cv-slot-header">
                  <strong style={{ fontSize: '12px', color: 'var(--acc)' }}>Degree #{i + 1}</strong>
                  <button className="cv-del-btn" onClick={() => removeEducation(i)}>🗑️</button>
                </div>
                <input type="text" placeholder="Degree / Certificate" value={ed.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', fontWeight: 600, marginBottom: '6px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '6px', marginBottom: '6px' }}>
                  <input type="text" placeholder="Institution / University" value={ed.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                  <input type="text" placeholder="Year" value={ed.year} onChange={e => updateEducation(i, 'year', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                </div>
                <input type="text" placeholder="Major / Coursework / CGPA" value={ed.details || ''} onChange={e => updateEducation(i, 'details', e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
              </div>
            ))}
            <button className="cv-add-btn" onClick={addEducation}>+ Add Another Education Slot</button>
          </div>

          {/* References */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)' }}>References</b>
              <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={Boolean(d.referencesUponRequest)} 
                  onChange={e => updateField('referencesUponRequest', e.target.checked)} 
                />
                Available upon request
              </label>
            </div>
            {!d.referencesUponRequest && (
              <>
                {(d.references || []).map((ref, i) => (
                  <div key={i} className="cv-slot-card">
                    <div className="cv-slot-header">
                      <strong style={{ fontSize: '12px', color: 'var(--acc)' }}>Reference #{i + 1}</strong>
                      <button className="cv-del-btn" onClick={() => removeReference(i)}>🗑️</button>
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                      <input type="text" placeholder="Name" value={ref.name} onChange={e => updateReference(i, 'name', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', fontWeight: 600 }} />
                      <input type="text" placeholder="Role" value={ref.role} onChange={e => updateReference(i, 'role', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px' }}>
                      <input type="text" placeholder="Company" value={ref.company} onChange={e => updateReference(i, 'company', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                      <input type="text" placeholder="Contact" value={ref.contact} onChange={e => updateReference(i, 'contact', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                    </div>
                  </div>
                ))}
                <button className="cv-add-btn" onClick={addReference}>+ Add Another Reference Slot</button>
              </>
            )}
          </div>

          {/* Digital Signature */}
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)' }}>Digital Signature & Declaration</b>
              <label style={{ fontSize: '11px', display: 'flex', alignItems: 'center', gap: '4px', cursor: 'pointer' }}>
                <input 
                  type="checkbox" 
                  checked={Boolean(d.signature?.enabled)} 
                  onChange={e => updateSignature('enabled', e.target.checked)} 
                />
                Include on CV
              </label>
            </div>
            {d.signature?.enabled && (
              <div className="cv-slot-card">
                <input type="text" placeholder="Declaration" value={d.signature.declaration || ''} onChange={e => updateSignature('declaration', e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', marginBottom: '6px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                  <input type="date" value={d.signature.date || ''} onChange={e => updateSignature('date', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                  <input type="text" placeholder="Place" value={d.signature.place || ''} onChange={e => updateSignature('place', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                </div>
                <input type="text" placeholder="Typed Signature" value={d.signature.typedName || d.name} onChange={e => updateSignature('typedName', e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '13px', fontWeight: 600 }} />
              </div>
            )}
          </div>

        </div>

        {/* RIGHT LIVE A4 SHEET CANVAS */}
        <div style={{ display: 'flex', justifyContent: 'center', overflowX: 'auto' }}>
          <div id="cv-preview-sheet" className={`cv-sheet cv-${currentFormat}`}>
            
            {/* 1. ATS MODERN TEMPLATE */}
            {currentFormat === 'ats-modern' && (
              <div className="ats-wrapper">
                <header className="ats-header" style={d.showPhoto && d.photoUrl ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center', textAlign: 'left' } : {}}>
                  <div style={{ flex: 1 }}>
                    <h1 className="ats-name">{d.name}</h1>
                    <div className="ats-title">{d.title}</div>
                    <div className="ats-contact">
                      <a href={`mailto:${d.email}`}>{d.email}</a> · {d.phone && <a href={`tel:${d.phone}`}>{d.phone}</a>} · {d.location}
                      <br />
                      {d.github && <><a href={safeUrl(d.github)} target="_blank" rel="noopener noreferrer">🐙 GitHub</a> | </>}
                      {d.linkedin && <><a href={safeUrl(d.linkedin)} target="_blank" rel="noopener noreferrer">💼 LinkedIn</a> | </>}
                      {d.website && <><a href={safeUrl(d.website)} target="_blank" rel="noopener noreferrer">🌐 Portfolio</a></>}
                    </div>
                  </div>
                  {d.showPhoto && d.photoUrl && (
                    <img src={d.photoUrl} className="cv-photo-circle" alt="Photo" style={{ marginLeft: '16px' }} />
                  )}
                </header>

                <section className="ats-section">
                  <h2 className="ats-sec-title">PROFESSIONAL SUMMARY</h2>
                  <p className="ats-text" style={{ fontSize: '12.5px', lineHeight: 1.55, margin: 0 }}>{d.summary}</p>
                </section>

                <section className="ats-section">
                  <h2 className="ats-sec-title">TECHNICAL SKILLS</h2>
                  <div className="ats-skills-list">
                    <div><b>Languages:</b> {d.skills?.languages}</div>
                    <div><b>Frameworks & Libraries:</b> {d.skills?.frameworks}</div>
                    <div><b>Databases:</b> {d.skills?.databases}</div>
                    <div><b>Developer Tools:</b> {d.skills?.tools}</div>
                    {(d.customSkills || []).map((cs, i) => (
                      <div key={i}><b>{cs.category}:</b> {cs.items}</div>
                    ))}
                  </div>
                </section>

                <section className="ats-section">
                  <h2 className="ats-sec-title">FEATURED PROJECTS</h2>
                  {(d.projects || []).map((p, i) => (
                    <div key={i} className="ats-item">
                      <div className="ats-item-header">
                        <div>
                          <b>{p.title}</b> | <i>{p.technologies}</i>
                        </div>
                        <span className="ats-links" style={{ display: 'inline-flex', gap: '6px' }}>
                          {p.github && <a href={safeUrl(p.github)} target="_blank" rel="noopener noreferrer">[Source]</a>}
                          {p.demo && <a href={safeUrl(p.demo)} target="_blank" rel="noopener noreferrer">[Demo]</a>}
                        </span>
                      </div>
                      <ul className="ats-bullets">
                        {(p.bullets || []).map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>

                <section className="ats-section">
                  <h2 className="ats-sec-title">WORK EXPERIENCE</h2>
                  {(d.experience || []).map((exp, i) => (
                    <div key={i} className="ats-item">
                      <div className="ats-item-header">
                        <b>{exp.role}</b> · {exp.company} {exp.location ? `(${exp.location})` : ''}
                        <span className="ats-date">{exp.period}</span>
                      </div>
                      <ul className="ats-bullets">
                        {(exp.bullets || []).map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>

                <section className="ats-section">
                  <h2 className="ats-sec-title">EDUCATION</h2>
                  {(d.education || []).map((ed, i) => (
                    <div key={i} className="ats-item">
                      <div className="ats-item-header">
                        <b>{ed.degree}</b>
                        <span className="ats-date">{ed.year}</span>
                      </div>
                      <div>{ed.institution} {ed.details ? `— ${ed.details}` : ''}</div>
                    </div>
                  ))}
                </section>

                {(d.referencesUponRequest || (d.references && d.references.length > 0)) && (
                  <section className="ats-section">
                    <h2 className="ats-sec-title">REFERENCES</h2>
                    {renderReferences()}
                  </section>
                )}

                {renderSignature()}
              </div>
            )}

            {/* 2. TWO-COLUMN ENGINEERING TEMPLATE */}
            {currentFormat === 'two-column' && (
              <div className="twocol-wrapper">
                <aside className="twocol-sidebar">
                  {d.showPhoto && d.photoUrl && (
                    <div style={{ textAlign: 'center', marginBottom: '12px' }}>
                      <img src={d.photoUrl} className="cv-photo-circle" alt="Photo" style={{ margin: '0 auto' }} />
                    </div>
                  )}
                  <h1 className="twocol-name">{d.name}</h1>
                  <div className="twocol-title">{d.title}</div>

                  <div className="twocol-group">
                    <h3>Contact & Links</h3>
                    <div>📧 <a href={`mailto:${d.email}`}>{d.email}</a></div>
                    <div>📱 <a href={`tel:${d.phone}`}>{d.phone}</a></div>
                    <div>📍 {d.location}</div>
                    {d.github && <div>🐙 <a href={safeUrl(d.github)} target="_blank" rel="noopener noreferrer">GitHub</a></div>}
                    {d.linkedin && <div>💼 <a href={safeUrl(d.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a></div>}
                    {d.website && <div>🌐 <a href={safeUrl(d.website)} target="_blank" rel="noopener noreferrer">Portfolio</a></div>}
                  </div>

                  <div className="twocol-group">
                    <h3>Skills & Stack</h3>
                    <p><b>Languages:</b><br />{d.skills?.languages}</p>
                    <p><b>Frameworks:</b><br />{d.skills?.frameworks}</p>
                    <p><b>Databases:</b><br />{d.skills?.databases}</p>
                    <p><b>Tools:</b><br />{d.skills?.tools}</p>
                  </div>

                  <div className="twocol-group">
                    <h3>Education</h3>
                    {(d.education || []).map((ed, i) => (
                      <p key={i} style={{ marginBottom: '8px' }}>
                        <b>{ed.degree}</b><br />
                        {ed.institution} ({ed.year})
                      </p>
                    ))}
                  </div>

                  {(d.referencesUponRequest || (d.references && d.references.length > 0)) && (
                    <div className="twocol-group">
                      <h3>References</h3>
                      {renderReferences()}
                    </div>
                  )}
                </aside>

                <main className="twocol-main">
                  <section>
                    <h2 className="twocol-heading">Profile Summary</h2>
                    <p style={{ fontSize: '12.5px', lineHeight: 1.6, margin: 0 }}>{d.summary}</p>
                  </section>

                  <section>
                    <h2 className="twocol-heading">Featured Engineering Projects</h2>
                    {(d.projects || []).map((p, i) => (
                      <div key={i} style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>
                          <b>{p.title}</b>
                          <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                            <span style={{ color: '#64748B' }}>{p.technologies}</span>
                            {p.github && <a href={safeUrl(p.github)} target="_blank" rel="noopener noreferrer">[Source]</a>}
                            {p.demo && <a href={safeUrl(p.demo)} target="_blank" rel="noopener noreferrer">[Demo]</a>}
                          </div>
                        </div>
                        <ul style={{ margin: '4px 0 0 16px', fontSize: '12px', lineHeight: 1.5 }}>
                          {(p.bullets || []).map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </section>

                  <section>
                    <h2 className="twocol-heading">Work Experience</h2>
                    {(d.experience || []).map((exp, i) => (
                      <div key={i} style={{ marginBottom: '14px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                          <b>{exp.role} · {exp.company}</b>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>{exp.period}</span>
                        </div>
                        <ul style={{ margin: '4px 0 0 16px', fontSize: '12px', lineHeight: 1.5 }}>
                          {(exp.bullets || []).map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </section>

                  {renderSignature()}
                </main>
              </div>
            )}

            {/* 3. EXECUTIVE IMPACT TEMPLATE */}
            {currentFormat === 'executive-impact' && (
              <div className="exec-wrapper">
                <header className="exec-header" style={d.showPhoto && d.photoUrl ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } : {}}>
                  <div>
                    <h1>{d.name}</h1>
                    <div className="exec-subtitle">{d.title} | Engineering Leadership</div>
                    <div className="exec-contact-bar">
                      <a href={`mailto:${d.email}`}>{d.email}</a> · {d.phone} · {d.location}
                      {d.github && <> · <a href={safeUrl(d.github)} target="_blank" rel="noopener noreferrer">GitHub</a></>}
                      {d.linkedin && <> · <a href={safeUrl(d.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a></>}
                      {d.website && <> · <a href={safeUrl(d.website)} target="_blank" rel="noopener noreferrer">Portfolio</a></>}
                    </div>
                  </div>
                  {d.showPhoto && d.photoUrl && (
                    <img src={d.photoUrl} className="cv-photo-square" alt="Photo" />
                  )}
                </header>

                <section className="exec-section">
                  <h2 className="exec-title">EXECUTIVE SUMMARY</h2>
                  <p className="exec-summary" style={{ fontSize: '12.5px', lineHeight: 1.6, margin: 0 }}>{d.summary}</p>
                </section>

                <section className="exec-section">
                  <h2 className="exec-title">CORE TECHNICAL ARCHITECTURE</h2>
                  <div className="exec-competencies" style={{ fontSize: '12.5px', lineHeight: 1.6 }}>
                    <div><b>Languages & Stacks:</b> {d.skills?.languages}</div>
                    <div><b>Frameworks:</b> {d.skills?.frameworks}</div>
                    <div><b>Databases & Systems:</b> {d.skills?.databases}, {d.skills?.tools}</div>
                  </div>
                </section>

                <section className="exec-section">
                  <h2 className="exec-title">KEY ENGINEERING DELIVERABLES</h2>
                  {(d.projects || []).map((p, i) => (
                    <div key={i} className="exec-item">
                      <div className="exec-item-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap', gap: '6px' }}>
                        <div>
                          <b>{p.title}</b> — <span>{p.technologies}</span>
                        </div>
                        <div style={{ fontSize: '11px', display: 'flex', gap: '6px' }}>
                          {p.github && <a href={safeUrl(p.github)} target="_blank" rel="noopener noreferrer">[Source]</a>}
                          {p.demo && <a href={safeUrl(p.demo)} target="_blank" rel="noopener noreferrer">[Demo]</a>}
                        </div>
                      </div>
                      <ul style={{ margin: '4px 0 0 18px', fontSize: '12px', lineHeight: 1.5 }}>
                        {(p.bullets || []).map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>

                <section className="exec-section">
                  <h2 className="exec-title">EMPLOYMENT HISTORY</h2>
                  {(d.experience || []).map((exp, i) => (
                    <div key={i} className="exec-item">
                      <div className="exec-item-title">
                        <b>{exp.role}</b>, {exp.company}
                        <span style={{ float: 'right', fontWeight: 'normal', fontSize: '12px' }}>{exp.period}</span>
                      </div>
                      <ul style={{ margin: '4px 0 0 18px', fontSize: '12px', lineHeight: 1.5 }}>
                        {(exp.bullets || []).map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>

                <section className="exec-section">
                  <h2 className="exec-title">EDUCATION</h2>
                  {(d.education || []).map((ed, i) => (
                    <div key={i} style={{ marginBottom: '8px', fontSize: '12.5px' }}>
                      <b>{ed.degree}</b> — {ed.institution} <span style={{ float: 'right' }}>{ed.year}</span>
                    </div>
                  ))}
                </section>

                {renderSignature()}
              </div>
            )}

            {/* 4. DEVELOPER MINIMALIST */}
            {currentFormat === 'developer-minimal' && (
              <div className="minimal-wrapper">
                <div className="minimal-head" style={d.showPhoto && d.photoUrl ? { display: 'flex', justifyContent: 'space-between', alignItems: 'center' } : {}}>
                  <div>
                    <div className="minimal-prompt">$ whoami</div>
                    <h1 className="minimal-name">{d.name}</h1>
                    <div className="minimal-role">&gt; {d.title}</div>
                    <div className="minimal-meta">contact: [ <a href={`mailto:${d.email}`}>{d.email}</a> | {d.phone} | {d.location} ]</div>
                    <div className="minimal-meta">
                      links: [ 
                        {d.github && <><a href={safeUrl(d.github)} target="_blank" rel="noopener noreferrer">github</a> | </>}
                        {d.linkedin && <><a href={safeUrl(d.linkedin)} target="_blank" rel="noopener noreferrer">linkedin</a> | </>}
                        {d.website && <><a href={safeUrl(d.website)} target="_blank" rel="noopener noreferrer">portfolio</a></>}
                      ]
                    </div>
                  </div>
                  {d.showPhoto && d.photoUrl && (
                    <img src={d.photoUrl} className="cv-photo-square" alt="Photo" />
                  )}
                </div>

                <div className="minimal-sec">
                  <div className="minimal-sec-head">## 01. SUMMARY</div>
                  <p style={{ margin: 0 }}>{d.summary}</p>
                </div>

                <div className="minimal-sec">
                  <div className="minimal-sec-head">## 02. STACK</div>
                  <pre><code>languages: {d.skills?.languages}{'\n'}frameworks: {d.skills?.frameworks}{'\n'}databases: {d.skills?.databases}{'\n'}tools: {d.skills?.tools}</code></pre>
                </div>

                <div className="minimal-sec">
                  <div className="minimal-sec-head">## 03. PROJECTS ({(d.projects || []).length})</div>
                  {(d.projects || []).map((p, i) => (
                    <div key={i} style={{ marginBottom: '10px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', flexWrap: 'wrap' }}>
                        <b>* {p.title}</b> <span>[{p.technologies}]</span>
                        <span style={{ fontSize: '11px', display: 'flex', gap: '6px' }}>
                          {p.github && <a href={safeUrl(p.github)} target="_blank" rel="noopener noreferrer">[src]</a>}
                          {p.demo && <a href={safeUrl(p.demo)} target="_blank" rel="noopener noreferrer">[demo]</a>}
                        </span>
                      </div>
                      <ul style={{ margin: '3px 0 0 16px' }}>
                        {(p.bullets || []).map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="minimal-sec">
                  <div className="minimal-sec-head">## 04. EXPERIENCE</div>
                  {(d.experience || []).map((exp, i) => (
                    <div key={i} style={{ marginBottom: '10px' }}>
                      <b>* {exp.role} @ {exp.company}</b> [{exp.period}]
                      <ul style={{ margin: '3px 0 0 16px' }}>
                        {(exp.bullets || []).map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </div>

                <div className="minimal-sec">
                  <div className="minimal-sec-head">## 05. EDUCATION</div>
                  {(d.education || []).map((ed, i) => (
                    <div key={i} style={{ marginBottom: '6px' }}>
                      * <b>{ed.degree}</b>, {ed.institution} ({ed.year})
                    </div>
                  ))}
                </div>

                {renderSignature()}
              </div>
            )}

            {/* 5. CREATIVE FRONTEND */}
            {currentFormat === 'frontend-creative' && (
              <div className="creative-wrapper">
                <header className="creative-header">
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                    {d.showPhoto && d.photoUrl && (
                      <img src={d.photoUrl} className="cv-photo-circle" alt="Photo" />
                    )}
                    <div>
                      <h1 className="creative-name">{d.name}</h1>
                      <div className="creative-title">{d.title}</div>
                    </div>
                  </div>
                  <div className="creative-contact">
                    <div>📧 <a href={`mailto:${d.email}`}>{d.email}</a></div>
                    <div>📱 {d.phone}</div>
                    <div>📍 {d.location}</div>
                    <div style={{ marginTop: '4px', display: 'flex', gap: '8px', justifyContent: 'flex-end', fontSize: '11.5px' }}>
                      {d.github && <a href={safeUrl(d.github)} target="_blank" rel="noopener noreferrer">GitHub</a>}
                      {d.linkedin && <a href={safeUrl(d.linkedin)} target="_blank" rel="noopener noreferrer">LinkedIn</a>}
                      {d.website && <a href={safeUrl(d.website)} target="_blank" rel="noopener noreferrer">Portfolio</a>}
                    </div>
                  </div>
                </header>

                <section className="creative-section">
                  <h3>About Me</h3>
                  <p style={{ fontSize: '13px', lineHeight: 1.6, margin: 0 }}>{d.summary}</p>
                </section>

                <section className="creative-section">
                  <h3>Skills & Tools</h3>
                  <div className="creative-pills">
                    {((d.skills?.languages || '') + ', ' + (d.skills?.frameworks || '') + ', ' + (d.skills?.databases || '')).split(',').map((s, i) => (
                      <span key={i} className="creative-pill">{s.trim()}</span>
                    ))}
                  </div>
                </section>

                <section className="creative-section">
                  <h3>Featured Projects ({(d.projects || []).length})</h3>
                  <div className="creative-projects-grid">
                    {(d.projects || []).map((p, i) => (
                      <div key={i} className="creative-project-card">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '2px' }}>
                          <b>{p.title}</b>
                          <div style={{ fontSize: '11px', display: 'flex', gap: '6px' }}>
                            {p.github && <a href={safeUrl(p.github)} target="_blank" rel="noopener noreferrer">Code ↗</a>}
                            {p.demo && <a href={safeUrl(p.demo)} target="_blank" rel="noopener noreferrer">Demo ↗</a>}
                          </div>
                        </div>
                        <span className="creative-stack">{p.technologies}</span>
                        <ul style={{ margin: '0 0 0 16px', fontSize: '12px', lineHeight: 1.45 }}>
                          {(p.bullets || []).map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </section>

                <section className="creative-section">
                  <h3>Experience</h3>
                  {(d.experience || []).map((exp, i) => (
                    <div key={i} style={{ marginBottom: '12px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <b>{exp.role} · <span style={{ color: '#0E7C7B' }}>{exp.company}</span></b>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>{exp.period}</span>
                      </div>
                      <ul style={{ margin: '4px 0 0 16px', fontSize: '12px', lineHeight: 1.5 }}>
                        {(exp.bullets || []).map((b, bIdx) => <li key={bIdx}>{b}</li>)}
                      </ul>
                    </div>
                  ))}
                </section>

                <section className="creative-section">
                  <h3>Education</h3>
                  {(d.education || []).map((ed, i) => (
                    <div key={i} style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <b>{ed.degree}</b>
                        <span style={{ fontSize: '12px', color: '#64748B' }}>{ed.year}</span>
                      </div>
                      <div style={{ fontSize: '12px' }}>{ed.institution}</div>
                    </div>
                  ))}
                </section>

                {renderSignature()}
              </div>
            )}

          </div>
        </div>

      </div>
    </div>
  );
}
