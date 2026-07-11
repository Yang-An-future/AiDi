import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';
import { storage } from './firebase';

export const MAX_UPLOAD_BYTES = 20 * 1024 * 1024; // 20MB

export class UploadError extends Error {}

export async function uploadFile(path: string, file: File): Promise<{ url: string; storagePath: string }> {
  if (!storage) throw new UploadError('Firebase 尚未設定，無法上傳檔案。');
  if (file.size > MAX_UPLOAD_BYTES) {
    throw new UploadError('檔案大小不可超過 20MB。');
  }
  const storageRef = ref(storage, path);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return { url, storagePath: storageRef.fullPath };
}

export async function deleteFile(storagePath: string): Promise<void> {
  if (!storage) return;
  try {
    await deleteObject(ref(storage, storagePath));
  } catch {
    // Object may already be gone — not worth surfacing to the user.
  }
}
