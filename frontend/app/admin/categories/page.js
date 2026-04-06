'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [name, setName] = useState('');
  const [editing, setEditing] = useState(null);

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    const res = await axios.get(`${API}/api/categories`);
    setCategories(res.data);
  };

  useEffect(() => { load(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editing) {
      await axios.put(`${API}/api/categories/${editing.id}`, { name }, { headers });
      setEditing(null);
    } else {
      await axios.post(`${API}/api/categories`, { name }, { headers });
    }
    setName('');
    load();
  };

  const handleDelete = async (id) => {
    if (!confirm('O\'chirasizmi?')) return;
    await axios.delete(`${API}/api/categories/${id}`, { headers });
    load();
  };

  return (
    <div className="max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-800">Kategoriyalar</h1>
        <p className="text-gray-500 text-sm mt-1">{categories.length} ta kategoriya</p>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 mb-6">
        <h2 className="font-semibold text-gray-700 mb-3">{editing ? '✏️ Tahrirlash' : '➕ Yangi kategoriya'}</h2>
        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            value={name}
            onChange={e => setName(e.target.value)}
            placeholder="Kategoriya nomi..."
            className="flex-1 border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button type="submit"
            className="bg-blue-600 text-white px-5 py-2.5 rounded-xl hover:bg-blue-700 transition text-sm font-semibold">
            {editing ? 'Saqlash' : 'Qo\'shish'}
          </button>
          {editing && (
            <button type="button" onClick={() => { setEditing(null); setName(''); }}
              className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition">
              Bekor
            </button>
          )}
        </form>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div style={{background:'#0f172a'}} className="px-4 py-3">
          <p className="text-white/70 text-sm font-medium">Kategoriyalar ro'yxati</p>
        </div>
        {categories.map((c, i) => (
          <div key={c.id} className={`flex items-center justify-between px-4 py-3.5 border-b border-gray-50 hover:bg-blue-50/50 transition ${i % 2 === 0 ? 'bg-white' : 'bg-gray-50/30'}`}>
            <div className="flex items-center gap-3">
              <span className="w-8 h-8 bg-blue-100 text-blue-600 rounded-lg flex items-center justify-center text-sm font-bold">{i + 1}</span>
              <span className="font-medium text-gray-800">{c.name}</span>
            </div>
            <div className="flex gap-2">
              <button onClick={() => { setEditing(c); setName(c.name); }}
                className="bg-blue-50 text-blue-600 hover:bg-blue-100 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                ✏️ Tahrirlash
              </button>
              <button onClick={() => handleDelete(c.id)}
                className="bg-red-50 text-red-500 hover:bg-red-100 px-3 py-1.5 rounded-lg text-xs font-medium transition">
                🗑 O'chirish
              </button>
            </div>
          </div>
        ))}
        {categories.length === 0 && (
          <div className="text-center py-12 text-gray-400">
            <div className="text-3xl mb-2">🗂</div>
            <div className="text-sm">Kategoriya yo'q</div>
          </div>
        )}
      </div>
    </div>
  );
}
