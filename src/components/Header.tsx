import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion } from 'motion/react';
import { useAuth } from '../contexts/AuthContext';

export default function Header() {
  const location = useLocation();
  const isHome = location.pathname === '/';
  const { user } = useAuth();
  const workshopLink = user ? '/portal' : '/login';
  const workshopLabel = user ? '我的專區' : '計畫工作坊';

  return (
    <nav className="sticky top-0 z-50 bg-[#003366] border-b-4 border-[#C5A059] text-white shadow-md px-4 md:px-8 py-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center">
          <Link to="/" className="flex items-center gap-4 cursor-pointer">
            <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center">
              <span className="text-[#003366] font-bold text-xl">AI+</span>
            </div>
            <div>
              <h1 className="text-white text-lg md:text-xl font-bold tracking-tight mb-0.5">AI Di+ 實驗方案計劃</h1>
              <p className="text-[#C5A059] text-[10px] md:text-xs uppercase tracking-widest font-semibold hidden sm:block font-serif">AI Di+ Experimental Scheme Project</p>
            </div>
          </Link>
          <div className="hidden lg:flex items-center gap-4 xl:gap-8 text-white text-sm font-medium">
            <Link to="/" className={`whitespace-nowrap transition-all border-b-2 ${isHome ? 'border-[#C5A059]' : 'border-transparent opacity-70 hover:opacity-100 hover:border-[#C5A059]'}`}>首頁</Link>
            <Link to="/introduction" className="whitespace-nowrap opacity-70 hover:opacity-100 transition-all border-b-2 border-transparent hover:border-[#C5A059]">計畫介紹</Link>
            <Link to="/organization" className="whitespace-nowrap opacity-70 hover:opacity-100 transition-all border-b-2 border-transparent hover:border-[#C5A059]">計畫組織</Link>
            <Link to={workshopLink} className="ml-2 px-6 py-2 bg-[#C5A059] text-[#003366] rounded-full hover:bg-[#b5924d] transition-all font-bold shadow-lg whitespace-nowrap transform hover:scale-105 active:scale-95">{workshopLabel}</Link>
          </div>
          {/* Mobile Menu Button Placeholder */}
          <div className="lg:hidden">
            <Link to={workshopLink} className="text-xs font-semibold px-4 py-2 bg-[#C5A059] text-[#003366] rounded-full">{user ? '專區' : '工作坊'}</Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
