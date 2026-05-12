import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProjectIntro from './pages/ProjectIntro';
import ProjectOrg from './pages/ProjectOrg';

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

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout><Home /></Layout>} />
        <Route path="/introduction" element={<Layout><ProjectIntro /></Layout>} />
        <Route path="/organization" element={<Layout><ProjectOrg /></Layout>} />
        <Route path="/review/:id" element={<Layout><div className="min-h-screen flex items-center justify-center text-[#003366] font-bold text-2xl">計畫執行回顧詳情頁面 (開發中)</div></Layout>} />
      </Routes>
    </BrowserRouter>
  );
}

