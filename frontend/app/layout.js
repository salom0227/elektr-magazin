import './globals.css';
import Providers from './providers';
import NavbarWrapper from '@/components/NavbarWrapper';

export const metadata = {
  title: 'Elektr Magazin',
  description: 'Sifatli elektr aksessuarlar do\'koni',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz" data-scroll-behavior="smooth">
      <body className="antialiased">
        <Providers>
          <NavbarWrapper />
          <main>{children}</main>
        </Providers>
      </body>
    </html>
  );
}
