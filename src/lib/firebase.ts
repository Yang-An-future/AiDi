import { initializeApp, type FirebaseApp } from 'firebase/app';
import { getAuth, type Auth } from 'firebase/auth';
import { getFirestore, type Firestore } from 'firebase/firestore';
import { getStorage, type FirebaseStorage } from 'firebase/storage';

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

export const isFirebaseConfigured = Boolean(firebaseConfig.apiKey && firebaseConfig.projectId);

let firebaseApp: FirebaseApp | null = null;
let auth: Auth | null = null;
let db: Firestore | null = null;
let storage: FirebaseStorage | null = null;

// getAuth() throws synchronously on a missing/invalid apiKey, which would take
// down the whole SPA (not just the admin pages) before VITE_FIREBASE_* is set
// — e.g. right after the first deploy, before secrets are configured. Degrade
// to "Firebase unavailable" instead of a blank white screen.
if (isFirebaseConfigured) {
  firebaseApp = initializeApp(firebaseConfig);
  auth = getAuth(firebaseApp);
  db = getFirestore(firebaseApp);
  storage = getStorage(firebaseApp);
} else if (import.meta.env.DEV) {
  console.warn(
    'Firebase 尚未設定（缺少 VITE_FIREBASE_* 環境變數）。公告/課程等內容與管理後台登入功能將無法使用，請參考 .env.example。'
  );
}

export { firebaseApp, auth, db, storage };
