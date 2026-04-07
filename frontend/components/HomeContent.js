'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const API = process.env.NEXT_PUBLIC_API_URL;

const CATEGORY_ICONS = {
  'Rozetka': '🔌', 'Удлинитель': '🔗', 'Adapter': '🔄',
  'USB rozetka': '⚡', 'Smart rozetka': '📱', 'Vilka': '🔌',
  'Kabel organayzer': '📦', 'Switch': '🔀', 'Triple rozetka': '🔌'
};

export default function HomeContent() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [added, setAdded] = useState({});
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`${API}/api/categories`).then(r => setCategories(r.data));
    axios.get(`${API}/api/products`).then(r => setProducts(r.data.slice(0, 8)));
  }, []);

  const handleAdd = (p) => {
    addToCart(p);
    setAdded(a => ({ ...a, [p.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [p.id]: false })), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>

      {/* Hero */}
      <div className="relative overflow-hidden py-20 px-4"
        style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 50%, #0f172a 100%)' }}>
        <div className="absolute inset-0 opacity-10"
          style={{ backgroundImage: 'radial-gradient(circle at 20% 50%, #3b82f6 0%, transparent 50%), radial-gradient(circle at 80% 20%, #06b6d4 0%, transparent 50%)' }} />
        <div className="absolute top-10 right-10 text-8xl animate-float opacity-20">⚡</div>
        <div className="absolute bottom-10 left-10 text-6xl animate-float opacity-10" style={{ animationDelay: '1s' }}>🔌</div>

        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium mb-6"
            style={{ background: 'rgba(59,130,246,0.2)', border: '1px solid rgba(59,130,246,0.4)', color: '#93c5fd' }}>
            ⚡ Sifatli elektr aksessuarlar
          </div>
          <h1 className="text-5xl md:text-6xl font-bold text-white mb-6 leading-tight">
            Elektr <span style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>aksessuarlar</span>
            <br />do'koni
          </h1>
          <p className="text-blue-200 text-xl mb-10">Rozetka, adapter, kabel va boshqa sifatli mahsulotlar</p>
          <Link href="/catalog"
            className="btn-glow px-8 py-4 rounded-2xl font-bold text-gray-900 text-lg transition-all inline-block"
            style={{ background: 'linear-gradient(135deg, #facc15, #f59e0b)' }}>
            Katalogni ko'rish →
          </Link>

          <div className="grid grid-cols-3 gap-6 mt-16 max-w-lg mx-auto">
            {[{ n: '500+', l: 'Mahsulot' }, { n: '1000+', l: 'Mijozlar' }, { n: '24/7', l: 'Xizmat' }].map(s => (
              <div key={s.l} className="text-center">
                <p className="text-3xl font-bold text-white">{s.n}</p>
                <p className="text-blue-300 text-sm">{s.l}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Kategoriyalar</h2>
          <Link href="/catalog" className="text-blue-600 text-sm font-medium hover:underline">Barchasini ko'rish →</Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-14">
          {categories.map(c => (
            <Link key={c.id} href={`/catalog?category=${c.id}`}
              className="category-card bg-white rounded-2xl p-4 text-center"
              style={{ border: '1px solid #e2e8f0' }}>
              <div className="text-3xl mb-2">{CATEGORY_ICONS[c.name] || '⚡'}</div>
              <p className="text-xs font-semibold text-gray-700">{c.name}</p>
            </Link>
          ))}
        </div>

        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Yangi mahsulotlar</h2>
          <Link href="/catalog" className="text-blue-600 text-sm font-medium hover:underline">Barchasini ko'rish →</Link>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-5">
          {products.map(p => (
            <div key={p.id} className="card-3d bg-white rounded-2xl overflow-hidden"
              style={{ border: '1px solid #e2e8f0' }}>
              <Link href={`/product/${p.slug}`}>
                <div className="relative overflow-hidden" style={{ height: '180px', background: '#f8fafc' }}>
                  {p.image
                    ? <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    : <div className="w-full h-full flex items-center justify-center text-6xl">⚡</div>
                  }
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-lg text-xs font-semibold text-white"
                    style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>Yangi</div>
                </div>
              </Link>
              <div className="p-4">
                <span className="text-xs font-medium px-2 py-1 rounded-lg"
                  style={{ background: '#eff6ff', color: '#3b82f6' }}>{p.category_name}</span>
                <Link href={`/product/${p.slug}`}>
                  <p className="font-semibold text-gray-800 text-sm mt-2 hover:text-blue-600 transition-colors line-clamp-2">{p.name}</p>
                </Link>
                <p className="font-bold mt-2 text-lg" style={{ color: '#1d4ed8' }}>
                  {Number(p.price).toLocaleString()} <span className="text-sm font-normal text-gray-500">so'm</span>
                </p>
                <button onClick={() => handleAdd(p)}
                  className="w-full mt-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
                  style={{
                    background: added[p.id] ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white'
                  }}>
                  {added[p.id] ? '✅ Qo\'shildi!' : '🛒 Savatchaga'}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <footer className="mt-16 py-10 px-4" style={{ background: '#0f172a' }}>
        <div className="max-w-6xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <span className="text-2xl">⚡</span>
            <span className="text-white font-bold text-xl">Elektr Magazin</span>
          </div>
          <p className="text-blue-300 text-sm">Sifatli elektr aksessuarlar do'koni</p>
        </div>
      </footer>
    </div>
  );
}
