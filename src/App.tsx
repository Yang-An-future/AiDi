import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectIntro from './pages/ProjectIntro';
import ProjectOrg from './pages/ProjectOrg';
import Login from './pages/Login';
import Portal from './pages/Portal';
import AdminDashboard from './pages/admin/Dashboard';
import MentorDashboard from './pages/mentor/MentorDashboard';
import TeacherDashboard from './pages/teacher/TeacherDashboard';
import RequireRole from './components/RequireRole';
import OnboardingModal from './components/OnboardingModal';
import PendingApprovalModal from './components/PendingApprovalModal';
import IntroAnimation from './components/IntroAnimation';
import { AuthProvider, useAuth } from './contexts/AuthContext';

function Layout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col pt-0">
      <Header />
      <main className="flex-grow">
        {children}
      </main>
      <Footer />
    </div>
  );
}

// Same topbar as the rest of the site, but no footer — used for the login
// page where a full site chrome isn't wanted.
function TopBarLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-slate-50 font-sans text-gray-800 flex flex-col pt-0">
      <Header />
      <main className="flex-grow flex flex-col">{children}</main>
    </div>
  );
}

function OnboardingGate() {
  const { user, profile, loading, profileLoading } = useAuth();
  if (loading || profileLoading || !user || profile) return null;
  return <OnboardingModal />;
}

function PendingGate() {
  const { user, profile, loading, profileLoading } = useAuth();
  if (loading || profileLoading || !user || !profile) return null;
  if (profile.status !== 'pending') return null;
  return <PendingApprovalModal />;
}

export default function App() {
  return (
    <BrowserRouter>
      <IntroAnimation />
      <AuthProvider>
        <OnboardingGate />
        <PendingGate />
        <Routes>
          <Route path="/" element={<Layout><Home /></Layout>} />
          <Route path="/introduction" element={<Layout><ProjectIntro /></Layout>} />
          <Route path="/organization" element={<Layout><ProjectOrg /></Layout>} />
          <Route path="/review/:id" element={<Layout><div className="min-h-screen flex items-center justify-center text-[#003366] font-bold text-2xl">計畫執行回顧詳情頁面 (開發中)</div></Layout>} />
          <Route path="/login" element={<TopBarLayout><Login /></TopBarLayout>} />
          <Route path="/portal" element={<Portal />} />
          <Route
            path="/admin"
            element={
              <TopBarLayout>
                <RequireRole allowedRoles={['admin']}>
                  <AdminDashboard />
                </RequireRole>
              </TopBarLayout>
            }
          />
          <Route
            path="/mentor"
            element={
              <TopBarLayout>
                <RequireRole allowedRoles={['mentor']}>
                  <MentorDashboard />
                </RequireRole>
              </TopBarLayout>
            }
          />
          <Route
            path="/teacher"
            element={
              <TopBarLayout>
                <RequireRole allowedRoles={['teacher']}>
                  <TeacherDashboard />
                </RequireRole>
              </TopBarLayout>
            }
          />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}
