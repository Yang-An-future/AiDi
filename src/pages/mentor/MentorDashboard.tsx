import React, { useRef, useState } from 'react';
import { addDoc, collection, orderBy, serverTimestamp, where } from 'firebase/firestore';
import { CalendarDays, FileText, LogOut, Upload } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import { uploadFile } from '../../lib/upload';
import type { LessonPlan } from '../../types/portal';
import ScheduleModal from '../../components/ScheduleModal';

export default function MentorDashboard() {
  const { user, profile, logout } = useAuth();
  const [showSchedule, setShowSchedule] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const constraints = user ? [where('mentorUid', '==', user.uid), orderBy('uploadedAt', 'desc')] : [];
  const { data: lessonPlans, loading } = useFirestoreCollection<LessonPlan>('lessonPlans', constraints);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !db || !user || !profile) return;
    setError(null);
    setUploading(true);
    try {
      const { url, storagePath } = await uploadFile(`lessonPlans/${user.uid}/${Date.now()}-${file.name}`, file);
      await addDoc(collection(db, 'lessonPlans'), {
        mentorUid: user.uid,
        mentorName: profile.name,
        mentorEmail: profile.email,
        fileName: file.name,
        fileUrl: url,
        storagePath,
        uploadedAt: serverTimestamp(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '上傳失敗');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#003366]">大學伴專區</h1>
            <p className="text-sm text-gray-400 mt-1">{profile?.name}（{user?.email}）</p>
          </div>
          <button onClick={() => logout()} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#003366]">
            <LogOut className="w-4 h-4" /> 登出
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <button
            onClick={() => setShowSchedule(true)}
            className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-[#003366] text-left hover:shadow-xl transition-shadow"
          >
            <CalendarDays className="w-8 h-8 text-[#F5892E] mb-4" />
            <h3 className="font-bold text-[#003366] text-lg">查看課表</h3>
            <p className="text-xs text-gray-400 mt-1">檢視目前課程總表</p>
          </button>

          <label className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-[#F5892E] cursor-pointer hover:shadow-xl transition-shadow block">
            <Upload className="w-8 h-8 text-[#003366] mb-4" />
            <h3 className="font-bold text-[#003366] text-lg">{uploading ? '上傳中...' : '上傳教案'}</h3>
            <p className="text-xs text-gray-400 mt-1">支援 PDF / Word / PPT，上限 20MB</p>
            <input ref={fileInputRef} type="file" onChange={handleUpload} disabled={uploading} className="hidden" />
          </label>
        </div>
        {error && <p className="text-red-600 text-sm mb-6">{error}</p>}

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h3 className="font-bold text-[#003366] flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-[#F5892E]" /> 我上傳的教案
          </h3>
          {loading && <p className="text-sm text-gray-400">載入中...</p>}
          <div className="space-y-3">
            {lessonPlans.map((p) => (
              <a
                key={p.id}
                href={p.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#F5892E] transition-colors"
              >
                <span className="text-sm font-medium text-gray-700">{p.fileName}</span>
                <span className="text-xs text-[#003366] font-bold">查看</span>
              </a>
            ))}
          </div>
          {!loading && lessonPlans.length === 0 && <p className="text-sm text-gray-400 italic">尚未上傳教案。</p>}
        </div>
      </div>

      {showSchedule && <ScheduleModal onClose={() => setShowSchedule(false)} />}
    </div>
  );
}
