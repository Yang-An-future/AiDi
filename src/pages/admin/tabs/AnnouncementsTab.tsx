import React, { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useFirestoreCollection } from '../../../hooks/useFirestore';
import type { Announcement } from '../../../types/content';
import { Trash2 } from 'lucide-react';

const constraints = [orderBy('order', 'desc')];

const emptyForm = { date: '', title: '', summary: '' };

export default function AnnouncementsTab() {
  const { data: announcements, loading } = useFirestoreCollection<Announcement>('announcements', constraints);
  const [form, setForm] = useState(emptyForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const startEdit = (a: Announcement) => {
    setEditingId(a.id);
    setForm({ date: a.date, title: a.title, summary: a.summary });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !form.date.trim() || !form.title.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'announcements', editingId), form);
      } else {
        await addDoc(collection(db, 'announcements'), { ...form, order: Date.now() });
      }
      cancelEdit();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, 'announcements', id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-fit">
        <h3 className="font-bold text-[#003366] mb-4">{editingId ? '編輯公告' : '新增公告'}</h3>
        <label className="block text-xs font-medium text-gray-600 mb-1">日期</label>
        <input
          placeholder="2026/05/12"
          value={form.date}
          onChange={(e) => setForm({ ...form, date: e.target.value })}
          className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-lg text-sm"
        />
        <label className="block text-xs font-medium text-gray-600 mb-1">標題</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-lg text-sm"
        />
        <label className="block text-xs font-medium text-gray-600 mb-1">摘要</label>
        <textarea
          value={form.summary}
          onChange={(e) => setForm({ ...form, summary: e.target.value })}
          rows={3}
          className="w-full mb-4 px-3 py-2 border border-slate-300 rounded-lg text-sm"
        />
        <div className="flex gap-2">
          <button
            type="submit"
            disabled={submitting}
            className="flex-1 py-2 bg-[#003366] text-white rounded-lg text-sm font-bold disabled:opacity-50"
          >
            {editingId ? '儲存' : '新增'}
          </button>
          {editingId && (
            <button type="button" onClick={cancelEdit} className="px-4 py-2 text-sm text-gray-500">
              取消
            </button>
          )}
        </div>
      </form>

      <div>
        {loading && <p className="text-sm text-gray-400">載入中...</p>}
        <div className="space-y-3">
          {announcements.map((a) => (
            <div key={a.id} className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs text-gray-400 font-mono">{a.date}</p>
                <p className="font-bold text-gray-800">{a.title}</p>
                <p className="text-xs text-gray-500 mt-1">{a.summary}</p>
              </div>
              <div className="flex flex-col gap-2 items-end shrink-0">
                <button onClick={() => startEdit(a)} className="text-xs text-[#003366] hover:underline">
                  編輯
                </button>
                <button onClick={() => handleDelete(a.id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {!loading && announcements.length === 0 && <p className="text-sm text-gray-400 italic">尚無公告。</p>}
        </div>
      </div>
    </div>
  );
}
