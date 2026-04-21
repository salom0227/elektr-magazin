// ──────────────────────────────────────────────
// app/product/[slug]/page.js
// ──────────────────────────────────────────────
'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const API = process.env.NEXT_PUBLIC_API_URL;

export default function ProductPage() {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [qty, setQty] = useState(1);
  const [added, setAdded] = useState(false);
  const [tab, setTab] = useState('desc');
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`${API}/api/products/${slug}`).then(r => setProduct(r.data)).catch(() => {});
  }, [slug]);

  const handleAdd = () => {
    for (let i = 0; i < qty; i++) addToCart({ ...product, qty: 1 });
    setAdded(true);
    setTimeout(() => setAdded(false), 2500);
  };

  if (!product) return (
    <div style={{ minHeight: '70vh', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 12, color: 'var(--gray-400)' }}>
      <div style={{ fontSize: 48, animation: 'float 2s ease-in-out infinite' }}>⚡</div>
      <div style={{ fontWeight: 600 }}>Yuklanmoqda...</div>
    </div>
  );

  return (
    <div className="main-wrap page-enter">
      {/* Breadcrumb */}
      <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 24, display: 'flex', gap: 6, alignItems: 'center' }}>
        <Link href="/" style={{ color: 'var(--gray-500)' }}>Bosh sahifa</Link>
        <span>›</span>
        <Link href="/catalog" style={{ color: 'var(--gray-500)' }}>Katalog</Link>
        <span>›</span>
        <span style={{ color: 'var(--gray-800)', fontWeight: 600 }}>{product.name}</span>
      </div>

      <div style={{
        background: 'var(--white)', borderRadius: 'var(--r-xl)',
        border: '1.5px solid var(--gray-200)',
        overflow: 'hidden', boxShadow: 'var(--sh-lg)',
      }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 0 }}>
          {/* Image */}
          <div className="pd-img-wrap" style={{ margin: 24, borderRadius: 20 }}>
            {product.image
              ? <img src={product.image} alt={product.name} />
              : <span style={{ fontSize: 100, opacity: .3 }}>⚡</span>
            }
            {/* badge */}
            <div style={{
              position: 'absolute', top: 14, left: 14,
              padding: '4px 14px', borderRadius: 20,
              background: 'var(--g)', color: 'white',
              fontSize: 11, fontWeight: 800, letterSpacing: .5,
            }}>Yangi</div>
          </div>

          {/* Info */}
          <div style={{ padding: '32px 32px 32px 24px' }}>
            <span style={{
              fontSize: 11, fontWeight: 700, color: 'var(--g)',
              background: 'var(--g-50)', padding: '3px 10px', borderRadius: 6,
              textTransform: 'uppercase', letterSpacing: .5,
            }}>{product.category_name}</span>

            <h1 style={{ fontSize: 26, fontWeight: 800, color: 'var(--gray-900)', marginTop: 12, lineHeight: 1.25 }}>
              {product.name}
            </h1>

            {product.brand && (
              <div style={{ fontSize: 13, color: 'var(--gray-500)', marginTop: 4 }}>
                {product.brand} {product.model && `— ${product.model}`}
              </div>
            )}

            <div style={{ display: 'flex', gap: 2, margin: '10px 0' }}>
              {[1,2,3,4,5].map(s => <span key={s} style={{ fontSize: 16, color: '#f59e0b' }}>★</span>)}
              <span style={{ fontSize: 12, color: 'var(--gray-400)', marginLeft: 6, alignSelf: 'center' }}>5.0</span>
            </div>

            {/* Price */}
            <div style={{
              padding: '16px 0', borderTop: '1.5px solid var(--gray-200)',
              borderBottom: '1.5px solid var(--gray-200)', margin: '16px 0',
            }}>
              <div style={{ fontSize: 38, fontWeight: 900, color: 'var(--g-dark)' }}>
                {Number(product.price).toLocaleString('uz-UZ')}
                <span style={{ fontSize: 16, color: 'var(--gray-400)', fontWeight: 500, marginLeft: 6 }}>so'm</span>
              </div>
            </div>

            {/* Specs */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20 }}>
              {product.voltage && (
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--gray-50)', borderRadius: 10 }}>
                  <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>⚡ Kuchlanish</span>
                  <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-800)' }}>{product.voltage}</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: 'var(--gray-50)', borderRadius: 10 }}>
                <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>📦 Omborda</span>
                <span style={{ fontSize: 13, fontWeight: 700, color: product.stock > 0 ? 'var(--g)' : '#ef4444' }}>
                  {product.stock > 0 ? `${product.stock} ta mavjud` : 'Tugagan'}
                </span>
              </div>
            </div>

            {/* Qty + Add */}
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <div className="qty-ctrl">
                <button className="qty-btn" onClick={() => setQty(q => Math.max(1, q - 1))}>−</button>
                <div className="qty-num">{qty}</div>
                <button className="qty-btn" onClick={() => setQty(q => q + 1)}>+</button>
              </div>
              <button
                onClick={handleAdd}
                disabled={product.stock === 0}
                style={{
                  flex: 1, padding: '13px 20px',
                  borderRadius: 'var(--r-lg)', border: 'none',
                  background: added ? '#059669' : product.stock === 0 ? 'var(--gray-300)' : 'var(--g)',
                  color: 'white', fontFamily: 'inherit', fontWeight: 800, fontSize: 15,
                  cursor: product.stock === 0 ? 'not-allowed' : 'pointer',
                  transition: 'all .2s',
                  transform: added ? 'scale(0.98)' : 'scale(1)',
                  boxShadow: added ? 'none' : 'var(--sh-green)',
                }}
              >
                {added ? '✅ Savatchangizga qo\'shildi!' : '🛒 Savatchaga qo\'shish'}
              </button>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div style={{ borderTop: '1.5px solid var(--gray-200)', padding: '0 32px' }}>
          <div style={{ display: 'flex', gap: 0 }}>
            {[['desc', '📋 Tavsif'], ['specs', '⚙️ Xususiyatlar']].map(([k, l]) => (
              <button key={k} onClick={() => setTab(k)} style={{
                padding: '14px 20px', background: 'none', border: 'none',
                borderBottom: tab === k ? '3px solid var(--g)' : '3px solid transparent',
                color: tab === k ? 'var(--g)' : 'var(--gray-500)',
                fontFamily: 'inherit', fontWeight: 700, fontSize: 13,
                cursor: 'pointer', transition: 'all .2s',
              }}>{l}</button>
            ))}
          </div>
          <div style={{ padding: '20px 0 28px' }}>
            {tab === 'desc' ? (
              <p style={{ fontSize: 14, color: 'var(--gray-600)', lineHeight: 1.8 }}>
                {product.description || 'Mahsulot haqida ma\'lumot yo\'q.'}
              </p>
            ) : (
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10 }}>
                {[
                  ['Nomi', product.name],
                  ['Brend', product.brand],
                  ['Model', product.model],
                  ['Kuchlanish', product.voltage],
                  ['Kategoriya', product.category_name],
                  ['Omborda', `${product.stock} ta`],
                ].filter(([, v]) => v).map(([k, v]) => (
                  <div key={k} style={{
                    display: 'flex', justifyContent: 'space-between',
                    padding: '9px 14px', background: 'var(--gray-50)', borderRadius: 10,
                  }}>
                    <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>{k}</span>
                    <span style={{ fontSize: 13, fontWeight: 700, color: 'var(--gray-800)' }}>{v}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
