'use client';
import { useState, useEffect } from 'react';
import axios from 'axios';
import ProductForm from '@/components/admin/ProductForm';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [search, setSearch] = useState('');

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';
  const headers = { Authorization: `Bearer ${token}` };

  const load = async () => {
    const [p, c] = await Promise.all([
      axios.get(`${API}/api/products?search=${search}`),
      axios.get(`${API}/api/categories`)
    ]);
    setProducts(p.data);
    setCategories(c.data);
  };

  useEffect(() => { load(); }, [search]);

  const handleDelete = async (id) => {
    if (!confirm('O\'chirishga ishonchingiz komilmi?')) return;
    await axios.delete(`${API}/api/products/${id}`, { headers });
    load();
  };

  const handleEdit = (product) => {
    setEditing(product);
    setShowForm(true);
  };

  const handleClose = () => {
    setShowForm(false);
    setEditing(null);
    load();
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Mahsulotlar</h1>
        <button onClick={() => { setEditing(null); setShowForm(true); }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition text-sm font-medium">
          + Yangi mahsulot
        </button>
      </div>

      <input
        type="text"
        placeholder="Qidirish..."
        value={search}
        onChange={e => setSearch(e.target.value)}
        className="mb-4 w-full border rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
      />

      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>
              <th className="text-left px-4 py-3">Rasm</th>
              <th className="text-left px-4 py-3">Nomi</th>
              <th className="text-left px-4 py-3">Kategoriya</th>
              <th className="text-left px-4 py-3">Narx</th>
              <th className="text-left px-4 py-3">Stock</th>
              <th className="text-left px-4 py-3">Amal</th>
            </tr>
          </thead>
          <tbody>
            {products.map(p => (
              <tr key={p.id} className="border-b hover:bg-gray-50">
                <td className="px-4 py-3">
                  {p.image
                    ? <img src={p.image} className="w-12 h-12 object-cover rounded-lg" />
                    : <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center text-gray-400">📷</div>
                  }
                </td>
                <td className="px-4 py-3 font-medium">{p.name}</td>
                <td className="px-4 py-3 text-gray-500">{p.category_name}</td>
                <td className="px-4 py-3">{Number(p.price).toLocaleString()} so'm</td>
                <td className="px-4 py-3">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${p.stock > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                    {p.stock} ta
                  </span>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:underline text-xs font-medium">
                      Tahrirlash
                    </button>
                    <button onClick={() => handleDelete(p.id)}
                      className="text-red-500 hover:underline text-xs font-medium">
                      O'chirish
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {products.length === 0 && (
              <tr><td colSpan={6} className="text-center py-10 text-gray-400">Mahsulot yo'q</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showForm && (
        <ProductForm
          categories={categories}
          editing={editing}
          onClose={handleClose}
        />
      )}
    </div>
  );
}
