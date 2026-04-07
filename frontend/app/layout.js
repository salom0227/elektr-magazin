import './globals.css';
import Providers from './providers';
import Navbar from '@/components/Navbar';

export const metadata = {
  title: 'Elektr Magazin',
  description: 'Sifatli elektr aksessuarlar do\'koni',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" data-scroll-behavior="smooth">
      <body className="antialiased">
        <Providers>
          {/* Navbar useCart hook-ini ishlatgani uchun u Providers ichida bo'lishi shart */}
          <Navbar />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
