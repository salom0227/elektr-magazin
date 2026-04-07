import { CartProvider } from "@/context/CartContext";
import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'Elektr Magazin',
  description: 'Rozetka, adapter, kabel va boshqa elektr aksessuarlar',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>
        <CartProvider>
          <Providers>
          <CartProvider>{children}</CartProvider>
        </Providers>
        </CartProvider>
      </body>
    </html>
  );
}
