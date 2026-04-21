'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function AdminLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); setError('');
    try {
      const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error || 'Xatolik'); return; }
      localStorage.setItem('admin_token', data.token);
      localStorage.setItem('admin', JSON.stringify(data.admin));
      router.push('/admin/dashboard');
    } catch { setError('Server bilan bog\'lanishda xatolik'); }
    finally { setLoading(false); }
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center',
      background: 'linear-gradient(135deg, #052e16 0%, #14532d 50%, #0f2d1a 100%)',
      position: 'relative', overflow: 'hidden',
    }}>
      {/* bg decoration */}
      {[...Array(6)].map((_, i) => (
        <div key={i} style={{
          position: 'absolute',
          width: 300 + i * 80, height: 300 + i * 80,
          borderRadius: '50%',
          border: '1px solid rgba(34,197,94,0.1)',
          top: '50%', left: '50%',
          transform: 'translate(-50%,-50%)',
          pointerEvents: 'none',
          animation: `wave ${20 + i * 4}s linear infinite`,
        }} />
      ))}

      <div style={{
        width: '100%', maxWidth: 400, padding: '0 20px',
        position: 'relative', zIndex: 1,
      }}>
        {/* Logo */}
        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <div style={{
            width: 72, height: 72, borderRadius: 20,
            background: 'linear-gradient(135deg, #16a34a, #15803d)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, margin: '0 auto 14px',
            boxShadow: '0 0 40px rgba(22,163,74,0.4)',
            animation: 'pulse 2s infinite',
          }}>⚡</div>
          <h1 style={{ color: 'white', fontSize: 26, fontWeight: 900, marginBottom: 4 }}>Admin Panel</h1>
          <p style={{ color: 'rgba(255,255,255,.5)', fontSize: 14 }}>ElektrBaza boshqaruv paneli</p>
        </div>

        {/* Card */}
        <div style={{
          background: 'rgba(255,255,255,0.06)',
          backdropFilter: 'blur(20px)',
          border: '1px solid rgba(255,255,255,0.12)',
          borderRadius: 24, padding: 32,
          boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
        }}>
          {error && (
            <div style={{
              padding: '10px 14px', borderRadius: 10,
              background: 'rgba(239,68,68,0.15)', border: '1px solid rgba(239,68,68,0.3)',
              color: '#fca5a5', fontSize: 13, fontWeight: 600, marginBottom: 16,
            }}>❌ {error}</div>
          )}

          <form onSubmit={handleLogin}>
            <div style={{ marginBottom: 16 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.7)', marginBottom: 7 }}>Login</label>
              <input type="text" value={email} onChange={e => setEmail(e.target.value)} required
                placeholder="admin" style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  borderRadius: 12, color: 'white',
                  fontFamily: 'inherit', fontSize: 14, outline: 'none',
                }} />
            </div>
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'rgba(255,255,255,.7)', marginBottom: 7 }}>Parol</label>
              <input type="password" value={password} onChange={e => setPassword(e.target.value)} required
                placeholder="••••••••" style={{
                  width: '100%', padding: '11px 14px',
                  background: 'rgba(255,255,255,0.08)',
                  border: '1.5px solid rgba(255,255,255,0.15)',
                  borderRadius: 12, color: 'white',
                  fontFamily: 'inherit', fontSize: 14, outline: 'none',
                }} />
            </div>
            <button type="submit" disabled={loading} style={{
              width: '100%', padding: 14,
              background: loading ? 'rgba(22,163,74,0.4)' : 'var(--g)',
              color: 'white', border: 'none', borderRadius: 14,
              fontFamily: 'inherit', fontWeight: 800, fontSize: 16,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all .2s',
              boxShadow: loading ? 'none' : '0 8px 24px rgba(22,163,74,0.4)',
            }}>
              {loading ? '⏳ Kirish...' : '→ Kirish'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
