// Seeds the name rosters used for auto-approval at onboarding, the school
// dropdown shown to teachers, and the "合作學校" partner-school cards on the
// homepage (placeholder colored-initial logos + each school's real official
// website, until real logo images are supplied).
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

// Official websites (public info, safe to commit) for the homepage "合作學校"
// section. Keyed by the exact school name string used in roster-data.json.
// The four 國中 added 2026/07 don't have a confirmed official site yet —
// left out so the card just shows no website link instead of a guessed URL.
const schoolWebsites = {
  '屏東縣三地門鄉地磨兒國民小學': 'https://www.sdps.ptc.edu.tw/',
  '高雄市美濃區美濃國民小學': 'https://www.mnp.kh.edu.tw/index.php?WebID=228',
  '高雄市前鎮區愛群國民小學': 'https://www.acps.kh.edu.tw/index.php?WebID=74',
  '屏東縣獅子鄉丹路國民小學': 'https://www.dles.ptc.edu.tw/',
  '屏東縣枋寮鄉枋寮國民小學': 'http://www.flps.ptc.edu.tw/',
  '屏東縣長治鄉長興國民小學': 'http://www.csps.ptc.edu.tw/',
  '屏東縣恆春鎮恆春國民小學': 'https://www.hcps.ptc.edu.tw/nss/p/index',
  '屏東縣瑪家鄉北葉國民小學': 'http://www.byps.ptc.edu.tw/',
  '屏東縣屏東市前進國民小學': 'https://www.cjes.ptc.edu.tw/',
  '屏東縣恆春鎮僑勇國民小學': 'https://www.chyps.ptc.edu.tw/',
  '高雄市前鎮區樂群國民小學': 'https://www.lcps.kh.edu.tw/index.php?WebID=157',
};

const BADGE_COLORS = ['#003366', '#F5892E'];

// Pulls the distinctive part out of "<縣市><鄉鎮市區><school name>國民小學/國民中學",
// e.g. "屏東縣三地門鄉地磨兒國民小學" -> "地磨兒", so the placeholder logo
// badge shows something recognizable instead of repeating "屏東" on every card.
function shortSchoolName(fullName) {
  const match = fullName.match(/^(?:.*?(?:縣|市))(?:.*?(?:鄉|鎮|市|區))(.*)國民(?:小學|中學)$/);
  return match ? match[1] : fullName.slice(0, 2);
}

function badgeLogoDataUri(text, color) {
  const fontSize = text.length >= 3 ? 32 : 42;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="128" height="128" viewBox="0 0 128 128">
  <rect width="128" height="128" rx="24" fill="${color}"/>
  <text x="64" y="72" font-family="'Noto Sans TC','PingFang TC','Microsoft JhengHei',sans-serif" font-size="${fontSize}" font-weight="700" fill="#ffffff" text-anchor="middle">${text}</text>
</svg>`;
  return `data:image/svg+xml;base64,${Buffer.from(svg, 'utf-8').toString('base64')}`;
}

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

// Replaces the placeholder "合作學校" cards on the homepage with the real
// partner schools — full overwrite, so any old dummy docs (s1..s4) are
// cleared out first rather than left alongside the real ones.
async function seedPartnerSchools() {
  const existing = await db.collection('schools').get();
  const deleteBatch = db.batch();
  existing.docs.forEach((d) => deleteBatch.delete(d.ref));
  await deleteBatch.commit();

  const batch = db.batch();
  schools.forEach((name, i) => {
    const short = shortSchoolName(name);
    const color = BADGE_COLORS[i % BADGE_COLORS.length];
    batch.set(db.collection('schools').doc(String(i + 1)), {
      name,
      logoUrl: badgeLogoDataUri(short, color),
      website: schoolWebsites[name] ?? '',
      order: i + 1,
    });
  });
  await batch.commit();
  console.log(`Seeded ${schools.length} partner school(s).`);
}

async function main() {
  await seedMentorRoster();
  await seedTeacherRoster();
  await seedSchoolOptions();
  await seedPartnerSchools();
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
