'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function SignupPage() {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
  });
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

    // Client-side validation
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: formData.email, password: formData.password }),
      });

      const data = await res.json();

      if (res.ok) {
        // Redirect to verification page with email in query
        router.push(`/verify?email=${encodeURIComponent(formData.email)}`);
      } else {
        setError(data.error || 'Signup failed. Please try again.');
      }
    } catch {
      setError('Connection refused. Please check your internet.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          {/* Subtle gradient overlay */}
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-white/20 to-blue-600"></div>
          
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold text-white mb-3 tracking-tight">Create Account</h1>
            <p className="text-slate-400 font-medium">Start your secure journey with us</p>
          </div>

          {error && (
            <div className="mb-6 p-4 rounded-2xl bg-red-500/10 border border-red-500/20 text-red-400 text-sm flex items-center gap-3 animate-pulse">
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Email Address</label>
              <input
                name="email"
                type="email"
                required
                value={formData.email}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#202e42] transition-all"
                placeholder="name@company.com"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Password</label>
              <input
                name="password"
                type="password"
                required
                minLength={8}
                value={formData.password}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#202e42] transition-all"
                placeholder="At least 8 characters"
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-semibold text-slate-300 ml-1">Confirm Password</label>
              <input
                name="confirmPassword"
                type="password"
                required
                value={formData.confirmPassword}
                onChange={handleChange}
                className="w-full px-5 py-4 rounded-2xl bg-[#1e293b] border border-white/5 text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:bg-[#202e42] transition-all"
                placeholder="Repeat password"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-4 mt-4 rounded-2xl bg-white text-[#020617] font-bold text-lg hover:bg-slate-100 active:scale-[0.98] transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Creating Account...' : 'Get Started'}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-white/5 pt-8">
            <p className="text-slate-400 font-medium">
              Already have an account?{' '}
              <Link href="/login" className="text-white hover:underline underline-offset-4 decoration-blue-500 transition-all">
                Sign In
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
