// CodePath Main Application Orchestrator & Router
const routes = {
  dashboard: DashboardView,
  tracks: TracksView,
  lessons: LessonsView,
  practice: PracticeView,
  quizzes: QuizzesView,
  interview: InterviewView,
  projects: ProjectsView,
  jobs: JobsView,
  readiness: ReadinessView,
  portfolio: ProfileView,
  admin: AdminView
};

let currentTab = 'dashboard';

function navigate(tabName, params = {}) {
  const target = routes[tabName] || routes.dashboard;
  currentTab = tabName;

  // Update navigation button active state
  document.querySelectorAll('nav button').forEach(btn => {
    btn.setAttribute('aria-current', btn.dataset.t === tabName ? 'page' : 'false');
  });

  // Render target view
  target.render(params);

  // Sync hash
  window.location.hash = tabName;
}

// Global initialization
window.addEventListener('DOMContentLoaded', () => {
  Store.init();

  // Subscribe UI to store state changes
  Store.subscribe((state) => {
    // 1. Streak badge in header
    const streakEl = document.getElementById('streak-badge');
    if (streakEl) {
      streakEl.textContent = state.streak.n ? `🔥 Streak: ${state.streak.n} ${state.streak.n === 1 ? 'day' : 'days'}` : '';
    }

    // 2. User info
    const userNameEl = document.getElementById('user-name');
    if (userNameEl && state.user) {
      userNameEl.textContent = state.user.name || 'Learner';
    }
  });

  // Theme toggle button
  const themeBtn = document.getElementById('theme-toggle');
  if (themeBtn) {
    themeBtn.addEventListener('click', () => {
      Store.toggleTheme();
    });
  }

  // Navigation tab button listeners
  document.querySelectorAll('nav button').forEach(btn => {
    btn.addEventListener('click', () => {
      const tab = btn.dataset.t;
      if (tab) navigate(tab);
    });
  });

  // Modal overlay click to dismiss
  const modalOverlay = document.getElementById('modal-overlay');
  if (modalOverlay) {
    modalOverlay.addEventListener('click', (e) => {
      if (e.target === modalOverlay) {
        modalOverlay.style.display = 'none';
      }
    });
  }

  // User menu click to jump to profile
  const userMenuBtn = document.getElementById('user-menu-btn');
  if (userMenuBtn) {
    userMenuBtn.addEventListener('click', () => {
      navigate('portfolio');
    });
  }

  // Handle initial route from hash
  const initialHash = window.location.hash.replace('#', '') || 'dashboard';
  navigate(initialHash);
});
