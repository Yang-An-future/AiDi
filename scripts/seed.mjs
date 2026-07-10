// Populates Firestore with the same sample content the site used to have
// hardcoded, so the pages aren't empty right after the DB is wired up.
// Run locally with a service account configured (see .env.example):
//   npm run seed
import dotenv from 'dotenv';
import fs from 'fs';
import { getAdminFirestore } from '../server/firebaseAdmin.js';

for (const file of ['.env.local', '.env']) {
  if (fs.existsSync(file)) dotenv.config({ path: file });
}

const db = getAdminFirestore();

const announcements = [
  { id: 'a1', date: '2026/05/12', title: '115-116 年 AI Di+ 實驗方案大學伴招募說明會', summary: '邀請有志青年加入數位學伴行列，共同為偏鄉教育貢獻心力...', order: 1 },
  { id: 'a2', date: '2026/04/20', title: '因材網數位學習平臺操作研習報名開始', summary: '協助大學伴熟悉因材網平臺與知識節點星空圖功能，即日起開放報名。', order: 2 },
  { id: 'a3', date: '2026/03/15', title: '合作學校媒合結果公告', summary: '本學期各合作國中小學伴媒合名單已公布，請至因材網查詢分組資訊。', order: 3 },
];

const courses = [
  { id: 'c1', tag: '大學伴研習', title: '生成式 AI 輔助教學實務工作坊 (A1)', location: '線上會議平台', time: '115/06/15 14:00', order: 1 },
  { id: 'c2', tag: '大學伴研習', title: '因材網數位學習平臺應用工作坊 (A2)', location: '線上會議平台', time: '115/06/22 14:00', order: 2 },
];

const reviews = [
  { id: '2024', year: '2024 年度回顧', imgUrl: 'https://images.unsplash.com/photo-1577896851231-70ef18881754?w=800&q=80', order: 1 },
  { id: '2025', year: '2025 年度回顧', imgUrl: 'https://images.unsplash.com/photo-1427504494785-319ce8372c02?w=800&q=80', order: 2 },
];

const schools = [
  { id: 's1', name: '屏大附小', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=school1', order: 1 },
  { id: 's2', name: '中正國中', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=school2', order: 2 },
  { id: 's3', name: '民生國小', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=school3', order: 3 },
  { id: 's4', name: '鶴聲國中', logoUrl: 'https://api.dicebear.com/7.x/identicon/svg?seed=school4', order: 4 },
];

const assistants = [
  { id: 'as1', name: '專任助理 A', role: '行政管理及媒合對接', detail: '負責國民中小學學習端媒合、計畫進度追蹤與行政彙整。', order: 1 },
  { id: 'as2', name: '專任助理 B', role: '技術支援及數位平台', detail: '負責因材網帳號綁定、數位平台操作疑難排解與維護。', order: 2 },
];

const principalInvestigator = {
  name: '林青穎 博士',
  title: '計畫主持人',
  affiliation: '國立屏東大學',
  bio: '主導整體「AI Di+」研究架構、資源整合及校際合作。致力於將先進 AI 應用導入偏鄉英語及跨域學習，推動「大學伴」與「小學伴」之優質數位互動模組。',
  email: 'genie8451@mail.moe.gov.tw',
};

async function seedCollection(name, items) {
  const batch = db.batch();
  for (const { id, ...data } of items) {
    batch.set(db.collection(name).doc(id), data);
  }
  await batch.commit();
  console.log(`Seeded ${items.length} document(s) into "${name}"`);
}

async function seed() {
  await seedCollection('announcements', announcements);
  await seedCollection('courses', courses);
  await seedCollection('reviews', reviews);
  await seedCollection('schools', schools);
  await seedCollection('assistants', assistants);
  await db.collection('org').doc('principalInvestigator').set(principalInvestigator);
  console.log('Seeded org/principalInvestigator');
}

seed()
  .then(() => {
    console.log('Done.');
    process.exit(0);
  })
  .catch((err) => {
    console.error('Seeding failed:', err);
    process.exit(1);
  });
