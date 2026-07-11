import React, { useState } from 'react';
import { deleteDoc, doc, orderBy, updateDoc, writeBatch } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useFirestoreCollection } from '../../../hooks/useFirestore';
import type { UserProfile, UserRole, UserStatus } from '../../../types/portal';
import { Pencil, Trash2, X } from 'lucide-react';

const roleLabel: Record<UserRole, string> = { admin: '管理員', mentor: '大學伴', teacher: '學習端老師' };
const statusLabel: Record<UserStatus, string> = { pending: '待審核', active: '已啟用', disabled: '已停用' };
const statusColor: Record<UserStatus, string> = {
  pending: 'bg-amber-100 text-amber-700',
  active: 'bg-emerald-100 text-emerald-700',
  disabled: 'bg-slate-200 text-slate-500',
};

function detailLabel(u: UserProfile) {
  if (u.role === 'mentor') return [u.className, u.studentId].filter(Boolean).join(' / ') || '-';
  if (u.role === 'teacher') return u.schoolName || '-';
  return '-';
}

const constraints = [orderBy('createdAt', 'desc')];

export default function AccountsTab() {
  const { data: users, loading } = useFirestoreCollection<UserProfile>('users', constraints);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [editing, setEditing] = useState<UserProfile | null>(null);

  const allSelected = users.length > 0 && selected.size === users.length;

  const toggleAll = () => {
    setSelected(allSelected ? new Set() : new Set(users.map((u) => u.uid)));
  };

  const toggleOne = (uid: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(uid)) next.delete(uid);
      else next.add(uid);
      return next;
    });
  };

  const batchSetStatus = async (status: UserStatus) => {
    if (!db || selected.size === 0) return;
    const batch = writeBatch(db);
    for (const uid of selected) {
      batch.update(doc(db, 'users', uid), { status });
    }
    await batch.commit();
    setSelected(new Set());
  };

  const setOneStatus = async (uid: string, status: UserStatus) => {
    if (!db) return;
    await updateDoc(doc(db, 'users', uid), { status });
  };

  // Only removes the Firestore profile — the underlying Google sign-in
  // still works, so onboarding just runs again from scratch on next login.
  // Handy for resetting a test account between mentor/teacher runs.
  const deleteOne = async (u: UserProfile) => {
    if (!db) return;
    if (!window.confirm(`確定要刪除「${u.name}」（${u.email}）的帳號資料嗎？此動作無法復原。`)) return;
    await deleteDoc(doc(db, 'users', u.uid));
  };

  if (loading) return <p className="text-sm text-gray-400">載入中...</p>;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={() => batchSetStatus('active')}
          disabled={selected.size === 0}
          className="px-4 py-2 text-xs font-bold rounded-full bg-emerald-600 text-white disabled:opacity-30"
        >
          啟用選取（{selected.size}）
        </button>
        <button
          onClick={() => batchSetStatus('disabled')}
          disabled={selected.size === 0}
          className="px-4 py-2 text-xs font-bold rounded-full bg-slate-500 text-white disabled:opacity-30"
        >
          停用選取（{selected.size}）
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-gray-500">
              <th className="py-2 pr-2">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="py-2 pr-4">Email</th>
              <th className="py-2 pr-4">姓名</th>
              <th className="py-2 pr-4">身分</th>
              <th className="py-2 pr-4">詳細資料</th>
              <th className="py-2 pr-4">狀態</th>
              <th className="py-2 pr-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.uid} className="border-b border-slate-100 hover:bg-slate-50">
                <td className="py-2 pr-2">
                  <input type="checkbox" checked={selected.has(u.uid)} onChange={() => toggleOne(u.uid)} />
                </td>
                <td className="py-2 pr-4">{u.email}</td>
                <td className="py-2 pr-4">{u.name}</td>
                <td className="py-2 pr-4">{roleLabel[u.role]}</td>
                <td className="py-2 pr-4">{detailLabel(u)}</td>
                <td className="py-2 pr-4">
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold ${statusColor[u.status]}`}>
                    {statusLabel[u.status]}
                  </span>
                </td>
                <td className="py-2 pr-4 flex items-center gap-2">
                  {u.status === 'active' ? (
                    <button onClick={() => setOneStatus(u.uid, 'disabled')} className="text-xs text-slate-500 hover:underline">
                      停用
                    </button>
                  ) : (
                    <button onClick={() => setOneStatus(u.uid, 'active')} className="text-xs text-emerald-600 hover:underline">
                      啟用
                    </button>
                  )}
                  <button onClick={() => setEditing(u)} className="text-gray-400 hover:text-[#003366]">
                    <Pencil className="w-4 h-4" />
                  </button>
                  <button onClick={() => deleteOne(u)} className="text-gray-400 hover:text-red-600">
                    <Trash2 className="w-4 h-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {users.length === 0 && <p className="text-sm text-gray-400 italic py-6 text-center">尚無帳號資料。</p>}
      </div>

      {editing && <EditUserModal user={editing} onClose={() => setEditing(null)} />}
    </div>
  );
}

function EditUserModal({ user, onClose }: { user: UserProfile; onClose: () => void }) {
  const [name, setName] = useState(user.name);
  const [className, setClassName] = useState(user.className ?? '');
  const [studentId, setStudentId] = useState(user.studentId ?? '');
  const [schoolName, setSchoolName] = useState(user.schoolName ?? '');
  const [role, setRole] = useState<UserRole>(user.role);
  const [saving, setSaving] = useState(false);

  const handleSave = async () => {
    if (!db) return;
    setSaving(true);
    await updateDoc(
      doc(db, 'users', user.uid),
      role === 'mentor'
        ? { name, className, studentId, role }
        : role === 'teacher'
          ? { name, schoolName, role }
          : { name, role }
    );
    setSaving(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 relative">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-[#003366] mb-6">編輯帳號資料</h3>
        <p className="text-xs text-gray-400 mb-4">{user.email}</p>

        <label className="block text-sm font-medium text-gray-700 mb-1">姓名</label>
        <input value={name} onChange={(e) => setName(e.target.value)} className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg" />

        {role === 'mentor' && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">班級</label>
            <input value={className} onChange={(e) => setClassName(e.target.value)} className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg" />

            <label className="block text-sm font-medium text-gray-700 mb-1">學號</label>
            <input value={studentId} onChange={(e) => setStudentId(e.target.value)} className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg" />
          </>
        )}

        {role === 'teacher' && (
          <>
            <label className="block text-sm font-medium text-gray-700 mb-1">國中小名稱</label>
            <input value={schoolName} onChange={(e) => setSchoolName(e.target.value)} className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg" />
          </>
        )}

        <label className="block text-sm font-medium text-gray-700 mb-2">身分</label>
        <div className="flex gap-4 mb-6">
          {(['mentor', 'teacher', 'admin'] as UserRole[]).map((r) => (
            <label key={r} className="flex items-center gap-2 text-sm">
              <input type="radio" checked={role === r} onChange={() => setRole(r)} /> {roleLabel[r]}
            </label>
          ))}
        </div>

        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full py-2.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002347] disabled:opacity-50"
        >
          {saving ? '儲存中...' : '儲存'}
        </button>
      </div>
    </div>
  );
}
