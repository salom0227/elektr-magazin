'use client';
import { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export function CartProvider({ children }) {
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setCart(JSON.parse(saved));
  }, []);

  const save = (items) => {
    setCart(items);
    localStorage.setItem('cart', JSON.stringify(items));
  };

  const addToCart = (product) => {
    const exists = cart.find(i => i.id === product.id);
    if (exists) {
      save(cart.map(i => i.id === product.id ? { ...i, qty: i.qty + 1 } : i));
    } else {
      save([...cart, { ...product, qty: 1 }]);
    }
  };

  const removeFromCart = (id) => save(cart.filter(i => i.id !== id));

  const updateQty = (id, qty) => {
    if (qty < 1) return removeFromCart(id);
    save(cart.map(i => i.id === id ? { ...i, qty } : i));
  };

  const clearCart = () => save([]);

  const total = cart.reduce((sum, i) => sum + Number(i.price) * i.qty, 0);
  const count = cart.reduce((sum, i) => sum + i.qty, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQty, clearCart, total, count }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => useContext(CartContext);
