'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { count } = useCart();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <nav className={`sticky top-0 z-50 transition-all duration-300 ${scrolled ? 'shadow-2xl' : ''}`}
      style={{ background: scrolled ? 'rgba(15,23,42,0.98)' : '#0f172a', backdropFilter: 'blur(10px)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2 group">
          <div className="w-9 h-9 rounded-xl flex items-center justify-center animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
            <span className="text-lg">⚡</span>
          </div>
          <div>
            <span className="text-white font-bold text-lg leading-none">Elektr</span>
            <span className="text-blue-400 font-bold text-lg leading-none"> Magazin</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-6">
          <Link href="/" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Bosh sahifa</Link>
          <Link href="/catalog" className="text-white/70 hover:text-white text-sm font-medium transition-colors">Katalog</Link>
        </div>

        <div className="flex items-center gap-3">
          <Link href="/cart" className="relative group">
            <div className="flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-300 btn-glow"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              <span className="text-white">🛒</span>
              <span className="text-white hidden sm:inline">Savatcha</span>
              {count > 0 && (
                <span className="animate-fadeIn absolute -top-2 -right-2 w-5 h-5 rounded-full text-xs font-bold flex items-center justify-center text-gray-900"
                  style={{ background: '#facc15' }}>
                  {count}
                </span>
              )}
            </div>
          </Link>
        </div>
      </div>
    </nav>
  );
}
