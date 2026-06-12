import { motion } from 'framer-motion';
import { useState } from 'react';
import { Bookmark, Search } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import { HADITHS } from '../../utils/islamicData';
import './Hadith.css';

export default function Hadith() {
  const [favs, setFavs] = useState([]);
  const daily = HADITHS[new Date().getDay() % HADITHS.length];
  const toggleFav = (id) => setFavs(f => f.includes(id) ? f.filter(x=>x!==id) : [...f, id]);

  return (
    <div className="hadith page-container">
      <motion.h1 className="hadith__title" initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }}>Hadith Center</motion.h1>
      
      <GlassCard className="hadith__daily" variant="gold" delay={0.1} padding="lg">
        <div className="hadith__daily-label">📖 Daily Hadith</div>
        <p className="hadith__arabic">{daily.arabic}</p>
        <p className="hadith__translation">{daily.translation}</p>
        <div className="hadith__meta"><span>{daily.narrator}</span><span className="hadith__source">{daily.source}</span></div>
      </GlassCard>

      <h3 className="hadith__section-title">Hadith Collection</h3>
      <div className="hadith__list">
        {HADITHS.map((h, i) => (
          <GlassCard key={h.id} className="hadith__item" delay={0.15 + i*0.05} padding="md">
            <div className="hadith__item-header">
              <span className="hadith__cat">{h.category}</span>
              <button className={`hadith__fav ${favs.includes(h.id)?'hadith__fav--active':''}`} onClick={()=>toggleFav(h.id)}>
                <Bookmark size={16} fill={favs.includes(h.id)?'currentColor':'none'}/>
              </button>
            </div>
            <p className="hadith__arabic">{h.arabic}</p>
            <p className="hadith__translation">{h.translation}</p>
            <div className="hadith__meta"><span>{h.narrator}</span><span className="hadith__source">{h.source}</span></div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
