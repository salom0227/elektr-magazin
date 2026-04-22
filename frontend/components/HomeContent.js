'use client';
import { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import Link from 'next/link';
import { useCart } from '@/context/CartContext';

const API = process.env.NEXT_PUBLIC_API_URL;

const getCatIcon = (name = '') => {
  const map = {'rozetka':'🔌','удлинитель':'🔗','adapter':'🔄','usb':'📲','smart':'📱','vilka':'🔌','kabel':'📦','switch':'🔀','triple':'🔌'};
  for (const [k,v] of Object.entries(map)) if (name.toLowerCase().includes(k)) return v;
  return '⚡';
};

const FEATURES = [
  {icon:'🚚',title:'Bepul yetkazish',sub:'500 000 so\'mdan yuqori'},
  {icon:'✅',title:'Kafolat',sub:'12 oy mahsulot kafolati'},
  {icon:'🔄',title:'Qaytarish',sub:'14 kun ichida'},
  {icon:'💬',title:'24/7 Aloqa',sub:'Doim yordam beramiz'},
];

const SLIDES = [
  {tag:'⚡ Yangi kolleksiya',accent:'#22c55e',title:'Aqlli Uy\nElektr Tizimi',desc:'Smart rozetka, USB hub, sensor kalitlar — zamonaviy hayot uchun',btn1:'Katalogni ko\'rish',btn1href:'/catalog',bg:'linear-gradient(135deg,#0a1628 0%,#1a3a1a 50%,#0d2d0d 100%)',product:{name:'Smart Rozetka Pro',price:'189 000',badge:'🔥 Bestseller',stars:5}},
  {tag:'🔌 Premium sifat',accent:'#86efac',title:'USB Rozetkalar\nHar Qayerda',desc:'Type-C, USB-A va simsiz zaryadlash — bitta qurilmada',btn1:'Xarid qilish',btn1href:'/catalog',bg:'linear-gradient(135deg,#0c1a0c 0%,#1f2d0e 50%,#162616 100%)',product:{name:'USB Hub 4-port',price:'245 000',badge:'✨ Yangi',stars:5}},
  {tag:'🏠 Biznes uchun',accent:'#4ade80',title:'Ofis va Do\'kon\nTa\'minoti',desc:'Ommaviy buyurtmalar uchun maxsus narxlar va tez yetkazib berish',btn1:'Buyurtma berish',btn1href:'/checkout',bg:'linear-gradient(135deg,#0f1f0f 0%,#1a2e0a 50%,#0a1f0a 100%)',product:{name:'Industrial Socket',price:'320 000',badge:'💼 Biznes',stars:4}},
];

function ProductBanner({products}) {
  const [cur, setCur] = useState(0);
  const [anim, setAnim] = useState(false);
  const timer = useRef(null);

  useEffect(() => {
    if (!products.length) return;
    timer.current = setInterval(() => {
      setAnim(true);
      setTimeout(() => { setCur(c => (c+1)%products.length); setAnim(false); }, 400);
    }, 3000);
    return () => clearInterval(timer.current);
  }, [products.length]);

  if (!products.length) return null;
  const p = products[cur];

  return (
    <div style={{background:'linear-gradient(135deg,#052e16 0%,#14532d 50%,#0a2a1a 100%)',borderRadius:24,overflow:'hidden',position:'relative',minHeight:300,display:'flex',alignItems:'stretch'}}>
      <div style={{position:'absolute',inset:0,opacity:.04,backgroundImage:'linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)',backgroundSize:'48px 48px'}}/>
      <div style={{flex:1,padding:'36px 40px',display:'flex',flexDirection:'column',justifyContent:'center',position:'relative',zIndex:2}}>
        <div style={{display:'inline-flex',alignItems:'center',gap:6,background:'rgba(34,197,94,0.15)',border:'1px solid rgba(34,197,94,0.3)',padding:'4px 14px',borderRadius:20,width:'fit-content',fontSize:11,fontWeight:800,color:'#86efac',letterSpacing:1,textTransform:'uppercase',marginBottom:16}}>🔥 Tavsiya etiladi</div>
        <div style={{fontSize:28,fontWeight:900,color:'white',lineHeight:1.2,marginBottom:10,minHeight:70,opacity:anim?0:1,transform:anim?'translateY(12px)':'translateY(0)',transition:'all .4s cubic-bezier(.23,1,.32,1)'}}>{p.name}</div>
        {p.category_name&&<div style={{fontSize:12,fontWeight:700,color:'rgba(134,239,172,0.7)',textTransform:'uppercase',letterSpacing:1,marginBottom:10,opacity:anim?0:1,transition:'opacity .4s'}}>{p.category_name}</div>}
        <div style={{fontSize:34,fontWeight:900,color:'#4ade80',marginBottom:20,opacity:anim?0:1,transform:anim?'translateX(-8px)':'translateX(0)',transition:'all .4s .1s cubic-bezier(.23,1,.32,1)'}}>{Number(p.price).toLocaleString('uz-UZ')}<span style={{fontSize:14,fontWeight:600,color:'rgba(74,222,128,0.7)',marginLeft:6}}>so'm</span></div>
        <div style={{display:'flex',gap:3,marginBottom:20}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:16,color:'#fbbf24'}}>★</span>)}</div>
        <Link href={p.slug?`/product/${p.slug}`:'/catalog'} style={{textDecoration:'none',width:'fit-content'}}>
          <button style={{padding:'11px 26px',borderRadius:12,border:'none',background:'linear-gradient(135deg,#16a34a,#15803d)',color:'white',fontFamily:'inherit',fontWeight:800,fontSize:14,cursor:'pointer',boxShadow:'0 6px 20px rgba(22,163,74,0.4)'}}>Ko'rish →</button>
        </Link>
        <div style={{display:'flex',gap:6,marginTop:20}}>
          {products.map((_,i)=><button key={i} onClick={()=>{clearInterval(timer.current);setAnim(true);setTimeout(()=>{setCur(i);setAnim(false)},400);}} style={{width:i===cur?24:8,height:8,borderRadius:4,background:i===cur?'#22c55e':'rgba(255,255,255,0.2)',border:'none',cursor:'pointer',padding:0,transition:'all .35s'}}/>)}
        </div>
      </div>
      <div style={{width:280,position:'relative',display:'flex',alignItems:'center',justifyContent:'center',padding:'32px 32px 32px 0',flexShrink:0}}>
        <div style={{position:'absolute',width:200,height:200,borderRadius:'50%',background:'radial-gradient(circle,rgba(34,197,94,0.2),transparent 70%)',top:'50%',left:'50%',transform:'translate(-50%,-50%)'}}/>
        <div style={{width:220,height:220,borderRadius:22,background:'rgba(255,255,255,0.07)',border:'1px solid rgba(255,255,255,0.12)',display:'flex',alignItems:'center',justifyContent:'center',overflow:'hidden',position:'relative',zIndex:2,opacity:anim?0:1,transform:anim?'scale(0.88) rotate(4deg)':'scale(1) rotate(0deg)',transition:'all .5s cubic-bezier(.23,1,.32,1)'}}>
          {p.image?<img src={p.image} alt={p.name} style={{width:'100%',height:'100%',objectFit:'contain',padding:16}}/>:<span style={{fontSize:72,opacity:.3}}>⚡</span>}
        </div>
        <div style={{position:'absolute',top:20,right:12,zIndex:3,background:'linear-gradient(135deg,#dc2626,#b91c1c)',color:'white',padding:'5px 12px',borderRadius:20,fontSize:11,fontWeight:900,boxShadow:'0 4px 14px rgba(220,38,38,0.4)',animation:'float 3s ease-in-out infinite'}}>🔥 HOT</div>
      </div>
    </div>
  );
}

export default function HomeContent() {
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [added, setAdded] = useState({});
  const [current, setCurrent] = useState(0);
  const [progress, setProgress] = useState(0);
  const { addToCart } = useCart();
  const timerRef = useRef(null);
  const progRef = useRef(null);

  useEffect(() => {
    axios.get(`${API}/api/categories`).then(r=>setCategories(r.data)).catch(()=>{});
    axios.get(`${API}/api/products`).then(r=>setProducts(r.data)).catch(()=>{});
  }, []);

  const startProgress = useCallback(() => {
    clearInterval(progRef.current);
    setProgress(0);
    progRef.current = setInterval(()=>setProgress(p=>{if(p>=100){clearInterval(progRef.current);return 100;}return p+2;}),100);
  },[]);

  useEffect(()=>{
    startProgress();
    timerRef.current = setInterval(()=>{setCurrent(c=>(c+1)%SLIDES.length);startProgress();},5500);
    return ()=>{clearInterval(timerRef.current);clearInterval(progRef.current);};
  },[]);

  const [cartPopup, setCartPopup] = useState(null);
  const handleAdd=(p)=>{
    addToCart({...p,qty:1});
    setCartPopup(p);
    setTimeout(()=>setCartPopup(null),3000);
    setAdded(a=>({...a,[p.id]:true}));
    setTimeout(()=>setAdded(a=>({...a,[p.id]:false})),2000);
  };

  const [showInfo, setShowInfo] = useState(false);
  const sl = SLIDES[current];
  // Oxirgi 3 ta mahsulot
  const newProducts = [...products].slice(-3);
  // Barcha 8 ta
  const allProducts = products.slice(0,8);

  const PROMO_STYLE = {
    card: {
      borderRadius:20,overflow:'hidden',position:'relative',
      minHeight:180,cursor:'pointer',
      transition:'transform .3s,box-shadow .3s',
      background:'linear-gradient(135deg,#052e16,#14532d,#0a2a1a)',
    }
  };

  return (
    <div className="page-enter">
      {/* HERO SLIDER */}
      <div className="hero-slider" style={{position:'relative'}}>
        {SLIDES.map((s,i)=>(
          <div key={i} className={`slide slide-height${i===current?' active':''}`} style={{display:i===current?'flex':'none'}}>
            <div className="slide-bg" style={{background:s.bg}}/>
            <div style={{position:'absolute',inset:0,opacity:.05,backgroundImage:`linear-gradient(${s.accent} 1px,transparent 1px),linear-gradient(90deg,${s.accent} 1px,transparent 1px)`,backgroundSize:'60px 60px'}}/>
            <div className="slide-overlay"/>
            <div className="container" style={{position:'relative',zIndex:2,width:'100%'}}>
              <div style={{display:'flex',alignItems:'center',width:'100%'}}>
                <div className="slide-content" style={{maxWidth:560}}>
                  <div className="slide-tag" style={{background:s.accent,color:'#000',fontWeight:800}}>{s.tag}</div>
                  <h1 className="slide-title">{s.title.split('\n').map((l,li)=><span key={li}>{l}{li<s.title.split('\n').length-1&&<br/>}</span>)}</h1>
                  <p className="slide-desc">{s.desc}</p>
                  <div className="slide-actions">
                    <Link href={s.btn1href}><button className="slide-btn slide-btn-primary" style={{background:s.accent,color:'#000'}}>{s.btn1} →</button></Link>
                    <button className="slide-btn slide-btn-ghost" onClick={()=>setShowInfo(true)}>Batafsil</button>
                  </div>
                  <div style={{display:'flex',gap:28,marginTop:32}}>
                    {[['500+','Mahsulot'],['1000+','Mijoz'],['24/7','Xizmat']].map(([n,l])=>(
                      <div key={l}><div style={{fontSize:22,fontWeight:800,color:s.accent}}>{n}</div><div style={{fontSize:11,color:'rgba(255,255,255,.55)',marginTop:1}}>{l}</div></div>
                    ))}
                  </div>
                </div>
                <div className="slide-3d-el">
                  <div className="slide-3d-card" style={{borderColor:`${s.accent}33`}}>
                    <div style={{width:56,height:56,borderRadius:16,background:`${s.accent}22`,display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,marginBottom:12,border:`1px solid ${s.accent}44`}}>⚡</div>
                    <div style={{display:'inline-block',padding:'2px 10px',borderRadius:20,background:`${s.accent}22`,color:s.accent,fontSize:11,fontWeight:700,marginBottom:8}}>{s.product.badge}</div>
                    <div style={{color:'white',fontWeight:700,fontSize:14,marginBottom:4}}>{s.product.name}</div>
                    <div style={{display:'flex',gap:2}}>{[1,2,3,4,5].map(x=><span key={x} style={{fontSize:12,color:x<=s.product.stars?'#f59e0b':'#374151'}}>★</span>)}</div>
                    <div style={{color:s.accent,fontWeight:800,fontSize:18,marginTop:8}}>{s.product.price}<span style={{fontSize:12,opacity:.7,marginLeft:4}}>so'm</span></div>
                    <div style={{marginTop:12,padding:'8px 0',background:s.accent,borderRadius:10,color:'#000',fontSize:12,fontWeight:800,textAlign:'center'}}>Savatchaga →</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ))}
        <button className="s-arrow prev" onClick={()=>{clearInterval(timerRef.current);setCurrent(c=>(c-1+SLIDES.length)%SLIDES.length);startProgress();}}>‹</button>
        <button className="s-arrow next" onClick={()=>{clearInterval(timerRef.current);setCurrent(c=>(c+1)%SLIDES.length);startProgress();}}>›</button>
        <div className="slider-dots">{SLIDES.map((_,i)=><button key={i} className={`s-dot${i===current?' active':''}`} onClick={()=>{clearInterval(timerRef.current);setCurrent(i);startProgress();}}/>)}</div>
        <div className="slide-progress" style={{width:`${progress}%`}}/>
      </div>

      {/* FEATURES */}
      <div className="features-strip">
        <div className="features-inner stagger">
          {FEATURES.map(f=>(
            <div key={f.title} className="feat-card anim-fade-up">
              <div className="feat-icon">{f.icon}</div>
              <div><div className="feat-title">{f.title}</div><div className="feat-sub">{f.sub}</div></div>
            </div>
          ))}
        </div>
      </div>

      <div className="main-wrap">
        {/* REKLAMA BANNER */}
        {products.length>0&&(
          <div className="section">
            <div className="sec-head">
              <div className="sec-title"><div className="sec-title-bar"/>Mahsulot Reklama</div>
            </div>
            <ProductBanner products={allProducts}/>
          </div>
        )}

        {/* PROMO — hammasi bir xil stil */}
        <div className="section">
          <div style={{display:'grid',gridTemplateColumns:'2fr 1fr 1fr',gap:16}}>
            {[
              {tag:'🔥 Aksiya',title:'Smart Rozetkalar\n-30% chegirma',sub:'Bu hafta cheklangan miqdorda',emoji:'⚡',href:'/catalog'},
              {tag:'✨ Yangi',title:'USB-C Hub\nKeldi!',sub:'7-portli premium',emoji:'🔌',href:'/catalog'},
              {tag:'💼 Biznes',title:'Ommaviy\nbuyurtma',sub:'Maxsus narx',emoji:'📦',href:'/catalog'},
            ].map((pr,i)=>(
              <Link key={i} href={pr.href} style={{textDecoration:'none'}}>
                <div style={{
                  ...PROMO_STYLE.card,
                  minHeight: i===0?200:180,
                }}
                  onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-4px)';e.currentTarget.style.boxShadow='0 16px 48px rgba(0,0,0,0.3)'}}
                  onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='none'}}
                >
                  {/* mesh */}
                  <div style={{position:'absolute',inset:0,opacity:.05,backgroundImage:'linear-gradient(#22c55e 1px,transparent 1px),linear-gradient(90deg,#22c55e 1px,transparent 1px)',backgroundSize:'32px 32px'}}/>
                  {/* emoji bg */}
                  <div style={{position:'absolute',right:16,bottom:12,fontSize: i===0?80:60,opacity:.12,animation:'float 4s ease-in-out infinite',animationDelay:`${i*0.5}s`}}>{pr.emoji}</div>
                  <div style={{position:'absolute',inset:0,background:'linear-gradient(90deg,rgba(0,0,0,.25),transparent)'}}/>
                  <div style={{position:'relative',zIndex:2,padding:24}}>
                    <span style={{fontSize:10,fontWeight:800,letterSpacing:1,textTransform:'uppercase',padding:'3px 10px',borderRadius:20,background:'rgba(255,255,255,0.15)',color:'white',backdropFilter:'blur(4px)',display:'inline-block',marginBottom:10}}>{pr.tag}</span>
                    <div style={{fontSize:i===0?24:18,fontWeight:900,color:'white',lineHeight:1.2,marginBottom:6}}>
                      {pr.title.split('\n').map((l,li)=><span key={li}>{l}{li<pr.title.split('\n').length-1&&<br/>}</span>)}
                    </div>
                    <div style={{fontSize:13,color:'rgba(255,255,255,0.7)'}}>{pr.sub}</div>
                    {i===0&&<button style={{marginTop:16,padding:'8px 18px',borderRadius:10,background:'#22c55e',border:'none',color:'white',fontFamily:'inherit',fontWeight:700,fontSize:13,cursor:'pointer'}}>Xarid qilish →</button>}
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* KATEGORIYALAR */}
        <div className="section">
          <div className="sec-head">
            <div className="sec-title"><div className="sec-title-bar"/>Kategoriyalar</div>
            <Link href="/catalog" className="sec-link">Barchasi →</Link>
          </div>
          <div className="cat-grid stagger">
            {categories.map(c=>(
              <Link key={c.id} href={`/catalog?category=${c.id}`} style={{textDecoration:'none'}}>
                <div className="cat-card anim-fade-up">
                  <div className="cat-icon-wrap"><span>{getCatIcon(c.name)}</span></div>
                  <div className="cat-name">{c.name}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* OXIRGI QOSHILGAN 3 TA */}
        <div className="section">
          <div className="sec-head">
            <div className="sec-title"><div className="sec-title-bar"/>Yangi qo'shilganlar</div>
            <Link href="/catalog" className="sec-link">Barchasi →</Link>
          </div>
          <div style={{display:'grid',gridTemplateColumns:'repeat(3,1fr)',gap:16}} className="stagger">
            {newProducts.map(p=>(
              <div key={p.id} className="product-card card-3d anim-fade-up">
                <div className="card-shine"/>
                <span className="p-badge hot">🆕 Yangi</span>
                <button className="p-wish">♡</button>
                <Link href={`/product/${p.slug}`} style={{textDecoration:'none'}}>
                  <div className="p-img">{p.image?<img src={p.image} alt={p.name}/>:<span style={{fontSize:56}}>⚡</span>}</div>
                </Link>
                <div className="p-body">
                  <span className="p-cat">{p.category_name}</span>
                  <Link href={`/product/${p.slug}`} style={{textDecoration:'none'}}><div className="p-name">{p.name}</div></Link>
                  {p.brand&&<div style={{fontSize:11,color:'#9ca3af'}}>{p.brand}</div>}
                  <div style={{display:'flex',gap:2,margin:'4px 0'}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:11,color:'#f59e0b'}}>★</span>)}</div>
                  <div className="p-price">{Number(p.price).toLocaleString('uz-UZ')} <span>so'm</span></div>
                </div>
                <button className={`p-btn${added[p.id]?' added':''}`} onClick={()=>handleAdd(p)}>
                  {added[p.id]?'✅ Qo\'shildi':'🛒 Savatchaga'}
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* BARCHA MAHSULOTLAR */}
        <div className="section">
          <div className="sec-head">
            <div className="sec-title"><div className="sec-title-bar"/>Barcha mahsulotlar</div>
            <Link href="/catalog" className="sec-link">Katalogga →</Link>
          </div>
          <div className="product-grid stagger">
            {allProducts.map(p=>(
              <div key={p.id} className="product-card card-3d anim-fade-up">
                <div className="card-shine"/>
                <span className="p-badge">Yangi</span>
                <button className="p-wish">♡</button>
                <Link href={`/product/${p.slug}`} style={{textDecoration:'none'}}>
                  <div className="p-img">{p.image?<img src={p.image} alt={p.name}/>:<span style={{fontSize:56}}>⚡</span>}</div>
                </Link>
                <div className="p-body">
                  <span className="p-cat">{p.category_name}</span>
                  <Link href={`/product/${p.slug}`} style={{textDecoration:'none'}}><div className="p-name">{p.name}</div></Link>
                  {p.brand&&<div style={{fontSize:11,color:'#9ca3af'}}>{p.brand}</div>}
                  <div style={{display:'flex',gap:2,margin:'4px 0'}}>{[1,2,3,4,5].map(s=><span key={s} style={{fontSize:11,color:'#f59e0b'}}>★</span>)}</div>
                  <div className="p-price">{Number(p.price).toLocaleString('uz-UZ')} <span>so'm</span></div>
                </div>
                <button className={`p-btn${added[p.id]?' added':''}`} onClick={()=>handleAdd(p)}>
                  {added[p.id]?'✅ Qo\'shildi':'🛒 Savatchaga'}
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* STATS */}
      <div className="stats-section">
        <div className="stats-inner">
          {[['📦','500+','Mahsulot'],['😊','1 200+','Mijozlar'],['💬','24/7','Aloqa'],['🏆','5 yil','Tajriba']].map(([ic,n,l])=>(
            <div key={l} className="stat-card anim-fade-up">
              <div style={{fontSize:32,marginBottom:6}}>{ic}</div>
              <div className="stat-num">{n}</div>
              <div className="stat-label">{l}</div>
            </div>
          ))}
        </div>
      </div>

      {/* FOOTER */}
      <footer className="footer">
        <div className="footer-grid">
          <div>
            <div className="footer-logo">⚡ Elektr<em>Baza</em></div>
            <p className="footer-desc">Sifatli elektr aksessuarlar — rozetka, adapter, kabel va boshqa mahsulotlar. Samarqand bo'ylab tez yetkazib berish.</p>
            <div className="footer-socials">{['📘','📸','💬','▶️'].map((s,i)=><a key={i} href="#" className="footer-social">{s}</a>)}</div>
          </div>
          <div>
            <div className="footer-col-title">Sahifalar</div>
            <div className="footer-links">{[['/', 'Bosh sahifa'],['/catalog','Katalog'],['/cart','Savatcha']].map(([h,l])=><Link key={h} href={h} className="footer-link">{l}</Link>)}</div>
          </div>
          <div>
            <div className="footer-col-title">Kategoriyalar</div>
            <div className="footer-links">{['Rozetka','Adapter','USB Hub','Smart','Kabel'].map(c=><a key={c} href="#" className="footer-link">{c}</a>)}</div>
          </div>
          <div>
            <div className="footer-col-title">Aloqa</div>
            <div className="footer-links">
              <span className="footer-link">📍 Samarqand shahar</span>
              <span className="footer-link">📞 +998 90 123 45 67</span>
              <span className="footer-link">📧 info@elektrbaza.uz</span>
              <span className="footer-link">🕐 9:00 — 20:00</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <span>© 2025 ElektrBaza. Barcha huquqlar himoyalangan.</span>
          <span>Next.js · Node.js · PostgreSQL</span>
        </div>
      </footer>
      <style>{`@keyframes slideInRight{from{opacity:0;transform:translateX(80px)}to{opacity:1;transform:translateX(0)}}@keyframes shrinkBar{from{width:100%}to{width:0%}}`}</style>
      {cartPopup && (
        <div style={{position:'fixed',bottom:32,right:32,zIndex:9999,background:'white',borderRadius:20,border:'1.5px solid #d8ede5',boxShadow:'0 20px 60px rgba(45,106,79,0.25)',padding:'16px 20px',display:'flex',alignItems:'center',gap:14,minWidth:300,maxWidth:360,animation:'slideInRight .35s cubic-bezier(.23,1,.32,1)'}}>
          <div style={{width:56,height:56,borderRadius:14,background:'linear-gradient(135deg,#f0f7f4,#d8f3e5)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:28,flexShrink:0,border:'1.5px solid #d8ede5',overflow:'hidden'}}>
            {cartPopup.image?<img src={cartPopup.image} alt='' style={{width:'100%',height:'100%',objectFit:'cover'}}/>:<span>⚡</span>}
          </div>
          <div style={{flex:1,minWidth:0}}>
            <div style={{fontSize:11,fontWeight:700,color:'#2d6a4f',marginBottom:3,textTransform:'uppercase',letterSpacing:0.5}}>✅ Savatchaga qoshildi</div>
            <div style={{fontSize:14,fontWeight:800,color:'#111827',whiteSpace:'nowrap',overflow:'hidden',textOverflow:'ellipsis'}}>{cartPopup.name}</div>
            <div style={{fontSize:13,fontWeight:700,color:'#1b4332',marginTop:2}}>{Number(cartPopup.price).toLocaleString('uz-UZ')} som</div>
            <div style={{marginTop:8,height:3,borderRadius:2,background:'#e5e7eb',overflow:'hidden'}}>
              <div style={{height:'100%',background:'linear-gradient(90deg,#2d6a4f,#52b788)',borderRadius:2,animation:'shrinkBar 3s linear forwards'}}/>
            </div>
          </div>
          <div style={{display:'flex',flexDirection:'column',gap:6,flexShrink:0}}>
            <a href='/cart' style={{padding:'7px 14px',borderRadius:10,background:'linear-gradient(135deg,#2d6a4f,#1b4332)',color:'white',fontSize:12,fontWeight:800,textDecoration:'none',textAlign:'center'}}>Savat →</a>
            <button onClick={()=>setCartPopup(null)} style={{padding:'6px 14px',borderRadius:10,background:'#f3f4f6',border:'none',color:'#6b7280',fontSize:12,fontWeight:700,cursor:'pointer'}}>Yopish</button>
          </div>
        </div>
      )}
    </div>
  );
}
