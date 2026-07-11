// Publishes firestore.rules and storage.rules using the Admin SDK service
// account, so rule changes don't require manually pasting into the Firebase
// Console (or installing/logging into the Firebase CLI).
import dotenv from 'dotenv';
import fs from 'fs';
import { getSecurityRules } from 'firebase-admin/security-rules';
import { getFirebaseAdminApp } from '../server/firebaseAdmin.js';

for (const file of ['.env.local', '.env']) {
  if (fs.existsSync(file)) dotenv.config({ path: file });
}

async function main() {
  const rules = getSecurityRules(getFirebaseAdminApp());

  const firestoreSource = fs.readFileSync('firestore.rules', 'utf-8');
  await rules.releaseFirestoreRulesetFromSource(firestoreSource);
  console.log('Firestore rules published.');

  const storageSource = fs.readFileSync('storage.rules', 'utf-8');
  await rules.releaseStorageRulesetFromSource(storageSource);
  console.log('Storage rules published.');
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed to publish rules:', err);
    process.exit(1);
  });
