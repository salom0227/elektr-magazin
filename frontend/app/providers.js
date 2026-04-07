'use client';
import { CartProvider } from '@/context/CartContext';
// Agar AuthProvider bo'lsa, uni ham shu yerga qo'shing
// import { AuthProvider } from '@/context/AuthContext'; 

export default function Providers({ children }) {
  return (
    <CartProvider>
      {/* <AuthProvider> */}
        {children}
      {/* </AuthProvider> */}
    </CartProvider>
  );
}
