// CodePath Main Router & Application Orchestrator
const routes = {
  languages: LanguagesView,
  dashboard: DashboardView,
  tracks: TracksView,
  lessons: LessonsView,
  practice: PracticeView,
  quizzes: QuizzesView,
  interview: InterviewView,
  projects: ProjectsView,
  jobs: JobsView,
  readiness: ReadinessView,
  cv: CVBuilderView,
  portfolio: ProfileView,
  admin: AdminView
};

let currentTab = 'languages';

function navigate(tabName, params = {}) {
  // Enforce strict authentication for all workspace features
  if (!Store.state.isAuthenticated && tabName !== 'languages') {
    AuthView.openModal('login');
    tabName = 'languages';
  }

  const target = routes[tabName] || routes.languages;
  currentTab = tabName;

  // Update active state in drawer menu
  document.querySelectorAll('.drawer-nav-item').forEach(btn => {
    btn.setAttribute('aria-current', btn.dataset.t === tabName ? 'page' : 'false');
  });

  // Close drawer if open
  closeDrawer();

  // Render target view
  target.render(params);

  // Sync hash
  window.location.hash = tabName;
}

function openDrawer() {
  document.getElementById('drawer-menu')?.classList.add('open');
  const backdrop = document.getElementById('drawer-backdrop');
  if (backdrop) backdrop.style.display = 'block';
}

function closeDrawer() {
  document.getElementById('drawer-menu')?.classList.remove('open');
  const backdrop = document.getElementById('drawer-backdrop');
  if (backdrop) backdrop.style.display = 'none';
}

window.addEventListener('DOMContentLoaded', () => {
  Store.init();
  AuthView.init();

  // 1. Subscribe UI to Store State Changes
  Store.subscribe((state) => {
    // Header streak
    const streakEl = document.getElementById('streak-badge');
    if (streakEl) {
      streakEl.textContent = state.streak.n ? `🔥 Streak: ${state.streak.n} ${state.streak.n === 1 ? 'day' : 'days'}` : '';
    }

    // Header active language text
    const langText = document.getElementById('current-lang-text');
    if (langText) {
      langText.textContent = state.selectedLanguage || 'JavaScript';
    }

    // Drawer user profile
    const drawerName = document.getElementById('drawer-user-name');
    const drawerStatus = document.getElementById('drawer-user-status');
    const authBtnText = document.getElementById('drawer-auth-text');

    if (drawerName) {
      drawerName.textContent = state.user?.name || 'Welcome! Please Sign In';
    }
    if (drawerStatus) {
      drawerStatus.textContent = state.isAuthenticated ? `Signed in (${state.user?.role || 'Learner'})` : 'Sign up or log in to track progress';
    }
    if (authBtnText) {
      authBtnText.textContent = state.isAuthenticated ? 'Log Out' : 'Sign Up / Log In 🔑';
    }

    // Drawer language pills active state
    document.querySelectorAll('.drawer-lang-btn').forEach(btn => {
      btn.classList.toggle('active', btn.dataset.lang === state.selectedLanguage);
    });
  });

  // 2. Hamburger button listeners
  document.getElementById('hamburger-btn')?.addEventListener('click', () => openDrawer());
  document.getElementById('drawer-close-btn')?.addEventListener('click', () => closeDrawer());
  document.getElementById('drawer-backdrop')?.addEventListener('click', () => closeDrawer());

  // 3. Drawer navigation items
  document.querySelectorAll('.drawer-nav-item').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.t;
      if (tab) navigate(tab);
    });
  });

  // 4. Drawer quick language selector
  document.querySelectorAll('.drawer-lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const lang = btn.dataset.lang;
      if (lang) {
        Store.selectLanguage(lang);
        closeDrawer();
      }
    });
  });

  // 5. Theme toggle
  document.getElementById('theme-toggle')?.addEventListener('click', () => {
    Store.toggleTheme();
  });

  // 6. Modal overlay click to dismiss
  document.getElementById('modal-overlay')?.addEventListener('click', (e) => {
    if (e.target.id === 'modal-overlay') {
      e.target.style.display = 'none';
    }
  });

  // 7. Initial Route
  const initialHash = window.location.hash.replace('#', '');
  if (initialHash && routes[initialHash]) {
    navigate(initialHash);
  } else {
    // When a user first opens this website, show the language selection hub
    navigate('languages');
  }
});
