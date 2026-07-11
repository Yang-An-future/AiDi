import React, { useRef, useState } from 'react';
import { addDoc, collection, orderBy, serverTimestamp, where } from 'firebase/firestore';
import { FileText, LogOut, Upload } from 'lucide-react';
import { db } from '../../lib/firebase';
import { useAuth } from '../../contexts/AuthContext';
import { useFirestoreCollection } from '../../hooks/useFirestore';
import { uploadFile } from '../../lib/upload';
import type { SurveyCategory, SurveyUpload } from '../../types/portal';

const categoryLabel: Record<SurveyCategory, string> = {
  equipment: '學習端設備環境調查',
  needs: '學習需求調查',
};

export default function TeacherDashboard() {
  const { user, profile, logout } = useAuth();
  const [uploadingCategory, setUploadingCategory] = useState<SurveyCategory | null>(null);
  const [error, setError] = useState<string | null>(null);
  const equipmentInputRef = useRef<HTMLInputElement>(null);
  const needsInputRef = useRef<HTMLInputElement>(null);

  const constraints = user ? [where('teacherUid', '==', user.uid), orderBy('uploadedAt', 'desc')] : [];
  const { data: uploads, loading } = useFirestoreCollection<SurveyUpload>('surveyUploads', constraints);

  const handleUpload = async (category: SurveyCategory, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !db || !user || !profile) return;
    setError(null);
    setUploadingCategory(category);
    try {
      const { url, storagePath } = await uploadFile(`surveys/${user.uid}/${category}-${Date.now()}-${file.name}`, file);
      await addDoc(collection(db, 'surveyUploads'), {
        teacherUid: user.uid,
        teacherName: profile.name,
        teacherEmail: profile.email,
        category,
        fileName: file.name,
        fileUrl: url,
        storagePath,
        uploadedAt: serverTimestamp(),
      });
    } catch (err) {
      setError(err instanceof Error ? err.message : '上傳失敗');
    } finally {
      setUploadingCategory(null);
      e.target.value = '';
    }
  };

  return (
    <div className="flex-grow bg-slate-50 px-6 py-12">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-[#003366]">學習端老師專區</h1>
            <p className="text-sm text-gray-400 mt-1">{profile?.name}（{user?.email}）</p>
          </div>
          <button onClick={() => logout()} className="flex items-center gap-2 text-sm font-semibold text-gray-500 hover:text-[#003366]">
            <LogOut className="w-4 h-4" /> 登出
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <label className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-[#003366] cursor-pointer hover:shadow-xl transition-shadow block">
            <Upload className="w-8 h-8 text-[#F5892E] mb-4" />
            <h3 className="font-bold text-[#003366] text-lg">
              {uploadingCategory === 'equipment' ? '上傳中...' : categoryLabel.equipment}
            </h3>
            <p className="text-xs text-gray-400 mt-1">上限 20MB</p>
            <input
              ref={equipmentInputRef}
              type="file"
              onChange={(e) => handleUpload('equipment', e)}
              disabled={uploadingCategory !== null}
              className="hidden"
            />
          </label>

          <label className="bg-white rounded-2xl shadow-lg p-8 border-l-4 border-[#F5892E] cursor-pointer hover:shadow-xl transition-shadow block">
            <Upload className="w-8 h-8 text-[#003366] mb-4" />
            <h3 className="font-bold text-[#003366] text-lg">
              {uploadingCategory === 'needs' ? '上傳中...' : categoryLabel.needs}
            </h3>
            <p className="text-xs text-gray-400 mt-1">上限 20MB</p>
            <input
              ref={needsInputRef}
              type="file"
              onChange={(e) => handleUpload('needs', e)}
              disabled={uploadingCategory !== null}
              className="hidden"
            />
          </label>
        </div>
        {error && <p className="text-red-600 text-sm mb-6">{error}</p>}

        <div className="bg-white rounded-2xl shadow-lg p-8 border border-slate-100">
          <h3 className="font-bold text-[#003366] flex items-center gap-2 mb-6">
            <FileText className="w-5 h-5 text-[#F5892E]" /> 我上傳的檔案
          </h3>
          {loading && <p className="text-sm text-gray-400">載入中...</p>}
          <div className="space-y-3">
            {uploads.map((u) => (
              <a
                key={u.id}
                href={u.fileUrl}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-between p-4 rounded-xl border border-slate-200 hover:border-[#F5892E] transition-colors"
              >
                <div>
                  <span className="text-[10px] bg-[#003366] text-white px-2 py-0.5 rounded-full mr-2">{categoryLabel[u.category]}</span>
                  <span className="text-sm font-medium text-gray-700">{u.fileName}</span>
                </div>
                <span className="text-xs text-[#003366] font-bold">查看</span>
              </a>
            ))}
          </div>
          {!loading && uploads.length === 0 && <p className="text-sm text-gray-400 italic">尚未上傳檔案。</p>}
        </div>
      </div>
    </div>
  );
}
