'use client';
import { useState } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function SettingsPage() {
  const [current, setCurrent] = useState('');
  const [newPass, setNewPass] = useState('');
  const [confirm, setConfirm] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  const headers = { Authorization: `Bearer ${token}` };

  const handleSubmit = async () => {
    setError(''); setSuccess('');
    if (newPass.length < 6) return setError('Yangi parol kamida 6 ta belgidan iborat bo\'lsin');
    if (newPass !== confirm) return setError('Parollar mos kelmayapti');
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/change-password`,
        { current_password: current, new_password: newPass },
        { headers }
      );
      setSuccess('Parol muvaffaqiyatli o\'zgartirildi!');
      setCurrent(''); setNewPass(''); setConfirm('');
    } catch (err) {
      setError(err.response?.data?.error || 'Xatolik yuz berdi');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Sozlamalar</h1>
        <p className="text-gray-500 text-sm mt-1">Admin panel sozlamalari</p>
      </div>

      <div className="max-w-md">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-5">🔐 Parolni o'zgartirish</h2>

          {success && (
            <div className="mb-4 px-4 py-3 bg-green-50 text-green-700 rounded-xl text-sm font-medium">
              ✅ {success}
            </div>
          )}
          {error && (
            <div className="mb-4 px-4 py-3 bg-red-50 text-red-600 rounded-xl text-sm font-medium">
              ❌ {error}
            </div>
          )}

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joriy parol</label>
              <input type="password" value={current} onChange={e => setCurrent(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yangi parol</label>
              <input type="password" value={newPass} onChange={e => setNewPass(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Yangi parolni tasdiqlang</label>
              <input type="password" value={confirm} onChange={e => setConfirm(e.target.value)}
                placeholder="••••••••"
                className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
            </div>
            <button onClick={handleSubmit} disabled={loading || !current || !newPass || !confirm}
              className="w-full py-2.5 rounded-xl font-semibold text-sm text-white transition disabled:opacity-50"
              style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
              {loading ? 'Saqlanmoqda...' : 'Saqlash'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
