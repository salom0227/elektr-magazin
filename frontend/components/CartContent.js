'use client';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartContent() {
  const { cart, removeFromCart, updateQty, total } = useCart();

  if (cart.length === 0) return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <div className="text-8xl mb-6 animate-float">🛒</div>
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Savatcha bo'sh</h2>
        <p className="text-gray-500 mb-8">Hali hech narsa qo'shilmagan</p>
        <Link href="/catalog"
          className="btn-glow px-8 py-3.5 rounded-2xl font-bold text-white transition-all"
          style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)' }}>
          Xarid qilish →
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen" style={{ background: '#f0f4f8' }}>
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-10">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">🛒 Savatcha</h1>

        <div className="space-y-3 mb-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl p-4 flex items-center gap-4 animate-slideIn"
              style={{ border: '1px solid #e2e8f0', boxShadow: '0 2px 15px rgba(0,0,0,0.05)' }}>
              {item.image
                ? <img src={item.image} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                : <div className="w-16 h-16 bg-blue-50 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">⚡</div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                <p className="font-bold mt-1" style={{ color: '#1d4ed8' }}>{Number(item.price).toLocaleString()} so'm</p>
              </div>
              <div className="flex items-center rounded-xl overflow-hidden" style={{ border: '1.5px solid #e2e8f0' }}>
                <button onClick={() => updateQty(item.id, item.qty - 1)}
                  className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-bold transition-colors">−</button>
                <span className="px-3 py-2 font-bold text-gray-800">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}
                  className="px-3 py-2 hover:bg-gray-50 text-gray-600 font-bold transition-colors">+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)}
                className="w-8 h-8 rounded-xl flex items-center justify-center text-red-400 hover:bg-red-50 hover:text-red-600 transition-all ml-1">✕</button>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl p-6" style={{ border: '1px solid #e2e8f0', boxShadow: '0 4px 20px rgba(0,0,0,0.06)' }}>
          <div className="flex justify-between items-center mb-6">
            <span className="text-gray-600 font-medium text-lg">Jami:</span>
            <span className="text-3xl font-bold" style={{ color: '#1d4ed8' }}>{total.toLocaleString()} so'm</span>
          </div>
          <Link href="/checkout"
            className="block w-full text-center py-4 rounded-2xl font-bold text-white text-lg btn-glow transition-all"
            style={{ background: 'linear-gradient(135deg, #3b82f6, #1d4ed8)', boxShadow: '0 8px 25px rgba(59,130,246,0.4)' }}>
            Buyurtma berish →
          </Link>
        </div>
      </div>
    </div>
  );
}
