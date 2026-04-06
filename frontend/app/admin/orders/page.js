'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

const STATUS = {
  new: { label: 'Yangi', class: 'bg-yellow-100 text-yellow-700' },
  "ko'rildi": { label: "Ko'rildi", class: 'bg-blue-100 text-blue-700' },
  yetkazildi: { label: 'Yetkazildi', class: 'bg-green-100 text-green-700' }
};

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    const res = await axios.get(`${API}/api/orders`, { headers });
    setOrders(res.data);
  };

  useEffect(() => { load(); }, []);

  const changeStatus = async (id, status) => {
    await axios.put(`${API}/api/orders/${id}/status`, { status }, { headers });
    load();
  };

  const counts = {
    new: orders.filter(o => o.status === 'new').length,
    "ko'rildi": orders.filter(o => o.status === "ko'rildi").length,
    yetkazildi: orders.filter(o => o.status === 'yetkazildi').length,
  };

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Buyurtmalar</h1>
        <p className="text-gray-500 text-sm mt-1">{orders.length} ta buyurtma</p>
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-yellow-600 text-sm font-medium">🆕 Yangi</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{counts.new}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-blue-600 text-sm font-medium">👁 Ko'rildi</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{counts["ko'rildi"]}</p>
        </div>
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4">
          <p className="text-green-600 text-sm font-medium">✅ Yetkazildi</p>
          <p className="text-3xl font-bold text-gray-800 mt-1">{counts.yetkazildi}</p>
        </div>
      </div>

      <div className="space-y-3">
        {orders.map(o => (
          <div key={o.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 hover:shadow-md transition">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-bold text-gray-800 text-lg">{o.name}</p>
                <p className="text-blue-600 text-sm font-medium mt-0.5">{o.phone}</p>
                {o.address && <p className="text-gray-500 text-sm mt-1">📍 {o.address}</p>}
                <p className="text-gray-400 text-xs mt-2">
                  🕐 {new Date(o.created_at).toLocaleString('uz-UZ')}
                </p>
              </div>
              <select
                value={o.status}
                onChange={e => changeStatus(o.id, e.target.value)}
                className={`text-sm font-semibold px-4 py-2 rounded-xl border-0 cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500 ${STATUS[o.status]?.class || 'bg-gray-100 text-gray-600'}`}
              >
                <option value="new">🆕 Yangi</option>
                <option value="ko'rildi">👁 Ko'rildi</option>
                <option value="yetkazildi">✅ Yetkazildi</option>
              </select>
            </div>
          </div>
        ))}
        {orders.length === 0 && (
          <div className="text-center py-20 text-gray-400 bg-white rounded-2xl border border-gray-100">
            <div className="text-5xl mb-3">🛒</div>
            <div className="font-medium">Buyurtma yo'q</div>
          </div>
        )}
      </div>
    </div>
  );
}
