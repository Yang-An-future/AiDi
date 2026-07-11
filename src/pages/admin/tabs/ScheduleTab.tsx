import React, { useRef, useState } from 'react';
import { doc, serverTimestamp, setDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useFirestoreDoc } from '../../../hooks/useFirestore';
import { useAuth } from '../../../contexts/AuthContext';
import type { CourseScheduleFile } from '../../../types/portal';
import { deleteFile, uploadFile } from '../../../lib/upload';
import { CalendarDays, Upload } from 'lucide-react';

export default function ScheduleTab() {
  const { profile } = useAuth();
  const { data: schedule, loading } = useFirestoreDoc<CourseScheduleFile>('courseSchedule/current');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !db) return;
    setError(null);
    setUploading(true);
    try {
      const { url, storagePath } = await uploadFile(`courseSchedule/${Date.now()}-${file.name}`, file);
      const previousPath = schedule?.storagePath;
      await setDoc(doc(db, 'courseSchedule', 'current'), {
        fileName: file.name,
        fileUrl: url,
        storagePath,
        uploadedAt: serverTimestamp(),
        uploadedByName: profile?.name ?? '管理員',
      });
      if (previousPath) await deleteFile(previousPath);
    } catch (err) {
      setError(err instanceof Error ? err.message : '上傳失敗');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  return (
    <div className="max-w-xl">
      <p className="text-sm text-gray-500 mb-6">
        上傳課程總表（Word 或 Excel），所有大學伴登入後於「查看課表」皆會看到同一份最新總表。
      </p>

      <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white rounded-full text-sm font-bold cursor-pointer hover:bg-[#002347] transition-colors">
        <Upload className="w-4 h-4" /> {uploading ? '上傳中...' : '上傳／更新課程總表'}
        <input
          ref={fileInputRef}
          type="file"
          accept=".doc,.docx,.xls,.xlsx,.pdf"
          onChange={handleUpload}
          disabled={uploading}
          className="hidden"
        />
      </label>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      <div className="mt-8 p-6 bg-slate-50 rounded-xl border border-slate-200">
        <h4 className="font-bold text-[#003366] flex items-center gap-2 mb-3">
          <CalendarDays className="w-5 h-5 text-[#F5892E]" /> 目前課程總表
        </h4>
        {loading && <p className="text-sm text-gray-400">載入中...</p>}
        {!loading && !schedule && <p className="text-sm text-gray-400 italic">尚未上傳課程總表。</p>}
        {schedule && (
          <div className="text-sm">
            <p className="font-semibold text-gray-800">{schedule.fileName}</p>
            <p className="text-xs text-gray-400 mt-1">上傳者：{schedule.uploadedByName}</p>
            <a
              href={schedule.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-3 text-xs font-bold text-[#003366] hover:underline"
            >
              下載目前檔案
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
