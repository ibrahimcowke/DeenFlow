import { motion } from 'framer-motion';
import { useState } from 'react';
import { Heart, Search } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import { DUA_COLLECTIONS } from '../../utils/islamicData';
import './Dua.css';

const CATS = ['All','Morning','Evening','Sleep','Meals','Travel','Anxiety','Health','Forgiveness','Protection'];

export default function Dua() {
  const [active, setActive] = useState('All');
  const [favs, setFavs] = useState([]);
  const [search, setSearch] = useState('');
  const filtered = DUA_COLLECTIONS.filter(d =>
    (active === 'All' || d.category === active) &&
    (d.translation.toLowerCase().includes(search.toLowerCase()) || d.arabic.includes(search))
  );
  const toggleFav = (id) => setFavs(f => f.includes(id) ? f.filter(x=>x!==id) : [...f, id]);
  return (
    <div className="dua page-container">
      <motion.h1 className="dua__title" initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }}>Dua Center</motion.h1>
      <div className="dua__search"><Search size={16}/><input value={search} onChange={e=>setSearch(e.target.value)} placeholder="Search duas..." className="dua__search-input"/></div>
      <div className="dua__cats">
        {CATS.map(c=><button key={c} className={`dua__cat ${active===c?'dua__cat--active':''}`} onClick={()=>setActive(c)}>{c}</button>)}
      </div>
      <div className="dua__list">
        {filtered.map((dua,i)=>(
          <GlassCard key={dua.id} className="dua__card" delay={i*0.05} padding="md">
            <div className="dua__card-header">
              <span className="dua__category">{dua.category}</span>
              <button className={`dua__fav ${favs.includes(dua.id)?'dua__fav--active':''}`} onClick={()=>toggleFav(dua.id)}><Heart size={16} fill={favs.includes(dua.id)?'currentColor':'none'}/></button>
            </div>
            <p className="dua__arabic">{dua.arabic}</p>
            <p className="dua__translation">{dua.translation}</p>
            <span className="dua__source">{dua.source}</span>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
