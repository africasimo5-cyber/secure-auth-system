'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function DashboardPage() {
  const [user, setUser] = useState<any>(null);
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

        {/* Info Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard title="Identity" value="Authenticated" color="emerald" />
          <StatCard title="Protection" value="Middleware Active" color="blue" />
          <StatCard title="Storage" value="HTTP-Only Cookies" color="slate" />
          <StatCard title="System" value="V3.1.0" color="slate" />
        </div>

        {/* placeholder for main dashboard content */}
        <div className="p-12 rounded-3xl bg-[#0f172a] border border-white/5 border-dashed flex flex-col items-center justify-center text-center">
          <div className="w-16 h-16 rounded-full bg-slate-800 flex items-center justify-center mb-6">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold mb-2 text-slate-300">No recent activity</h2>
          <p className="text-slate-500 max-w-sm">
            Server-side route protection is now active. Your session is managed via secure, HTTP-only cookies.
          </p>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, color }: { title: string, value: string, color: 'emerald' | 'blue' | 'slate' }) {
  const colors = {
    emerald: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20',
    blue: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    slate: 'text-slate-400 bg-slate-500/10 border-slate-500/20',
  };

  return (
    <div className={`p-6 rounded-2xl border ${colors[color]} backdrop-blur-sm shadow-xl`}>
      <h4 className="text-xs font-bold uppercase tracking-widest opacity-60 mb-1">{title}</h4>
      <div className="text-xl font-extrabold">{value}</div>
    </div>
  );
}
