import Providers from './providers';
import './globals.css';

export const metadata = {
  title: 'Elektr Magazin',
  description: 'Sifatli elektr aksessuarlar do\'koni',
};

export default function RootLayout({ children }) {
  return (
    <html lang="uz">
      <body>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
