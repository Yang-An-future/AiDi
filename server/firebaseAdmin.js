import { cert, getApps, initializeApp } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { getFirestore } from 'firebase-admin/firestore';

// Render (and most PaaS) can't hold a multi-line JSON service-account file, so the
// whole key is passed as one env var and parsed here. Keep it out of source control.
function loadServiceAccount() {
  const raw = process.env.FIREBASE_SERVICE_ACCOUNT_JSON;
  if (!raw) return null;
  try {
    return JSON.parse(raw);
  } catch {
    // Some hosts mangle newlines in multi-line env vars; base64 sidesteps that.
    return JSON.parse(Buffer.from(raw, 'base64').toString('utf-8'));
  }
}

let app = null;

export function getFirebaseAdminApp() {
  if (app) return app;
  if (getApps().length > 0) {
    app = getApps()[0];
    return app;
  }

  const serviceAccount = loadServiceAccount();
  if (!serviceAccount) {
    throw new Error(
      'FIREBASE_SERVICE_ACCOUNT_JSON is not set. Provide the Firebase service account key (as JSON or base64) to use Admin SDK features.'
    );
  }

  app = initializeApp({
    credential: cert(serviceAccount),
    storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  });
  return app;
}

export function getAdminAuth() {
  return getAuth(getFirebaseAdminApp());
}

export function getAdminFirestore() {
  return getFirestore(getFirebaseAdminApp());
}
