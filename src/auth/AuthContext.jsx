import React, { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { supabase, supabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = async (user) => {
    if (!user) { setProfile(null); return null; }
    setProfileLoading(true);
    const { data, error } = await supabase.from('profiles').select('*').eq('id', user.id).maybeSingle();
    setProfileLoading(false);
    if (error) {
      console.error('Profile load error:', error);
      setProfile(null);
      return null;
    }
    setProfile(data);
    return data;
  };

  useEffect(() => {
    if (!supabaseConfigured) { setLoading(false); return undefined; }
    let mounted = true;
    supabase.auth.getSession().then(async ({ data: { session: current } }) => {
      if (!mounted) return;
      setSession(current);
      if (current?.user) await loadProfile(current.user);
      setLoading(false);
    });
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (_event, current) => {
      setSession(current);
      if (current?.user) await loadProfile(current.user);
      else setProfile(null);
      setLoading(false);
    });
    return () => { mounted = false; subscription.unsubscribe(); };
  }, []);

  const signUp = async ({ email, password, fullName, membershipType, affiliation, department, year, profession, interests, preferredContribution, phone, username }) => {
    if (!supabaseConfigured) throw new Error('Authentication is not configured yet. Add the Supabase values to .env.local.');
    const redirectTo = `${window.location.origin}/auth/callback`;
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,
        data: { full_name: fullName, membership_type: membershipType, affiliation, department, year, profession, interests: interests.join(', '), preferred_contribution: preferredContribution, phone, username },
      },
    });
    if (error) throw error;
    return data;
  };

  const signIn = async ({ email, password }) => {
    if (!supabaseConfigured) throw new Error('Authentication is not configured yet. Add the Supabase values to .env.local.');
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) throw error;
    return data;
  };

  const signOut = async () => {
    await supabase.auth.signOut();
  };

  const resetPasswordRequest = async (email) => {
    if (!supabaseConfigured) throw new Error('Authentication is not configured yet.');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    if (error) throw error;
  };

  const updatePassword = async (password) => {
    const { data, error } = await supabase.auth.updateUser({ password });
    if (error) throw error;
    return data;
  };

  const updateEmail = async (email) => {
    const { data, error } = await supabase.auth.updateUser({
      email,
      options: { emailRedirectTo: `${window.location.origin}/auth/callback` },
    });
    if (error) throw error;
    return data;
  };

  const value = useMemo(() => ({
    session,
    user: session?.user || null,
    profile,
    loading,
    profileLoading,
    isConfigured: supabaseConfigured,
    isAdmin: profile?.role === 'admin',
    signUp,
    signIn,
    signOut,
    resetPasswordRequest,
    updatePassword,
    updateEmail,
    refreshProfile: () => loadProfile(session?.user),
  }), [session, profile, loading, profileLoading]);

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const value = useContext(AuthContext);
  if (!value) throw new Error('useAuth must be used inside AuthProvider');
  return value;
}
