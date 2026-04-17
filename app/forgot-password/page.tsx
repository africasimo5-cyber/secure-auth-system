'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/forgot-password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage(data.message || 'Verification link sent if account exists.');
      } else {
        setError(data.error || 'Failed to request reset');
      }
    } catch (err) {
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
            <h1 className="text-3xl font-extrabold mb-3 tracking-tight">Recover Access</h1>
            <p className="text-slate-400 font-medium">Reset your secure credentials</p>
          </div>

          {(error || message) && (
            <div className={`mb-8 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2 duration-400 ${
              error ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-blue-500/10 border border-blue-500/20 text-blue-400'
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
                <label className="text-sm font-semibold text-slate-300 flex text-left ml-1">Email Address</label>
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#202e42] transition-all"
                  placeholder="name@company.com"
                />
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-4 mt-4 rounded-2xl bg-white text-[#020617] font-bold text-lg hover:bg-slate-100 active:scale-[0.98] transition-all shadow-xl shadow-white/5 disabled:opacity-50"
              >
                {isLoading ? 'Sending Request...' : 'Send Recovery Link'}
              </button>
            </form>
          )}

          <div className="mt-10 pt-8 border-t border-white/5">
            <Link href="/login" className="text-slate-400 hover:text-white transition-colors text-sm font-medium flex items-center justify-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              Back to Sign In
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
