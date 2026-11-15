import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';

import {
  supabase,
  supabaseConfigured,
} from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  const loadProfile = async (user) => {
    if (!user) {
      setProfile(null);
      return null;
    }

    setProfileLoading(true);

    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) {
        console.error('Profile load error:', error);
        setProfile(null);
        return null;
      }

      console.log('PROFILE FROM SUPABASE:', data);
      console.log('PROFILE ROLE:', data?.role);

      setProfile(data);

      return data;
    } finally {
      setProfileLoading(false);
    }
  };

  useEffect(() => {
    if (!supabaseConfigured) {
      setLoading(false);
      return;
    }

    let mounted = true;

    const initialize = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!mounted) return;

      setSession(session);

      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setProfile(null);
      }

      if (mounted) {
        setLoading(false);
      }
    };

    initialize();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, session) => {
      if (!mounted) return;

      setSession(session);

      if (session?.user) {
        await loadProfile(session.user);
      } else {
        setProfile(null);
      }

      setLoading(false);
    });

    return () => {
      mounted = false;
      subscription.unsubscribe();
    };
  }, []);

  const signOut = async () => {
    await supabase.auth.signOut();
    setSession(null);
    setProfile(null);
  };

  const updatePassword = async (password) => {
    const { error } = await supabase.auth.updateUser({
      password,
    });

    if (error) {
      throw error;
    }
  };

  const updateEmail = async (email) => {
    const { error } = await supabase.auth.updateUser({
      email,
    });

    if (error) {
      throw error;
    }
  };

  const value = {
    session,
    user: session?.user || null,
    profile,
    loading,
    profileLoading,
    signOut,
    updatePassword,
    updateEmail,
    refreshProfile: () =>
      session?.user ? loadProfile(session.user) : null,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}