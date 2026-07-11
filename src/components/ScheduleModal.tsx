import React from 'react';
import { CalendarDays, X } from 'lucide-react';
import { useFirestoreDoc } from '../hooks/useFirestore';
import type { CourseScheduleFile } from '../types/portal';

export default function ScheduleModal({ onClose }: { onClose: () => void }) {
  const { data: schedule, loading } = useFirestoreDoc<CourseScheduleFile>('courseSchedule/current');

  return (
    <div className="fixed inset-0 z-[100] bg-black/50 flex items-center justify-center px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-2xl p-8 relative border-t-8 border-[#003366]">
        <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
          <X className="w-5 h-5" />
        </button>
        <h3 className="text-lg font-bold text-[#003366] flex items-center gap-2 mb-6">
          <CalendarDays className="w-5 h-5 text-[#F5892E]" /> 課程總表
        </h3>

        {loading && <p className="text-sm text-gray-400">載入中...</p>}
        {!loading && !schedule && <p className="text-sm text-gray-400 italic">管理員尚未上傳課程總表。</p>}
        {schedule && (
          <div className="text-sm">
            <p className="font-semibold text-gray-800">{schedule.fileName}</p>
            <a
              href={schedule.fileUrl}
              target="_blank"
              rel="noreferrer"
              className="inline-block mt-4 w-full text-center py-2.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002347] transition-colors"
            >
              下載課程總表
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
