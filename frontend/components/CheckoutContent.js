'use client';
import { useState } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import Navbar from '@/components/Navbar';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutContent() {
  const { cart, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/api/orders`, {
        ...form,
        items: cart.map(i => ({ product_id: i.id, qty: i.qty }))
      });
      clearCart();
      setDone(true);
      setTimeout(() => router.push('/'), 3000);
    } catch {
      alert('Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  if (done) return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <div className="text-8xl mb-6 animate-float">✅</div>
        <h2 className="text-3xl font-bold text-gray-800 mb-3">Buyurtma qabul qilindi!</h2>
        <p className="text-gray-500 text-lg mb-2">Tez orada siz bilan bog'lanamiz</p>
        <p className="text-gray-400 text-sm">Bosh sahifaga yo'naltirilmoqda...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Buyurtma berish</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl p-6 mb-4" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h2 className="font-bold text-gray-700 mb-5 text-lg">📋 Ma'lumotlaringiz</h2>
              {[
                { key: 'name', label: 'Ismingiz', placeholder: 'Ali Valiyev', type: 'text', icon: '👤' },
                { key: 'phone', label: 'Telefon', placeholder: '+998901234567', type: 'tel', icon: '📞' },
                { key: 'address', label: 'Manzil', placeholder: 'Shahar, ko\'cha...', type: 'text', icon: '📍' },
              ].map(f => (
                <div key={f.key} className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.icon} {f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                    style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    required
                  />
                </div>
              ))}
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg btn-glow transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 8px 25px rgba(59,130,246,0.4)' }}>
              {loading ? '⏳ Yuborilmoqda...' : '✅ Buyurtma berish'}
            </button>
          </form>

          <div className="bg-white rounded-2xl p-6 h-fit" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-gray-700 mb-4 text-lg">🛒 Buyurtma</h2>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm py-2 border-b border-gray-50">
                  <span className="text-gray-600 truncate flex-1 pr-2">{item.name} <span className="text-gray-400">×{item.qty}</span></span>
                  <span className="font-semibold text-gray-800">{(Number(item.price) * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="flex justify-between items-center mt-4 pt-4" style={{ borderTop: '2px solid #e2e8f0' }}>
              <span className="font-bold text-gray-700">Jami</span>
              <span className="text-2xl font-bold" style={{ color: '#1d4ed8' }}>{total.toLocaleString()} so'm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
