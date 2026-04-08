'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

const STATUS = {
  new: { label: 'Yangi', class: 'bg-yellow-100 text-yellow-700' },
  "ko'rildi": { label: "Ko'rildi", class: 'bg-blue-100 text-blue-700' },
  yetkazildi: { label: 'Yetkazildi', class: 'bg-green-100 text-green-700' },
  bekor: { label: 'Bekor qilindi', class: 'bg-red-100 text-red-700' },
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [cancelModal, setCancelModal] = useState(null);
  const [cancelReason, setCancelReason] = useState('');
  const [filter, setFilter] = useState('all');

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    const res = await axios.get(`${API}/api/orders`, { headers });
    setOrders(res.data);
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status, reason = null) => {
    await axios.put(`${API}/api/orders/${id}/status`, { status, cancel_reason: reason }, { headers });
    load();
    setCancelModal(null);
    setCancelReason('');
  };

  const filtered = filter === 'all' ? orders : orders.filter(o => o.status === filter);

  const counts = {
    all: orders.length,
    new: orders.filter(o => o.status === 'new').length,
    "ko'rildi": orders.filter(o => o.status === "ko'rildi").length,
    yetkazildi: orders.filter(o => o.status === 'yetkazildi').length,
    bekor: orders.filter(o => o.status === 'bekor').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Buyurtmalar</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} ta buyurtma</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        {[
          { key: 'new', label: '🆕 Yangi', color: 'text-yellow-600' },
          { key: "ko'rildi", label: "👁 Ko'rildi", color: 'text-blue-600' },
          { key: 'yetkazildi', label: '✅ Yetkazildi', color: 'text-green-600' },
          { key: 'bekor', label: '❌ Bekor', color: 'text-red-600' },
        ].map(s => (
          <div key={s.key} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
            <p className={`${s.color} text-sm font-medium`}>{s.label}</p>
            <p className="text-3xl font-bold text-gray-800 mt-1">{counts[s.key]}</p>
          </div>
        ))}
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {[
          { key: 'all', label: 'Barchasi' },
          { key: 'new', label: 'Yangi' },
          { key: "ko'rildi", label: "Ko'rildi" },
          { key: 'yetkazildi', label: 'Yetkazildi' },
          { key: 'bekor', label: 'Bekor' },
        ].map(f => (
          <button key={f.key} onClick={() => setFilter(f.key)}
            className={`px-4 py-1.5 rounded-xl text-sm font-medium transition ${filter === f.key ? 'bg-blue-600 text-white' : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'}`}>
            {f.label} ({counts[f.key] ?? orders.length})
          </button>
        ))}
      </div>

      {/* Orders list */}
      <div className="space-y-3">
        {filtered.map(o => (
          <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <p className="font-bold text-gray-800 text-lg">{o.name}</p>
                <p className="text-blue-600 text-sm font-medium mt-0.5">{o.phone}</p>
                {o.address && <p className="text-gray-500 text-sm mt-1">📍 {o.address}</p>}
                <p className="text-gray-400 text-xs mt-2">🕐 {new Date(o.created_at).toLocaleString('uz-UZ')}</p>
                {o.cancel_reason && (
                  <div className="mt-2 px-3 py-2 bg-red-50 rounded-xl text-sm text-red-600">
                    ❌ Sabab: {o.cancel_reason}
                  </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <select
                  value={o.status}
                  onChange={e => {
                    if (e.target.value === 'bekor') {
                      setCancelModal(o.id);
                    } else {
                      changeStatus(o.id, e.target.value);
                    }
                  }}
                  className={`text-sm font-semibold px-4 py-2 rounded-xl border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS[o.status]?.class || 'bg-gray-100 text-gray-600'}`}>
                  <option value="new">🆕 Yangi</option>
                  <option value="ko'rildi">👁 Ko'rildi</option>
                  <option value="yetkazildi">✅ Yetkazildi</option>
                  <option value="bekor">❌ Bekor qilindi</option>
                </select>
              </div>
            </div>
          </div>
        ))}
        {filtered.length === 0 && (
          <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-3">🛒</div>
            <div className="font-medium">Buyurtma yo'q</div>
          </div>
        )}
      </div>

      {/* Cancel modal */}
      {cancelModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md mx-4 shadow-2xl">
            <h3 className="text-lg font-bold text-gray-800 mb-2">Bekor qilish sababi</h3>
            <p className="text-gray-500 text-sm mb-4">Buyurtma nima sababdan bekor qilinmoqda?</p>
            <textarea
              value={cancelReason}
              onChange={e => setCancelReason(e.target.value)}
              placeholder="Masalan: Mijoz telefonga javob bermadi..."
              className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400 resize-none"
              rows={3}
            />
            <div className="flex gap-3 mt-4">
              <button onClick={() => { setCancelModal(null); setCancelReason(''); }}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-medium hover:bg-gray-50 transition">
                Orqaga
              </button>
              <button onClick={() => changeStatus(cancelModal, 'bekor', cancelReason)}
                disabled={!cancelReason.trim()}
                className="flex-1 py-2.5 rounded-xl bg-red-500 text-white text-sm font-medium hover:bg-red-600 transition disabled:opacity-50">
                Bekor qilish
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
