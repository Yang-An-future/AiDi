import React, { useMemo, useState } from 'react';
import { deleteDoc, doc, orderBy } from 'firebase/firestore';
import JSZip from 'jszip';
import { db } from '../../../lib/firebase';
import { useFirestoreCollection } from '../../../hooks/useFirestore';
import type { LessonPlan, SurveyUpload } from '../../../types/portal';
import { deleteFile } from '../../../lib/upload';
import { Download, Trash2 } from 'lucide-react';

const constraints = [orderBy('uploadedAt', 'desc')];

type UploadItem =
  | (LessonPlan & { kind: 'lessonPlan' })
  | (SurveyUpload & { kind: 'survey' });

const typeLabel: Record<string, string> = {
  lessonPlan: '教案',
  equipment: '學習端設備環境',
  needs: '學習需求調查',
};

function itemKey(item: UploadItem) {
  return `${item.kind}-${item.id}`;
}

function itemLabel(item: UploadItem) {
  return item.kind === 'lessonPlan' ? typeLabel.lessonPlan : typeLabel[item.category];
}

function itemUploader(item: UploadItem) {
  return item.kind === 'lessonPlan' ? item.mentorName : item.teacherName;
}

function downloadBlob(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export default function UploadsTab() {
  const { data: lessonPlans, loading: lessonPlansLoading } = useFirestoreCollection<LessonPlan>('lessonPlans', constraints);
  const { data: surveys, loading: surveysLoading } = useFirestoreCollection<SurveyUpload>('surveyUploads', constraints);
  const [selected, setSelected] = useState<Set<string>>(new Set());
  const [zipping, setZipping] = useState(false);

  const items: UploadItem[] = useMemo(() => {
    const a: UploadItem[] = lessonPlans.map((p) => ({ ...p, kind: 'lessonPlan' as const }));
    const b: UploadItem[] = surveys.map((s) => ({ ...s, kind: 'survey' as const }));
    return [...a, ...b].sort((x, y) => {
      const tx = (x.uploadedAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
      const ty = (y.uploadedAt as { toMillis?: () => number } | undefined)?.toMillis?.() ?? 0;
      return ty - tx;
    });
  }, [lessonPlans, surveys]);

  const allSelected = items.length > 0 && selected.size === items.length;

  const toggleAll = () => setSelected(allSelected ? new Set() : new Set(items.map(itemKey)));
  const toggleOne = (key: string) => {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  };

  const handleDelete = async (item: UploadItem) => {
    if (!db) return;
    const collectionName = item.kind === 'lessonPlan' ? 'lessonPlans' : 'surveyUploads';
    await deleteDoc(doc(db, collectionName, item.id));
    await deleteFile(item.storagePath);
    setSelected((prev) => {
      const next = new Set(prev);
      next.delete(itemKey(item));
      return next;
    });
  };

  const handleDownloadZip = async () => {
    const chosen = items.filter((item) => selected.has(itemKey(item)));
    if (chosen.length === 0) return;
    setZipping(true);
    try {
      const zip = new JSZip();
      await Promise.all(
        chosen.map(async (item) => {
          const res = await fetch(item.fileUrl);
          const blob = await res.blob();
          zip.file(`${itemLabel(item)}/${itemUploader(item)}-${item.fileName}`, blob);
        })
      );
      const blob = await zip.generateAsync({ type: 'blob' });
      downloadBlob(blob, `上傳資料_${Date.now()}.zip`);
    } finally {
      setZipping(false);
    }
  };

  const loading = lessonPlansLoading || surveysLoading;

  return (
    <div>
      <div className="flex items-center gap-3 mb-4">
        <button
          onClick={handleDownloadZip}
          disabled={selected.size === 0 || zipping}
          className="flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white rounded-full text-sm font-bold disabled:opacity-30"
        >
          <Download className="w-4 h-4" /> {zipping ? '打包中...' : `下載選取（${selected.size}）`}
        </button>
      </div>

      {loading && <p className="text-sm text-gray-400">載入中...</p>}

      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-slate-200 text-left text-gray-500">
              <th className="py-2 pr-2">
                <input type="checkbox" checked={allSelected} onChange={toggleAll} />
              </th>
              <th className="py-2 pr-4">類型</th>
              <th className="py-2 pr-4">上傳者</th>
              <th className="py-2 pr-4">檔名</th>
              <th className="py-2 pr-4">操作</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item) => {
              const key = itemKey(item);
              return (
                <tr key={key} className="border-b border-slate-100 hover:bg-slate-50">
                  <td className="py-2 pr-2">
                    <input type="checkbox" checked={selected.has(key)} onChange={() => toggleOne(key)} />
                  </td>
                  <td className="py-2 pr-4">{itemLabel(item)}</td>
                  <td className="py-2 pr-4">{itemUploader(item)}</td>
                  <td className="py-2 pr-4">
                    <a href={item.fileUrl} target="_blank" rel="noreferrer" className="text-[#003366] hover:underline">
                      {item.fileName}
                    </a>
                  </td>
                  <td className="py-2 pr-4">
                    <button onClick={() => handleDelete(item)} className="text-gray-400 hover:text-red-600">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {!loading && items.length === 0 && <p className="text-sm text-gray-400 italic py-6 text-center">尚無上傳資料。</p>}
      </div>
    </div>
  );
}
