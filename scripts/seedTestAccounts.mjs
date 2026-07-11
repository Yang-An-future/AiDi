// Adds (or removes) two obviously-fake roster entries so the admin can walk
// through the "name matched -> auto-approved" onboarding path end-to-end with
// a real Google account, without touching the real roster data.
//
// Usage:
//   node scripts/seedTestAccounts.mjs           add the test names
//   node scripts/seedTestAccounts.mjs --remove  remove them again
import dotenv from 'dotenv';
import fs from 'fs';
import { getAdminFirestore } from '../server/firebaseAdmin.js';

for (const file of ['.env.local', '.env']) {
  if (fs.existsSync(file)) dotenv.config({ path: file });
}

const TEST_MENTOR_NAME = '測試大學伴';
const TEST_TEACHER_NAME = '測試老師';

const db = getAdminFirestore();
const remove = process.argv.includes('--remove');

async function main() {
  if (remove) {
    await db.collection('roster_mentor').doc(TEST_MENTOR_NAME).delete();
    await db.collection('roster_teacher').doc(TEST_TEACHER_NAME).delete();
    console.log(`Removed test roster entries: ${TEST_MENTOR_NAME}, ${TEST_TEACHER_NAME}`);
  } else {
    await db.collection('roster_mentor').doc(TEST_MENTOR_NAME).set({ name: TEST_MENTOR_NAME, test: true });
    await db.collection('roster_teacher').doc(TEST_TEACHER_NAME).set({ name: TEST_TEACHER_NAME, school: '(測試用)', test: true });
    console.log(`Added test roster entries. During onboarding, enter the name exactly:`);
    console.log(`  大學伴 -> ${TEST_MENTOR_NAME}`);
    console.log(`  學習端老師 -> ${TEST_TEACHER_NAME}`);
  }
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });
