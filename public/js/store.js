// CodePath Central Reactive State & API Store
const Store = {
  state: {
    user: null,
    profile: null,
    isAuthenticated: false,
    selectedLanguage: localStorage.getItem('cp_lang') || 'JavaScript',
    activeTab: 'languages',
    theme: 'light',
    streak: { n: 0, last: '' },
    savedJobs: [],
    solvedProblems: []
  },
  subscribers: [],

  subscribe(fn) {
    this.subscribers.push(fn);
  },

  notify() {
    this.subscribers.forEach(fn => fn(this.state));
  },

  init() {
    // 1. Theme initialization
    const savedTheme = localStorage.getItem('cp_theme') || (window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light');
    this.setTheme(savedTheme);

    // 2. Fetch authenticated user & profile
    this.fetchUser();
  },

  setTheme(theme) {
    this.state.theme = theme;
    document.documentElement.dataset.theme = theme;
    localStorage.setItem('cp_theme', theme);
    this.notify();
  },

  toggleTheme() {
    this.setTheme(this.state.theme === 'dark' ? 'light' : 'dark');
  },

  async selectLanguage(lang) {
    this.state.selectedLanguage = lang;
    localStorage.setItem('cp_lang', lang);
    try {
      await this.api('/user/language', 'POST', { language: lang });
    } catch (e) {}
    this.notify();
    Store.toast(`Switched to ${lang} learning path! 🚀`, 'info');
    navigate('dashboard');
  },

  async api(endpoint, method = 'GET', data = null) {
    try {
      const options = {
        method,
        headers: { 'Content-Type': 'application/json' }
      };
      if (data && method !== 'GET') {
        options.body = JSON.stringify(data);
      }
      const res = await fetch('/api' + endpoint, options);
      const json = await res.json();
      if (!res.ok) {
        throw new Error(json.error?.message || 'API request failed');
      }
      return json;
    } catch (err) {
      console.warn(`[Store API Error] ${endpoint}:`, err.message);
      throw err;
    }
  },

  async fetchUser() {
    try {
      const res = await this.api('/me');
      this.state.user = res.user;
      this.state.profile = res.profile;
      this.state.isAuthenticated = Boolean(res.isAuthenticated && res.user);
      if (res.profile?.selectedLanguage) {
        this.state.selectedLanguage = res.profile.selectedLanguage;
        localStorage.setItem('cp_lang', res.profile.selectedLanguage);
      }
      this.state.streak.n = res.profile?.streakCount || 0;
      this.notify();
    } catch (e) {
      this.state.user = null;
      this.state.isAuthenticated = false;
      this.notify();
    }
  },

  toast(message, type = 'info') {
    const container = document.getElementById('toast-container');
    if (!container) return;
    const toastEl = document.createElement('div');
    toastEl.className = 'toast ' + type;
    toastEl.textContent = message;
    container.appendChild(toastEl);
    setTimeout(() => {
      toastEl.style.opacity = '0';
      setTimeout(() => toastEl.remove(), 250);
    }, 3200);
  }
};
