'use client';
import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import axios from 'axios';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const API = process.env.NEXT_PUBLIC_API_URL;

const getCatIcon = (name = '') => {
  const map = { 'rozetka':'🔌','удлинитель':'🔗','adapter':'🔄','usb':'📲','smart':'📱','vilka':'🔌','kabel':'📦','switch':'🔀','triple':'🔌' };
  for (const [k,v] of Object.entries(map)) if (name.toLowerCase().includes(k)) return v;
  return '⚡';
};

function CatalogContent() {
  const searchParams = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [search, setSearch] = useState(searchParams.get('search') || '');
  const [activeCategory, setActiveCategory] = useState(searchParams.get('category') || '');
  const [added, setAdded] = useState({});
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState('');
  const { addToCart } = useCart();

  useEffect(() => {
    axios.get(`${API}/api/categories`).then(r => setCategories(r.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.append('search', search);
    if (activeCategory) params.append('category_id', activeCategory);
    axios.get(`${API}/api/products?${params}`)
      .then(r => {
        let data = r.data;
        if (sortBy === 'price_asc') data = [...data].sort((a,b) => a.price - b.price);
        if (sortBy === 'price_desc') data = [...data].sort((a,b) => b.price - a.price);
        setProducts(data);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [search, activeCategory, sortBy]);

  const handleAdd = (p) => {
    addToCart({...p, qty:1});
    setAdded(a => ({...a, [p.id]:true}));
    setTimeout(() => setAdded(a => ({...a, [p.id]:false})), 2000);
  };

  return (
    <div>
      {/* ── HEADER — to'q yashil-qora ── */}
      <div style={{
        background: 'linear-gradient(135deg, #0a1f0a 0%, #14532d 60%, #0f2d1a 100%)',
        padding: '40px 0',
      }}>
        <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', marginBottom: 8 }}>
            <Link href="/" style={{ color: 'rgba(255,255,255,0.5)', textDecoration:'none' }}>Bosh sahifa</Link>
            {' → '}
            <span style={{ color: 'white' }}>Katalog</span>
          </div>
          <h1 style={{ color: 'white', fontSize: 36, fontWeight: 900, marginBottom: 6 }}>Katalog</h1>
          <p style={{ color: 'rgba(255,255,255,0.6)', fontSize: 15, marginBottom: 20 }}>
            {products.length} ta mahsulot mavjud
          </p>

          <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
            {/* Search */}
            <form onSubmit={e => e.preventDefault()} style={{
              flex: 1, maxWidth: 460, display: 'flex',
              background: 'rgba(255,255,255,0.12)',
              border: '1.5px solid rgba(255,255,255,0.25)',
              borderRadius: 14, overflow: 'hidden',
              backdropFilter: 'blur(8px)',
            }}>
              <input
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder="Mahsulot qidirish..."
                style={{
                  flex: 1, padding: '12px 18px',
                  background: 'transparent', border: 'none', outline: 'none',
                  color: 'white', fontFamily: 'inherit', fontSize: 15,
                }}
              />
              <button type="submit" style={{
                padding: '12px 20px', background: 'rgba(255,255,255,0.15)',
                border: 'none', cursor: 'pointer', color: 'white',
                fontSize: 18, borderLeft: '1px solid rgba(255,255,255,0.15)',
                transition: 'background .2s',
              }}>🔍</button>
            </form>

            {/* Sort */}
            <select value={sortBy} onChange={e => setSortBy(e.target.value)} style={{
              padding: '11px 16px', borderRadius: 12,
              border: '1.5px solid rgba(255,255,255,0.25)',
              background: 'rgba(255,255,255,0.12)',
              color: 'white', fontFamily: 'inherit',
              fontSize: 13, fontWeight: 600, outline: 'none',
              cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}>
              <option value="" style={{color:'#111'}}>Saralash</option>
              <option value="price_asc" style={{color:'#111'}}>Narx: arzon</option>
              <option value="price_desc" style={{color:'#111'}}>Narx: qimmat</option>
            </select>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1280, margin: '0 auto', padding: '0 24px' }}>
        {/* Filter chips */}
        <div style={{ display:'flex', flexWrap:'wrap', gap:8, padding:'24px 0' }}>
          <button
            onClick={() => setActiveCategory('')}
            style={{
              padding: '7px 18px', borderRadius: 24,
              fontSize: 13, fontWeight: 700, cursor: 'pointer',
              border: '1.5px solid',
              borderColor: !activeCategory ? '#16a34a' : '#e5e7eb',
              background: !activeCategory ? '#16a34a' : 'white',
              color: !activeCategory ? 'white' : '#4b5563',
              boxShadow: !activeCategory ? '0 4px 12px rgba(22,163,74,0.25)' : 'none',
              transition: 'all .2s',
            }}>Hammasi</button>
          {categories.map(c => (
            <button key={c.id}
              onClick={() => setActiveCategory(activeCategory === String(c.id) ? '' : String(c.id))}
              style={{
                padding: '7px 18px', borderRadius: 24,
                fontSize: 13, fontWeight: 700, cursor: 'pointer',
                border: '1.5px solid',
                borderColor: activeCategory === String(c.id) ? '#16a34a' : '#e5e7eb',
                background: activeCategory === String(c.id) ? '#16a34a' : 'white',
                color: activeCategory === String(c.id) ? 'white' : '#4b5563',
                boxShadow: activeCategory === String(c.id) ? '0 4px 12px rgba(22,163,74,0.25)' : 'none',
                transition: 'all .2s',
              }}>
              {getCatIcon(c.name)} {c.name}
            </button>
          ))}
        </div>

        {/* Grid */}
        {loading ? (
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, paddingBottom:40 }}>
            {Array.from({length:8}).map((_,i) => (
              <div key={i} style={{ borderRadius:20, overflow:'hidden' }}>
                <div style={{
                  height:200, borderRadius:12,
                  background:'linear-gradient(90deg,#d1fae5 25%,#ecfdf5 50%,#d1fae5 75%)',
                  backgroundSize:'200% 100%',
                  animation:'shimmer 1.4s infinite',
                }}/>
                <div style={{padding:14,background:'white',marginTop:4,borderRadius:12}}>
                  <div style={{height:14,width:'60%',marginBottom:8,borderRadius:6,background:'#f3f4f6'}}/>
                  <div style={{height:20,width:'40%',borderRadius:6,background:'#f3f4f6'}}/>
                </div>
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div style={{ textAlign:'center', padding:'80px 20px', color:'#9ca3af' }}>
            <div style={{ fontSize:64, marginBottom:16, opacity:.5 }}>🔍</div>
            <div style={{ fontSize:18, fontWeight:700, color:'#6b7280' }}>Mahsulot topilmadi</div>
            <div style={{ fontSize:13, marginTop:8 }}>Boshqa so'z bilan qidiring</div>
            <button onClick={() => { setSearch(''); setActiveCategory(''); }}
              style={{
                marginTop:20, padding:'10px 24px', borderRadius:12,
                background:'#16a34a', color:'white', border:'none',
                fontFamily:'inherit', fontWeight:700, fontSize:14, cursor:'pointer',
              }}>Filterlarni tozalash</button>
          </div>
        ) : (
          <div style={{
            display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, paddingBottom:48
          }} className="stagger">
            {products.map(p => (
              <div key={p.id} className="product-card card-3d anim-fade-up">
                <div className="card-shine"/>
                <span className="p-badge">Yangi</span>
                <button className="p-wish">♡</button>
                <Link href={`/product/${p.slug}`} style={{textDecoration:'none'}}>
                  <div className="p-img">
                    {p.image ? <img src={p.image} alt={p.name}/> : <span style={{fontSize:56}}>⚡</span>}
                  </div>
                </Link>
                <div className="p-body">
                  <span className="p-cat">{p.category_name}</span>
                  <Link href={`/product/${p.slug}`} style={{textDecoration:'none'}}>
                    <div className="p-name">{p.name}</div>
                  </Link>
                  {p.brand && <div style={{fontSize:11,color:'#9ca3af'}}>{p.brand}</div>}
                  <div style={{display:'flex',gap:2,margin:'4px 0'}}>
                    {[1,2,3,4,5].map(s=><span key={s} style={{fontSize:11,color:'#f59e0b'}}>★</span>)}
                  </div>
                  <div className="p-price">
                    {Number(p.price).toLocaleString('uz-UZ')} <span>so'm</span>
                  </div>
                </div>
                <button className={`p-btn${added[p.id]?' added':''}`} onClick={()=>handleAdd(p)}>
                  {added[p.id] ? '✅ Qo\'shildi' : '🛒 Savatchaga'}
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default function CatalogPage() {
  return (
    <Suspense fallback={
      <div style={{display:'flex',justifyContent:'center',padding:80,color:'#9ca3af',flexDirection:'column',alignItems:'center',gap:12}}>
        <div style={{fontSize:40}}>⚡</div>
        <div>Yuklanmoqda...</div>
      </div>
    }>
      <CatalogContent/>
    </Suspense>
  );
}
