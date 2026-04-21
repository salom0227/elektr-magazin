'use client';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useCart } from '@/context/CartContext';
import { useState, useEffect } from 'react';

export default function Navbar() {
  const { cart } = useCart();
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [search, setSearch] = useState('');
  const [dark, setDark] = useState(false);
  const count = cart.reduce((s, i) => s + (i.qty || 1), 0);

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    if (saved === 'dark') {
      setDark(true);
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }, []);

  const toggleDark = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.setAttribute('data-theme', next ? 'dark' : 'light');
    localStorage.setItem('theme', next ? 'dark' : 'light');
  };

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 10);
    window.addEventListener('scroll', fn);
    return () => window.removeEventListener('scroll', fn);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    if (search.trim()) window.location.href = `/catalog?search=${encodeURIComponent(search.trim())}`;
  };

  const bg = dark ? (scrolled ? 'rgba(17,24,39,0.98)' : '#111827') : (scrolled ? 'rgba(255,255,255,0.98)' : '#ffffff');
  const borderColor = dark ? '#1f3a2e' : '#d8ede5';
  const textMain = dark ? '#f9fafb' : '#111827';
  const textSub = dark ? '#9ca3af' : '#6b7280';
  const textNav = dark ? '#d1d5db' : '#4b5563';
  const searchBg = dark ? '#1f2937' : '#f0f7f4';
  const searchBorder = dark ? '#374151' : '#d8ede5';
  const inputColor = dark ? '#f3f4f6' : '#1f2937';
  const activeBg = dark ? '#1a3a2a' : '#f0f7f4';
  const activeColor = dark ? '#4ade80' : '#2d6a4f';

  return (
    <>
      <div style={{background:'#1b4332',padding:'7px 0',overflow:'hidden'}}>
        <div style={{display:'flex',width:'max-content',animation:'ticker 30s linear infinite'}}>
          {[...Array(2)].map((_,ri)=>['⚡ Bepul yetkazib berish 500 000 soʻmdan yuqori','🎁 Yangi mijozlarga 10% chegirma','🔒 12 oy kafolat','📞 24/7 qoʻllab-quvvatlash','🏷️ Haftaning taklifi: -20%'].map((t,i)=>(
            <span key={`${ri}-${i}`} style={{padding:'0 40px',color:'white',fontSize:12,fontWeight:600,whiteSpace:'nowrap',opacity:.85}}>
              {t} <span style={{opacity:.4}}>•</span>
            </span>
          )))}
        </div>
      </div>

      <nav style={{
        position:'sticky',top:0,zIndex:100,
        background:bg,
        backdropFilter:'blur(20px)',
        borderBottom:`1.5px solid ${borderColor}`,
        boxShadow:scrolled?'0 2px 20px rgba(45,106,79,0.1)':'none',
        transition:'all .3s',
      }}>
        <div style={{maxWidth:1280,margin:'0 auto',padding:'0 24px',height:70,display:'flex',alignItems:'center',gap:16}}>

          <Link href="/" style={{display:'flex',alignItems:'center',gap:12,textDecoration:'none',flexShrink:0}}>
            <div style={{width:44,height:44,borderRadius:12,background:'linear-gradient(135deg,#2d6a4f,#1b4332)',display:'flex',alignItems:'center',justifyContent:'center',fontSize:22,boxShadow:'0 4px 14px rgba(45,106,79,0.3)'}}>💡</div>
            <div style={{lineHeight:1.1}}>
              <div style={{fontSize:18,fontWeight:900,color:textMain,letterSpacing:'-0.3px'}}>
                LED<span style={{color:'#c9a84c'}}>_optom</span>
              </div>
              <div style={{fontSize:10,fontWeight:600,color:textSub,letterSpacing:'0.8px',textTransform:'uppercase'}}>
                Premium elektr do'koni
              </div>
            </div>
          </Link>

          <div style={{display:'flex',gap:2}}>
            {[['/', 'Bosh sahifa'],['/catalog','Katalog']].map(([href,label])=>(
              <Link key={href} href={href} style={{
                padding:'7px 14px',borderRadius:10,
                fontSize:14,fontWeight:600,textDecoration:'none',
                color:pathname===href?activeColor:textNav,
                background:pathname===href?activeBg:'transparent',
                transition:'all .2s',
              }}>{label}</Link>
            ))}
          </div>

          <form onSubmit={handleSearch} style={{
            flex:1,maxWidth:480,display:'flex',
            border:`1.5px solid ${searchBorder}`,borderRadius:12,overflow:'hidden',
            background:searchBg,transition:'all .2s',
          }}>
            <input value={search} onChange={e=>setSearch(e.target.value)}
              placeholder="Mahsulot qidirish..."
              style={{flex:1,padding:'10px 16px',border:'none',outline:'none',background:'transparent',fontFamily:'inherit',fontSize:14,color:inputColor}}
            />
            <button type="submit" style={{padding:'10px 18px',background:'#2d6a4f',border:'none',cursor:'pointer',fontSize:15,color:'white',transition:'background .2s'}}
              onMouseEnter={e=>e.target.style.background='#1b4332'}
              onMouseLeave={e=>e.target.style.background='#2d6a4f'}
            >🔍</button>
          </form>

          <button onClick={toggleDark} title={dark?'Kunduzgi rejim':'Tungi rejim'} style={{
            flexShrink:0,width:46,height:46,borderRadius:12,
            border:`1.5px solid ${searchBorder}`,
            background:searchBg,cursor:'pointer',fontSize:20,
            display:'flex',alignItems:'center',justifyContent:'center',
            transition:'all .2s',
          }}>
            {dark ? '☀️' : '🌙'}
          </button>

          <div style={{marginLeft:'auto',flexShrink:0}}>
            <Link href="/cart" style={{textDecoration:'none'}}>
              <div style={{
                display:'flex',alignItems:'center',gap:10,
                padding:'0 20px',height:46,
                background:'linear-gradient(135deg,#2d6a4f,#1b4332)',
                borderRadius:14,cursor:'pointer',position:'relative',
                boxShadow:'0 6px 20px rgba(45,106,79,0.35)',transition:'all .2s',
              }}
                onMouseEnter={e=>{e.currentTarget.style.transform='translateY(-2px)';e.currentTarget.style.boxShadow='0 10px 28px rgba(45,106,79,0.45)'}}
                onMouseLeave={e=>{e.currentTarget.style.transform='translateY(0)';e.currentTarget.style.boxShadow='0 6px 20px rgba(45,106,79,0.35)'}}
              >
                <span style={{fontSize:20}}>🛒</span>
                <div>
                  <div style={{fontSize:10,color:'rgba(255,255,255,0.7)',fontWeight:600,lineHeight:1}}>Savatcha</div>
                  <div style={{fontSize:14,color:'white',fontWeight:900,lineHeight:1,marginTop:2}}>
                    {count>0?`${count} ta`:"Bo'sh"}
                  </div>
                </div>
                {count>0&&(
                  <div style={{position:'absolute',top:-8,right:-8,width:22,height:22,borderRadius:'50%',background:'#ef4444',color:'white',fontSize:11,fontWeight:900,display:'flex',alignItems:'center',justifyContent:'center',border:'2.5px solid white'}}>{count}</div>
                )}
              </div>
            </Link>
          </div>

        </div>
      </nav>
    </>
  );
}
