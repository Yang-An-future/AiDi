import React, { useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export default function Login() {
  const { user, login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  if (user) {
    return <Navigate to="/portal" replace />;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await login(email, password);
      navigate('/portal');
    } catch {
      setError('登入失敗，請確認帳號密碼是否正確。');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-sm bg-white rounded-2xl shadow-xl p-8 border-t-8 border-[#003366]"
      >
        <h1 className="text-xl font-bold text-[#003366] flex items-center gap-3 mb-8">
          <LogIn className="w-5 h-5 text-[#F5892E]" /> 計畫工作坊登入
        </h1>

        <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
        <input
          type="email"
          required
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E]"
        />

        <label className="block text-sm font-medium text-gray-700 mb-1">密碼</label>
        <input
          type="password"
          required
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#F5892E]"
        />

        {error && <p className="text-red-600 text-sm mb-4">{error}</p>}

        <button
          type="submit"
          disabled={submitting}
          className="w-full py-2.5 bg-[#003366] text-white rounded-lg font-bold hover:bg-[#002347] transition-colors disabled:opacity-50"
        >
          {submitting ? '登入中...' : '登入'}
        </button>

        <p className="text-center text-xs text-gray-400 mt-6">
          大學伴／學習端老師還沒有帳號？
          <Link to="/signup" className="text-[#003366] font-semibold hover:underline ml-1">
            立即註冊
          </Link>
        </p>
      </form>
    </div>
  );
}
