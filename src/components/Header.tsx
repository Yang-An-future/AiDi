import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';
import logo from '../assets/logo-160.webp';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user } = useAuth();
  const workshopLink = user ? '/portal' : '/login';
  const workshopLabel = user ? '我的專區' : '計畫工作坊';

  return (
    <nav className="sticky top-0 z-50 bg-[#003366] text-white shadow-md px-4 md:px-8 py-4 relative">
      <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-gradient-to-r from-[#2DACE3] via-[#F5892E] to-[#2DACE3]"></div>
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 cursor-pointer">
            <img src={logo} alt="AI Di+ Logo" className="w-12 h-12 rounded-full bg-white shadow-md" />
            <div>
              <h1 className="text-white text-lg md:text-xl font-bold tracking-tight mb-0.5">AI Di+ 實驗方案計劃</h1>
              <p className="text-[#F5892E] text-[10px] md:text-xs uppercase tracking-widest font-semibold hidden sm:block font-serif">AI Di+ Experimental Scheme Project</p>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-4 xl:gap-8 text-white text-sm font-medium">
            <Link to="/" className={`whitespace-nowrap transition-all border-b-2 ${isHome ? 'border-[#F5892E]' : 'border-transparent opacity-70 hover:opacity-100 hover:border-[#F5892E]'}`}>首頁</Link>
            <Link to="/introduction" className="whitespace-nowrap opacity-70 hover:opacity-100 transition-all border-b-2 border-transparent hover:border-[#F5892E]">計畫介紹</Link>
            <Link to="/organization" className="whitespace-nowrap opacity-70 hover:opacity-100 transition-all border-b-2 border-transparent hover:border-[#F5892E]">計畫組織</Link>
            <Link to={workshopLink} className="ml-2 px-6 py-2 bg-[#F5892E] text-[#003366] rounded-full hover:bg-[#e0761a] transition-all font-bold shadow-lg whitespace-nowrap transform hover:scale-105 active:scale-95">{workshopLabel}</Link>
          </div>
          {/* Mobile Menu Button Placeholder */}
          <div className="lg:hidden">
            <Link to={workshopLink} className="text-xs font-semibold px-4 py-2 bg-[#F5892E] text-[#003366] rounded-full">{user ? '專區' : '工作坊'}</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
