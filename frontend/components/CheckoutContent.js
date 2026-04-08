'use client';
import { useState } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutContent() {
  const { cart, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [location, setLocation] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [locationError, setLocationError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const getLocation = () => {
    setLocationLoading(true);
    setLocationError('');
    if (!navigator.geolocation) {
      setLocationError('Brauzer lokatsiyani qo\'llab-quvvatlamaydi');
      setLocationLoading(false);
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setLocationError('Lokatsiyaga ruxsat berilmadi');
        setLocationLoading(false);
      }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post(`${API}/api/orders`, {
        ...form,
        latitude: location?.lat || null,
        longitude: location?.lng || null,
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
    <div className="min-h-screen flex flex-col items-center justify-center text-center" style={{ background: '#f0f4f8' }}>
      <div className="text-8xl mb-6">✅</div>
      <h2 className="text-3xl font-bold text-gray-800 mb-3">Buyurtma qabul qilindi!</h2>
      <p className="text-gray-500 text-lg mb-2">Tez orada siz bilan bog'lanamiz</p>
      <p className="text-gray-400 text-sm">Bosh sahifaga yo'naltirilmoqda...</p>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      <div className="max-w-2xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Buyurtma berish</h1>
        <div className="grid md:grid-cols-2 gap-6">
          <form onSubmit={handleSubmit}>
            <div className="bg-white rounded-2xl p-6 mb-4" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
              <h2 className="font-bold text-gray-700 mb-5 text-lg">📋 Ma'lumotlaringiz</h2>

              {[
                { key: 'name', label: 'Ismingiz', placeholder: 'Ali Valiyev', type: 'text', icon: '👤' },
                { key: 'phone', label: 'Telefon', placeholder: '+998901234567', type: 'tel', icon: '📞' },
                { key: 'address', label: 'Manzil', placeholder: 'Shahar, ko\'cha, uy...', type: 'text', icon: '📍' },
              ].map(f => (
                <div key={f.key} className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-1.5">{f.icon} {f.label}</label>
                  <input
                    type={f.type}
                    value={form[f.key]}
                    onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                    placeholder={f.placeholder}
                    className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                    style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }}
                    required
                  />
                </div>
              ))}

              {/* LOKATSIYA */}
              <div className="mb-2">
                <label className="block text-sm font-semibold text-gray-700 mb-1.5">🗺️ Lokatsiya (ixtiyoriy)</label>
                {location ? (
                  <div className="flex items-center gap-3 p-3 rounded-xl" style={{ background: '#f0fdf4', border: '1.5px solid #86efac' }}>
                    <span className="text-green-600 text-xl">✅</span>
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-green-700">Lokatsiya aniqlandi</p>
                      <p className="text-xs text-green-600">{location.lat.toFixed(5)}, {location.lng.toFixed(5)}</p>
                    </div>
                    <button type="button" onClick={() => setLocation(null)}
                      className="text-xs text-red-400 hover:text-red-600">✕</button>
                  </div>
                ) : (
                  <button type="button" onClick={getLocation} disabled={locationLoading}
                    className="w-full py-3 rounded-xl text-sm font-semibold transition-all"
                    style={{ border: '1.5px dashed #93c5fd', background: '#eff6ff', color: '#2563eb' }}>
                    {locationLoading ? '⏳ Aniqlanmoqda...' : '📍 Joylashuvimni yuborish'}
                  </button>
                )}
                {locationError && <p className="text-xs text-red-500 mt-1">{locationError}</p>}
              </div>
            </div>

            <button type="submit" disabled={loading || cart.length === 0}
              className="w-full py-4 rounded-2xl font-bold text-white text-lg transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 8px 25px rgba(59,130,246,0.4)' }}>
              {loading ? '⏳ Yuborilmoqda...' : '✅ Buyurtma berish'}
            </button>
          </form>

          <div className="bg-white rounded-2xl p-6 h-fit" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
            <h2 className="font-bold text-gray-700 mb-4 text-lg">🛒 Buyurtma</h2>
            {cart.length === 0 ? (
              <p className="text-gray-400 text-sm text-center py-8">Savatcha bo'sh</p>
            ) : (
              <>
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
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
