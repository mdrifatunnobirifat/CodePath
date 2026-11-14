// CodePath Authentication Controller (Strict Sign Up / Log In Enforcement)
const AuthView = {
  mode: 'signup', // 'signup' | 'login'
  pendingLanguage: null,

  init() {
    // Connect auth modal close button
    const closeBtn = document.getElementById('auth-modal-close');
    if (closeBtn) {
      closeBtn.addEventListener('click', () => this.closeModal());
    }

    // Connect tab buttons (Only Sign Up and Log In)
    document.getElementById('tab-signup-btn')?.addEventListener('click', () => this.switchMode('signup'));
    document.getElementById('tab-login-btn')?.addEventListener('click', () => this.switchMode('login'));

    // Connect drawer logout button
    document.getElementById('drawer-logout-btn')?.addEventListener('click', () => {
      if (Store.state.isAuthenticated) {
        this.logout();
      } else {
        this.openModal('login');
      }
    });
  },

  openModal(mode = 'signup', pendingLang = null) {
    this.pendingLanguage = pendingLang;
    const nameInput = document.getElementById('auth-name');
    const emailInput = document.getElementById('auth-email');
    const passInput = document.getElementById('auth-password');
    if (nameInput) nameInput.value = '';
    if (emailInput) emailInput.value = '';
    if (passInput) passInput.value = '';
    this.switchMode(mode);
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'flex';
  },

  closeModal() {
    const modal = document.getElementById('auth-modal');
    if (modal) modal.style.display = 'none';

    // If closing without logging in, ensure they stay on language portal
    if (!Store.state.isAuthenticated && currentTab !== 'languages') {
      navigate('languages');
    }
  },

  switchMode(mode) {
    this.mode = mode;
    const isSignup = mode === 'signup';

    document.getElementById('tab-signup-btn')?.setAttribute('aria-pressed', isSignup);
    document.getElementById('tab-login-btn')?.setAttribute('aria-pressed', mode === 'login');

    const nameGroup = document.getElementById('signup-name-group');
    const submitBtn = document.getElementById('auth-submit-btn');
    const titleEl = document.getElementById('auth-modal-title');
    const subEl = document.getElementById('auth-modal-subtitle');
    const errorEl = document.getElementById('auth-error-msg');
    if (errorEl) errorEl.style.display = 'none';

    if (isSignup) {
      if (nameGroup) nameGroup.style.display = 'block';
      if (titleEl) titleEl.textContent = 'Create your CodePath Account';
      if (subEl) subEl.textContent = 'Sign up to track your 60-day plan, keep your daily streak, and solve practice problems.';
      if (submitBtn) submitBtn.textContent = 'Create Free Account & Start Learning 🚀';
    } else {
      if (nameGroup) nameGroup.style.display = 'none';
      if (titleEl) titleEl.textContent = 'Welcome back! Log in to continue';
      if (subEl) subEl.textContent = 'Access your saved drafts, streak, and interview portfolio.';
      if (submitBtn) submitBtn.textContent = 'Log In to My Account 🔑';
    }
  },

  async submit() {
    const errorEl = document.getElementById('auth-error-msg');
    errorEl.style.display = 'none';

    const email = document.getElementById('auth-email').value.trim();
    const password = document.getElementById('auth-password').value.trim();
    const name = document.getElementById('auth-name').value.trim();

    const submitBtn = document.getElementById('auth-submit-btn');
    const originalText = submitBtn ? submitBtn.textContent : '';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.textContent = 'Connecting...';
    }

    try {
      let res;
      if (this.mode === 'signup') {
        if (!name) throw new Error('Please enter your full name.');
        res = await Store.api('/auth/signup', 'POST', { name, email, password });
      } else {
        res = await Store.api('/auth/login', 'POST', { email, password });
      }

      Store.state.user = res.user;
      Store.state.isAuthenticated = true;
      Store.notify();
      this.closeModal();
      Store.toast(`Welcome, ${res.user.name}! 🎉`, 'success');

      if (this.pendingLanguage) {
        Store.selectLanguage(this.pendingLanguage);
      } else {
        navigate('dashboard');
      }
    } catch (err) {
      errorEl.style.display = 'block';
      errorEl.innerHTML = `<div class="no">${CodeEditor.escapeHtml(err.message)}</div>`;
    } finally {
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.textContent = originalText;
      }
    }
  },

  async logout() {
    try {
      await Store.api('/auth/logout', 'POST');
    } catch (e) {}

    Store.state.user = null;
    Store.state.isAuthenticated = false;
    Store.notify();
    Store.toast('Logged out successfully.');

    // Close drawer
    document.getElementById('drawer-menu')?.classList.remove('open');
    document.getElementById('drawer-backdrop').style.display = 'none';

    // Direct user back to language portal
    navigate('languages');
  }
};
