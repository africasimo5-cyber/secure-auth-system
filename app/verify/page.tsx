'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

function VerifyOtpContent() {
  const [otp, setOtp] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [cooldown, setCooldown] = useState(0);
  const searchParams = useSearchParams();
  const email = searchParams.get('email') || '';

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (cooldown > 0) {
      timer = setInterval(() => {
        setCooldown((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [cooldown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/verify-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, otp }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('Verification successful! Logging you in...');
        localStorage.setItem('token', data.token);
        setTimeout(() => {
          window.location.assign('/welcome');
        }, 1500);
      } else {
        setError(data.error || 'Invalid or expired code');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResend = async () => {
    if (cooldown > 0) return;
    
    setResendLoading(true);
    setError('');
    setMessage('');

    try {
      const res = await fetch('/api/auth/resend-otp', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();

      if (res.ok) {
        setMessage('A new verification code has been sent.');
        setCooldown(60); // 60-second cooldown
      } else {
        setError(data.error || 'Failed to resend code');
      }
    } catch {
      setError('Connection failed. Please try again.');
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#020617] p-6 text-white">
      <div className="max-w-md w-full animate-in fade-in zoom-in duration-500">
        <div className="bg-[#0f172a] border border-white/5 rounded-3xl p-8 shadow-2xl shadow-black/50 overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-600 via-white/20 to-blue-600"></div>
          
          <div className="mb-10 text-center">
            <h1 className="text-4xl font-extrabold mb-3 tracking-tight">Verify Email</h1>
            <p className="text-slate-400 font-medium">
              We sent a code to <span className="text-white break-all">{email}</span>
            </p>
          </div>

          {(error || message) && (
            <div className={`mb-6 p-4 rounded-2xl flex items-center gap-3 text-sm animate-in slide-in-from-top-2 duration-300 ${
              error ? 'bg-red-500/10 border border-red-500/20 text-red-400' : 'bg-emerald-500/10 border border-emerald-500/20 text-emerald-400'
            }`}>
              <svg className="w-5 h-5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              {error || message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            <div className="flex justify-center">
              <input
                type="text"
                maxLength={6}
                required
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))}
                className="w-full text-center text-4xl tracking-[1.5rem] px-5 py-5 rounded-2xl bg-[#1e293b] border border-white/5 text-white placeholder-slate-700 focus:outline-none focus:ring-4 focus:ring-blue-500/20 transition-all font-mono"
                placeholder="000000"
              />
            </div>

            <button
              type="submit"
              disabled={isLoading || otp.length !== 6}
              className="w-full py-4 rounded-2xl bg-white text-[#020617] font-bold text-lg hover:bg-slate-100 active:scale-[0.98] transition-all shadow-xl shadow-white/5 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? 'Verifying...' : 'Verify Code'}
            </button>
          </form>

          <div className="mt-10 text-center border-t border-white/5 pt-8">
            <button
              onClick={handleResend}
              disabled={cooldown > 0 || resendLoading}
              className={`text-slate-400 font-medium hover:text-white transition-colors flex items-center justify-center gap-2 mx-auto disabled:opacity-50 disabled:cursor-default`}
            >
              {resendLoading ? (
                <span>Sending...</span>
              ) : cooldown > 0 ? (
                <span>Resend available in {cooldown}s</span>
              ) : (
                <span>Didn&apos;t receive code? <span className="text-blue-400 hover:underline">Resend</span></span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function VerifyPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center bg-[#020617] text-white">Loading...</div>}>
      <VerifyOtpContent />
    </Suspense>
  );
}
