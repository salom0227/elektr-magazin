'use client';
import dynamic from 'next/dynamic';

const CartContent = dynamic(() => import('@/components/CartContent'), { ssr: false });

export default function CartPage() {
  return <CartContent />;
}
