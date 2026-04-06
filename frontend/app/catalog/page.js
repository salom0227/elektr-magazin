'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';

const API = process.env.NEXT_PUBLIC_API_URL;

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
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

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Katalog</h1>

        {/* Search */}
        <div className="relative mb-5">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">🔍</span>
          <input
            type="text"
            placeholder="Mahsulot qidirish..."
            value={search}
            onChange={e => setSearch(e.target.value)}
            className="w-full bg-white border border-gray-200 rounded-xl pl-9 pr-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
        </div>

        {/* Kategoriya filter */}
        <div className="flex gap-2 flex-wrap mb-6">
          <button
            onClick={() => setActiveCategory('')}
            className={`px-4 py-2 rounded-xl text-sm font-medium transition ${!activeCategory ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>
            Hammasi
          </button>
          {categories.map(c => (
            <button key={c.id}
              onClick={() => setActiveCategory(String(c.id))}
              className={`px-4 py-2 rounded-xl text-sm font-medium transition ${activeCategory === String(c.id) ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:border-blue-300'}`}>
              {c.name}
            </button>
          ))}
        </div>

        <p className="text-gray-500 text-sm mb-4">{products.length} ta mahsulot topildi</p>

        {/* Mahsulotlar */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <Link href={`/product/${p.slug}`}>
                {p.image
                  ? <img src={p.image} className="w-full h-44 object-cover" />
                  : <div className="w-full h-44 bg-gray-100 flex items-center justify-center text-5xl">⚡</div>
                }
              </Link>
              <div className="p-3">
                <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-lg font-medium">{p.category_name}</span>
                <Link href={`/product/${p.slug}`}>
                  <p className="font-semibold text-gray-800 text-sm mt-2 hover:text-blue-600 transition line-clamp-2">{p.name}</p>
                </Link>
                {p.brand && <p className="text-gray-400 text-xs mt-0.5">{p.brand}</p>}
                <p className="text-blue-600 font-bold mt-2">{Number(p.price).toLocaleString()} so'm</p>
                <button
                  onClick={() => addToCart(p)}
                  className="w-full mt-2 bg-blue-600 text-white py-2 rounded-xl text-xs font-semibold hover:bg-blue-700 transition">
                  🛒 Savatchaga
                </button>
              </div>
            </div>
          ))}
          {products.length === 0 && (
            <div className="col-span-4 text-center py-20 text-gray-400">
              <div className="text-5xl mb-3">🔍</div>
              <p>Mahsulot topilmadi</p>
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
