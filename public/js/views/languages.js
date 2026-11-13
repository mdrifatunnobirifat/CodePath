// CodePath Language Selection Portal (First-time landing hub)
const LanguagesView = {
  languages: [
    {
      id: 'JavaScript',
      icon: '🟨',
      name: 'JavaScript',
      category: 'Web & Full-Stack',
      desc: 'Master closures, event loop, functional array transformations, and asynchronous coding.',
      badge: '100 Practice Problems · 12 Topics'
    },
    {
      id: 'React',
      icon: '⚛️',
      name: 'React',
      category: 'Frontend UI',
      desc: 'Build component architecture, hooks (useState, useEffect), state lifting, and interactive DOM tests.',
      badge: '100 Component Challenges · 12 Topics'
    },
    {
      id: 'Python',
      icon: '🐍',
      name: 'Python',
      category: 'Backend & Data',
      desc: 'Learn Pythonic data structures, algorithm patterns, list comprehensions, and backend scripting.',
      badge: '100 Practice Problems · 12 Topics'
    },
    {
      id: 'SQL',
      icon: '🗄️',
      name: 'Relational SQL',
      category: 'Databases & Systems',
      desc: 'Master SELECT, WHERE filters, GROUP BY, aggregations, INNER/LEFT joins, and performance indexing.',
      badge: '100 Real Query Challenges · 12 Topics'
    },
    {
      id: 'C#',
      icon: '🟣',
      name: 'C# & .NET',
      category: 'Enterprise & APIs',
      desc: 'Object-oriented programming, generic collections, LINQ declarative querying, and ASP.NET Core.',
      badge: '100 Practice Problems · 12 Topics'
    },
    {
      id: 'PHP',
      icon: '🐘',
      name: 'PHP',
      category: 'Backend Web',
      desc: 'Modern backend logic, array manipulation, string compression, and RESTful API data flows.',
      badge: '100 Practice Problems · 12 Topics'
    }
  ],

  render() {
    const app = document.getElementById('app');
    const currentLang = Store.state.selectedLanguage || 'JavaScript';

    app.innerHTML = `
      <div style="display: flex; flex-direction: column; gap: 24px;">
        <div class="lang-hero">
          <span class="badge easy" style="margin-bottom: 8px;">60-Day Job Preparation Plan</span>
          <h1 style="font-size: 36px; margin: 8px 0;">Choose Your Language Track</h1>
          <p class="tag" style="font-size: 16px;">
            Select the programming language you want to master. You will get a personalized two-segment dashboard with <b>Basic-to-Strong Lessons</b> and <b>100+ Job-Ready Coding Problems</b>.
          </p>
        </div>

        <div class="lang-grid">
          ${this.languages.map(lang => `
            <div class="lang-card ${lang.id === currentLang ? 'active-border' : ''}" onclick="LanguagesView.onSelectLanguage('${lang.id}')">
              <div>
                <div class="lang-card-top">
                  <div class="lang-icon">${lang.icon}</div>
                  <div>
                    <h3 style="font-size: 20px;">${lang.name}</h3>
                    <span class="tag">${lang.category}</span>
                  </div>
                </div>
                <p style="font-size: 14px; color: var(--mute); margin: 10px 0 16px; line-height: 1.5;">${lang.desc}</p>
              </div>

              <div>
                <div style="display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--line); padding-top: 12px; margin-top: 6px;">
                  <span class="pill" style="margin: 0; font-size: 11px;">${lang.badge}</span>
                  <button class="btn p" style="padding: 6px 14px; font-size: 13px;">Start Learning →</button>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  },

  onSelectLanguage(langId) {
    if (Store.state.isAuthenticated) {
      // User is logged in: proceed immediately
      Store.selectLanguage(langId);
    } else {
      // User is not logged in: pop up the Sign Up / Login modal
      AuthView.openModal('signup', langId);
    }
  }
};

