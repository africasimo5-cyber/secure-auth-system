'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';

export default function LandingNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    
    // Check for token in localStorage
    setIsLoggedIn(!!localStorage.getItem('token'));
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'py-4 bg-[#020617]/80 backdrop-blur-md border-b border-white/5' : 'py-6 bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-[0_0_20px_rgba(37,99,235,0.3)] group-hover:scale-110 transition-transform">
            <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <span className="text-xl font-bold tracking-tight text-white">EmmaAuth</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-medium text-slate-400">
          <Link href="#features" className="hover:text-white transition-colors">Features</Link>
          <Link href="#security" className="hover:text-white transition-colors">Security</Link>
          <Link href="#about" className="hover:text-white transition-colors">About</Link>
        </div>

        <div className="flex items-center gap-4">
          {isLoggedIn ? (
            <Link 
              href="/dashboard"
              className="px-6 py-2.5 rounded-full bg-blue-600 hover:bg-blue-500 text-white text-sm font-bold transition-all shadow-lg shadow-blue-600/20 active:scale-95"
            >
              Dashboard
            </Link>
          ) : (
            <>
              <Link 
                href="/login"
                className="hidden sm:block text-sm font-bold text-white hover:text-blue-400 transition-colors"
              >
                Sign In
              </Link>
              <Link 
                href="/signup"
                className="px-6 py-2.5 rounded-full bg-white text-[#020617] text-sm font-bold transition-all hover:bg-slate-100 hover:shadow-xl hover:shadow-white/10 active:scale-95"
              >
                Get Started
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
