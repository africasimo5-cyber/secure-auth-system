'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function WelcomePage() {
  const router = useRouter();

  useEffect(() => {
    // Automatically redirect to the dashboard after a short delay
    const timer = setTimeout(() => {
      window.location.assign('/dashboard');
    }, 4000);

    return () => clearTimeout(timer);
  }, [router]);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#020617] text-white p-6">
      <div className="text-center space-y-4 animate-in fade-in zoom-in duration-700">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          You are welcome!
        </h1>
        <p className="text-slate-400 font-medium text-lg">
          Secure access granted. Preparing your dashboard...
        </p>
        
        <div className="pt-8">
          <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        </div>
      </div>
    </div>
  );
}
