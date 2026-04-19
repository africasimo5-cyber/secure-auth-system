'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

export default function Navbar() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const pathname = usePathname();

  useEffect(() => {
    // We check localStorage for immediate UI feedback.
    // The actual security is handled by the middleware checking the cookie.
    const token = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, [pathname]);



  return (
    <nav className="fixed top-0 w-full z-50 border-b border-white/5 bg-[#020617]/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href={isLoggedIn ? "/dashboard" : "/login"} className="text-xl font-black tracking-tighter text-white hover:opacity-80 transition-opacity">
              EMMA<span className="text-blue-500">AUTH</span>
            </Link>
          </div>
          <div className="flex items-center gap-6">
            {isLoggedIn ? (
              <>
                <Link href="/dashboard" className={`text-sm font-bold transition-colors ${pathname === '/dashboard' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  CONSOLE
                </Link>

              </>
            ) : (
              <>
                <Link href="/login" className={`text-sm font-bold transition-colors ${pathname === '/login' ? 'text-white' : 'text-slate-400 hover:text-white'}`}>
                  SIGN IN
                </Link>
                <Link
                  href="/signup"
                  className="px-5 py-2 rounded-xl bg-white text-[#020617] hover:bg-slate-200 text-xs font-black tracking-widest transition-all shadow-xl shadow-white/5"
                >
                  ENROLL
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}
