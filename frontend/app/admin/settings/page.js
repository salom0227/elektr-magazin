'use client';
import { useState, useRef } from 'react';
import axios from 'axios';

const API = process.env.NEXT_PUBLIC_API_URL;

// ── PASSWORD CHANGE ──
function PasswordSection() {
  const [form, setForm] = useState({ current: '', newPass: '', confirm: '' });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState(null); // { type: 'ok'|'err', text }

  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  const handleSubmit = async () => {
    setMsg(null);
    if (form.newPass.length < 6) return setMsg({ type: 'err', text: 'Yangi parol kamida 6 ta belgi' });
    if (form.newPass !== form.confirm) return setMsg({ type: 'err', text: 'Parollar mos kelmayapti' });
    setLoading(true);
    try {
      await axios.post(`${API}/api/auth/change-password`,
        { current_password: form.current, new_password: form.newPass },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg({ type: 'ok', text: 'Parol muvaffaqiyatli o\'zgartirildi!' });
      setForm({ current: '', newPass: '', confirm: '' });
    } catch (err) {
      setMsg({ type: 'err', text: err.response?.data?.error || 'Xatolik yuz berdi' });
    } finally { setLoading(false); }
  };

  return (
    <div style={{
      background: 'white', borderRadius: 20,
      border: '1.5px solid var(--gray-200)',
      padding: 24, marginBottom: 20,
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
        🔐 Parolni o'zgartirish
      </h3>
      {msg && (
        <div style={{
          padding: '10px 14px', borderRadius: 10, marginBottom: 16,
          background: msg.type === 'ok' ? 'var(--g-50)' : '#fef2f2',
          border: `1px solid ${msg.type === 'ok' ? 'var(--g-200)' : '#fecaca'}`,
          color: msg.type === 'ok' ? 'var(--g-dark)' : '#dc2626',
          fontSize: 13, fontWeight: 600,
        }}>{msg.type === 'ok' ? '✅' : '❌'} {msg.text}</div>
      )}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 14, maxWidth: 400 }}>
        {[
          ['Joriy parol', 'current'],
          ['Yangi parol', 'newPass'],
          ['Yangi parolni tasdiqlang', 'confirm'],
        ].map(([label, key]) => (
          <div key={key}>
            <label style={{ display: 'block', fontSize: 13, fontWeight: 700, color: 'var(--gray-700)', marginBottom: 6 }}>
              {label}
            </label>
            <input type="password" value={form[key]}
              onChange={e => setForm({ ...form, [key]: e.target.value })}
              placeholder="••••••••"
              className="form-input" />
          </div>
        ))}
        <button onClick={handleSubmit} disabled={loading || !form.current || !form.newPass || !form.confirm}
          style={{
            padding: '11px', borderRadius: 12, border: 'none',
            background: 'var(--g)', color: 'white',
            fontFamily: 'inherit', fontWeight: 800, fontSize: 14,
            cursor: 'pointer', opacity: loading ? .6 : 1,
            boxShadow: 'var(--sh-green)',
            transition: 'all .2s',
          }}>
          {loading ? 'Saqlanmoqda...' : 'Saqlash'}
        </button>
      </div>
    </div>
  );
}

// ── BANNER UPLOAD ──
function BannerSection() {
  const [banners, setBanners] = useState([
    { id: 1, label: 'Birinchi slider', preview: null, uploading: false, saved: false },
    { id: 2, label: 'Ikkinchi slider', preview: null, uploading: false, saved: false },
    { id: 3, label: 'Uchinchi slider', preview: null, uploading: false, saved: false },
  ]);
  const refs = useRef({});
  const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : '';

  const handleFile = (id, file) => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    setBanners(bs => bs.map(b => b.id === id ? { ...b, preview: url, file, saved: false } : b));
  };

  const handleUpload = async (id) => {
    const banner = banners.find(b => b.id === id);
    if (!banner?.file) return;
    setBanners(bs => bs.map(b => b.id === id ? { ...b, uploading: true } : b));
    try {
      const fd = new FormData();
      fd.append('image', banner.file);
      fd.append('banner_index', id);
      await axios.post(`${API}/api/settings/banner`, fd, {
        headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'multipart/form-data' },
      });
      setBanners(bs => bs.map(b => b.id === id ? { ...b, uploading: false, saved: true } : b));
    } catch {
      alert('Yuklashda xatolik');
      setBanners(bs => bs.map(b => b.id === id ? { ...b, uploading: false } : b));
    }
  };

  return (
    <div style={{
      background: 'white', borderRadius: 20,
      border: '1.5px solid var(--gray-200)', padding: 24,
    }}>
      <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 6, display: 'flex', alignItems: 'center', gap: 8 }}>
        🖼️ Banner rasmlari
      </h3>
      <p style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 20 }}>
        Bosh sahifadagi slider uchun rasmlar. Tavsiya: 1400×480 px
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {banners.map(b => (
          <div key={b.id} style={{
            border: '1.5px solid var(--gray-200)', borderRadius: 16,
            overflow: 'hidden', transition: 'border-color .2s',
          }}
            onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--g-200)'}
            onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--gray-200)'}
          >
            <div style={{
              padding: '12px 16px', background: 'var(--gray-50)',
              borderBottom: '1px solid var(--gray-200)',
              display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            }}>
              <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-700)' }}>
                {b.label}
              </span>
              {b.saved && (
                <span style={{
                  fontSize: 11, fontWeight: 700,
                  background: 'var(--g-50)', color: 'var(--g)',
                  padding: '2px 10px', borderRadius: 20,
                }}>✅ Saqlandi</span>
              )}
            </div>

            {/* Preview or drop zone */}
            <div
              onClick={() => refs.current[b.id]?.click()}
              style={{
                height: 140, cursor: 'pointer',
                background: b.preview ? 'transparent' : 'var(--gray-50)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                position: 'relative', overflow: 'hidden',
              }}
            >
              {b.preview ? (
                <img src={b.preview} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <div style={{ textAlign: 'center', color: 'var(--gray-400)' }}>
                  <div style={{ fontSize: 32, marginBottom: 8 }}>📷</div>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Rasm yuklash uchun bosing</div>
                  <div style={{ fontSize: 11, marginTop: 3 }}>JPG, PNG, WEBP</div>
                </div>
              )}
              {b.preview && (
                <div style={{
                  position: 'absolute', inset: 0,
                  background: 'rgba(0,0,0,0.3)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  opacity: 0, transition: 'opacity .2s',
                }}
                  onMouseEnter={e => e.currentTarget.style.opacity = 1}
                  onMouseLeave={e => e.currentTarget.style.opacity = 0}
                >
                  <span style={{ color: 'white', fontWeight: 700, fontSize: 13 }}>🔄 Almashtirish</span>
                </div>
              )}
            </div>
            <input
              type="file" accept="image/*"
              ref={el => refs.current[b.id] = el}
              style={{ display: 'none' }}
              onChange={e => handleFile(b.id, e.target.files[0])}
            />

            {b.preview && (
              <div style={{ padding: '10px 14px', borderTop: '1px solid var(--gray-200)', display: 'flex', gap: 8 }}>
                <button onClick={() => handleUpload(b.id)} disabled={b.uploading}
                  style={{
                    flex: 1, padding: '9px',
                    background: b.uploading ? 'var(--gray-300)' : 'var(--g)',
                    color: 'white', border: 'none', borderRadius: 10,
                    fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
                    cursor: b.uploading ? 'not-allowed' : 'pointer',
                    transition: 'all .2s',
                  }}>
                  {b.uploading ? '⏳ Yuklanmoqda...' : '⬆️ Yuklash'}
                </button>
                <button
                  onClick={() => setBanners(bs => bs.map(x => x.id === b.id ? { ...x, preview: null, file: null, saved: false } : x))}
                  style={{
                    padding: '9px 14px', background: '#fee2e2',
                    color: '#dc2626', border: 'none', borderRadius: 10,
                    fontFamily: 'inherit', fontWeight: 700, fontSize: 13, cursor: 'pointer',
                  }}>✕</button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default function SettingsPage() {
  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 24 }}>
        <h1 style={{ fontSize: 24, fontWeight: 800, color: 'var(--gray-900)' }}>Sozlamalar</h1>
        <p style={{ color: 'var(--gray-500)', fontSize: 14, marginTop: 4 }}>Sayt va admin panel sozlamalari</p>
      </div>
      <PasswordSection />
      <BannerSection />
    </div>
  );
}
