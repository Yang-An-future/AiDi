import React from 'react';
import { LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export default function AdminDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl font-bold text-[#003366] flex items-center gap-3">
            <LayoutDashboard className="w-6 h-6 text-[#C5A059]" /> 管理後台
          </h1>
          <button
            onClick={() => logout()}
            className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#003366] transition-colors"
          >
            <LogOut className="w-4 h-4" /> 登出
          </button>
        </div>

        <div className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-[#003366]">
          <p className="text-gray-600">
            已登入：<span className="font-semibold text-[#003366]">{user?.email}</span>
          </p>
          <p className="text-sm text-gray-400 mt-4">
            公告 / 課程 / 回顧 / 組織成員的編輯介面尚未建置，目前請直接於 Firebase Console 的 Firestore
            中維護 announcements、courses、reviews、schools、assistants、org 等集合。前台已會即時讀取這些資料。
          </p>
        </div>
      </div>
    </div>
  );
}
