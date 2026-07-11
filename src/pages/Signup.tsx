import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { UserPlus } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Signup() {
  const { user, signup } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/portal" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (password !== confirmPassword) {
      setError('兩次輸入的密碼不一致。');
      return;
    }
    if (password.length < 6) {
      setError('密碼長度至少需要 6 個字元。');
      return;
    }
    setSubmitting(true);
    try {
      await signup(email, password);
      navigate('/portal');
    } catch (err) {
      const code = (err as { code?: string })?.code;
      setError(code === 'auth/email-already-in-use' ? '此 Email 已被註冊，請直接登入。' : '註冊失敗，請稍後再試一次。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border-t-8 border-[#C5A059]"
      >
        <h1 className="text-xl font-bold text-[#003366] flex items-center gap-3 mb-8">
          <UserPlus className="w-5 h-5 text-[#C5A059]" /> 大學伴／學習端老師註冊
        </h1>

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">確認密碼</label>
        <input
          type="password"
          required
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#C5A059]"
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002347] transition-colors disabled:opacity-50"
        >
          {submitting ? '註冊中...' : '註冊'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          註冊完成後需填寫基本資料，並等待管理員審核啟用帳號。
        </p>
        <p className="text-center text-xs text-gray-400 mt-2">
          已經有帳號？
          <Link to="/login" className="text-[#003366] font-semibold hover:underline ml-1">
            直接登入
          </Link>
        </p>
      </form>
    </div>
  );
}
