'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLoginPage = pathname === '/admin';

  useEffect(() => {
    if (!isLoginPage) {
      const token = localStorage.getItem('admin_token');
      if (!token) router.push('/admin');
    }
  }, []);

  const logout = () => {
    localStorage.removeItem('admin_token');
    router.push('/admin');
  };

  if (isLoginPage) return <>{children}</>;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      <aside style={{background: '#0f172a'}} className="w-56 flex flex-col fixed h-full">
        <div className="p-5 border-b border-white/10">
          <h2 className="font-bold text-lg text-white">⚡ Elektr Magazin</h2>
          <p className="text-white/40 text-xs mt-1">Admin panel</p>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {[
            { href: '/admin/products', icon: '📦', label: 'Mahsulotlar' },
            { href: '/admin/categories', icon: '🗂', label: 'Kategoriyalar' },
            { href: '/admin/orders', icon: '🛒', label: 'Buyurtmalar' },
          ].map(item => (
            <Link key={item.href} href={item.href}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-sm font-medium ${
                pathname === item.href
                  ? 'bg-blue-600 text-white'
                  : 'text-white/60 hover:bg-white/10 hover:text-white'
              }`}>
              <span>{item.icon}</span>
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-3 border-t border-white/10">
          <button onClick={logout}
            className="w-full text-sm text-red-400 hover:text-red-300 font-medium py-2 hover:bg-white/5 rounded-xl transition">
            Chiqish
          </button>
        </div>
      </aside>
      <main className="flex-1 ml-56 p-6 overflow-auto">
        {children}
      </main>
    </div>
  );
}
