import React, { useState } from 'react';
import { addDoc, collection, deleteDoc, doc, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useFirestoreCollection } from '../../../hooks/useFirestore';
import type { Announcement, CourseAnnouncement } from '../../../types/content';
import { Trash2 } from 'lucide-react';
import RichTextEditor from '../../../components/RichTextEditor';

const COURSE_CATEGORIES = ['大學伴研習'];

const constraints = [orderBy('order', 'desc')];

type NoticeType = 'announcements' | 'courses';

export default function AnnouncementsTab() {
  const [type, setType] = useState<NoticeType>('announcements');

  return (
    <div>
      <label className="block text-xs font-medium text-gray-600 mb-1">公告類型</label>
      <select
        value={type}
        onChange={(e) => setType(e.target.value as NoticeType)}
        className="mb-6 px-3 py-2 border border-slate-300 rounded-lg text-sm font-bold text-[#003366] bg-white"
      >
        <option value="announcements">最新公告</option>
        <option value="courses">課程公告</option>
      </select>

      {type === 'announcements' ? <AnnouncementsPanel /> : <CoursesPanel />}
    </div>
  );
}

const emptyAnnouncementForm = { date: '', title: '', summary: '' };

function AnnouncementsPanel() {
  const { data: announcements, loading } = useFirestoreCollection<Announcement>('announcements', constraints);
  const [form, setForm] = useState(emptyAnnouncementForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const startEdit = (a: Announcement) => {
    setEditingId(a.id);
    setForm({ date: a.date, title: a.title, summary: a.summary });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyAnnouncementForm);
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
        <RichTextEditor
          key={editingId ?? 'new-announcement'}
          defaultValue={form.summary}
          onChange={(html) => setForm((f) => ({ ...f, summary: html }))}
          placeholder="輸入公告內容，可使用粗體／斜體／連結／圖片"
        />
        <div className="flex gap-2 mt-4">
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
              <div className="min-w-0">
                <p className="text-xs text-gray-400 font-mono">{a.date}</p>
                <p className="font-bold text-gray-800">{a.title}</p>
                <div
                  className="text-xs text-gray-500 mt-1 line-clamp-2 [&_img]:max-h-10 [&_img]:inline-block [&_a]:text-[#003366] [&_a]:underline"
                  dangerouslySetInnerHTML={{ __html: a.summary }}
                />
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

const emptyCourseForm = { tag: COURSE_CATEGORIES[0], title: '', location: '', time: '', remark: '' };

function CoursesPanel() {
  const { data: courses, loading } = useFirestoreCollection<CourseAnnouncement>('courses', constraints);
  const [form, setForm] = useState(emptyCourseForm);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const startEdit = (c: CourseAnnouncement) => {
    setEditingId(c.id);
    setForm({ tag: c.tag, title: c.title, location: c.location, time: c.time, remark: c.remark ?? '' });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setForm(emptyCourseForm);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!db || !form.title.trim() || !form.location.trim() || !form.time.trim()) return;
    setSubmitting(true);
    try {
      if (editingId) {
        await updateDoc(doc(db, 'courses', editingId), form);
      } else {
        await addDoc(collection(db, 'courses'), { ...form, order: Date.now() });
      }
      cancelEdit();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!db) return;
    await deleteDoc(doc(db, 'courses', id));
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <form onSubmit={handleSubmit} className="bg-slate-50 rounded-2xl p-6 border border-slate-200 h-fit">
        <h3 className="font-bold text-[#003366] mb-4">{editingId ? '編輯課程公告' : '新增課程公告'}</h3>
        <label className="block text-xs font-medium text-gray-600 mb-1">研習類別</label>
        <select
          value={form.tag}
          onChange={(e) => setForm({ ...form, tag: e.target.value })}
          className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-lg text-sm bg-white"
        >
          {COURSE_CATEGORIES.map((c) => (
            <option key={c} value={c}>
              {c}
            </option>
          ))}
        </select>
        <label className="block text-xs font-medium text-gray-600 mb-1">標題</label>
        <input
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-lg text-sm"
        />
        <label className="block text-xs font-medium text-gray-600 mb-1">地點</label>
        <input
          value={form.location}
          onChange={(e) => setForm({ ...form, location: e.target.value })}
          className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-lg text-sm"
        />
        <label className="block text-xs font-medium text-gray-600 mb-1">時間</label>
        <input
          placeholder="115/06/15 14:00"
          value={form.time}
          onChange={(e) => setForm({ ...form, time: e.target.value })}
          className="w-full mb-3 px-3 py-2 border border-slate-300 rounded-lg text-sm"
        />
        <label className="block text-xs font-medium text-gray-600 mb-1">備註（點開課程後才會顯示）</label>
        <textarea
          value={form.remark}
          onChange={(e) => setForm({ ...form, remark: e.target.value })}
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
          {courses.map((c) => (
            <div key={c.id} className="p-4 rounded-xl border border-slate-200 flex items-start justify-between gap-4">
              <div className="min-w-0">
                <span className="text-[10px] bg-[#003366] text-white px-2 py-0.5 rounded-full">{c.tag}</span>
                <p className="font-bold text-gray-800 mt-1">{c.title}</p>
                <p className="text-xs text-gray-500 mt-1">
                  地點：{c.location}｜時間：{c.time}
                </p>
                {c.remark && <p className="text-xs text-gray-400 mt-1 italic">備註：{c.remark}</p>}
              </div>
              <div className="flex flex-col gap-2 items-end shrink-0">
                <button onClick={() => startEdit(c)} className="text-xs text-[#003366] hover:underline">
                  編輯
                </button>
                <button onClick={() => handleDelete(c.id)} className="text-gray-400 hover:text-red-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
          {!loading && courses.length === 0 && <p className="text-sm text-gray-400 italic">尚無課程公告。</p>}
        </div>
      </div>
    </div>
  );
}
