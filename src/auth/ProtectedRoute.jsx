import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext';

export function ProtectedRoute({ children, adminOnly = false }) {
  const { user, profile, loading, profileLoading, isConfigured } = useAuth();
  const location = useLocation();

  if (!isConfigured) return <Navigate to="/login" replace state={{ from: location.pathname, reason: 'not-configured' }} />;
  if (loading || (user && profileLoading)) {
    return <div className="auth-loading"><div className="auth-spinner"></div><p>Checking your EAC account…</p></div>;
  }
  if (!user) return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  if (adminOnly && profile?.role !== 'admin') return <Navigate to="/dashboard" replace state={{ forbidden: true }} />;
  return children;
}
