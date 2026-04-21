'use client';
import { useState } from 'react';
import axios from 'axios';
import { useCart } from '@/context/CartContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function CheckoutContent() {
  const { cart, total, clearCart } = useCart();
  const [form, setForm] = useState({ name: '', phone: '', address: '' });
  const [location, setLocation] = useState(null);
  const [locLoading, setLocLoading] = useState(false);
  const [locError, setLocError] = useState('');
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);
  const router = useRouter();

  const getLocation = () => {
    setLocLoading(true); setLocError('');
    if (!navigator.geolocation) { setLocError('Brauzer qo\'llab-quvvatlamaydi'); setLocLoading(false); return; }
    navigator.geolocation.getCurrentPosition(
      pos => { setLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }); setLocLoading(false); },
      () => { setLocError('Ruxsat berilmadi'); setLocLoading(false); }
    );
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); setLoading(true);
    try {
      await axios.post(`${API}/api/orders`, {
        ...form,
        latitude: location?.lat || null,
        longitude: location?.lng || null,
        items: cart.map(i => ({ product_id: i.id, qty: i.qty || 1 })),
      });
      clearCart(); setDone(true);
      setTimeout(() => router.push('/'), 3500);
    } catch { alert('Xatolik yuz berdi'); }
    finally { setLoading(false); }
  };

  if (done) return (
    <div className="success-wrap">
      <div className="success-icon">✅</div>
      <h2 style={{ fontSize: 30, fontWeight: 900, color: 'var(--gray-900)', marginBottom: 8 }}>
        Buyurtma qabul qilindi!
      </h2>
      <p style={{ color: 'var(--gray-500)', fontSize: 16, marginBottom: 6 }}>
        Tez orada siz bilan bog'lanamiz
      </p>
      <p style={{ color: 'var(--gray-400)', fontSize: 13 }}>Bosh sahifaga yo'naltirilmoqda...</p>
      <div style={{
        marginTop: 24, width: 200, height: 4, background: 'var(--gray-200)',
        borderRadius: 2, overflow: 'hidden',
      }}>
        <div style={{
          height: '100%', background: 'var(--g)',
          animation: 'shimmer 3.5s linear',
          width: '100%',
        }} />
      </div>
    </div>
  );

  return (
    <div className="main-wrap page-enter">
      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 24 }}>
        <Link href="/" style={{ color: 'var(--gray-500)' }}>Bosh sahifa</Link>
        {' › '}
        <Link href="/cart" style={{ color: 'var(--gray-500)' }}>Savatcha</Link>
        {' › '}
        <span style={{ color: 'var(--gray-800)', fontWeight: 600 }}>Buyurtma</span>
      </div>

      <h1 style={{ fontSize: 28, fontWeight: 800, marginBottom: 28 }}>Buyurtma berish</h1>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 360px', gap: 24 }}>
        {/* Form */}
        <form onSubmit={handleSubmit}>
          <div className="checkout-card" style={{ marginBottom: 16 }}>
            <h3 style={{ fontSize: 17, fontWeight: 800, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--g)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>1</span>
              Kontakt ma'lumotlar
            </h3>

            <div className="form-group">
              <label className="form-label">👤 Ismingiz</label>
              <input
                className="form-input" type="text" required
                placeholder="Ali Valiyev"
                value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">📞 Telefon</label>
              <input
                className="form-input" type="tel" required
                placeholder="+998 90 123 45 67"
                value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
              />
            </div>
            <div className="form-group">
              <label className="form-label">📍 Manzil</label>
              <input
                className="form-input" type="text" required
                placeholder="Shahar, ko'cha, uy raqami"
                value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
              />
            </div>

            {/* Location */}
            <div className="form-group">
              <label className="form-label">🗺️ Lokatsiya <span style={{ color: 'var(--gray-400)', fontWeight: 500 }}>(ixtiyoriy)</span></label>
              {location ? (
                <div style={{
                  display: 'flex', alignItems: 'center', gap: 12,
                  padding: '12px 14px', borderRadius: 'var(--r)',
                  background: 'var(--g-50)', border: '1.5px solid var(--g-200)',
                }}>
                  <span style={{ fontSize: 20 }}>✅</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: 700, fontSize: 13, color: 'var(--g-dark)' }}>Lokatsiya aniqlandi</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)', marginTop: 1 }}>
                      {location.lat.toFixed(5)}, {location.lng.toFixed(5)}
                    </div>
                  </div>
                  <button type="button" onClick={() => setLocation(null)}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ef4444', fontSize: 16 }}>×</button>
                </div>
              ) : (
                <button type="button" onClick={getLocation} disabled={locLoading}
                  style={{
                    width: '100%', padding: '11px', borderRadius: 'var(--r)',
                    border: '1.5px dashed var(--g-200)', background: 'var(--g-50)',
                    color: 'var(--g)', fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
                    cursor: 'pointer', transition: 'all .2s',
                  }}>
                  {locLoading ? '⏳ Aniqlanmoqda...' : '📍 Joylashuvimni yuborish'}
                </button>
              )}
              {locError && <div style={{ fontSize: 12, color: '#ef4444', marginTop: 6 }}>{locError}</div>}
            </div>
          </div>

          <button type="submit" disabled={loading || cart.length === 0}
            style={{
              width: '100%', padding: '16px',
              background: loading ? 'var(--gray-300)' : 'var(--g)',
              color: 'white', border: 'none', borderRadius: 'var(--r-lg)',
              fontFamily: 'inherit', fontWeight: 800, fontSize: 17,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all .2s',
              boxShadow: loading ? 'none' : 'var(--sh-green)',
            }}>
            {loading ? '⏳ Yuborilmoqda...' : '✅ Buyurtma berish'}
          </button>
        </form>

        {/* Order summary */}
        <div>
          <div className="checkout-card" style={{ position: 'sticky', top: 100 }}>
            <h3 style={{ fontSize: 16, fontWeight: 800, marginBottom: 18, display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ width: 28, height: 28, borderRadius: 8, background: 'var(--g)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 800 }}>2</span>
              Buyurtma tarkibi
            </h3>

            {cart.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--gray-400)' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>📭</div>
                <div>Savatcha bo'sh</div>
              </div>
            ) : (
              <>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 16 }}>
                  {cart.map(item => (
                    <div key={item.id} style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <div style={{
                        width: 44, height: 44, borderRadius: 10,
                        background: 'var(--g-50)', flexShrink: 0,
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden',
                      }}>
                        {item.image ? <img src={item.image} alt="" style={{ width: '100%', height: '100%', objectFit: 'contain', padding: 4 }} /> : '⚡'}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--gray-700)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                          {item.name}
                        </div>
                        <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>×{item.qty || 1}</div>
                      </div>
                      <div style={{ fontSize: 13, fontWeight: 800, color: 'var(--g-dark)', flexShrink: 0 }}>
                        {(Number(item.price) * (item.qty || 1)).toLocaleString('uz-UZ')}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ height: 1, background: 'var(--gray-200)', margin: '12px 0' }} />
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>Yetkazib berish</span>
                  <span style={{ fontSize: 13, color: 'var(--g)', fontWeight: 700 }}>Bepul</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 15, fontWeight: 800 }}>Jami:</span>
                  <span style={{ fontSize: 22, fontWeight: 900, color: 'var(--g-dark)' }}>
                    {total.toLocaleString('uz-UZ')}
                    <span style={{ fontSize: 12, color: 'var(--gray-400)', fontWeight: 500 }}> so'm</span>
                  </span>
                </div>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
