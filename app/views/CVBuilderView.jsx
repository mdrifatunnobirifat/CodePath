'use client';
import React, { useState } from 'react';

export default function CVBuilderView({ initialCvData, onSaveCv, user }) {
  const [currentFormat, setCurrentFormat] = useState('ats-modern');

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

  // Dynamic Education Slots
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

  // Dynamic Work Experience Slots
  const addExperience = () => {
    setCvData(prev => ({
      ...prev,
      experience: [...(prev.experience || []), { role: '', company: '', period: '', location: '', bullets: [''] }]
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

  const updateExperienceBullets = (idx, val) => {
    setCvData(prev => {
      const exp = [...prev.experience];
      exp[idx] = { ...exp[idx], bullets: val.split('\n').filter(b => b.trim().length > 0) };
      return { ...prev, experience: exp };
    });
  };

  // Dynamic Project Slots
  const addProject = () => {
    setCvData(prev => ({
      ...prev,
      projects: [...(prev.projects || []), { title: '', technologies: '', github: '', demo: '', bullets: [''] }]
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
      const projs = [...prev.projects];
      projs[idx] = { ...projs[idx], [field]: val };
      return { ...prev, projects: projs };
    });
  };

  const updateProjectBullets = (idx, val) => {
    setCvData(prev => {
      const projs = [...prev.projects];
      projs[idx] = { ...projs[idx], bullets: val.split('\n').filter(b => b.trim().length > 0) };
      return { ...prev, projects: projs };
    });
  };

  // Custom Skills
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
${d.email} | ${d.phone} | ${d.location} | [GitHub](${d.github}) | [LinkedIn](${d.linkedin})

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
${(p.bullets || []).map(b => `- ${b}`).join('\n')}
`).join('\n')}

## Work Experience
${(d.experience || []).map(e => `### ${e.role} - ${e.company} (${e.period})
${(e.bullets || []).map(b => `- ${b}`).join('\n')}
`).join('\n')}

## Education
${(d.education || []).map(ed => `- **${ed.degree}**, ${ed.institution} (${ed.year || ''})`).join('\n')}
`;
    navigator.clipboard.writeText(md);
    alert('Formatted Markdown copied to clipboard!');
  };

  const d = cvData;

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
            Choose from the top 5 industry formats with unlimited dynamic slots, photo, references, and signature.
          </p>
        </div>
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button className="btn" onClick={() => setCvData(defaultCv)}>✨ Reset Sample</button>
          <button className="btn" onClick={handleSave}>💾 Save CV</button>
          <button className="btn" onClick={handleCopyMarkdown}>📋 Copy Markdown</button>
          <button className="btn p" onClick={() => window.print()}>🖨️ Print / Download PDF</button>
        </div>
      </div>

      {/* Format Switcher */}
      <div className="chips" style={{ margin: '0 0 20px' }}>
        {templates.map(t => (
          <button 
            key={t.id}
            className="chip"
            aria-pressed={currentFormat === t.id}
            onClick={() => setCurrentFormat(t.id)}
          >
            {t.name}
          </button>
        ))}
      </div>

      {/* Split Workspace */}
      <div style={{ display: 'grid', gridTemplateColumns: '460px 1fr', gap: '20px', alignItems: 'start' }}>
        
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

            {/* Links */}
            <div style={{ background: 'var(--code)', border: '1px solid var(--line)', borderRadius: '6px', padding: '10px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <b style={{ fontSize: '11.5px', color: 'var(--mute)' }}>🌐 Online Profiles:</b>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🐙</span>
                <input 
                  type="text" 
                  placeholder="GitHub URL" 
                  value={d.github || ''} 
                  onChange={e => updateField('github', e.target.value)} 
                  style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>💼</span>
                <input 
                  type="text" 
                  placeholder="LinkedIn URL" 
                  value={d.linkedin || ''} 
                  onChange={e => updateField('linkedin', e.target.value)} 
                  style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }}
                />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                <span>🔗</span>
                <input 
                  type="text" 
                  placeholder="Portfolio / Website URL" 
                  value={d.website || ''} 
                  onChange={e => updateField('website', e.target.value)} 
                  style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }}
                />
              </div>
            </div>

            {/* Photo */}
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
                <label className="btn" style={{ padding: '5px 10px', fontSize: '12px', cursor: 'pointer', background: 'var(--panel)', border: '1px solid var(--line)' }}>
                  📁 Upload Photo
                  <input type="file" accept="image/*" style={{ display: 'none' }} onChange={handlePhotoUpload} />
                </label>
                <input 
                  type="text" 
                  placeholder="Or paste image URL" 
                  value={d.photoUrl || ''} 
                  onChange={e => updateField('photoUrl', e.target.value)} 
                  style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }}
                />
              </div>
            </div>
          </div>

          {/* Summary */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)', display: 'block', marginBottom: '6px' }}>Professional Summary</b>
            <textarea 
              rows={4} 
              value={d.summary || ''} 
              onChange={e => updateField('summary', e.target.value)}
              style={{ width: '100%', padding: '8px', borderRadius: '6px', border: '1px solid var(--line)', background: 'var(--code)', color: 'var(--ink)', fontSize: '13px', fontFamily: 'inherit' }}
            />
          </div>

          {/* Technical Skills */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)' }}>Technical Skills</b>
              <button className="ghost" onClick={addCustomSkill} style={{ fontSize: '11px', padding: '2px 8px' }}>+ Add Skill Group</button>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <input type="text" placeholder="Languages" value={d.skills?.languages || ''} onChange={e => updateSkill('languages', e.target.value)} style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12.5px' }} />
              <input type="text" placeholder="Frameworks" value={d.skills?.frameworks || ''} onChange={e => updateSkill('frameworks', e.target.value)} style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12.5px' }} />
              <input type="text" placeholder="Databases" value={d.skills?.databases || ''} onChange={e => updateSkill('databases', e.target.value)} style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12.5px' }} />
              <input type="text" placeholder="Tools" value={d.skills?.tools || ''} onChange={e => updateSkill('tools', e.target.value)} style={{ padding: '6px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12.5px' }} />
              
              {(d.customSkills || []).map((cs, i) => (
                <div key={i} style={{ display: 'flex', gap: '6px', alignItems: 'center' }}>
                  <input type="text" placeholder="Group" value={cs.category} onChange={e => updateCustomSkill(i, 'category', e.target.value)} style={{ width: '110px', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12px' }} />
                  <input type="text" placeholder="Skills list" value={cs.items} onChange={e => updateCustomSkill(i, 'items', e.target.value)} style={{ flex: 1, padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--code)', fontSize: '12px' }} />
                  <button className="cv-del-btn" onClick={() => removeCustomSkill(i)}>✕</button>
                </div>
              ))}
            </div>
          </div>

          {/* Dynamic Featured Projects */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)' }}>Featured Projects ({(d.projects || []).length})</b>
              <button className="ghost" onClick={addProject} style={{ fontSize: '11px', padding: '2px 8px' }}>+ Add Project</button>
            </div>
            {(d.projects || []).map((p, i) => (
              <div key={i} className="cv-slot-card">
                <div className="cv-slot-header">
                  <strong style={{ fontSize: '12px', color: 'var(--acc)' }}>Project #{i + 1}</strong>
                  <button className="cv-del-btn" onClick={() => removeProject(i)}>🗑️</button>
                </div>
                <input type="text" placeholder="Title" value={p.title} onChange={e => updateProject(i, 'title', e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }} />
                <input type="text" placeholder="Tech Stack" value={p.technologies} onChange={e => updateProject(i, 'technologies', e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', marginBottom: '6px' }} />
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                  <input type="text" placeholder="GitHub" value={p.github || ''} onChange={e => updateProject(i, 'github', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                  <input type="text" placeholder="Demo" value={p.demo || ''} onChange={e => updateProject(i, 'demo', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                </div>
                <textarea rows={3} placeholder="Bullets (1 per line)" value={(p.bullets || []).join('\n')} onChange={e => updateProjectBullets(i, e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', fontFamily: 'inherit' }} />
              </div>
            ))}
            <button className="cv-add-btn" onClick={addProject}>+ Add Another Project Slot</button>
          </div>

          {/* Dynamic Work Experience */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)' }}>Work Experience ({(d.experience || []).length})</b>
              <button className="ghost" onClick={addExperience} style={{ fontSize: '11px', padding: '2px 8px' }}>+ Add Experience</button>
            </div>
            {(d.experience || []).map((exp, i) => (
              <div key={i} className="cv-slot-card">
                <div className="cv-slot-header">
                  <strong style={{ fontSize: '12px', color: 'var(--acc)' }}>Role #{i + 1}</strong>
                  <button className="cv-del-btn" onClick={() => removeExperience(i)}>🗑️</button>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                  <input type="text" placeholder="Role" value={exp.role} onChange={e => updateExperience(i, 'role', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', fontWeight: 600 }} />
                  <input type="text" placeholder="Company" value={exp.company} onChange={e => updateExperience(i, 'company', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '6px', marginBottom: '6px' }}>
                  <input type="text" placeholder="Period" value={exp.period} onChange={e => updateExperience(i, 'period', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                  <input type="text" placeholder="Location" value={exp.location || ''} onChange={e => updateExperience(i, 'location', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                </div>
                <textarea rows={3} placeholder="Bullets (1 per line)" value={(exp.bullets || []).join('\n')} onChange={e => updateExperienceBullets(i, e.target.value)} style={{ width: '100%', padding: '6px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', fontFamily: 'inherit' }} />
              </div>
            ))}
            <button className="cv-add-btn" onClick={addExperience}>+ Add Another Work Experience Slot</button>
          </div>

          {/* Dynamic Education */}
          <div style={{ marginBottom: '16px', borderBottom: '1px solid var(--line)', paddingBottom: '16px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
              <b style={{ fontSize: '12px', textTransform: 'uppercase', color: 'var(--mute)' }}>Education Degrees ({(d.education || []).length})</b>
              <button className="ghost" onClick={addEducation} style={{ fontSize: '11px', padding: '2px 8px' }}>+ Add Education</button>
            </div>
            {(d.education || []).map((ed, i) => (
              <div key={i} className="cv-slot-card">
                <div className="cv-slot-header">
                  <strong style={{ fontSize: '12px', color: 'var(--acc)' }}>Education #{i + 1}</strong>
                  <button className="cv-del-btn" onClick={() => removeEducation(i)}>🗑️</button>
                </div>
                <input type="text" placeholder="Degree" value={ed.degree} onChange={e => updateEducation(i, 'degree', e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px', marginBottom: '6px', fontWeight: 600 }} />
                <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '6px', marginBottom: '6px' }}>
                  <input type="text" placeholder="Institution" value={ed.institution} onChange={e => updateEducation(i, 'institution', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                  <input type="text" placeholder="Years" value={ed.year || ''} onChange={e => updateEducation(i, 'year', e.target.value)} style={{ padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
                </div>
                <input type="text" placeholder="Major / CGPA" value={ed.details || ''} onChange={e => updateEducation(i, 'details', e.target.value)} style={{ width: '100%', padding: '5px 8px', borderRadius: '4px', border: '1px solid var(--line)', background: 'var(--panel)', fontSize: '12px' }} />
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
                      {d.email} · {d.phone} · {d.location}
                      <br />
                      {d.github && <><a href={d.github} target="_blank">🐙 GitHub</a> | </>}
                      {d.linkedin && <><a href={d.linkedin} target="_blank">💼 LinkedIn</a> | </>}
                      {d.website && <><a href={d.website} target="_blank">🌐 Portfolio</a></>}
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
                        <b>{p.title}</b> | <i>{p.technologies}</i>
                        <span className="ats-links">
                          {p.github && <a href={p.github} target="_blank">[Source] </a>}
                          {p.demo && <a href={p.demo} target="_blank">[Demo]</a>}
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
                    <h3>Contact</h3>
                    <div>📧 {d.email}</div>
                    <div>📱 {d.phone}</div>
                    <div>📍 {d.location}</div>
                    {d.github && <div>🐙 <a href={d.github} target="_blank">GitHub</a></div>}
                    {d.linkedin && <div>💼 <a href={d.linkedin} target="_blank">LinkedIn</a></div>}
                    {d.website && <div>🌐 <a href={d.website} target="_blank">Portfolio</a></div>}
                  </div>

                  <div className="twocol-group">
                    <h3>Skills & Tools</h3>
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
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline' }}>
                          <b>{p.title}</b>
                          <span style={{ fontSize: '11px', color: '#64748B' }}>{p.technologies}</span>
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
                      {d.email} · {d.phone} · {d.location} · {d.github}
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
                      <div className="exec-item-title">
                        <b>{p.title}</b> — <span>{p.technologies}</span>
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
                    <div className="minimal-meta">contact: [ {d.email} | {d.phone} | {d.location} ]</div>
                    <div className="minimal-meta">links: [ <a href={d.github}>github</a> | <a href={d.linkedin}>linkedin</a> ]</div>
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
                      <b>* {p.title}</b> [{p.technologies}]
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
                    <div>📧 {d.email}</div>
                    <div>📱 {d.phone}</div>
                    <div>📍 {d.location}</div>
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
                        <b>{p.title}</b>
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

