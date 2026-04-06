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
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <div className="text-6xl mb-4">✅</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Buyurtma qabul qilindi!</h2>
        <p className="text-gray-500">Tez orada siz bilan bog'lanamiz</p>
        <p className="text-gray-400 text-sm mt-2">Bosh sahifaga yo'naltirilmoqda...</p>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Buyurtma berish</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <h2 className="font-semibold text-gray-700 mb-4">Ma'lumotlaringiz</h2>
              {[
                { key: 'name', label: 'Ismingiz', placeholder: 'Ali Valiyev', type: 'text' },
                { key: 'phone', label: 'Telefon', placeholder: '+998901234567', type: 'tel' },
                { key: 'address', label: 'Manzil', placeholder: 'Toshkent, Chilonzor...', type: 'text' },
              ].map(f => (
                <div key={f.key} className="mb-3">
                  <label className="block text-sm font-medium text-gray-700 mb-1">{f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              ))}
            </div>
            <button type="submit" disabled={loading}
              className="w-full bg-blue-600 text-white py-3 rounded-xl font-semibold hover:bg-blue-700 transition disabled:opacity-50">
              {loading ? 'Yuborilmoqda...' : '✅ Buyurtma berish'}
            </button>
          </form>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 h-fit">
            <h2 className="font-semibold text-gray-700 mb-4">Buyurtma</h2>
            <div className="space-y-3">
              {cart.map(item => (
                <div key={item.id} className="flex justify-between text-sm">
                  <span className="text-gray-600 truncate flex-1">{item.name} <span className="text-gray-400">x{item.qty}</span></span>
                  <span className="font-semibold text-gray-800 ml-2">{(Number(item.price) * item.qty).toLocaleString()}</span>
                </div>
              ))}
            </div>
            <div className="border-t border-gray-100 mt-4 pt-4 flex justify-between">
              <span className="font-semibold text-gray-700">Jami</span>
              <span className="text-xl font-bold text-blue-600">{total.toLocaleString()} so'm</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
