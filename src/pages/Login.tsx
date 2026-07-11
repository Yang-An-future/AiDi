import React, { useState } from 'react';
import { Navigate, useNavigate } from 'react-router-dom';
import { FirebaseError } from 'firebase/app';
import { GoogleAuthProvider, type AuthCredential } from 'firebase/auth';
import { useAuth } from '../contexts/AuthContext';

function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 48 48" aria-hidden="true">
      <path fill="#FFC107" d="M43.6 20.5H42V20H24v8h11.3C33.7 32.9 29.3 36 24 36c-6.6 0-12-5.4-12-12s5.4-12 12-12c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4 12.9 4 4 12.9 4 24s8.9 20 20 20 20-8.9 20-20c0-1.3-.1-2.7-.4-3.5z" />
      <path fill="#FF3D00" d="M6.3 14.7l6.6 4.8C14.7 16 19 13 24 13c3.1 0 5.9 1.1 8 3.1l5.7-5.7C34.6 6.1 29.6 4 24 4c-7.5 0-14 4.2-17.3 10.4z" />
      <path fill="#4CAF50" d="M24 44c5.2 0 10-2 13.5-5.2l-6.2-5.2C29.3 35.6 26.8 36.5 24 36.5c-5.3 0-9.6-3.4-11.3-8.1l-6.5 5C9.9 39.6 16.4 44 24 44z" />
      <path fill="#1976D2" d="M43.6 20.5H42V20H24v8h11.3c-.8 2.2-2.2 4.1-4 5.6l6.2 5.2C40.5 36 44 30.5 44 24c0-1.3-.1-2.7-.4-3.5z" />
    </svg>
  );
}

export default function Login() {
  const { user, loginWithGoogle, linkGoogleWithPassword } = useAuth();
  const navigate = useNavigate();
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Only populated when Google sign-in fails because the email is already
  // tied to an older password-based account — asks for that password once,
  // then links Google onto the same account so the existing profile carries over.
  const [linkEmail, setLinkEmail] = useState<string | null>(null);
  const [linkCredential, setLinkCredential] = useState<AuthCredential | null>(null);
  const [linkPassword, setLinkPassword] = useState('');

  if (user) {
    return <Navigate to="/portal" replace />;
  }

  const handleGoogleLogin = async () => {
    setError(null);
    setSubmitting(true);
    try {
      await loginWithGoogle();
      navigate('/portal');
    } catch (err) {
      const code = (err as { code?: string })?.code;
      if (code === 'auth/account-exists-with-different-credential' && err instanceof FirebaseError) {
        const credential = GoogleAuthProvider.credentialFromError(err);
        const email = (err.customData as { email?: string } | undefined)?.email;
        if (credential && email) {
          setLinkCredential(credential);
          setLinkEmail(email);
        } else {
          setError('此 Email 已使用其他方式註冊，請聯繫管理員處理。');
        }
      } else if (code === 'auth/popup-closed-by-user') {
        // User cancelled — no error message needed.
      } else {
        setError('登入失敗，請稍後再試一次。');
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleLinkSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!linkEmail || !linkCredential) return;
    setError(null);
    setSubmitting(true);
    try {
      await linkGoogleWithPassword(linkEmail, linkPassword, linkCredential);
      navigate('/portal');
    } catch {
      setError('密碼不正確，請再試一次。');
    } finally {
      setSubmitting(false);
    }
  };

  if (linkEmail) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
        <form
          onSubmit={handleLinkSubmit}
          className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border-t-8 border-[#003366]"
        >
          <h1 className="text-lg font-bold text-[#003366] mb-2">帳號已存在</h1>
          <p className="text-sm text-gray-500 mb-6">
            {linkEmail} 先前已使用密碼註冊，請輸入密碼一次以完成與 Google 帳號的連結，之後即可直接用 Google 登入。
          </p>

          <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
          <input
            type="password"
            required
            autoFocus
            value={linkPassword}
            onChange={(e) => setLinkPassword(e.target.value)}
            className="w-full mb-6 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E]"
          />

          {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

          <button
            type="submit"
            disabled={submitting}
            className="w-full py-2.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002347] transition-colors disabled:opacity-50"
          >
            {submitting ? '連結中...' : '確認並連結帳號'}
          </button>
          <button
            type="button"
            onClick={() => {
              setLinkEmail(null);
              setLinkCredential(null);
              setError(null);
            }}
            className="w-full mt-3 text-xs text-gray-400 hover:text-gray-600"
          >
            返回
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <div className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border-t-8 border-[#003366] text-center">
        <h1 className="text-xl font-bold text-[#003366] mb-2">計畫工作坊登入</h1>
        <p className="text-sm text-gray-500 mb-8">大學伴／學習端老師請使用常用的 Google 帳號登入。</p>

        <button
          onClick={handleGoogleLogin}
          disabled={submitting}
          className="w-full flex items-center justify-center gap-3 py-3 bg-white border border-slate-300 rounded-lg font-bold text-gray-700 hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-50"
        >
          <GoogleIcon />
          {submitting ? '登入中...' : '使用 Google 帳號登入'}
        </button>

        {error && <p className="text-red-600 text-sm mt-4">{error}</p>}

        <p className="text-xs text-gray-400 mt-8">
          首次登入將請您選擇身分並填寫基本資料。
        </p>
      </div>
    </div>
  );
}
