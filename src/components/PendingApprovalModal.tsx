import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

// Shown whenever a signed-in profile is still 'pending' — either the name
// didn't match the admin's roster at onboarding time, or the admin hasn't
// manually approved it yet. Forces a logout back to the public homepage
// rather than leaving the user stuck on a waiting screen.
export default function PendingApprovalModal() {
  const { logout } = useAuth();

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 border-t-8 border-[#F5892E] text-center">
        <AlertTriangle className="w-10 h-10 text-[#F5892E] mx-auto mb-4" />
        <h2 className="text-lg font-bold text-[#003366] mb-2">查無此姓名</h2>
        <p className="text-sm text-gray-500 mb-8">
          您的資料尚未通過核對，請通知管理員進行處理。管理員審核完成後即可重新登入使用。
        </p>
        <button
          onClick={() => logout()}
          className="w-full py-2.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002347] transition-colors"
        >
          返回首頁
        </button>
      </div>
    </div>
  );
}
