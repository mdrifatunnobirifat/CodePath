'use client';
import React, { useState, useEffect } from 'react';
import Navbar from './components/Navbar';
import Drawer from './components/Drawer';
import AuthModal from './components/AuthModal';
import LanguagesView from './views/LanguagesView';
import DashboardView from './views/DashboardView';
import PracticeView from './views/PracticeView';
import CVBuilderView from './views/CVBuilderView';
import NotificationsView from './views/NotificationsView';
import AdminView from './views/AdminView';
import { 
  TracksView, 
  LessonsView, 
  QuizzesView, 
  InterviewView, 
  ProjectsView, 
  JobsView, 
  ReadinessView, 
  ProfileView 
} from './views/OtherViews';
import initialData from '../lib/initialData';
import { authService } from '../lib/authService';

export default function CodePathApp() {
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState('languages');
  const [selectedLanguage, setSelectedLanguage] = useState('JavaScript');
  const [theme, setTheme] = useState('light');
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authModalMode, setAuthModalMode] = useState('signup');
  const [user, setUser] = useState(null);
  const [streak, setStreak] = useState(1);
  const [solvedProblemIds, setSolvedProblemIds] = useState([]);
  const [currentProblem, setCurrentProblem] = useState(null);
  const [toastMessage, setToastMessage] = useState(null);
  const [notifications, setNotifications] = useState([]);
  const [cvData, setCvData] = useState(null);

  // Initialize data and client-side state
  useEffect(() => {
    setMounted(true);
    const savedTheme = localStorage.getItem('cp_theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.setAttribute('data-theme', savedTheme);

    const savedTab = localStorage.getItem('cp_active_tab');

    const initAuth = async () => {
      let resolvedUser = null;

      // 1. Check Supabase cloud session if configured
      try {
        const cloudUser = await authService.getSession();
        if (cloudUser) {
          resolvedUser = cloudUser;
        }
      } catch (e) {}

      // 2. Check saved local session if no cloud user
      if (!resolvedUser) {
        const savedUser = localStorage.getItem('cp_user');
        if (savedUser) {
          try {
            const u = JSON.parse(savedUser);
            if (u && u.id && u.email) {
              resolvedUser = u;
            }
          } catch (e) {}
        }
      }

      if (resolvedUser) {
        setUser(resolvedUser);
        localStorage.setItem('cp_user', JSON.stringify(resolvedUser));

        const isAdmin = resolvedUser.role === 'admin' || resolvedUser.email === 'admin@email.com';

        // Properly restore the view on page refresh!
        if (isAdmin) {
          // If admin, default to 'admin' view unless they were previewing a specific learner tab
          const tabToUse = (savedTab && savedTab !== 'languages') ? savedTab : 'admin';
          setActiveTab(tabToUse);
          localStorage.setItem('cp_active_tab', tabToUse);
        } else {
          // Regular learner
          const tabToUse = savedTab || 'dashboard';
          setActiveTab(tabToUse);
          localStorage.setItem('cp_active_tab', tabToUse);
        }
      } else {
        // New visitor: Prompt Sign Up / Log In
        setUser(null);
        setActiveTab('languages');
        setAuthModalMode('signup');
        setAuthModalOpen(true);
      }
    };

    initAuth();

    const savedLang = localStorage.getItem('cp_lang');
    if (savedLang) setSelectedLanguage(savedLang);

    const savedStreak = localStorage.getItem('cp_streak');
    if (savedStreak) setStreak(Number(savedStreak));

    const savedSolved = localStorage.getItem('cp_solved');
    if (savedSolved) {
      try {
        setSolvedProblemIds(JSON.parse(savedSolved));
      } catch (e) {}
    }

    const savedCv = localStorage.getItem('cp_cv');
    if (savedCv) {
      try {
        setCvData(JSON.parse(savedCv));
      } catch (e) {}
    }

    const savedNotifs = localStorage.getItem('cp_notifs');
    if (savedNotifs) {
      try {
        setNotifications(JSON.parse(savedNotifs));
      } catch (e) {}
    }

    // Set initial problem
    const defaultProblem = (initialData.problems || []).find(p => p.language === 'JavaScript') || initialData.problems?.[0];
    setCurrentProblem(defaultProblem);
  }, []);

  const showToast = (msg, type = 'info') => {
    setToastMessage({ msg, type });
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleToggleTheme = () => {
    const next = theme === 'dark' ? 'light' : 'dark';
    setTheme(next);
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('cp_theme', next);
  };

  const handleSelectLanguage = (lang) => {
    setSelectedLanguage(lang);
    localStorage.setItem('cp_lang', lang);

    if (!user) {
      setAuthModalMode('signup');
      setAuthModalOpen(true);
      return;
    }

    const isAdmin = user.role === 'admin' || user.email === 'admin@email.com';
    setIsDrawerOpen(false);
    if (isAdmin) {
      showToast(`Previewing ${lang} roadmap as Administrator! 🚀`, 'info');
    } else {
      setActiveTab('dashboard');
      localStorage.setItem('cp_active_tab', 'dashboard');
      showToast(`Switched to ${lang} learning roadmap! 🚀`, 'success');
    }
  };

  const handleNavigate = (tab) => {
    if (!user && tab !== 'languages') {
      setAuthModalMode('login');
      setAuthModalOpen(true);
      return;
    }
    setActiveTab(tab);
    localStorage.setItem('cp_active_tab', tab);
    setIsDrawerOpen(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLogin = async (email, password) => {
    const loggedUser = await authService.logIn(email, password);
    setUser(loggedUser);
    localStorage.setItem('cp_user', JSON.stringify(loggedUser));
    if (loggedUser.role === 'admin' || loggedUser.email === 'admin@email.com') {
      showToast(`Welcome, Administrator! 🛡️ Access granted.`, 'success');
      setActiveTab('admin');
      localStorage.setItem('cp_active_tab', 'admin');
    } else {
      showToast(`Welcome back, ${loggedUser.name}! 👋`, 'success');
      setActiveTab('dashboard');
      localStorage.setItem('cp_active_tab', 'dashboard');
    }
  };

  const handleSignup = async (name, email, password) => {
    const signedUser = await authService.signUp(name, email, password);
    setUser(signedUser);
    localStorage.setItem('cp_user', JSON.stringify(signedUser));

    // Create welcome notification
    const welcomeNotif = {
      id: 'n-' + Date.now(),
      time: 'Just now',
      to: email,
      subject: `Welcome to CodePath 🚀 Your ${selectedLanguage} Coding Journey Starts Today!`,
      status: 'Delivered',
      body: `Hi ${name}, welcome aboard! Your ${selectedLanguage} 60-day curriculum has been activated.`
    };
    const updatedNotifs = [welcomeNotif, ...notifications];
    setNotifications(updatedNotifs);
    localStorage.setItem('cp_notifs', JSON.stringify(updatedNotifs));

    showToast(`Account created! Welcome, ${name}! 🎉`, 'success');
    setActiveTab('dashboard');
    localStorage.setItem('cp_active_tab', 'dashboard');
  };

  const handleLogout = async () => {
    await authService.logOut();
    setUser(null);
    localStorage.removeItem('cp_user');
    localStorage.removeItem('cp_active_tab');
    setIsDrawerOpen(false);
    setActiveTab('languages');
    setAuthModalMode('login');
    setAuthModalOpen(true);
    showToast('Logged out successfully.');
  };

  const handleSolveProblem = (problemId) => {
    if (!solvedProblemIds.includes(problemId)) {
      const updated = [...solvedProblemIds, problemId];
      setSolvedProblemIds(updated);
      localStorage.setItem('cp_solved', JSON.stringify(updated));

      const newStreak = streak + 1;
      setStreak(newStreak);
      localStorage.setItem('cp_streak', String(newStreak));

      // Record milestone notification
      if (user?.email) {
        const milestoneNotif = {
          id: 'n-' + Date.now(),
          time: 'Just now',
          to: user.email,
          subject: `🎉 Solved: ${currentProblem?.title || 'Challenge'} | Streak: ${newStreak}d`,
          status: 'Delivered',
          body: `Awesome work! You passed all test cases for ${currentProblem?.title}.`
        };
        const updatedNotifs = [milestoneNotif, ...notifications];
        setNotifications(updatedNotifs);
        localStorage.setItem('cp_notifs', JSON.stringify(updatedNotifs));
      }

      showToast(`🏆 Problem Solved! Streak incremented to ${newStreak} days!`, 'success');
    }
  };

  const handleSaveCv = (data) => {
    setCvData(data);
    localStorage.setItem('cp_cv', JSON.stringify(data));
    showToast('Technical CV saved successfully! 💾', 'success');
  };

  const handleSendTestNotification = async (targetEmail) => {
    const testNotif = {
      id: 'n-' + Date.now(),
      time: 'Just now',
      to: targetEmail,
      subject: `✅ CodePath Email Notifications Active for ${targetEmail}`,
      status: 'Delivered',
      body: `Congratulations! Real-time notifications and roadmap alerts are active.`
    };
    const updated = [testNotif, ...notifications];
    setNotifications(updated);
    localStorage.setItem('cp_notifs', JSON.stringify(updated));
    showToast(`Test email dispatched to ${targetEmail}! Check inbox.`, 'success');
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* Top Navbar */}
      <Navbar 
        onOpenDrawer={() => setIsDrawerOpen(true)}
        streak={streak}
        selectedLanguage={selectedLanguage}
        theme={theme}
        onToggleTheme={handleToggleTheme}
        user={user}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
        onOpenAuth={(mode) => { setAuthModalMode(mode); setAuthModalOpen(true); }}
      />

      {/* Hamburger Navigation Drawer */}
      <Drawer 
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        user={user}
        selectedLanguage={selectedLanguage}
        onSelectLanguage={handleSelectLanguage}
        onLogout={handleLogout}
        onOpenAuth={(mode) => { setIsDrawerOpen(false); setAuthModalMode(mode); setAuthModalOpen(true); }}
      />

      {/* Authentication Modal */}
      <AuthModal 
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        onLogin={handleLogin}
        onSignup={handleSignup}
        initialMode={authModalMode}
      />

      {/* Toast Notification Container */}
      {toastMessage && (
        <div className="toast-container" style={{ position: 'fixed', bottom: '20px', right: '20px', zIndex: 9999 }}>
          <div className={`toast ${toastMessage.type}`} style={{ animation: 'fadeIn 0.2s ease-in' }}>
            {toastMessage.msg}
          </div>
        </div>
      )}

      {/* Main Container Content */}
      <main className="container" style={{ flex: 1, padding: '16px 20px', maxWidth: '1440px', margin: '0 auto', width: '100%' }}>
        {activeTab === 'languages' && (
          <LanguagesView onSelectLanguage={handleSelectLanguage} />
        )}

        {activeTab === 'dashboard' && (
          <DashboardView 
            selectedLanguage={selectedLanguage}
            roadmaps={initialData.topicRoadmaps || {}}
            problems={initialData.problems || []}
            solvedProblemIds={solvedProblemIds}
            onSelectProblem={(p) => {
              setCurrentProblem(p);
              setActiveTab('practice');
              localStorage.setItem('cp_active_tab', 'practice');
            }}
            onOpenLanguages={() => {
              setActiveTab('languages');
              localStorage.setItem('cp_active_tab', 'languages');
            }}
          />
        )}

        {activeTab === 'practice' && (
          <PracticeView 
            problem={currentProblem}
            allProblems={(initialData.problems || []).filter(p => p.language.toLowerCase() === selectedLanguage.toLowerCase())}
            onSelectProblem={setCurrentProblem}
            onSolveProblem={handleSolveProblem}
            isSolved={currentProblem ? solvedProblemIds.includes(currentProblem.id) : false}
          />
        )}

        {activeTab === 'cv' && (
          <CVBuilderView 
            initialCvData={cvData}
            user={user}
            onSaveCv={handleSaveCv}
          />
        )}

        {activeTab === 'notifications' && (
          <NotificationsView 
            user={user}
            notifications={notifications}
            onSendTestNotification={handleSendTestNotification}
          />
        )}

        {activeTab === 'tracks' && (
          <TracksView tracks={initialData.tracks || []} />
        )}

        {activeTab === 'lessons' && (
          <LessonsView lessons={initialData.lessons || []} />
        )}

        {activeTab === 'quizzes' && (
          <QuizzesView quizzes={initialData.quizzes || []} />
        )}

        {activeTab === 'interview' && (
          <InterviewView questions={initialData.interviewQuestions || []} />
        )}

        {activeTab === 'projects' && (
          <ProjectsView projects={initialData.projects || []} />
        )}

        {activeTab === 'jobs' && (
          <JobsView jobs={initialData.jobs || []} />
        )}

        {activeTab === 'readiness' && (
          <ReadinessView 
            solvedCount={solvedProblemIds.length} 
            onOpenTab={handleNavigate}
          />
        )}

        {activeTab === 'portfolio' && (
          <ProfileView 
            user={user} 
            solvedCount={solvedProblemIds.length} 
            streak={streak} 
            onOpenTab={handleNavigate}
          />
        )}

        {activeTab === 'admin' && (
          <AdminView 
            totalProblems={(initialData.problems || []).length}
          />
        )}
      </main>
    </div>
  );
}
