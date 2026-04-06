'use client';
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface CartItem { id: string; name: string; price: number; image?: string; qty: number; }
interface CartCtx { items: CartItem[]; addToCart: (item: CartItem) => void; removeFromCart: (id: string) => void; updateQty: (id: string, qty: number) => void; clearCart: () => void; }

const CartContext = createContext<CartCtx>({ items: [], addToCart: () => {}, removeFromCart: () => {}, updateQty: () => {}, clearCart: () => {} });

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  useEffect(() => {
    const saved = localStorage.getItem('cart');
    if (saved) setItems(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(items));
  }, [items]);

  const addToCart = (item: CartItem) => {
    setItems(prev => {
      const exists = prev.find(i => i.id === item.id);
      if (exists) return prev.map(i => i.id === item.id ? { ...i, qty: i.qty + item.qty } : i);
      return [...prev, item];
    });
  };

  const removeFromCart = (id: string) => setItems(prev => prev.filter(i => i.id !== id));
  const updateQty = (id: string, qty: number) => {
    if (qty <= 0) return removeFromCart(id);
    setItems(prev => prev.map(i => i.id === id ? { ...i, qty } : i));
  };
  const clearCart = () => setItems([]);

  return <CartContext.Provider value={{ items, addToCart, removeFromCart, updateQty, clearCart }}>{children}</CartContext.Provider>;
}

export const useCart = () => useContext(CartContext);
