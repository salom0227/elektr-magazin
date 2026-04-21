// ──────────────────────────────────────────────
// app/admin/layout.js  (GREEN sidebar)
// ──────────────────────────────────────────────
'use client';
import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';

export default function AdminLayout({ children }) {
  const router = useRouter();
  const pathname = usePathname();
  const isLogin = pathname === '/admin';

  useEffect(() => {
    if (!isLogin && !localStorage.getItem('admin_token')) router.push('/admin');
  }, []);

  const logout = () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin');
    router.push('/admin');
  };

  if (isLogin) return <>{children}</>;

  const navItems = [
    { href: '/admin/dashboard', icon: '📊', label: 'Dashboard' },
    { href: '/admin/products',  icon: '📦', label: 'Mahsulotlar' },
    { href: '/admin/categories',icon: '🗂',  label: 'Kategoriyalar' },
    { href: '/admin/orders',    icon: '🛒',  label: 'Buyurtmalar' },
    { href: '/admin/settings',  icon: '⚙️',  label: 'Sozlamalar' },
  ];

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <aside className="admin-sidebar">
        <div className="admin-logo">
          <div className="admin-logo-icon">⚡</div>
          <div>
            <div className="admin-logo-text">ElektrBaza</div>
            <div className="admin-logo-sub">Admin panel</div>
          </div>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <Link key={item.href} href={item.href} style={{ textDecoration: 'none' }}>
              <div className={`admin-nav-item${pathname === item.href ? ' active' : ''}`}>
                <span className="admin-nav-icon">{item.icon}</span>
                {item.label}
              </div>
            </Link>
          ))}
        </nav>

        <div className="admin-footer">
          <Link href="/" style={{ textDecoration: 'none' }}>
            <div className="admin-nav-item" style={{ marginBottom: 4 }}>
              <span className="admin-nav-icon">🌐</span>
              Saytga o'tish
            </div>
          </Link>
          <button onClick={logout} style={{
            width: '100%', padding: '9px 12px',
            background: 'rgba(239,68,68,0.12)', border: 'none',
            borderRadius: 10, cursor: 'pointer',
            color: '#f87171', fontFamily: 'inherit',
            fontWeight: 700, fontSize: 13,
            display: 'flex', alignItems: 'center', gap: 10,
            transition: 'background .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.background = 'rgba(239,68,68,0.22)'}
            onMouseLeave={e => e.currentTarget.style.background = 'rgba(239,68,68,0.12)'}
          >
            <span>🚪</span> Chiqish
          </button>
        </div>
      </aside>

      <main className="admin-main">{children}</main>
    </div>
  );
}
