'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function LoginPage() {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const router = useRouter();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('token', data.token);
        window.location.assign('/welcome');
      } else {
        // Handle specific error states for UX
        if (data.error?.toLowerCase().includes('verify')) {
          router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
        } else {
          setError(data.error || 'Invalid email or password');
        }
      }
    } catch (err) {
      setError('Connection refused. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 text-white">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-white/20 to-blue-600"></div>
          
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Sign In</h1>
            <p className="text-slate-400 font-medium font-mono text-sm">SECURE_AUTH_V3.0_ONLINE</p>
          </div>

          {error && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2 duration-300 ${
              error.toLowerCase().includes('locked') ? 'bg-orange-500/10 border border-orange-500/20 text-orange-400' : 'bg-red-500/10 border border-red-500/20 text-red-400'
            }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12 1.5a5.25 5.25 0 00-5.25 5.25v3a3 3 0 00-3 3v6.75a3 3 0 003 3h10.5a3 3 0 003-3v-6.75a3 3 0 00-3-3v-3c0-2.9-2.35-5.25-5.25-5.25zm3.75 8.25v-3a3.75 3.75 0 10-7.5 0v3h7.5z" clipRule="evenodd" />
              </svg>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#202e42] transition-all font-mono"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <div className="flex justify-between items-center px-1">
                <label className="text-sm font-semibold text-slate-300">Password</label>
                <Link href="/forgot-password" virtual="true" className="text-xs text-blue-400 hover:underline">
                  Forgot?
                </Link>
              </div>
              <input
                name="password"
                type="password"
                required
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/5 text-white placeholder-slate-600 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#202e42] transition-all font-mono"
                placeholder="••••••••"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 rounded-2xl bg-white text-[#020617] font-bold text-lg hover:bg-slate-100 active:scale-[0.98] transition-all shadow-xl shadow-white/5 disabled:opacity-50"
            >
              {isLoading ? 'Decrypting Access...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-white/5 pt-8">
            <p className="text-slate-400 font-medium">
              Don't have an account?{' '}
              <Link href="/signup" className="text-white hover:underline underline-offset-4 decoration-blue-500 transition-all font-extrabold">
                Sign Up
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
