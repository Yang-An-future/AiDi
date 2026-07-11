import React, { useState } from 'react';
import { doc, getDoc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { useAuth } from '../contexts/AuthContext';
import { useFirestoreCollection } from '../hooks/useFirestore';
import type { SchoolOption, UserRole, UserStatus } from '../types/portal';

// Roster collections are keyed by the exact trimmed name the admin supplies
// (see roster_mentor / roster_teacher), so a single getDoc is enough to check
// membership without exposing the full name list to the client.
async function resolveStatus(role: UserRole, name: string): Promise<UserStatus> {
  if (!db) return 'pending';
  const collectionName = role === 'mentor' ? 'roster_mentor' : 'roster_teacher';
  const snapshot = await getDoc(doc(db, collectionName, name));
  return snapshot.exists() ? 'active' : 'pending';
}

export default function OnboardingModal() {
  const { user, logout } = useAuth();
  const { data: schools } = useFirestoreCollection<SchoolOption>('schoolOptions');
  const [role, setRole] = useState<UserRole | ''>('');
  const [name, setName] = useState('');
  const [className, setClassName] = useState('');
  const [studentId, setStudentId] = useState('');
  const [schoolName, setSchoolName] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!user || !db) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!role) {
      setError('請選擇身分。');
      return;
    }
    const trimmedName = name.trim();
    if (!trimmedName) {
      setError('請填寫姓名。');
      return;
    }
    if (role === 'mentor' && (!className.trim() || !studentId.trim())) {
      setError('請完整填寫班級與學號。');
      return;
    }
    if (role === 'teacher' && !schoolName) {
      setError('請選擇服務的國中小。');
      return;
    }

    setSubmitting(true);
    try {
      const status = await resolveStatus(role, trimmedName);
      await setDoc(doc(db, 'users', user.uid), {
        uid: user.uid,
        email: user.email,
        name: trimmedName,
        role,
        status,
        ...(role === 'mentor' ? { className: className.trim(), studentId: studentId.trim() } : { schoolName }),
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
        <p className="text-sm text-gray-500 mb-6">首次登入請選擇身分並填寫以下資料。</p>

        <label className="block text-sm font-medium text-gray-700 mb-1">身分</label>
        <select
          value={role}
          onChange={(e) => setRole(e.target.value as UserRole)}
          className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E] bg-white"
        >
          <option value="">請選擇身分</option>
          <option value="mentor">大學伴</option>
          <option value="teacher">學習端老師</option>
        </select>

        {role && (
          <>
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
              placeholder="請填寫真實姓名，以利身分核對"
              className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E]"
            />

            {role === 'mentor' && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">班級</label>
                <input
                  type="text"
                  required
                  value={className}
                  onChange={(e) => setClassName(e.target.value)}
                  placeholder="例：教育系三年級"
                  className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E]"
                />

                <label className="block text-sm font-medium text-gray-700 mb-1">學號</label>
                <input
                  type="text"
                  required
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E]"
                />
              </>
            )}

            {role === 'teacher' && (
              <>
                <label className="block text-sm font-medium text-gray-700 mb-1">國中小名稱</label>
                <select
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E] bg-white"
                >
                  <option value="">請選擇學校</option>
                  {schools.map((s) => (
                    <option key={s.id} value={s.name}>
                      {s.name}
                    </option>
                  ))}
                </select>
                {schools.length === 0 && (
                  <p className="text-xs text-gray-400 -mt-2 mb-4 italic">學校名單尚未建置，如清單為空請聯繫管理員。</p>
                )}
              </>
            )}
          </>
        )}

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
