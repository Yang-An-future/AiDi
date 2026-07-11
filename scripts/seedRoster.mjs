// Seeds the name rosters used for auto-approval at onboarding, plus the
// school dropdown shown to teachers.
//
// The actual names live in scripts/roster-data.json, which is gitignored —
// it's real personal data (mentors/teachers/schools) and must never be
// committed. Ask the admin for an updated 人員名單 and regenerate that file
// (shape: { mentors: string[], schools: string[], teachers: { name, school }[] })
// whenever the roster changes, then re-run this script — it's a full
// overwrite (batch.set), not an incremental append.
import dotenv from 'dotenv';
import fs from 'fs';
import { getAdminFirestore } from '../server/firebaseAdmin.js';

for (const file of ['.env.local', '.env']) {
  if (fs.existsSync(file)) dotenv.config({ path: file });
}

const dataPath = new URL('./roster-data.json', import.meta.url);
if (!fs.existsSync(dataPath)) {
  console.error('scripts/roster-data.json not found. Create it (gitignored, real names only) before seeding.');
  process.exit(1);
}
const { mentors, schools, teachers } = JSON.parse(fs.readFileSync(dataPath, 'utf-8'));

const db = getAdminFirestore();

async function seedMentorRoster() {
  const batch = db.batch();
  for (const name of mentors) {
    batch.set(db.collection('roster_mentor').doc(name), { name });
  }
  await batch.commit();
  console.log(`Seeded ${mentors.length} mentor roster name(s).`);
}

async function seedTeacherRoster() {
  const batch = db.batch();
  for (const t of teachers) {
    batch.set(db.collection('roster_teacher').doc(t.name), t);
  }
  await batch.commit();
  console.log(`Seeded ${teachers.length} teacher roster name(s).`);
}

async function seedSchoolOptions() {
  const batch = db.batch();
  schools.forEach((name, i) => {
    batch.set(db.collection('schoolOptions').doc(String(i + 1)), { name, order: i + 1 });
  });
  await batch.commit();
  console.log(`Seeded ${schools.length} school option(s).`);
}

async function main() {
  await seedMentorRoster();
  await seedTeacherRoster();
  await seedSchoolOptions();
}

main()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding roster failed:', err);
    process.exit(1);
  });
