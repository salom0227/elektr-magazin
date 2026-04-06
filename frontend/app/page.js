'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Link from 'next/link';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function HomePage() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`${API}/api/categories`).then(r => setCategories(r.data));
    axios.get(`${API}/api/products`).then(r => setProducts(r.data.slice(0, 8)));
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero */}
      <div style={{background:'linear-gradient(135deg, #0f172a 0%, #1e40af 100%)'}} className="py-16 px-4">
        <div className="max-w-6xl mx-auto text-center">
          <h1 className="text-4xl font-bold text-white mb-4">
            ⚡ Elektr aksessuarlar
          </h1>
          <p className="text-blue-200 text-lg mb-8">
            Rozetka, adapter, kabel va boshqa mahsulotlar
          </p>
          <Link href="/catalog"
            className="bg-yellow-400 text-gray-900 px-8 py-3 rounded-xl font-bold hover:bg-yellow-300 transition inline-block">
            Katalogni ko'rish →
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-10">
        {/* Kategoriyalar */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Kategoriyalar</h2>
        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 mb-12">
          {categories.map(c => (
            <Link key={c.id} href={`/catalog?category=${c.id}`}
              className="bg-white rounded-2xl p-4 text-center shadow-sm border border-gray-100 hover:border-blue-300 hover:shadow-md transition">
              <div className="text-2xl mb-2">⚡</div>
              <p className="text-sm font-medium text-gray-700">{c.name}</p>
            </Link>
          ))}
        </div>

        {/* Yangi mahsulotlar */}
        <h2 className="text-xl font-bold text-gray-800 mb-4">Yangi mahsulotlar</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map(p => (
            <div key={p.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition">
              <Link href={`/product/${p.slug}`}>
                {p.image
                  ? <img src={p.image} className="w-full h-40 object-cover" />
                  : <div className="w-full h-40 bg-gray-100 flex items-center justify-center text-4xl">⚡</div>
                }
              </Link>
              <div className="p-3">
                <Link href={`/product/${p.slug}`}>
                  <p className="font-semibold text-gray-800 text-sm hover:text-blue-600 transition line-clamp-2">{p.name}</p>
                </Link>
                <p className="text-blue-600 font-bold mt-1">{Number(p.price).toLocaleString()} so'm</p>
                <button
                  onClick={() => addToCart(p)}
                  className="w-full mt-2 bg-blue-600 text-white py-1.5 rounded-xl text-xs font-semibold hover:bg-blue-700 transition">
                  Savatchaga
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
