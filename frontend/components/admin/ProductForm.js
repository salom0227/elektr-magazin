'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductForm({ categories, editing, onClose }) {
  const [form, setForm] = useState({
    name: '', description: '', price: '', brand: '',
    model: '', voltage: '', category_id: '', stock: ''
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);

  const token = localStorage.getItem('admin_token');
  const headers = { Authorization: `Bearer ${token}` };

  useEffect(() => {
    if (editing) {
      setForm({
        name: editing.name || '',
        description: editing.description || '',
        price: editing.price || '',
        brand: editing.brand || '',
        model: editing.model || '',
        voltage: editing.voltage || '',
        category_id: editing.category_id || '',
        stock: editing.stock || ''
      });
      setPreview(editing.image);
    }
  }, [editing]);

  const handleImage = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const data = new FormData();
      Object.entries(form).forEach(([k, v]) => data.append(k, v));
      if (image) data.append('image', image);
      if (editing?.image && !image) data.append('existing_image', editing.image);

      if (editing) {
        await axios.put(`${API}/api/products/${editing.id}`, data, { headers });
      } else {
        await axios.post(`${API}/api/products`, data, { headers });
      }
      onClose();
    } catch (err) {
      alert('Xatolik: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fields = [
    { key: 'name', label: 'Nomi', placeholder: 'Smart rozetka WiFi' },
    { key: 'brand', label: 'Brend', placeholder: 'Xiaomi' },
    { key: 'model', label: 'Model', placeholder: 'ZNCZ04CM' },
    { key: 'voltage', label: 'Kuchlanish', placeholder: '220V' },
    { key: 'price', label: 'Narx (so\'m)', placeholder: '120000', type: 'number' },
    { key: 'stock', label: 'Ombordagi soni', placeholder: '50', type: 'number' },
  ];

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-xl font-bold">
            {editing ? 'Mahsulotni tahrirlash' : 'Yangi mahsulot'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-2xl">×</button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Rasm yuklash */}
          <div>
            <label className="block text-sm font-medium mb-2">Rasm</label>
            <div
              onClick={() => document.getElementById('img-input').click()}
              className="border-2 border-dashed border-gray-300 rounded-xl p-4 text-center cursor-pointer hover:border-blue-400 transition"
            >
              {preview
                ? <img src={preview} className="h-40 object-contain mx-auto rounded-lg" />
                : <div className="py-8 text-gray-400">
                    <div className="text-4xl mb-2">📷</div>
                    <div className="text-sm">Rasm yuklash uchun bosing</div>
                  </div>
              }
            </div>
            <input id="img-input" type="file" accept="image/*" onChange={handleImage} className="hidden" />
          </div>

          {/* Kategoriya */}
          <div>
            <label className="block text-sm font-medium mb-1">Kategoriya</label>
            <select
              value={form.category_id}
              onChange={e => setForm({ ...form, category_id: e.target.value })}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Tanlang...</option>
              {categories.map(c => (
                <option key={c.id} value={c.id}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Boshqa maydonlar */}
          <div className="grid grid-cols-2 gap-4">
            {fields.map(f => (
              <div key={f.key}>
                <label className="block text-sm font-medium mb-1">{f.label}</label>
                <input
                  type={f.type || 'text'}
                  value={form[f.key]}
                  onChange={e => setForm({ ...form, [f.key]: e.target.value })}
                  placeholder={f.placeholder}
                  className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required={['name', 'price', 'stock'].includes(f.key)}
                />
              </div>
            ))}
          </div>

          {/* Tavsif */}
          <div>
            <label className="block text-sm font-medium mb-1">Tavsif</label>
            <textarea
              value={form.description}
              onChange={e => setForm({ ...form, description: e.target.value })}
              placeholder="Mahsulot haqida qisqacha..."
              rows={3}
              className="w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-xl font-medium hover:bg-blue-700 transition disabled:opacity-50"
          >
            {loading ? 'Saqlanmoqda...' : editing ? 'Saqlash' : 'Qo\'shish'}
          </button>
        </form>
      </div>
    </div>
  );
}
