'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`${API}/api/products/${slug}`).then(r => setProduct(r.data));
  }, [slug]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  if (!product) return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      <div className="flex items-center justify-center py-40">
        <div className="text-center">
          <div className="text-6xl animate-float mb-4">⚡</div>
          <p className="text-gray-500 font-medium">Yuklanmoqda...</p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      <div className="max-w-5xl mx-auto px-4 py-10">
        <Link href="/catalog" className="inline-flex items-center gap-2 text-blue-600 text-sm font-medium mb-6 hover:underline">
          ← Katalogga qaytish
        </Link>

        <div className="bg-white rounded-3xl overflow-hidden" style={{ border: '1px solid #e2e8f0', boxShadow: '0 20px 60px rgba(0,0,0,0.08)' }}>
          <div className="md:flex">
            {/* Rasm */}
            <div className="md:w-1/2 relative overflow-hidden" style={{ background: 'linear-gradient(135deg, #f0f4f8, #e2e8f0)', minHeight: '400px' }}>
              {product.image
                ? <img src={product.image} className="w-full h-full object-cover transition-transform duration-700 hover:scale-105" style={{ minHeight: '400px' }} />
                : <div className="w-full flex items-center justify-center text-9xl animate-float" style={{ minHeight: '400px' }}>⚡</div>
              }
              <div className="absolute top-4 left-4 px-3 py-1.5 rounded-xl text-xs font-semibold text-white"
                style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
                {product.category_name}
              </div>
            </div>

            {/* Info */}
            <div className="md:w-1/2 p-8">
              <h1 className="text-2xl font-bold text-gray-800 leading-snug mb-2">{product.name}</h1>
              {product.brand && (
                <p className="text-gray-400 text-sm mb-4">{product.brand} — {product.model}</p>
              )}

              <div className="py-4 border-y border-gray-100 mb-6">
                <p className="text-4xl font-bold" style={{ color: '#1d4ed8' }}>
                  {Number(product.price).toLocaleString()}
                  <span className="text-lg font-normal text-gray-500 ml-1">so'm</span>
                </p>
              </div>

              {/* Xususiyatlar */}
              <div className="space-y-3 mb-6">
                {product.voltage && (
                  <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: '#f8fafc' }}>
                    <span className="text-gray-500 text-sm">⚡ Kuchlanish</span>
                    <span className="font-semibold text-gray-800 text-sm">{product.voltage}</span>
                  </div>
                )}
                <div className="flex items-center justify-between py-2 px-3 rounded-xl" style={{ background: '#f8fafc' }}>
                  <span className="text-gray-500 text-sm">📦 Omborda</span>
                  <span className={`font-semibold text-sm ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} ta mavjud` : 'Tugagan'}
                  </span>
                </div>
              </div>

              {product.description && (
                <p className="text-gray-600 text-sm leading-relaxed mb-6">{product.description}</p>
              )}

              {/* Miqdor va qo'shish */}
              <div className="flex items-center gap-4">
                <div className="flex items-center rounded-2xl overflow-hidden" style={{ border: '2px solid #e2e8f0' }}>
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-4 py-3 font-bold text-gray-600 hover:bg-gray-50 transition-colors text-lg">−</button>
                  <span className="px-5 py-3 font-bold text-gray-800 text-lg min-w-[3rem] text-center">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="px-4 py-3 font-bold text-gray-600 hover:bg-gray-50 transition-colors text-lg">+</button>
                </div>
                <button onClick={handleAdd}
                  className="flex-1 py-3.5 rounded-2xl font-bold text-white transition-all duration-300 btn-glow"
                  style={{
                    background: added ? 'linear-gradient(135deg, #10b981, #059669)' : 'linear-gradient(135deg, #3b82f6, #1d4ed8)',
                    boxShadow: added ? '0 8px 25px rgba(16,185,129,0.4)' : '0 8px 25px rgba(59,130,246,0.4)'
                  }}>
                  {added ? '✅ Savatchangizga qo\'shildi!' : '🛒 Savatchaga qo\'shish'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
