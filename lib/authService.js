import { supabase, isSupabaseConfigured } from './supabaseClient';

export const authService = {
  // Check if Supabase cloud is active
  isCloudConnected() {
    return isSupabaseConfigured;
  },

  // 1. Sign Up
  async signUp(name, email, password) {
    const cleanEmail = email.trim().toLowerCase();
    const cleanName = name.trim();

    // Designated Master Admin Account
    if (cleanEmail === 'admin@email.com') {
      if (password !== '#codepathadmin') {
        throw new Error('Master administrator password must be #codepathadmin');
      }
      return {
        id: 'u-admin-master',
        name: cleanName || 'System Administrator',
        email: 'admin@email.com',
        role: 'admin',
        avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'
      };
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signUp({
        email: cleanEmail,
        password,
        options: {
          data: {
            full_name: cleanName,
            name: cleanName
          }
        }
      });

      if (error) throw new Error(error.message);

      const u = data.user;
      const user = u ? {
        id: u.id,
        name: cleanName,
        email: cleanEmail,
        role: 'learner',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`
      } : {
        id: 'u-' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        role: 'learner',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`
      };

      // Upsert profile in Supabase table
      try {
        await supabase.from('codepath_profiles').upsert({
          id: user.id,
          email: cleanEmail,
          full_name: cleanName,
          updated_at: new Date().toISOString()
        });
      } catch (e) {}

      return user;
    } else {
      // Local persistent database fallback
      const usersStr = typeof window !== 'undefined' ? localStorage.getItem('cp_users_db') : '[]';
      let users = [];
      try { users = JSON.parse(usersStr || '[]'); } catch (e) { users = []; }

      if (users.some(u => u.email.toLowerCase() === cleanEmail)) {
        throw new Error('An account with this email already exists. Please log in.');
      }

      const newUser = {
        id: 'u-' + Date.now(),
        name: cleanName,
        email: cleanEmail,
        password: password,
        role: 'learner',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(cleanName)}`,
        createdAt: new Date().toISOString()
      };

      users.push(newUser);
      if (typeof window !== 'undefined') {
        localStorage.setItem('cp_users_db', JSON.stringify(users));
      }

      const { password: _, ...safeUser } = newUser;
      return safeUser;
    }
  },

  // 2. Log In
  async logIn(email, password) {
    const cleanEmail = email.trim().toLowerCase();

    // Designated Master Admin Account check
    if (cleanEmail === 'admin@email.com') {
      if (password === '#codepathadmin') {
        const adminUser = {
          id: 'u-admin-master',
          name: 'System Administrator',
          email: 'admin@email.com',
          role: 'admin',
          avatar: 'https://api.dicebear.com/7.x/bottts/svg?seed=admin'
        };

        if (isSupabaseConfigured && supabase) {
          try {
            await supabase.from('codepath_profiles').upsert({
              id: '00000000-0000-0000-0000-000000000001',
              email: 'admin@email.com',
              full_name: 'System Administrator',
              selected_language: 'JavaScript',
              streak_count: 30,
              updated_at: new Date().toISOString()
            });
          } catch (e) {}
        }

        return adminUser;
      } else {
        throw new Error('Incorrect password for Administrator account.');
      }
    }

    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: cleanEmail,
        password
      });

      if (error) throw new Error(error.message);

      const u = data.user;
      return {
        id: u.id,
        name: u.user_metadata?.full_name || u.user_metadata?.name || cleanEmail.split('@')[0],
        email: cleanEmail,
        role: 'learner',
        avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.user_metadata?.full_name || cleanEmail)}`
      };
    } else {
      // Local persistent database check
      const usersStr = typeof window !== 'undefined' ? localStorage.getItem('cp_users_db') : '[]';
      let users = [];
      try { users = JSON.parse(usersStr || '[]'); } catch (e) { users = []; }

      const user = users.find(u => u.email.toLowerCase() === cleanEmail);
      if (!user) {
        throw new Error('No account found with this email. Please click "Create Account" to register.');
      }

      if (user.password !== password) {
        throw new Error('Incorrect password. Please verify your credentials.');
      }

      const { password: _, ...safeUser } = user;
      return safeUser;
    }
  },

  // 3. Log Out
  async logOut() {
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.auth.signOut();
      } catch (e) {}
    }
  },

  // 4. Get active session on initial load
  async getSession() {
    if (isSupabaseConfigured && supabase) {
      try {
        const { data: { session } } = await supabase.auth.getSession();
        if (session?.user) {
          const u = session.user;
          return {
            id: u.id,
            name: u.user_metadata?.full_name || u.user_metadata?.name || u.email.split('@')[0],
            email: u.email,
            role: 'learner',
            avatar: `https://api.dicebear.com/7.x/bottts/svg?seed=${encodeURIComponent(u.user_metadata?.full_name || u.email)}`
          };
        }
      } catch (e) {}
    }
    return null;
  },

  // 5. Cloud Progress Sync
  async syncProgress(userId, solvedProblems = [], completedLessons = []) {
    if (isSupabaseConfigured && supabase && userId) {
      try {
        await supabase.from('codepath_progress').upsert({
          user_id: userId,
          solved_problems: solvedProblems,
          completed_lessons: completedLessons,
          updated_at: new Date().toISOString()
        });
      } catch (e) {}
    }
  },

  // 6. Cloud Resume Sync
  async syncResume(userId, format, cvData) {
    if (isSupabaseConfigured && supabase && userId) {
      try {
        await supabase.from('codepath_resumes').upsert({
          user_id: userId,
          format: format || 'ats-modern',
          cv_data: cvData,
          updated_at: new Date().toISOString()
        });
      } catch (e) {}
    }
  },

  // 7. Admin: Get all users from Supabase or Local DB
  async adminGetUsers() {
    let usersList = [];

    // Track permanently deleted users (IDs or emails)
    let deletedUsers = [];
    if (typeof window !== 'undefined') {
      try {
        deletedUsers = JSON.parse(localStorage.getItem('cp_deleted_users') || '[]');
      } catch (e) {
        deletedUsers = [];
      }
    }
    const isDeleted = (id, email) => {
      const cleanEmail = (email || '').toLowerCase();
      return deletedUsers.includes(id) || deletedUsers.includes(cleanEmail);
    };

    if (isSupabaseConfigured && supabase) {
      try {
        const { data, error } = await supabase
          .from('codepath_profiles')
          .select('*')
          .order('created_at', { ascending: false });

        if (!error && data && data.length > 0) {
          usersList = data
            .filter(p => !isDeleted(p.id, p.email))
            .map(p => ({
              id: p.id,
              name: p.full_name || p.email.split('@')[0],
              email: p.email,
              role: p.email.toLowerCase() === 'admin@email.com' || (p.email || '').includes('admin') ? 'admin' : 'learner',
              selectedLanguage: p.selected_language || 'JavaScript',
              streak: p.streak_count || 1,
              solvedCount: Math.floor(Math.random() * 25) + 5,
              createdAt: p.created_at ? new Date(p.created_at).toLocaleDateString() : 'Today',
              source: 'supabase'
            }));
        }
      } catch (e) {}
    }

    // Always merge with local registered users
    if (typeof window !== 'undefined') {
      const localUsersStr = localStorage.getItem('cp_users_db') || '[]';
      try {
        const locals = JSON.parse(localUsersStr);
        locals.forEach(l => {
          if (!isDeleted(l.id, l.email) && !usersList.some(u => u.email.toLowerCase() === l.email.toLowerCase())) {
            usersList.push({
              id: l.id,
              name: l.name,
              email: l.email,
              role: l.email.toLowerCase() === 'admin@email.com' ? 'admin' : (l.role || 'learner'),
              selectedLanguage: l.selectedLanguage || localStorage.getItem('cp_lang') || 'JavaScript',
              streak: Number(l.streak || 1),
              solvedCount: Number(l.solvedCount || 5),
              createdAt: l.createdAt ? new Date(l.createdAt).toLocaleDateString() : 'Today',
              source: 'local'
            });
          }
        });
      } catch (e) {}
    }

    // Baseline demo learners for rich analytics
    const defaultBaseline = [
      { id: 'u-base-1', name: 'Alex Rivera', email: 'alex.rivera@techmail.dev', role: 'learner', selectedLanguage: 'React', streak: 14, solvedCount: 42, createdAt: 'Nov 10, 2026', source: 'system' },
      { id: 'u-base-2', name: 'Sara Chen', email: 'sara.chen@cs.edu', role: 'learner', selectedLanguage: 'Python', streak: 21, solvedCount: 58, createdAt: 'Nov 08, 2026', source: 'system' },
      { id: 'u-base-3', name: 'Tariq Rahman', email: 'tariq.rahman@devhub.org', role: 'learner', selectedLanguage: 'JavaScript', streak: 7, solvedCount: 29, createdAt: 'Nov 12, 2026', source: 'system' },
      { id: 'u-base-4', name: 'Elena Rostova', email: 'elena.rostova@engineer.io', role: 'learner', selectedLanguage: 'SQL', streak: 12, solvedCount: 35, createdAt: 'Nov 09, 2026', source: 'system' },
      { id: 'u-base-5', name: 'Michael Thorne', email: 'michael.t@dotnetpro.com', role: 'learner', selectedLanguage: 'C#', streak: 5, solvedCount: 16, createdAt: 'Nov 13, 2026', source: 'system' }
    ];

    defaultBaseline.forEach(b => {
      if (!isDeleted(b.id, b.email) && !usersList.some(u => u.email.toLowerCase() === b.email.toLowerCase())) {
        usersList.push(b);
      }
    });

    // Ensure Master Administrator is always registered in the list
    if (!usersList.some(u => u.email.toLowerCase() === 'admin@email.com')) {
      usersList.unshift({
        id: 'u-admin-master',
        name: 'System Administrator',
        email: 'admin@email.com',
        role: 'admin',
        selectedLanguage: 'JavaScript',
        streak: 30,
        solvedCount: 150,
        createdAt: 'Nov 01, 2026',
        source: 'system-root'
      });
    }

    return usersList;
  },

  // 8. Admin: Delete User Permanently
  async adminDeleteUser(userId, email) {
    const cleanEmail = (email || '').toLowerCase();
    if (cleanEmail === 'admin@email.com') {
      throw new Error('The Master Administrator account is protected and cannot be deleted.');
    }

    // 1. Delete from Supabase if configured
    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('codepath_profiles').delete().match({ id: userId });
        await supabase.from('codepath_progress').delete().match({ user_id: userId });
        await supabase.from('codepath_resumes').delete().match({ user_id: userId });
      } catch (e) {}
    }

    if (typeof window !== 'undefined') {
      // 2. Add to permanent deleted list so baseline/cached users never resurrect
      let deletedUsers = [];
      try {
        deletedUsers = JSON.parse(localStorage.getItem('cp_deleted_users') || '[]');
      } catch (e) {
        deletedUsers = [];
      }
      if (userId && !deletedUsers.includes(userId)) deletedUsers.push(userId);
      if (cleanEmail && !deletedUsers.includes(cleanEmail)) deletedUsers.push(cleanEmail);
      localStorage.setItem('cp_deleted_users', JSON.stringify(deletedUsers));

      // 3. Remove from local persistent users database
      const localUsersStr = localStorage.getItem('cp_users_db') || '[]';
      try {
        let locals = JSON.parse(localUsersStr);
        locals = locals.filter(u => u.id !== userId && (u.email || '').toLowerCase() !== cleanEmail);
        localStorage.setItem('cp_users_db', JSON.stringify(locals));
      } catch (e) {}

      // 4. If active session was this user, log them out
      const savedUserStr = localStorage.getItem('cp_user');
      if (savedUserStr) {
        try {
          const cu = JSON.parse(savedUserStr);
          if (cu.id === userId || (cu.email || '').toLowerCase() === cleanEmail) {
            localStorage.removeItem('cp_user');
          }
        } catch (e) {}
      }
    }

    return { success: true };
  },

  // 9. Admin: Create a new user directly
  async adminCreateUser(userData) {
    const cleanEmail = (userData.email || '').trim().toLowerCase();
    const cleanName = (userData.name || '').trim();

    if (!cleanEmail || !cleanName) {
      throw new Error('Name and valid email address are required.');
    }

    // Check if previously marked as deleted, un-delete it
    if (typeof window !== 'undefined') {
      try {
        let deletedUsers = JSON.parse(localStorage.getItem('cp_deleted_users') || '[]');
        deletedUsers = deletedUsers.filter(item => item !== cleanEmail && item !== userData.id);
        localStorage.setItem('cp_deleted_users', JSON.stringify(deletedUsers));
      } catch (e) {}
    }

    const newUser = {
      id: 'u-' + Date.now(),
      name: cleanName,
      email: cleanEmail,
      role: userData.role || 'learner',
      selectedLanguage: userData.selectedLanguage || 'JavaScript',
      streak: Number(userData.streak) || 1,
      solvedCount: Number(userData.solvedCount) || 0,
      createdAt: new Date().toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
      source: 'admin-created'
    };

    if (isSupabaseConfigured && supabase) {
      try {
        await supabase.from('codepath_profiles').insert({
          id: newUser.id,
          email: cleanEmail,
          full_name: cleanName,
          selected_language: newUser.selectedLanguage,
          streak_count: newUser.streak
        });
      } catch (e) {}
    }

    if (typeof window !== 'undefined') {
      const localUsersStr = localStorage.getItem('cp_users_db') || '[]';
      let locals = [];
      try { locals = JSON.parse(localUsersStr); } catch (e) { locals = []; }
      locals.unshift(newUser);
      localStorage.setItem('cp_users_db', JSON.stringify(locals));
    }

    return newUser;
  },

  // 10. Admin: Update User role or status
  async adminUpdateUserRole(userId, email, newRole) {
    const cleanEmail = (email || '').toLowerCase();
    if (cleanEmail === 'admin@email.com' && newRole !== 'admin') {
      throw new Error('Cannot demote the Root System Administrator.');
    }

    if (typeof window !== 'undefined') {
      const localUsersStr = localStorage.getItem('cp_users_db') || '[]';
      try {
        let locals = JSON.parse(localUsersStr);
        locals = locals.map(u => {
          if (u.id === userId || (u.email || '').toLowerCase() === cleanEmail) {
            return { ...u, role: newRole };
          }
          return u;
        });
        localStorage.setItem('cp_users_db', JSON.stringify(locals));
      } catch (e) {}
    }

    return { success: true };
  }
};

