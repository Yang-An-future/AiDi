import React, { useState } from 'react';
import { CalendarDays, Images, LayoutDashboard, LogOut, Megaphone, Upload, Users } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import AccountsTab from './tabs/AccountsTab';
import AnnouncementsTab from './tabs/AnnouncementsTab';
import CarouselTab from './tabs/CarouselTab';
import ScheduleTab from './tabs/ScheduleTab';
import UploadsTab from './tabs/UploadsTab';

const tabs = [
  { key: 'accounts', label: '帳號審核', icon: Users, Component: AccountsTab },
  { key: 'announcements', label: '公告管理', icon: Megaphone, Component: AnnouncementsTab },
  { key: 'carousel', label: '輪播照片', icon: Images, Component: CarouselTab },
  { key: 'schedule', label: '課程總表', icon: CalendarDays, Component: ScheduleTab },
  { key: 'uploads', label: '上傳資料管理', icon: Upload, Component: UploadsTab },
] as const;

export default function AdminDashboard() {
  const { user, logout } = useAuth();
  const [active, setActive] = useState<(typeof tabs)[number]['key']>('accounts');
  const ActiveComponent = tabs.find((t) => t.key === active)!.Component;

  return (
    <div className="flex-grow bg-slate-50 px-6 py-12">
      <div className="w-[80%] mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#003366] flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-[#F5892E]" /> 管理後台
          </h1>
          <div className="flex items-center gap-4">
            <span className="text-xs text-gray-400">{user?.email}</span>
            <button
              onClick={() => logout()}
              className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#003366] transition-colors"
            >
              <LogOut className="w-4 h-4" /> 登出
            </button>
          </div>
        </div>

        <div className="flex gap-2 mb-8 overflow-x-auto pb-1">
          {tabs.map((t) => (
            <button
              key={t.key}
              onClick={() => setActive(t.key)}
              className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition-colors ${
                active === t.key ? 'bg-[#003366] text-white' : 'bg-white text-gray-500 border border-slate-200 hover:border-[#F5892E]'
              }`}
            >
              <t.icon className="w-4 h-4" /> {t.label}
            </button>
          ))}
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-6 md:p-8 border border-slate-100">
          <ActiveComponent />
        </div>
      </div>
    </div>
  );
}
