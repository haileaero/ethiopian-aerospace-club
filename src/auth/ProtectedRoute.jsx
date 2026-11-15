import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({
  children,
  adminOnly = false,
}) {
  const {
    user,
    profile,
    loading,
    profileLoading,
    isConfigured,
    isAdmin,
  } = useAuth();

  const location = useLocation();

  // Supabase not configured
  if (!isConfigured) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
          reason: 'not-configured',
        }}
      />
    );
  }

  // Wait for authentication/profile loading
  if (
    loading ||
    (user && profileLoading)
  ) {
    return (
      <div className="auth-loading">
        <div className="auth-spinner"></div>
        <p>Checking your EAC account…</p>
      </div>
    );
  }

  // User is not logged in
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
        state={{
          from: location.pathname,
        }}
      />
    );
  }

  // Admin-only route
  if (adminOnly && !isAdmin) {
    console.warn(
      'Admin access denied.',
      {
        userId: user.id,
        profileRole: profile?.role,
        isAdmin,
      }
    );

    return (
      <Navigate
        to="/dashboard"
        replace
        state={{
          forbidden: true,
        }}
      />
    );
  }

  return children;
}