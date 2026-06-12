import { motion } from 'framer-motion';
import { useState } from 'react';
import { Moon, Calendar } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import { useAppStore } from '../../store';
import './Fasting.css';

const SUNNAH_FASTS = [
  { name: 'Monday Fast', desc: 'Weekly Sunnah', next: 'This Monday', type: 'weekly' },
  { name: 'Thursday Fast', desc: 'Weekly Sunnah', next: 'This Thursday', type: 'weekly' },
  { name: 'White Days (13-15)', desc: 'Monthly — Ayyam Al-Bid', next: '3 days away', type: 'monthly' },
  { name: 'Day of Arafah', desc: 'Dhul Hijjah 9', next: 'In 2 months', type: 'annual' },
  { name: 'Day of Ashura', desc: 'Muharram 10', next: 'In 4 months', type: 'annual' },
];

export default function Fasting() {
  const { todayFasting, toggleFasting } = useAppStore();
  const [fastingLog] = useState([true, false, true, false, true, false, false, true, true, false, false, true, false, false]);

  return (
    <div className="fasting page-container">
      <motion.h1 className="fasting__title" initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }}>
        Sunnah Fasting
      </motion.h1>

      {/* Today's Fast Toggle */}
      <GlassCard className="fasting__today" delay={0.1} padding="lg">
        <div className="fasting__today-body">
          <div>
            <Moon size={28} color="var(--color-emerald)" />
            <h3 className="fasting__today-title">Today's Fast</h3>
            <p className="fasting__today-sub">{todayFasting ? 'MashaAllah! You are fasting today 🌙' : 'Not fasting today'}</p>
          </div>
          <button className={`fasting__toggle ${todayFasting ? 'fasting__toggle--on' : ''}`} onClick={toggleFasting}>
            <span className="fasting__toggle-thumb" />
          </button>
        </div>
      </GlassCard>

      {/* Stats */}
      <div className="fasting__stats">
        <GlassCard className="fasting__stat" padding="md" delay={0.15}>
          <span className="fasting__stat-num">4</span>
          <span className="fasting__stat-label">This Month</span>
        </GlassCard>
        <GlassCard className="fasting__stat" padding="md" delay={0.2}>
          <span className="fasting__stat-num">7</span>
          <span className="fasting__stat-label">Total 2026</span>
        </GlassCard>
        <GlassCard className="fasting__stat" padding="md" delay={0.25}>
          <span className="fasting__stat-num">🔥 2</span>
          <span className="fasting__stat-label">Week Streak</span>
        </GlassCard>
      </div>

      {/* Upcoming Fasts */}
      <h3 className="fasting__section">Upcoming Sunnah Fasts</h3>
      <div className="fasting__sunnah-list">
        {SUNNAH_FASTS.map((f, i) => (
          <GlassCard key={f.name} className="fasting__sunnah" delay={0.3 + i*0.05} padding="md">
            <div className="fasting__sunnah-icon">{f.type === 'weekly' ? '📅' : f.type === 'monthly' ? '🌕' : '⭐'}</div>
            <div className="fasting__sunnah-info">
              <h4 className="fasting__sunnah-name">{f.name}</h4>
              <p className="fasting__sunnah-desc">{f.desc}</p>
            </div>
            <span className="fasting__sunnah-next">{f.next}</span>
          </GlassCard>
        ))}
      </div>

      {/* Log Calendar */}
      <h3 className="fasting__section">Fasting Log</h3>
      <GlassCard className="fasting__log" delay={0.5} padding="md">
        <div className="fasting__log-grid">
          {fastingLog.map((fasted, i) => (
            <div key={i} className={`fasting__log-day ${fasted ? 'fasting__log-day--fasted' : ''}`} title={`Day ${i+1}`}>{i+1}</div>
          ))}
        </div>
      </GlassCard>
    </div>
  );
}
