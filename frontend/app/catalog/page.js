'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const API = process.env.NEXT_PUBLIC_API_URL;

const CATEGORY_ICONS = {
  'Rozetka': '🔌', 'Удлинитель': '🔗', 'Adapter': '🔄',
  'USB rozetka': '⚡', 'Smart rozetka': '📱', 'Vilka': '🔌',
  'Kabel organayzer': '📦', 'Switch': '🔀', 'Triple rozetka': '🔌'
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [added, setAdded] = useState({});
  const { addToCart } = useCart();

  const load = async () => {
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (activeCategory) params.append('category_id', activeCategory);
    const res = await axios.get(`${API}/api/products?${params}`);
    setProducts(res.data);
  };

  useEffect(() => {
    axios.get(`${API}/api/categories`).then(r => setCategories(r.data));
  }, []);

  useEffect(() => { load(); }, [search, activeCategory]);

  const handleAdd = (p) => {
    addToCart(p);
    setAdded(a => ({ ...a, [p.id]: true }));
    setTimeout(() => setAdded(a => ({ ...a, [p.id]: false })), 2000);
  };

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>

      {/* Header */}
      <div className="py-10 px-4" style={{ background: 'linear-gradient(135deg, #0f172a, #1e3a8a)' }}>
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-white mb-4">Katalog</h1>
          <div className="relative">
            <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 text-lg">🔍</span>
            <input
              type="text"
              placeholder="Mahsulot qidirish..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              className="w-full rounded-2xl pl-12 pr-4 py-4 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              style={{ background: 'rgba(255,255,255,0.1)', border: '1px solid rgba(255,255,255,0.2)', color: 'white' }}
            />
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-8">
        {/* Filter */}
        <div className="flex gap-2 flex-wrap mb-8">
          <button onClick={() => setActiveCategory('')}
            className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
            style={{
              background: !activeCategory ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'white',
              color: !activeCategory ? 'white' : '#64748b',
              border: '1px solid #e2e8f0',
              boxShadow: !activeCategory ? '0 4px 15px rgba(59,130,246,0.4)' : 'none'
            }}>
            Hammasi
          </button>
          {categories.map(c => (
            <button key={c.id} onClick={() => setActiveCategory(String(c.id))}
              className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-300"
              style={{
                background: activeCategory === String(c.id) ? 'linear-gradient(135deg, #3b82f6, #1d4ed8)' : 'white',
                color: activeCategory === String(c.id) ? 'white' : '#64748b',
                border: '1px solid #e2e8f0',
                boxShadow: activeCategory === String(c.id) ? '0 4px 15px rgba(59,130,246,0.4)' : 'none'
              }}>
              {CATEGORY_ICONS[c.name] || '⚡'} {c.name}
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-sm mb-5 font-medium">{products.length} ta mahsulot topildi</p>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {products.map((p, i) => (
            <div key={p.id} className="card-3d bg-white rounded-2xl overflow-hidden"
              style={{ border: '1px solid #e2e8f0' }}>
              <Link href={`/product/${p.slug}`}>
                <div className="relative overflow-hidden" style={{ height: '180px', background: '#f8fafc' }}>
                  {p.image
                    ? <img src={p.image} className="w-full h-full object-cover transition-transform duration-500 hover:scale-110" />
                    : <div className="w-full h-full flex items-center justify-center text-6xl">⚡</div>
                  }
                </div>
              </Link>
              <div className="p-4">
                <span className="text-xs font-medium px-2 py-1 rounded-lg"
                  style={{ background: '#eff6ff', color: '#3b82f6' }}>
                  {p.category_name}
                </span>
                <Link href={`/product/${p.slug}`}>
                  <p className="font-semibold text-gray-800 text-sm mt-2 hover:text-blue-600 transition-colors line-clamp-2">
                    {p.name}
                  </p>
                </Link>
                {p.brand && <p className="text-gray-400 text-xs mt-0.5">{p.brand}</p>}
                <p className="font-bold mt-2 text-lg" style={{ color: '#1d4ed8' }}>
                  {Number(p.price).toLocaleString()} <span className="text-sm font-normal text-gray-500">so'm</span>
                </p>
                <button onClick={() => handleAdd(p)}
                  className="w-full mt-3 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300"
                  style={{
                    background: added[p.id] ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    color: 'white',
                    boxShadow: added[p.id] ? '0 4px 15px rgba(16,185,129,0.4)' : '0 4px 15px rgba(59,130,246,0.3)'
                  }}>
                  {added[p.id] ? '✅ Qo\'shildi!' : '🛒 Savatchaga'}
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-4 text-center py-20">
              <div className="text-6xl mb-4">🔍</div>
              <p className="text-gray-500 font-medium">Mahsulot topilmadi</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return <Suspense><CatalogContent /></Suspense>;
}
