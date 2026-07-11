import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/portal';

function Centered({ children }: { children: React.ReactNode }) {
  return <div className="min-h-screen flex items-center justify-center text-center px-6">{children}</div>;
}

export default function RequireRole({
  allowedRoles,
  children,
}: {
  allowedRoles: UserRole[];
  children: React.ReactNode;
}) {
  const { user, profile, loading, profileLoading } = useAuth();

  if (loading || profileLoading) {
    return <Centered><span className="text-[#003366]">載入中...</span></Centered>;
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Profile missing entirely — the global OnboardingModal is already covering
  // the screen in this state, so render nothing underneath it.
  if (!profile) {
    return null;
  }

  // Pending accounts are handled by the global PendingGate (which forces a
  // logout back to the homepage), so nothing needs to render here.
  if (profile.status === 'pending') {
    return null;
  }

  if (profile.status === 'disabled') {
    return (
      <Centered>
        <div>
          <p className="text-lg font-bold text-red-600 mb-2">帳號已停用</p>
          <p className="text-sm text-gray-500">如有疑問請聯繫計畫管理員。</p>
        </div>
      </Centered>
    );
  }

  if (!allowedRoles.includes(profile.role)) {
    return (
      <Centered>
        <p className="text-lg font-bold text-[#003366]">您沒有權限檢視此頁面</p>
      </Centered>
    );
  }

  return <>{children}</>;
}
