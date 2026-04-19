'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<{ email?: string; userId?: string } | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    // Note: middleware.ts handles the hard redirect to /login if no cookie is present.
    // We check localStorage here just to populate the UI with the user's email.
    const token = localStorage.getItem('token');
    
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split('.')[1]));
        setUser(payload);
      } catch (err) {
        console.error('Failed to parse local token:', err);
      }
    }
    
    setIsLoading(false);
  }, []);

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      localStorage.removeItem('token');
      router.push('/login');
      router.refresh();
    } catch (error) {
      console.error('Logout failed:', error);
      localStorage.removeItem('token');
      router.push('/login');
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#020617] text-white font-mono uppercase tracking-widest text-sm animate-pulse">
        Initializing Secure Environment...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] text-white pt-24 px-6 pb-12">
      <div className="max-w-6xl mx-auto space-y-10">
        {/* Header Section */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 p-8 rounded-3xl bg-[#0f172a] border border-white/5 shadow-2xl overflow-hidden relative border-l-4 border-l-blue-600">
          <div className="absolute top-0 right-0 w-64 h-64 bg-blue-600/10 rounded-full blur-3xl -mr-32 -mt-32"></div>
          
          <div className="relative">
            <h1 className="text-4xl font-extrabold mb-2 tracking-tight">
              Control Panel
            </h1>
            <p className="text-slate-400 font-medium">
              Verified User: <span className="text-emerald-400">{user?.email || 'Authenticated Session'}</span>
            </p>
          </div>

          <button
            onClick={handleLogout}
            className="relative px-8 py-3 rounded-xl bg-red-500 hover:bg-red-600 transition-all font-bold shadow-lg shadow-red-500/20 flex items-center gap-2 group"
          >
            <svg className="w-5 h-5 group-hover:-translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
            </svg>
            Sign Out
          </button>
        </div>




      </div>
    </div>
  );
}


