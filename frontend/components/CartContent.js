'use client';
import { useCart } from '@/context/CartContext';
import Link from 'next/link';
import { useState } from 'react';

export default function CartContent() {
  const { cart, removeFromCart, updateQty, total } = useCart();
  const [removing, setRemoving] = useState(null);
  const [pulse, setPulse] = useState(null);

  const handleRemove = (id) => {
    setRemoving(id);
    setTimeout(() => removeFromCart(id), 380);
  };

  const handleQty = (id, val) => {
    setPulse(id);
    setTimeout(() => setPulse(null), 300);
    updateQty(id, val);
  };

  if (cart.length === 0) return (
    <>
      <style>{`
        @keyframes floatCart { 0%,100%{transform:translateY(0) rotate(-5deg)} 50%{transform:translateY(-18px) rotate(5deg)} }
        @keyframes fadeInUp { from{opacity:0;transform:translateY(30px)} to{opacity:1;transform:translateY(0)} }
        .empty-wrap { min-height:70vh;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;animation:fadeInUp .5s ease; }
        .empty-icon { font-size:90px;animation:floatCart 3s ease-in-out infinite;display:block;margin-bottom:20px; }
        .shop-btn { padding:14px 36px;border-radius:14px;background:linear-gradient(135deg,#2d6a4f,#1b4332);color:white;font-weight:800;font-size:15px;box-shadow:0 8px 24px rgba(45,106,79,0.35);text-decoration:none;display:inline-block;transition:all .25s; }
        .shop-btn:hover { transform:translateY(-3px);box-shadow:0 14px 32px rgba(45,106,79,0.45); }
      `}</style>
      <div className="empty-wrap">
        <span className="empty-icon">🛒</span>
        <h2 style={{fontSize:26,fontWeight:900,color:'var(--gray-800)',marginBottom:8}}>Savatcha bo'sh</h2>
        <p style={{color:'var(--gray-500)',marginBottom:32,fontSize:15}}>Hali hech narsa qo'shilmagan</p>
        <Link href="/catalog" className="shop-btn">🛍️ Xarid qilish</Link>
      </div>
    </>
  );

  return (
    <>
      <style>{`
        @keyframes fadeInUp { from{opacity:0;transform:translateY(24px)} to{opacity:1;transform:translateY(0)} }
        @keyframes slideOut { to{opacity:0;transform:translateX(60px) scale(0.92)} }
        @keyframes pricePulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.18)} }
        @keyframes qtyPop { 0%,100%{transform:scale(1)} 40%{transform:scale(1.35)} }
        @keyframes shimmer { 0%{background-position:-400px 0} 100%{background-position:400px 0} }

        .cart-page { animation:fadeInUp .45s ease; }

        .cart-item-new {
          display:flex;align-items:center;gap:16px;
          background:white;border-radius:18px;
          border:1.5px solid #e8f5ef;
          padding:16px 20px;
          box-shadow:0 2px 12px rgba(45,106,79,0.07);
          animation:fadeInUp .4s ease both;
          transition:box-shadow .25s, transform .25s, border-color .25s;
          position:relative;overflow:hidden;
        }
        .cart-item-new::before {
          content:'';position:absolute;left:0;top:0;bottom:0;width:4px;
          background:linear-gradient(180deg,#2d6a4f,#52b788);
          border-radius:4px 0 0 4px;
          opacity:0;transition:opacity .25s;
        }
        .cart-item-new:hover { box-shadow:0 8px 28px rgba(45,106,79,0.13);transform:translateY(-2px);border-color:#b7dfc9; }
        .cart-item-new:hover::before { opacity:1; }
        .cart-item-removing { animation:slideOut .38s ease forwards; }

        .item-img-wrap {
          width:72px;height:72px;border-radius:14px;
          background:linear-gradient(135deg,#f0f7f4,#d8f3e5);
          display:flex;align-items:center;justify-content:center;
          overflow:hidden;flex-shrink:0;
          border:1.5px solid #d8ede5;
        }
        .item-img-wrap img { width:100%;height:100%;object-fit:cover; }
        .item-img-wrap span { font-size:32px; }

        .qty-wrap { display:flex;align-items:center;gap:0;background:#f0f7f4;border-radius:12px;overflow:hidden;border:1.5px solid #d8ede5; }
        .qty-btn-new {
          width:36px;height:36px;border:none;background:transparent;
          cursor:pointer;font-size:18px;font-weight:700;color:#2d6a4f;
          transition:background .18s,transform .15s;display:flex;align-items:center;justify-content:center;
        }
        .qty-btn-new:hover { background:#2d6a4f;color:white; }
        .qty-btn-new:active { transform:scale(0.88); }
        .qty-num-new { min-width:36px;text-align:center;font-weight:800;font-size:15px;color:#1b4332; }
        .qty-pop { animation:qtyPop .3s ease; }

        .remove-btn {
          width:34px;height:34px;border-radius:50%;border:none;
          background:#f9fafb;cursor:pointer;font-size:15px;color:#9ca3af;
          display:flex;align-items:center;justify-content:center;
          transition:all .2s;flex-shrink:0;
        }
        .remove-btn:hover { background:#fee2e2;color:#ef4444;transform:rotate(90deg) scale(1.1); }

        .summary-card {
          background:white;border-radius:20px;
          border:1.5px solid #d8ede5;
          padding:24px;
          box-shadow:0 4px 24px rgba(45,106,79,0.09);
          position:sticky;top:100px;
        }

        .checkout-btn {
          width:100%;padding:15px;
          background:linear-gradient(135deg,#2d6a4f,#1b4332);
          color:white;border:none;border-radius:14px;
          font-family:inherit;font-weight:900;font-size:16px;
          cursor:pointer;transition:all .25s;
          box-shadow:0 6px 20px rgba(45,106,79,0.35);
          letter-spacing:0.3px;
        }
        .checkout-btn:hover { transform:translateY(-3px);box-shadow:0 12px 32px rgba(45,106,79,0.45); }
        .checkout-btn:active { transform:translateY(0) scale(0.98); }

        .price-pulse { animation:pricePulse .3s ease; }

        .summary-row { display:flex;justify-content:space-between;align-items:center;font-size:13px;margin-bottom:10px; }
        .divider { height:1.5px;background:linear-gradient(90deg,transparent,#d8ede5,transparent);margin:16px 0; }

        .badge {
          display:inline-flex;align-items:center;gap:6px;
          background:#f0fdf4;border:1px solid #bbf7d0;
          border-radius:8px;padding:5px 12px;
          font-size:12px;font-weight:700;color:#166534;margin-bottom:16px;
        }
      `}</style>

      <div className="cart-page main-wrap">
        <div style={{display:'flex',alignItems:'center',gap:12,marginBottom:28}}>
          <h1 style={{fontSize:28,fontWeight:900,color:'var(--gray-900)',margin:0}}>🛒 Savatcha</h1>
          <span style={{background:'#f0f7f4',border:'1.5px solid #d8ede5',borderRadius:10,padding:'4px 12px',fontSize:14,fontWeight:700,color:'#2d6a4f'}}>
            {cart.length} ta
          </span>
        </div>

        <div style={{display:'grid',gridTemplateColumns:'1fr 340px',gap:20}}>
          {/* Items */}
          <div style={{display:'flex',flexDirection:'column',gap:12}}>
            {cart.map((item, idx) => (
              <div
                key={item.id}
                className={`cart-item-new${removing === item.id ? ' cart-item-removing' : ''}`}
                style={{animationDelay:`${idx * 0.06}s`}}
              >
                <div className="item-img-wrap">
                  {item.image ? <img src={item.image} alt={item.name} /> : <span>⚡</span>}
                </div>

                <div style={{flex:1,minWidth:0}}>
                  <div style={{fontWeight:700,fontSize:14,color:'var(--gray-800)',marginBottom:6,whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>
                    {item.name}
                  </div>
                  <div style={{fontSize:17,fontWeight:900,color:'#2d6a4f'}}>
                    {Number(item.price).toLocaleString('uz-UZ')}
                    <span style={{fontSize:11,fontWeight:500,color:'#6b7280',marginLeft:3}}>so'm</span>
                  </div>
                </div>

                <div className="qty-wrap">
                  <button className="qty-btn-new" onClick={() => handleQty(item.id, (item.qty||1)-1)}>−</button>
                  <div className={`qty-num-new${pulse===item.id?' qty-pop':''}`}>{item.qty||1}</div>
                  <button className="qty-btn-new" onClick={() => handleQty(item.id, (item.qty||1)+1)}>+</button>
                </div>

                <div style={{minWidth:100,textAlign:'right'}}>
                  <div className={pulse===item.id?'price-pulse':''} style={{fontSize:15,fontWeight:900,color:'#1b4332'}}>
                    {(Number(item.price)*(item.qty||1)).toLocaleString('uz-UZ')}
                  </div>
                  <div style={{fontSize:11,color:'#9ca3af',fontWeight:500}}>so'm</div>
                </div>

                <button className="remove-btn" onClick={() => handleRemove(item.id)}>✕</button>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div>
            <div className="summary-card">
              <div className="badge">✅ Bepul yetkazib berish</div>
              <h3 style={{fontSize:17,fontWeight:900,marginBottom:20,color:'#111827'}}>Buyurtma jami</h3>

              <div style={{display:'flex',flexDirection:'column',gap:4,marginBottom:8}}>
                {cart.map(item => (
                  <div key={item.id} className="summary-row">
                    <span style={{color:'#6b7280',maxWidth:160,overflow:'hidden',textOverflow:'ellipsis',whiteSpace:'nowrap'}}>
                      {item.name} <span style={{color:'#9ca3af'}}>×{item.qty||1}</span>
                    </span>
                    <span style={{fontWeight:700,color:'#111827'}}>
                      {(Number(item.price)*(item.qty||1)).toLocaleString('uz-UZ')}
                    </span>
                  </div>
                ))}
              </div>

              <div className="divider"/>

              <div className="summary-row">
                <span style={{color:'#6b7280'}}>Yetkazib berish</span>
                <span style={{fontWeight:700,color:'#2d6a4f'}}>🎁 Bepul</span>
              </div>

              <div className="divider"/>

              <div style={{display:'flex',justifyContent:'space-between',alignItems:'center',marginBottom:24}}>
                <span style={{fontSize:16,fontWeight:800,color:'#111827'}}>Jami:</span>
                <span style={{fontSize:26,fontWeight:900,color:'#1b4332'}}>
                  {total.toLocaleString('uz-UZ')}
                  <span style={{fontSize:13,fontWeight:500,color:'#9ca3af',marginLeft:4}}>so'm</span>
                </span>
              </div>

              <Link href="/checkout" style={{textDecoration:'none',display:'block'}}>
                <button className="checkout-btn">Buyurtma berish →</button>
              </Link>

              <Link href="/catalog" style={{
                display:'block',textAlign:'center',marginTop:14,
                fontSize:13,color:'#9ca3af',textDecoration:'none',transition:'color .2s',
              }}
                onMouseEnter={e=>e.target.style.color='#2d6a4f'}
                onMouseLeave={e=>e.target.style.color='#9ca3af'}
              >← Xarid davom ettirish</Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
