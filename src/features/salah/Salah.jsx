import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, BarChart2, Check, Plus, Minus } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import RingProgress from '../../components/ui/RingProgress';
import { useAppStore } from '../../store';
import { formatPrayerTime } from '../../services/prayerTimes';
import './Salah.css';

const PRAYERS = [
  { key: 'fajr',    name: 'Fajr',    emoji: '🌅', apiKey: 'Fajr' },
  { key: 'dhuhr',   name: 'Dhuhr',   emoji: '☀️', apiKey: 'Dhuhr' },
  { key: 'asr',     name: 'Asr',     emoji: '🌤', apiKey: 'Asr' },
  { key: 'maghrib', name: 'Maghrib', emoji: '🌇', apiKey: 'Maghrib' },
  { key: 'isha',    name: 'Isha',    emoji: '🌙', apiKey: 'Isha' },
];

const SUNNAH_ITEMS = [
  { key: 'fajrBefore',   label: '2 Rak\'ah before Fajr',   prayer: 'Fajr' },
  { key: 'dhuhrBefore',  label: '4 Rak\'ah before Dhuhr',  prayer: 'Dhuhr' },
  { key: 'dhuhrAfter',   label: '2 Rak\'ah after Dhuhr',   prayer: 'Dhuhr' },
  { key: 'maghribAfter', label: '2 Rak\'ah after Maghrib', prayer: 'Maghrib' },
  { key: 'ishaAfter',    label: '2 Rak\'ah after Isha',    prayer: 'Isha' },
];

// Generate mock heatmap data
const generateHeatmap = () => {
  const days = [];
  const now = new Date();
  for (let i = 27; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const count = i === 0 ? 0 : Math.floor(Math.random() * 6);
    days.push({ date: d, count, prayers: count });
  }
  return days;
};

export default function Salah() {
  const { 
    todaySalah, toggleSalah, setSalahAtMosque, prayerTimes,
    qadaCounts, incrementQada, decrementQada,
    todaySunnah, toggleSunnah 
  } = useAppStore();

  const [heatmap] = useState(generateHeatmap);

  const completedCount = Object.values(todaySalah).filter(p => p.completed).length;
  const completionPct = Math.round((completedCount / 5) * 100);

  return (
    <div className="salah page-container">
      {/* Header */}
      <motion.div className="salah__header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <div>
          <h1 className="salah__title">Prayer Times</h1>
          <p className="salah__sub flex gap-2" style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            <MapPin size={14} /> {prayerTimes?.meta?.timezone || 'Detecting location...'}
          </p>
        </div>
        <RingProgress value={completionPct} size={72} stroke={6} color="var(--color-emerald)" glow animated>
          <span style={{ fontSize: '1rem', fontWeight: 700, color: 'var(--color-emerald)' }}>{completedCount}/5</span>
        </RingProgress>
      </motion.div>

      {/* Prayer Cards */}
      <div className="salah__prayers">
        {PRAYERS.map((prayer, i) => {
          const status = todaySalah[prayer.key];
          const time = prayerTimes?.timings?.[prayer.apiKey] || '--:--';
          return (
            <GlassCard
              key={prayer.key}
              className={`salah__prayer-card ${status.completed ? 'salah__prayer-card--done' : ''}`}
              delay={i * 0.06}
              padding="md"
              hover={false}
            >
              <div className="salah__prayer-left">
                <span className="salah__prayer-emoji">{prayer.emoji}</span>
                <div>
                  <h3 className="salah__prayer-name">{prayer.name}</h3>
                  <span className="salah__prayer-time">{formatPrayerTime(time)}</span>
                </div>
              </div>
              <div className="salah__prayer-right">
                {/* Mosque toggle */}
                <button
                  className={`salah__mosque-btn ${status.atMosque ? 'salah__mosque-btn--on' : ''}`}
                  onClick={() => setSalahAtMosque(prayer.key, !status.atMosque)}
                  title="At Mosque"
                >
                  漏
                </button>
                {/* Complete toggle */}
                <motion.button
                  className={`salah__check-btn ${status.completed ? 'salah__check-btn--done' : ''}`}
                  onClick={() => toggleSalah(prayer.key)}
                  whileTap={{ scale: 0.85 }}
                  animate={status.completed ? { scale: [1, 1.2, 1] } : {}}
                >
                  {status.completed ? <Check size={18} /> : <div className="salah__check-circle" />}
                </motion.button>
              </div>
            </GlassCard>
          );
        })}
      </div>

      {/* Sunnah Prayers Checklist */}
      <GlassCard className="salah__sunnah-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>✨</span> Sunnah Prayers (Rawatib)
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Follow the Sunnah of Prophet Muhammad (ﷺ) by praying voluntary prayers daily.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {SUNNAH_ITEMS.map((item) => (
            <div 
              key={item.key} 
              style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'rgba(255,255,255,0.02)', padding: '0.65rem 1rem', borderRadius: '10px', border: '1px solid var(--glass-border)' }}
            >
              <span style={{ fontSize: '0.875rem' }}>{item.label}</span>
              <button 
                onClick={() => toggleSunnah(item.key)}
                style={{
                  background: todaySunnah[item.key] ? 'var(--color-emerald)' : 'rgba(255,255,255,0.05)',
                  border: '1px solid var(--glass-border)',
                  color: 'white',
                  width: '28px',
                  height: '28px',
                  borderRadius: '6px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  cursor: 'pointer'
                }}
              >
                {todaySunnah[item.key] ? <Check size={16} /> : null}
              </button>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Qada Missed Prayers Tracker */}
      <GlassCard className="salah__qada-card" style={{ marginBottom: '1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>⏳</span> Qada Missed Prayers
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Keep track of missed prayers and fulfill them when possible.
        </p>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))', gap: '0.75rem' }}>
          {PRAYERS.map((prayer) => (
            <div 
              key={prayer.key} 
              style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '1rem 0.5rem', borderRadius: '12px', textAlign: 'center' }}
            >
              <span style={{ fontSize: '1.5rem', marginBottom: '0.25rem' }}>{prayer.emoji}</span>
              <span style={{ fontSize: '0.85rem', fontWeight: 700, color: 'white' }}>{prayer.name}</span>
              
              <span style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-gold)', margin: '0.5rem 0' }}>
                {qadaCounts[prayer.key] || 0}
              </span>
              
              <div style={{ display: 'flex', gap: '0.5rem' }}>
                <button 
                  onClick={() => decrementQada(prayer.key)}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Minus size={14} />
                </button>
                <button 
                  onClick={() => incrementQada(prayer.key)}
                  style={{ background: 'var(--color-emerald)', border: 'none', color: 'white', width: '28px', height: '28px', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer' }}
                >
                  <Plus size={14} />
                </button>
              </div>
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Analytics */}
      <GlassCard className="salah__analytics" delay={0.4}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
          <BarChart2 size={18} color="var(--color-emerald)" />
          <h3 style={{ fontWeight: 700 }}>Prayer Analytics</h3>
        </div>

        {/* Stats */}
        <div className="salah__stats" style={{ display: 'flex', flexWrap: 'wrap', gap: '1.5rem' }}>
          {[
            { label: 'This Week', value: '32/35', sub: '91%' },
            { label: 'This Month', value: '124/150', sub: '83%' },
            { label: 'Streak', value: '7 days', sub: '🔥' },
          ].map(s => (
            <div key={s.label} className="salah__stat" style={{ flex: '1 1 80px' }}>
              <span className="salah__stat-val">{s.value}</span>
              <span className="salah__stat-sub">{s.sub}</span>
              <span className="salah__stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {/* Heatmap */}
        <div style={{ marginTop: '1.5rem' }}>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '0.75rem' }}>Last 4 Weeks</p>
          <div className="salah__heatmap">
            {heatmap.map((day, i) => (
              <div
                key={i}
                className="salah__heatmap-cell"
                title={`${day.date.toDateString()}: ${day.count}/5 prayers`}
                style={{
                  background: day.count === 0 ? 'rgba(255,255,255,0.05)' :
                              day.count <= 2 ? 'rgba(16,185,129,0.2)' :
                              day.count <= 4 ? 'rgba(16,185,129,0.5)' : 'var(--color-emerald)',
                }}
              />
            ))}
          </div>
          <div className="salah__heatmap-legend">
            <span>Less</span>
            {[0.1, 0.3, 0.6, 1].map((o, i) => (
              <div key={i} style={{ width: 10, height: 10, borderRadius: 2, background: `rgba(16,185,129,${o})` }} />
            ))}
            <span>More</span>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
