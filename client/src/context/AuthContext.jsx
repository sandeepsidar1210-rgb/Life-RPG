import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../supabase.js';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Initial session load
    let mounted = true;

    async function getInitialSession() {
      try {
        if (!supabase) {
          setLoading(false);
          return;
        }

        const { data, error } = await supabase.auth.getSession();
        if (error) throw error;

        if (mounted) {
          setSession(data.session);
          setUser(data.session?.user ?? null);
        }
      } catch (err) {
        console.error('[AuthContext] Session fetch error:', err);
      } finally {
        if (mounted) setLoading(false);
      }
    }

    getInitialSession();

    // Listen to real-time auth state updates
    const { data: authListener } = supabase?.auth.onAuthStateChange(
      (_event, currentSession) => {
        if (mounted) {
          setSession(currentSession);
          setUser(currentSession?.user ?? null);
          setLoading(false);
        }
      }
    ) || { data: { subscription: null } };

    return () => {
      mounted = false;
      authListener?.subscription?.unsubscribe();
    };
  }, []);

  // Format user-friendly error messages
  const parseAuthError = (err) => {
    if (!err) return null;
    const msg = err.message || '';
    if (msg.includes('Invalid login credentials')) {
      return 'The email or password you entered is incorrect. Please try again.';
    }
    if (msg.includes('User already registered') || msg.includes('already registered')) {
      return 'An account with this email already exists. Try signing in instead.';
    }
    if (msg.includes('Password should be at least 6') || msg.includes('weak_password')) {
      return 'Password must be at least 6 characters long.';
    }
    if (msg.includes('Email not confirmed')) {
      return 'Please verify your email address to log in, or disable email confirmations in Supabase.';
    }
    if (msg.includes('rate limit')) {
      return 'Too many login attempts. Please take a breather and try again in a moment.';
    }
    if (msg.includes('network') || msg.includes('Failed to fetch')) {
      return 'Unable to reach the study server. Please check your connection.';
    }
    return 'Something went wrong. Please check your details and try again.';
  };

  const signIn = async (email, password) => {
    if (!supabase) throw new Error('Supabase client is not configured.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw new Error(parseAuthError(error));
    return data;
  };

  const signUp = async (email, password) => {
    if (!supabase) throw new Error('Supabase client is not configured.');
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          app: 'Life RPG',
          avatar_seed: email
        }
      }
    });
    if (error) throw new Error(parseAuthError(error));
    return data;
  };

  const signOut = async () => {
    if (!supabase) return;
    const { error } = await supabase.auth.signOut();
    if (error) console.error('[AuthContext] SignOut error:', error);
    setUser(null);
    setSession(null);
  };

  const value = {
    user,
    session,
    token: session?.access_token,
    loading,
    signIn,
    signUp,
    signOut,
    parseAuthError
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
