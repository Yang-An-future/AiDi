import React, { useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import type { UserRole } from '../types/portal';

export default function OnboardingModal() {
  const { user, logout } = useAuth();
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('mentor');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || !db) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!name.trim() || !className.trim() || !phone.trim()) {
      setError('請完整填寫姓名、班級與電話。');
      return;
    }
    setSubmitting(true);
    try {
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: name.trim(),
        className: className.trim(),
        phone: phone.trim(),
        role,
        status: 'pending',
        createdAt: serverTimestamp(),
      });
    } catch {
      setError('儲存失敗，請稍後再試一次。');
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-md bg-white rounded-2xl shadow-2xl p-8 border-t-8 border-[#003366]"
      >
        <h2 className="text-xl font-bold text-[#003366] mb-2">完成個人資料</h2>
        <p className="text-sm text-gray-500 mb-6">首次登入請填寫以下資料，送出後將由管理員審核啟用帳號。</p>

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          disabled
          value={user.email ?? ''}
          className="w-full mb-4 px-4 py-2 border border-slate-200 bg-slate-50 rounded-lg text-gray-500"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
        <input
          type="text"
          required
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E]"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">班級</label>
        <input
          type="text"
          required
          value={className}
          onChange={(e) => setClassName(e.target.value)}
          placeholder="例：教育系三年級 / 屏大附小三年一班"
          className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E]"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">電話</label>
        <input
          type="tel"
          required
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E]"
        />

        <label className="block text-sm font-medium text-gray-700 mb-2">身分</label>
        <div className="flex gap-4 mb-6">
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="role" checked={role === 'mentor'} onChange={() => setRole('mentor')} />
            大學伴
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="radio" name="role" checked={role === 'teacher'} onChange={() => setRole('teacher')} />
            學習端老師
          </label>
        </div>

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002347] transition-colors disabled:opacity-50"
        >
          {submitting ? '送出中...' : '送出'}
        </button>
        <button
          type="button"
          onClick={() => logout()}
          className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600"
        >
          登出
        </button>
      </form>
    </div>
  );
}
