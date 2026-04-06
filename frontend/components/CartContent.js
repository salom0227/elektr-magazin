'use client';
import Navbar from '@/components/Navbar';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';

export default function CartContent() {
  const { cart, removeFromCart, updateQty, total } = useCart();

  if (cart.length === 0) return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="flex flex-col items-center justify-center py-40 text-center">
        <div className="text-6xl mb-4">🛒</div>
        <p className="text-lg font-medium mb-4 text-gray-600">Savatcha bo'sh</p>
        <Link href="/catalog" className="bg-blue-600 text-white px-6 py-2.5 rounded-xl font-semibold hover:bg-blue-700 transition">
          Xarid qilish
        </Link>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="max-w-3xl mx-auto px-4 py-8">
        <h1 className="text-2xl font-bold text-gray-800 mb-6">Savatcha</h1>
        <div className="space-y-3 mb-6">
          {cart.map(item => (
            <div key={item.id} className="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 flex items-center gap-4">
              {item.image
                ? <img src={item.image} className="w-16 h-16 object-cover rounded-xl flex-shrink-0" />
                : <div className="w-16 h-16 bg-gray-100 rounded-xl flex items-center justify-center text-2xl flex-shrink-0">⚡</div>
              }
              <div className="flex-1 min-w-0">
                <p className="font-semibold text-gray-800 text-sm truncate">{item.name}</p>
                <p className="text-blue-600 font-bold mt-1">{Number(item.price).toLocaleString()} so'm</p>
              </div>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden">
                <button onClick={() => updateQty(item.id, item.qty - 1)}
                  className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 font-bold text-sm">−</button>
                <span className="px-3 py-1.5 font-semibold text-gray-800 text-sm">{item.qty}</span>
                <button onClick={() => updateQty(item.id, item.qty + 1)}
                  className="px-2.5 py-1.5 hover:bg-gray-50 text-gray-600 font-bold text-sm">+</button>
              </div>
              <button onClick={() => removeFromCart(item.id)}
                className="text-red-400 hover:text-red-600 transition text-lg ml-2">✕</button>
            </div>
          ))}
        </div>
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-5">
          <div className="flex justify-between items-center mb-4">
            <span className="text-gray-600 font-medium">Jami:</span>
            <span className="text-2xl font-bold text-blue-600">{total.toLocaleString()} so'm</span>
          </div>
          <Link href="/checkout"
            className="block w-full bg-blue-600 text-white text-center py-3 rounded-xl font-semibold hover:bg-blue-700 transition">
            Buyurtma berish →
          </Link>
        </div>
      </div>
    </div>
  );
}
