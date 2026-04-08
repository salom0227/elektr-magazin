'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function DashboardPage() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    axios.get(`${API}/api/dashboard`, { headers })
      .then(r => setData(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="text-gray-400 text-lg">Yuklanmoqda...</div>
    </div>
  );

  if (!data) return (
    <div className="text-center py-20 text-gray-400">Ma'lumot yuklanmadi</div>
  );

  const maxOrders = Math.max(...(data.daily_orders.map(d => parseInt(d.count))), 1);
  const maxSold = Math.max(...(data.top_products.map(p => parseInt(p.sold))), 1);

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Dashboard</h1>
        <p className="text-gray-500 text-sm mt-1">Umumiy statistika</p>
      </div>

      {/* Stats cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {[
          { label: 'Jami buyurtmalar', value: data.total_orders, icon: '🛒', color: '#3b82f6', bg: '#eff6ff' },
          { label: 'Jami mahsulotlar', value: data.total_products, icon: '📦', color: '#8b5cf6', bg: '#f5f3ff' },
          { label: 'Foydalanuvchilar', value: data.total_users, icon: '👥', color: '#10b981', bg: '#ecfdf5' },
          { label: 'Umumiy daromad', value: `${Number(data.total_revenue).toLocaleString()} so'm`, icon: '💰', color: '#f59e0b', bg: '#fffbeb' },
        ].map((s, i) => (
          <div key={i} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
            <div className="flex items-center justify-between mb-3">
              <span className="text-2xl">{s.icon}</span>
              <span className="text-xs font-medium px-2 py-1 rounded-lg" style={{ background: s.bg, color: s.color }}>
                Jami
              </span>
            </div>
            <p className="text-2xl font-bold text-gray-800">{s.value}</p>
            <p className="text-gray-500 text-sm mt-1">{s.label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        {/* Daily orders chart */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">📈 Oxirgi 7 kun buyurtmalar</h2>
          {data.daily_orders.length === 0 ? (
            <div className="text-center py-10 text-gray-400">Ma'lumot yo'q</div>
          ) : (
            <div className="flex items-end gap-2 h-40">
              {data.daily_orders.map((d, i) => {
                const pct = Math.round((parseInt(d.count) / maxOrders) * 100);
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <span className="text-xs font-bold text-blue-600">{d.count}</span>
                    <div className="w-full rounded-t-lg transition-all duration-500"
                      style={{ height: `${Math.max(pct, 8)}%`, background: 'linear-gradient(180deg, #3b82f6, #1d4ed8)', minHeight: '8px' }} />
                    <span className="text-xs text-gray-400 rotate-0">
                      {new Date(d.date).toLocaleDateString('uz-UZ', { month: 'numeric', day: 'numeric' })}
                    </span>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
          <h2 className="font-bold text-gray-800 mb-4">🏆 Top 5 mahsulot</h2>
          {data.top_products.length === 0 ? (
            <div className="text-center py-10 text-gray-400">Ma'lumot yo'q</div>
          ) : (
            <div className="space-y-3">
              {data.top_products.map((p, i) => {
                const pct = Math.round((parseInt(p.sold) / maxSold) * 100);
                const colors = ['#3b82f6', '#8b5cf6', '#10b981', '#f59e0b', '#ef4444'];
                return (
                  <div key={i}>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="font-medium text-gray-700 truncate max-w-[70%]">
                        {i + 1}. {p.name}
                      </span>
                      <span className="font-bold" style={{ color: colors[i] }}>{p.sold} ta</span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <div className="h-2 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%`, background: colors[i] }} />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Revenue breakdown */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
        <h2 className="font-bold text-gray-800 mb-4">💹 Moliyaviy ko'rsatkichlar</h2>
        <div className="grid grid-cols-3 gap-4">
          {[
            { label: 'Yetkazilgan buyurtmalar', value: data.total_revenue, color: '#10b981', icon: '✅', pct: 100 },
            { label: 'Kutilayotgan daromad', value: data.total_revenue * 0.15, color: '#f59e0b', icon: '⏳', pct: 15 },
            { label: 'Bekor qilingan', value: data.total_revenue * 0.05, color: '#ef4444', icon: '❌', pct: 5 },
          ].map((item, i) => (
            <div key={i} className="text-center p-4 rounded-2xl" style={{ background: item.color + '11' }}>
              <div className="text-3xl mb-2">{item.icon}</div>
              <div className="text-xl font-bold" style={{ color: item.color }}>
                {Number(item.value).toLocaleString()} so'm
              </div>
              <div className="text-xs text-gray-500 mt-1">{item.label}</div>
              <div className="mt-2 w-full bg-gray-100 rounded-full h-1.5">
                <div className="h-1.5 rounded-full" style={{ width: `${item.pct}%`, background: item.color }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
