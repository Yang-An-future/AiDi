import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAdminAuth } from './firebaseAdmin.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const distDir = path.join(__dirname, '..', 'dist');

const app = express();
app.use(express.json());

app.get('/api/health', (_req, res) => {
  res.json({ ok: true });
});

// Verifies a Firebase Auth ID token sent as "Authorization: Bearer <token>".
// Attach this to any future /api route that needs to confirm the caller is a
// logged-in admin before touching Firestore via the Admin SDK.
export async function requireAuth(req, res, next) {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    return res.status(401).json({ error: 'Missing bearer token' });
  }
  try {
    req.user = await getAdminAuth().verifyIdToken(token);
    next();
  } catch (err) {
    res.status(401).json({ error: 'Invalid or expired token' });
  }
}

// Example protected route — replace/expand as the admin backend grows.
app.get('/api/admin/whoami', requireAuth, (req, res) => {
  res.json({ uid: req.user.uid, email: req.user.email });
});

app.use(express.static(distDir));

// SPA fallback: let react-router handle any non-API route client-side.
app.get(/^(?!\/api).*/, (_req, res) => {
  res.sendFile(path.join(distDir, 'index.html'));
});

const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
