'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';

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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex items-center justify-center py-40 text-gray-400">Yuklanmoqda...</div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
          <div className="md:flex">
            <div className="md:w-1/2">
              {product.image
                ? <img src={product.image} className="w-full h-80 object-cover" />
                : <div className="w-full h-80 bg-gray-100 flex items-center justify-center text-8xl">⚡</div>
              }
            </div>
            <div className="md:w-1/2 p-6">
              <span className="text-xs bg-blue-50 text-blue-600 px-3 py-1 rounded-lg font-medium">{product.category_name}</span>
              <h1 className="text-2xl font-bold text-gray-800 mt-3">{product.name}</h1>
              {product.brand && <p className="text-gray-400 text-sm mt-1">{product.brand} — {product.model}</p>}

              <p className="text-3xl font-bold text-blue-600 mt-4">{Number(product.price).toLocaleString()} so'm</p>

              <div className="mt-4 space-y-2">
                {product.voltage && (
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Kuchlanish</span>
                    <span className="font-medium text-gray-800">{product.voltage}</span>
                  </div>
                )}
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Omborda</span>
                  <span className={`font-medium ${product.stock > 0 ? 'text-green-600' : 'text-red-500'}`}>
                    {product.stock > 0 ? `${product.stock} ta bor` : 'Tugagan'}
                  </span>
                </div>
              </div>

              {product.description && (
                <p className="text-gray-600 text-sm mt-4 leading-relaxed">{product.description}</p>
              )}

              <div className="flex items-center gap-3 mt-6">
                <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                  <button onClick={() => setQty(q => Math.max(1, q - 1))}
                    className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-bold">−</button>
                  <span className="px-4 py-2 font-semibold text-gray-800">{qty}</span>
                  <button onClick={() => setQty(q => q + 1)}
                    className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-bold">+</button>
                </div>
                <button onClick={handleAdd}
                  className={`flex-1 py-2.5 rounded-xl font-semibold text-sm transition ${added ? 'bg-green-500 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  {added ? '✅ Qo\'shildi!' : '🛒 Savatchaga'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
