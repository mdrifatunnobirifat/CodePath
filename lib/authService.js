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
        await supabase.from('profiles').upsert({
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
  }
};

