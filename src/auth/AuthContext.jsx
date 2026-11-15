import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';

import { supabase, supabaseConfigured } from '../lib/supabase';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [profileLoading, setProfileLoading] = useState(false);

  // Load the profile belonging to the authenticated user
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

      console.log('Authenticated user ID:', user.id);
      console.log('Profile loaded from Supabase:', data);
      console.log('Profile role:', data?.role);

      setProfile(data);

      return data;
    } catch (error) {
      console.error('Unexpected profile error:', error);
      setProfile(null);
      return null;
    } finally {
      setProfileLoading(false);
    }
  };

  // Initialize authentication
  useEffect(() => {
    if (!supabaseConfigured) {
      console.error('Supabase is not configured.');
      setLoading(false);
      return;
    }

    let mounted = true;

    const initializeAuth = async () => {
      try {
        const {
          data: { session: currentSession },
          error,
        } = await supabase.auth.getSession();

        if (error) {
          console.error('Session load error:', error);
        }

        if (!mounted) return;

        setSession(currentSession);

        if (currentSession?.user) {
          await loadProfile(currentSession.user);
        } else {
          setProfile(null);
        }
      } catch (error) {
        console.error('Authentication initialization error:', error);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    initializeAuth();

    // Listen for authentication changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_event, currentSession) => {
      if (!mounted) return;

      setSession(currentSession);

      if (currentSession?.user) {
        await loadProfile(currentSession.user);
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

  // Register member
  const signUp = async ({
    email,
    password,
    fullName,
    membershipType,
    affiliation,
    department,
    year,
    profession,
    interests,
    preferredContribution,
    phone,
    username,
  }) => {
    if (!supabaseConfigured) {
      throw new Error(
        'Authentication is not configured yet. Add the Supabase values to .env.local.'
      );
    }

    const redirectTo = `${window.location.origin}/auth/callback`;

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: redirectTo,

        data: {
          full_name: fullName,
          membership_type: membershipType,
          affiliation,
          department,
          year,
          profession,
          interests: interests.join(', '),
          preferred_contribution: preferredContribution,
          phone,
          username,
        },
      },
    });

    if (error) {
      throw error;
    }

    return data;
  };

  // Login
  const signIn = async ({ email, password }) => {
    if (!supabaseConfigured) {
      throw new Error(
        'Authentication is not configured yet. Add the Supabase values to .env.local.'
      );
    }

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password,
      });

    if (error) {
      throw error;
    }

    // Immediately load the profile after login
    if (data?.user) {
      await loadProfile(data.user);
    }

    return data;
  };

  // Logout
  const signOut = async () => {
    const { error } = await supabase.auth.signOut();

    if (error) {
      throw error;
    }

    setSession(null);
    setProfile(null);
  };

  // Request password reset
  const resetPasswordRequest = async (email) => {
    if (!supabaseConfigured) {
      throw new Error('Authentication is not configured yet.');
    }

    const { error } =
      await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

    if (error) {
      throw error;
    }
  };

  // Update password
  const updatePassword = async (password) => {
    const { data, error } =
      await supabase.auth.updateUser({
        password,
      });

    if (error) {
      throw error;
    }

    return data;
  };

  // Update email
  const updateEmail = async (email) => {
    const { data, error } =
      await supabase.auth.updateUser({
        email,
        options: {
          emailRedirectTo: `${window.location.origin}/auth/callback`,
        },
      });

    if (error) {
      throw error;
    }

    return data;
  };

  // Refresh current profile
  const refreshProfile = async () => {
    if (!session?.user) {
      setProfile(null);
      return null;
    }

    return await loadProfile(session.user);
  };

  const value = useMemo(
    () => ({
      session,
      user: session?.user || null,

      profile,

      loading,
      profileLoading,

      isConfigured: supabaseConfigured,

      // TRUE only when Supabase profile role is admin
      isAdmin: profile?.role === 'admin',

      signUp,
      signIn,
      signOut,

      resetPasswordRequest,
      updatePassword,
      updateEmail,

      refreshProfile,
    }),
    [
      session,
      profile,
      loading,
      profileLoading,
    ]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const value = useContext(AuthContext);

  if (!value) {
    throw new Error(
      'useAuth must be used inside AuthProvider'
    );
  }

  return value;
}