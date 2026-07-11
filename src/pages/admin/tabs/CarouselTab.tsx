import React, { useRef, useState } from 'react';
import { addDoc, collection, deleteDoc, doc, orderBy, updateDoc } from 'firebase/firestore';
import { db } from '../../../lib/firebase';
import { useFirestoreCollection } from '../../../hooks/useFirestore';
import type { CarouselSlide } from '../../../types/portal';
import { deleteFile, uploadFile } from '../../../lib/upload';
import { ArrowDown, ArrowUp, Trash2, Upload } from 'lucide-react';

const constraints = [orderBy('order')];

export default function CarouselTab() {
  const { data: slides, loading } = useFirestoreCollection<CarouselSlide>('carouselSlides', constraints);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !db) return;
    setError(null);
    setUploading(true);
    try {
      const { url, storagePath } = await uploadFile(`carousel/${Date.now()}-${file.name}`, file);
      const maxOrder = slides.reduce((max, s) => Math.max(max, s.order), 0);
      await addDoc(collection(db, 'carouselSlides'), { imageUrl: url, storagePath, order: maxOrder + 1 });
    } catch (err) {
      setError(err instanceof Error ? err.message : '上傳失敗');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleDelete = async (slide: CarouselSlide) => {
    if (!db) return;
    await deleteDoc(doc(db, 'carouselSlides', slide.id));
    await deleteFile(slide.storagePath);
  };

  const swapOrder = async (a: CarouselSlide, b: CarouselSlide) => {
    if (!db) return;
    await updateDoc(doc(db, 'carouselSlides', a.id), { order: b.order });
    await updateDoc(doc(db, 'carouselSlides', b.id), { order: a.order });
  };

  return (
    <div>
      <label className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#003366] text-white rounded-full text-sm font-bold cursor-pointer hover:bg-[#002347] transition-colors">
        <Upload className="w-4 h-4" /> {uploading ? '上傳中...' : '上傳新照片'}
        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleUpload} disabled={uploading} className="hidden" />
      </label>
      {error && <p className="text-red-600 text-sm mt-2">{error}</p>}

      {loading && <p className="text-sm text-gray-400 mt-6">載入中...</p>}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-6">
        {slides.map((slide, i) => (
          <div key={slide.id} className="rounded-xl overflow-hidden border border-slate-200 bg-white">
            <div className="aspect-video overflow-hidden bg-slate-100">
              <img src={slide.imageUrl} alt="" className="w-full h-full object-cover" />
            </div>
            <div className="p-3 flex items-center justify-between">
              <div className="flex gap-1">
                <button
                  onClick={() => i > 0 && swapOrder(slide, slides[i - 1])}
                  disabled={i === 0}
                  className="p-1.5 text-gray-400 hover:text-[#003366] disabled:opacity-20"
                >
                  <ArrowUp className="w-4 h-4" />
                </button>
                <button
                  onClick={() => i < slides.length - 1 && swapOrder(slide, slides[i + 1])}
                  disabled={i === slides.length - 1}
                  className="p-1.5 text-gray-400 hover:text-[#003366] disabled:opacity-20"
                >
                  <ArrowDown className="w-4 h-4" />
                </button>
              </div>
              <button onClick={() => handleDelete(slide)} className="p-1.5 text-gray-400 hover:text-red-600">
                <Trash2 className="w-4 h-4" />
              </button>
            </div>
          </div>
        ))}
      </div>
      {!loading && slides.length === 0 && <p className="text-sm text-gray-400 italic mt-6">尚未上傳輪播照片。</p>}
    </div>
  );
}
