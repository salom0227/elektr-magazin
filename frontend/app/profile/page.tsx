'use client';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { user, token, logout } = useAuth();
  const router = useRouter();
  const [orders, setOrders] = useState<any[]>([]);
  const [form, setForm] = useState({ name: '', address: '' });
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) { router.push('/login'); return; }
    fetch(`${API}/api/user/profile`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setForm({ name: d.name || '', address: d.address || '' }); });
    fetch(`${API}/api/user/my-orders`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { setOrders(Array.isArray(d) ? d : []); setLoading(false); });
  }, [token]);

  const handleSave = async () => {
    await fetch(`${API}/api/user/profile`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify(form)
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const statusColor: Record<string, string> = {
    yangi: '#3b82f6', tayyorlanmoqda: '#f59e0b',
    yetkazilmoqda: '#8b5cf6', yetkazildi: '#10b981', bekor: '#ef4444'
  };

  return (
    <div className="min-h-screen" style={{ background: '#f0f4ff' }}>
      <nav className="sticky top-0 z-50" style={{ background: '#0f172a' }}>
        <div className="max-w-4xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <span className="text-xl">⚡</span>
            <span className="text-white font-bold">Elektr Magazin</span>
          </Link>
          <button onClick={() => { logout(); router.push('/'); }}
            className="px-4 py-2 rounded-xl text-sm font-medium text-white transition-all"
            style={{ background: '#ef4444' }}>
            Chiqish
          </button>
        </div>
      </nav>

      <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
        {/* Profil */}
        <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
          <div className="flex items-center gap-4 mb-6">
            <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-2xl"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>👤</div>
            <div>
              <h2 className="font-bold text-gray-800 text-lg">{user?.name || 'Foydalanuvchi'}</h2>
              <p className="text-gray-500 text-sm">{user?.email}</p>
            </div>
          </div>
          <div className="space-y-3">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">👤 Ism</label>
              <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ismingiz"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">📍 Manzil</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="Yetkazib berish manzili"
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none"
                style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }} />
            </div>
            <button onClick={handleSave}
              className="w-full py-3 rounded-2xl font-bold text-white text-sm transition-all"
              style={{ background: saved ? 'linear-gradient(135deg,#10b981,#059669)' : 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
              {saved ? '✅ Saqlandi!' : '💾 Saqlash'}
            </button>
          </div>
        </div>

        {/* Buyurtmalar */}
        <div className="bg-white rounded-3xl p-6 shadow-sm" style={{ border: '1px solid #e2e8f0' }}>
          <h3 className="font-bold text-gray-800 text-lg mb-4">📦 Mening buyurtmalarim</h3>
          {loading ? (
            <p className="text-center text-gray-400 py-8">Yuklanmoqda...</p>
          ) : orders.length === 0 ? (
            <div className="text-center py-10">
              <div className="text-5xl mb-3">📭</div>
              <p className="text-gray-400">Hali buyurtma yo'q</p>
              <Link href="/catalog" className="inline-block mt-4 px-6 py-2.5 rounded-xl font-semibold text-white text-sm"
                style={{ background: 'linear-gradient(135deg,#3b82f6,#1d4ed8)' }}>
                Xarid qilish →
              </Link>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map(o => (
                <div key={o.id} className="p-4 rounded-2xl flex items-center justify-between"
                  style={{ background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                  <div>
                    <p className="font-semibold text-gray-800 text-sm">#{o.id.slice(0, 8)}</p>
                    <p className="text-gray-400 text-xs mt-0.5">{new Date(o.created_at).toLocaleDateString('uz-UZ')}</p>
                  </div>
                  <span className="px-3 py-1 rounded-xl text-xs font-bold text-white"
                    style={{ background: statusColor[o.status] || '#6b7280' }}>
                    {o.status}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
