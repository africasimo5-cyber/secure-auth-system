'use client';

import { useState, Suspense } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';

function ResetPasswordContent() {
  const [formData, setFormData] = useState({ newPassword: '', confirmPassword: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get('token') || '';

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    if (formData.newPassword !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/reset-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ token, newPassword: formData.newPassword }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Password reset successfully! Redirecting to login...');
        setTimeout(() => {
          router.push('/login');
        }, 2000);
      } else {
        setError(data.error || 'Invalid or expired token');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 text-white text-center">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-white/20 to-blue-600"></div>
          
          <div className="mb-10">
            <h1 className="text-3xl font-extrabold mb-3 tracking-tight">Set New Password</h1>
            <p className="text-slate-400 font-medium">Update your secure access credentials</p>
          </div>

          {(error || message) && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2 duration-400 ${
              error ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              <span className="text-left">{error || message}</span>
            </div>
          )}

          {!message && (
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex text-left ml-1">New Password</label>
                <input
                  name="newPassword"
                  type="password"
                  required
                  minLength={8}
                  value={formData.newPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#202e42] transition-all"
                  placeholder="At least 8 characters"
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-semibold text-slate-300 flex text-left ml-1">Confirm New Password</label>
                <input
                  name="confirmPassword"
                  type="password"
                  required
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#202e42] transition-all"
                  placeholder="Repeat new password"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading || !token}
                className="w-full py-4 mt-4 rounded-2xl bg-white text-[#020617] font-bold text-lg hover:bg-slate-100 active:scale-[0.98] transition-all shadow-xl shadow-white/5 disabled:opacity-50"
              >
                {!token ? 'Missing Reset Token' : isLoading ? 'Updating Vault...' : 'Reset Password'}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-white/5">
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-medium">
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">Loading...</div>}>
      <ResetPasswordContent />
    </Suspense>
  );
}
