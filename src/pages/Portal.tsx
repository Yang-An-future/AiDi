import React from 'react';
import { Navigate } from 'react-router-dom';
import RequireRole from '../components/RequireRole';
import { useAuth } from '../contexts/AuthContext';

function RoleRedirect() {
  const { profile } = useAuth();
  if (!profile) return null;
  if (profile.role === 'admin') return <Navigate to="/admin" replace />;
  if (profile.role === 'mentor') return <Navigate to="/mentor" replace />;
  return <Navigate to="/teacher" replace />;
}

// Landing spot right after login/signup — routes each role to its own
// dashboard once RequireRole confirms the account is loaded and active.
export default function Portal() {
  return (
    <RequireRole allowedRoles={['admin', 'mentor', 'teacher']}>
      <RoleRedirect />
    </RequireRole>
  );
}
