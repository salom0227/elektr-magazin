'use client';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

export default function Navbar() {
  const { count } = useCart();

  return (
    <nav style={{background:'#0f172a'}} className="sticky top-0 z-50 shadow-lg">
      <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <span className="text-2xl">⚡</span>
          <span className="text-white font-bold text-lg">Elektr Magazin</span>
        </Link>

        <Link href="/catalog"
          className="text-white/70 hover:text-white text-sm font-medium transition">
          Katalog
        </Link>

        <Link href="/cart" className="relative">
          <div className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-xl transition text-sm font-medium">
            🛒 Savatcha
            {count > 0 && (
              <span className="bg-yellow-400 text-gray-900 text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {count}
              </span>
            )}
          </div>
        </Link>
      </div>
    </nav>
  );
}
