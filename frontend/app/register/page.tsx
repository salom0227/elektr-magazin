'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/components/AuthContext';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function RegisterPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${API}/api/user/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Xatolik'); return; }
      login(data.token, data.user);
      router.push('/profile');
    } catch {
      setError('Server bilan bog\'lanishda xatolik');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse-glow"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #06b6d4)' }}>
            <span className="text-3xl">⚡</span>
          </div>
          <h1 className="text-white font-bold text-2xl">Ro'yxatdan o'tish</h1>
          <p className="text-blue-300 text-sm mt-1">Elektr Magazin</p>
        </div>

        <div className="bg-white rounded-3xl p-8 shadow-2xl">
          {error && (
            <div className="mb-4 p-3 rounded-xl text-sm font-medium text-red-700" style={{ background: '#fef2f2', border: '1px solid #fecaca' }}>
              ❌ {error}
            </div>
          )}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">👤 Ism</label>
              <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="Ismingiz" required
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">📧 Email</label>
              <input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })}
                placeholder="email@example.com" required
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }} />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1.5">🔒 Parol</label>
              <input type="password" value={form.password} onChange={e => setForm({ ...form, password: e.target.value })}
                placeholder="Kamida 6 ta belgi" minLength={6} required
                className="w-full rounded-xl px-4 py-3 text-sm focus:outline-none transition-all"
                style={{ border: '1.5px solid #e2e8f0', background: '#f8fafc' }} />
            </div>
            <button type="submit" disabled={loading}
              className="w-full py-3.5 rounded-2xl font-bold text-white text-sm btn-glow transition-all disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 8px 25px rgba(59,130,246,0.4)' }}>
              {loading ? '⏳ Yuklanmoqda...' : '✅ Ro\'yxatdan o\'tish'}
            </button>
          </form>
          <p className="text-center text-sm text-gray-500 mt-6">
            Hisobingiz bormi?{' '}
            <Link href="/login" className="text-blue-600 font-semibold hover:underline">Kirish</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
