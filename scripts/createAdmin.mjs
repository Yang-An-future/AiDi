// Bootstraps (or promotes) the first admin account. Self-registration only
// ever creates 'mentor' / 'teacher' profiles, so admins have to be created
// out-of-band with this script and the Firebase Admin SDK.
//
// If the email already exists in Firebase Auth (e.g. created by hand in the
// Console), password is not needed — this just adds the missing Firestore
// users/{uid} profile (role=admin, status=active) that the app requires.
//
// Usage: npm run create-admin -- someone@example.com ["StrongPassw0rd"] ["管理員姓名"]
import dotenv from 'dotenv';
import fs from 'fs';
import { getAdminAuth, getAdminFirestore } from '../server/firebaseAdmin.js';

for (const file of ['.env.local', '.env']) {
  if (fs.existsSync(file)) dotenv.config({ path: file });
}

const [email, password, name = '管理員'] = process.argv.slice(2);

if (!email) {
  console.error('Usage: npm run create-admin -- <email> [password] [name]');
  console.error('  password is only required when the account does not already exist in Firebase Auth.');
  process.exit(1);
}

async function main() {
  const auth = getAdminAuth();
  const db = getAdminFirestore();

  let user;
  try {
    user = await auth.getUserByEmail(email);
    console.log(`Found existing auth user for ${email} (${user.uid}), promoting to admin.`);
  } catch {
    if (!password) {
      console.error(`No existing Auth account for ${email}. Provide a password to create one:`);
      console.error(`  npm run create-admin -- ${email} <password> [name]`);
      process.exit(1);
    }
    user = await auth.createUser({ email, password });
    console.log(`Created new auth user for ${email} (${user.uid}).`);
  }

  await db.collection('users').doc(user.uid).set(
    {
      uid: user.uid,
      email,
      name,
      role: 'admin',
      status: 'active',
      createdAt: new Date(),
    },
    { merge: true }
  );

  console.log(`Done. ${email} can now log in at /login (Google sign-in) as an admin.`);
}

main()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error('Failed:', err);
    process.exit(1);
  });
