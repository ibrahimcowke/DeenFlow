import { useState, useEffect, useCallback } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import {
  BookOpen, Moon, Star, Zap, RefreshCw, StickyNote,
  Bot, Compass, Heart, ArrowRight, MapPin, Clock,
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import RingProgress from '../../components/ui/RingProgress';
import { useAppStore } from '../../store';
import {
  getPrayerTimesForCurrentLocation,
  getNextPrayer, getCurrentPrayer, formatPrayerTime,
  formatCountdown, getHijriDate, DEMO_PRAYER_TIMES,
} from '../../services/prayerTimes';
import './Dashboard.css';

const PRAYERS = ['fajr', 'dhuhr', 'asr', 'maghrib', 'isha'];
const PRAYER_KEYS = { fajr: 'Fajr', dhuhr: 'Dhuhr', asr: 'Asr', maghrib: 'Maghrib', isha: 'Isha' };

const QUICK_ACTIONS = [
  { icon: BookOpen, label: 'Read Quran',    path: '/quran',    color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  { icon: Moon,     label: 'Track Salah',   path: '/salah',    color: '#6366F1', bg: 'rgba(99,102,241,0.12)' },
  { icon: Compass,  label: 'Qibla',         path: '/qibla',    color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
  { icon: Star,     label: 'Tasbih',        path: '/tasbih',   color: '#EC4899', bg: 'rgba(236,72,153,0.12)' },
  { icon: StickyNote,label:'Notes',          path: '/notes',    color: '#8B5CF6', bg: 'rgba(139,92,246,0.12)' },
  { icon: Heart,    label: 'Dua',           path: '/dua',      color: '#EF4444', bg: 'rgba(239,68,68,0.12)' },
  { icon: Bot,      label: 'AI Coach',      path: '/ai',       color: '#10B981', bg: 'rgba(16,185,129,0.12)' },
  { icon: Zap,      label: 'Habits',        path: '/habits',   color: '#F59E0B', bg: 'rgba(245,158,11,0.12)' },
];

export default function Dashboard() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const {
    userProfile, todaySalah, toggleSalah,
    quranProgress, goals, azkarProgress, recovery,
    prayerTimes, setPrayerTimes, setPrayerLocation,
    getDeenScore, dashboardLayout
  } = useAppStore();

  const [nextPrayer, setNextPrayer] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [hijriDate, setHijriDate] = useState('');
  const [greeting, setGreeting] = useState('Good Morning');
  const [countdown, setCountdown] = useState('');

  // Load prayer times
  useEffect(() => {
    setHijriDate(getHijriDate());
    const h = new Date().getHours();
    if (h < 12) setGreeting(t('greeting_morning', 'Good Morning'));
    else if (h < 17) setGreeting(t('greeting_afternoon', 'Good Afternoon'));
    else if (h < 20) setGreeting(t('greeting_evening', 'Good Evening'));
    else setGreeting(t('greeting_night', 'Good Night'));

    if (!prayerTimes) {
      getPrayerTimesForCurrentLocation()
        .then(({ data, coords }) => {
          setPrayerTimes(data);
          setPrayerLocation(coords);
        })
        .catch(() => setPrayerTimes(DEMO_PRAYER_TIMES));
    }
  }, []);

  // Update next prayer & countdown
  useEffect(() => {
    const update = () => {
      if (prayerTimes) {
        const next = getNextPrayer(prayerTimes);
        const current = getCurrentPrayer(prayerTimes);
        setNextPrayer(next);
        setCurrentPrayer(current);
        if (next) setCountdown(formatCountdown(next.minsLeft));
      }
    };
    update();
    const interval = setInterval(update, 30000);
    return () => clearInterval(interval);
  }, [prayerTimes]);

  const deenScore = getDeenScore();
  const completedPrayers = Object.values(todaySalah).filter(p => p.completed).length;
  const quranGoalPct = Math.min((quranProgress.todayPages / goals.quranPagesDaily) * 100, 100);

  if (dashboardLayout === 'classic') {
    return (
      <div className="dashboard dashboard--classic">
        <Particles />
        <div className="page-container">
          {/* Header */}
          <div className="classic-header" style={{ marginBottom: '2rem' }}>
            <span style={{ fontFamily: 'var(--font-arabic)', fontSize: '1.25rem', color: 'var(--color-gold)' }}>السلام عليكم</span>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginTop: '0.25rem' }}>
              Assalamu Alaikum, <span className="text-gradient-emerald">{userProfile.name}</span>
            </h1>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginTop: '0.5rem' }}>
              🌙 {hijriDate} · {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Next Prayer Gold Banner */}
            {nextPrayer && (
              <div className="classic-prayer-banner" style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid var(--color-gold-glow)', borderRadius: '20px', padding: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <span style={{ fontSize: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--color-gold)' }}>Next Prayer</span>
                  <h2 style={{ fontSize: '1.875rem', fontWeight: 800, color: 'white', marginTop: '0.25rem' }}>{nextPrayer.name}</h2>
                  <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
                    {prayerTimes ? formatPrayerTime(prayerTimes.timings[nextPrayer.name] || '00:00') : '--:--'}
                  </p>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--color-gold)' }}>{countdown}</div>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>remaining</span>
                </div>
              </div>
            )}

            {/* Classic Deen Score Card */}
            <div className="classic-deen-card" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
              <RingProgress value={deenScore} size={90} stroke={8} color="var(--color-gold)" glow>
                <span style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--color-gold)' }}>{deenScore}%</span>
              </RingProgress>
              <div>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 800, color: 'white' }}>Spiritual Score</h3>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.25rem' }}>Your daily consistency across Salah, Quran, and Azkar trackers.</p>
              </div>
            </div>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem', marginBottom: '1.5rem' }}>
            {/* Daily Prayers list */}
            <div className="classic-box" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '1.5rem' }}>
              <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'var(--color-gold)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🕌</span> Daily Prayers
              </h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                {PRAYERS.map((prayer) => {
                  const done = todaySalah[prayer]?.completed;
                  return (
                    <div 
                      key={prayer}
                      style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', background: done ? 'rgba(16,185,129,0.06)' : 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '10px' }}
                    >
                      <span style={{ fontWeight: 600, color: 'white' }}>{t(prayer, PRAYER_KEYS[prayer])}</span>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
                          {prayerTimes ? formatPrayerTime(prayerTimes.timings[PRAYER_KEYS[prayer]] || '') : ''}
                        </span>
                        <button 
                          onClick={() => toggleSalah(prayer)}
                          style={{ background: done ? 'var(--color-emerald)' : 'rgba(255,255,255,0.05)', border: '1px solid var(--glass-border)', width: '24px', height: '24px', borderRadius: '4px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}
                        >
                          {done ? '✓' : ''}
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Quran and Azkar Quick Stats */}
            <div className="classic-box" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <h3 style={{ fontWeight: 700, color: 'var(--color-emerald)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>📖</span> Quran & Azkar Status
              </h3>
              
              {/* Quran Progress */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'white', fontWeight: 600 }}>Daily Quran Reading</span>
                  <span style={{ color: 'var(--color-emerald)', fontWeight: 700 }}>{quranProgress.todayPages} / {goals.quranPagesDaily} pgs</span>
                </div>
                <div style={{ height: '6px', background: 'rgba(255,255,255,0.05)', borderRadius: '99px', overflow: 'hidden' }}>
                  <div style={{ width: `${quranGoalPct}%`, height: '100%', background: 'var(--grad-emerald)', borderRadius: '99px' }} />
                </div>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Streak: {quranProgress.streak} Days</p>
              </div>

              {/* Azkar Progress */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: '0.5rem' }}>
                  <span style={{ color: 'white', fontWeight: 600 }}>Azkar Hub</span>
                  <span style={{ color: 'var(--color-gold)', fontWeight: 700 }}>
                    {Object.values(azkarProgress).filter(a=>a.done).length} / 3 Complete
                  </span>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', marginTop: '0.5rem' }}>
                  {['morning', 'evening', 'afterSalah'].map(cat => (
                    <span 
                      key={cat} 
                      style={{ fontSize: '0.7rem', padding: '0.2rem 0.5rem', borderRadius: '6px', background: azkarProgress[cat]?.done ? 'rgba(245,158,11,0.15)' : 'rgba(255,255,255,0.05)', color: azkarProgress[cat]?.done ? 'var(--color-gold)' : 'var(--text-secondary)', border: '1px solid var(--glass-border)' }}
                    >
                      {cat === 'afterSalah' ? 'After Salah' : cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Tip Banner */}
          <div style={{ background: 'rgba(245,158,11,0.04)', border: '1px solid var(--color-gold-glow)', padding: '1.25rem', borderRadius: '16px', marginBottom: '1.5rem', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
            <span style={{ fontSize: '1.5rem' }}>💡</span>
            <div>
              <h4 style={{ color: 'var(--color-gold)', fontWeight: 700, fontSize: '0.95rem' }}>Daily Health & Sunnah Tip</h4>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.25rem', lineHeight: '1.4' }}>
                Cold water Wudu stimulates the parasympathetic nervous system, cooling stress triggers and resetting dopamine spikes naturally by 250%.
              </p>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="classic-box" style={{ background: 'rgba(15,23,42,0.6)', border: '1px solid var(--glass-border)', borderRadius: '20px', padding: '1.5rem' }}>
            <h3 style={{ fontWeight: 700, marginBottom: '1rem', color: 'white' }}>Quick Navigation</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: '0.75rem' }}>
              {QUICK_ACTIONS.map(action => {
                const Icon = action.icon;
                return (
                  <button 
                    key={action.label}
                    onClick={() => navigate(action.path)}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.75rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', color: 'white' }}
                  >
                    <Icon size={20} color={action.color} />
                    <span style={{ fontSize: '0.75rem', fontWeight: 600 }}>{action.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (dashboardLayout === 'minimal') {
    return (
      <div className="dashboard dashboard--minimal" style={{ background: '#000000', minHeight: '100vh', color: '#ffffff' }}>
        <div className="page-container" style={{ maxWidth: '800px' }}>
          {/* Header */}
          <div style={{ borderBottom: '1px solid #222', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
            <h1 style={{ fontSize: '1.75rem', fontWeight: 700 }}>Assalamu Alaikum</h1>
            <p style={{ color: '#888', fontSize: '0.85rem', marginTop: '0.25rem' }}>
              {hijriDate} · {new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}
            </p>
          </div>

          {/* Key Stat Badges Row */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem', marginBottom: '1.5rem' }}>
            {[
              { label: 'Faith Score', value: `${deenScore}%`, color: 'var(--color-emerald)' },
              { label: 'Salah Done', value: `${completedPrayers}/5`, color: 'white' },
              { label: 'Quran Streak', value: `${quranProgress.streak}d`, color: 'var(--color-emerald)' },
              { label: 'Quran Pages', value: `${quranProgress.todayPages}/${goals.quranPagesDaily}`, color: 'white' }
            ].map((st) => (
              <div key={st.label} style={{ border: '1px solid #222', background: '#050505', padding: '0.75rem 0.5rem', borderRadius: '8px', textAlign: 'center' }}>
                <span style={{ display: 'block', fontSize: '0.6rem', color: '#666', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{st.label}</span>
                <span style={{ display: 'block', fontSize: '1.1rem', fontWeight: 800, color: st.color, marginTop: '0.25rem' }}>{st.value}</span>
              </div>
            ))}
          </div>

          {/* Next Prayer Minimal Alert */}
          {nextPrayer && (
            <div style={{ background: '#0a0a0a', border: '1px solid #222', padding: '0.75rem 1rem', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <span style={{ fontSize: '0.8rem', color: '#888' }}>
                Next: <strong style={{ color: '#fff' }}>{nextPrayer.name}</strong> ({prayerTimes ? formatPrayerTime(prayerTimes.timings[nextPrayer.name] || '00:00') : ''})
              </span>
              <span style={{ fontSize: '0.85rem', color: 'var(--color-emerald)', fontWeight: 700 }}>{countdown}</span>
            </div>
          )}

          {/* Focus section: Prayers Checklist */}
          <div style={{ border: '1px solid #222', borderRadius: '8px', padding: '1rem', background: '#050505', marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', marginBottom: '0.75rem' }}>Daily Salah</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              {PRAYERS.map((prayer) => {
                const done = todaySalah[prayer]?.completed;
                return (
                  <div 
                    key={prayer}
                    onClick={() => toggleSalah(prayer)}
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '0.5rem 0.75rem', border: '1px solid #222', borderRadius: '6px', cursor: 'pointer', background: done ? '#081c15' : '#000000' }}
                  >
                    <span style={{ fontSize: '0.85rem', color: done ? 'var(--color-emerald)' : '#fff', fontWeight: 600 }}>{PRAYER_KEYS[prayer]}</span>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <span style={{ fontSize: '0.75rem', color: '#444' }}>
                        {prayerTimes ? formatPrayerTime(prayerTimes.timings[PRAYER_KEYS[prayer]] || '', true) : ''}
                      </span>
                      <span style={{ fontSize: '0.9rem', color: done ? 'var(--color-emerald)' : '#222' }}>{done ? '●' : '○'}</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Quran progress line */}
          <div style={{ border: '1px solid #222', borderRadius: '8px', padding: '1rem', background: '#050505', marginBottom: '1.5rem' }} onClick={() => navigate('/quran')}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', cursor: 'pointer' }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666' }}>Quran Reader</h3>
                <p style={{ fontSize: '0.85rem', color: '#fff', marginTop: '0.25rem' }}>
                  Streak: {quranProgress.streak} days · Read {quranProgress.todayPages} pages today
                </p>
              </div>
              <ArrowRight size={16} style={{ color: '#444' }} />
            </div>
            <div style={{ height: '3px', background: '#111', marginTop: '0.75rem', borderRadius: '99px', overflow: 'hidden' }}>
              <div style={{ width: `${quranGoalPct}%`, height: '100%', background: 'var(--color-emerald)' }} />
            </div>
          </div>

          {/* Quick Actions List */}
          <div style={{ border: '1px solid #222', borderRadius: '8px', padding: '1rem', background: '#050505' }}>
            <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em', color: '#666', marginBottom: '0.75rem' }}>Quick Links</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '0.5rem' }}>
              {QUICK_ACTIONS.map(action => (
                <button 
                  key={action.label}
                  onClick={() => navigate(action.path)}
                  style={{ background: '#000000', border: '1px solid #222', borderRadius: '6px', padding: '0.5rem', color: '#ccc', fontSize: '0.75rem', cursor: 'pointer' }}
                >
                  {action.label}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Floating Particles */}
      <Particles />

      <div className="page-container">
        {/* ── Hero Header ───────────────────────────────────── */}
        <motion.section
          className="dashboard__hero"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="dashboard__hero-content">
            <div className="dashboard__hero-left">
              <motion.h1
                className="dashboard__greeting"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                style={{ marginTop: '1rem' }}
              >
                {t('salaam', 'Assalamu Alaikum')}, <span className="text-gradient-emerald">{userProfile.name}</span>
              </motion.h1>
              <motion.div
                className="dashboard__dates"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
              >
                <span className="dashboard__hijri">🌙 {hijriDate}</span>
                <span className="dashboard__gregorian">
                  {new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}
                </span>
              </motion.div>
            </div>

            {/* Next Prayer Widget */}
            {nextPrayer && (
              <motion.div
                className="dashboard__prayer-widget"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.4, type: 'spring' }}
              >
                <div className="dashboard__pw-label">{t('next_prayer', 'Next Prayer')}</div>
                <div className="dashboard__pw-name">{nextPrayer.name}</div>
                <div className="dashboard__pw-time">{prayerTimes ? formatPrayerTime(prayerTimes.timings[nextPrayer.name] || '00:00') : '--:--'}</div>
                <div className="dashboard__pw-countdown">
                  <Clock size={12} />
                  {countdown}
                </div>
              </motion.div>
            )}
          </div>
        </motion.section>

        {/* ── Deen Score Card ───────────────────────────────── */}
        <GlassCard className="dashboard__deen-card" variant="default" glow delay={0.1}>
          <div className="dashboard__deen-header">
            <div>
              <h2 className="dashboard__deen-title">{t('deen_score', 'Deen Score')}</h2>
              <p className="dashboard__deen-sub">Your spiritual health today</p>
            </div>
            <button className="dashboard__deen-analytics" onClick={() => navigate('/salah')}>
              Analytics <ArrowRight size={14} />
            </button>
          </div>

          <div className="dashboard__deen-body">
            {/* Big Ring */}
            <div className="dashboard__deen-ring-wrap">
              <RingProgress value={deenScore} size={140} stroke={10} color="var(--color-emerald)" glow animated>
                <div className="dashboard__deen-ring-inner">
                  <span className="dashboard__deen-score score-display">{deenScore}</span>
                  <span className="dashboard__deen-pct">%</span>
                </div>
              </RingProgress>
              <p className="dashboard__deen-ring-label">{t('faith_score', 'Faith Score')}</p>
            </div>

            {/* Breakdown */}
            <div className="dashboard__deen-breakdown">
              {[
                { label: 'Salah',    value: (completedPrayers/5)*100, color: '#10B981' },
                { label: 'Quran',    value: quranGoalPct,              color: '#6366F1' },
                { label: 'Azkar',    value: Object.values(azkarProgress).filter(a=>a.done).length/3*100, color: '#F59E0B' },
                { label: 'Habits',   value: 60,                        color: '#EC4899' },
                { label: 'Recovery', value: recovery.score,            color: '#8B5CF6' },
              ].map((item, i) => (
                <div key={item.label} className="dashboard__breakdown-item">
                  <div className="dashboard__breakdown-top">
                    <span className="dashboard__breakdown-label">{item.label}</span>
                    <span className="dashboard__breakdown-val" style={{ color: item.color }}>{Math.round(item.value)}%</span>
                  </div>
                  <div className="dashboard__breakdown-track">
                    <motion.div
                      className="dashboard__breakdown-fill"
                      style={{ background: item.color }}
                      initial={{ width: 0 }}
                      animate={{ width: `${item.value}%` }}
                      transition={{ delay: 0.6 + i * 0.1, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* ── Prayer Rings ──────────────────────────────────── */}
        <GlassCard className="dashboard__prayers-card" delay={0.2}>
          <div className="dashboard__section-header">
            <h3>{t('todays_progress', "Today's Progress")}</h3>
            <button onClick={() => navigate('/salah')} className="dashboard__see-all">
              View all <ArrowRight size={14} />
            </button>
          </div>
          <div className="dashboard__prayer-rings">
            {PRAYERS.map((prayer, i) => {
              const done = todaySalah[prayer]?.completed;
              return (
                <motion.button
                  key={prayer}
                  className={`dashboard__prayer-ring ${done ? 'dashboard__prayer-ring--done' : ''}`}
                  onClick={() => toggleSalah(prayer)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + i * 0.08, type: 'spring', stiffness: 300 }}
                  whileTap={{ scale: 0.9 }}
                >
                  <RingProgress
                    value={done ? 100 : 0}
                    size={72}
                    stroke={5}
                    color={done ? 'var(--color-emerald)' : 'rgba(255,255,255,0.1)'}
                    animated={done}
                    glow={done}
                  >
                    <span className="dashboard__prayer-emoji">{done ? '✓' : PrayerEmoji[prayer]}</span>
                  </RingProgress>
                  <span className="dashboard__prayer-name">{t(prayer, PRAYER_KEYS[prayer])}</span>
                  {prayerTimes && (
                    <span className="dashboard__prayer-time-sm">
                      {formatPrayerTime(prayerTimes.timings[PRAYER_KEYS[prayer]] || '', true)}
                    </span>
                  )}
                </motion.button>
              );
            })}
          </div>
        </GlassCard>

        {/* ── Feature Cards Grid ────────────────────────────── */}
        <div className="dashboard__cards-grid">
          {/* Quran Card */}
          <GlassCard className="dashboard__feature-card" variant="default" delay={0.25} onClick={() => navigate('/quran')} hover>
            <div className="dashboard__feature-header">
              <div className="dashboard__feature-icon" style={{ background: 'rgba(16,185,129,0.12)', borderColor: 'rgba(16,185,129,0.25)' }}>
                <BookOpen size={20} color="var(--color-emerald)" />
              </div>
              <span className="dashboard__feature-streak">🔥 {quranProgress.streak} day streak</span>
            </div>
            <h3 className="dashboard__feature-title">Quran</h3>
            <p className="dashboard__feature-sub">
              {quranProgress.todayPages}/{goals.quranPagesDaily} pages today
            </p>
            <div className="dashboard__feature-bar">
              <motion.div
                className="dashboard__feature-fill"
                style={{ background: 'var(--grad-emerald)' }}
                initial={{ width: 0 }}
                animate={{ width: `${quranGoalPct}%` }}
                transition={{ delay: 0.8, duration: 1 }}
              />
            </div>
            <p className="dashboard__feature-last">
              Last: Surah Al-Baqarah · Page {quranProgress.lastPage}
            </p>
            <button className="dashboard__feature-btn">
              Continue Reading <ArrowRight size={14} />
            </button>
          </GlassCard>

          {/* Azkar Card */}
          <GlassCard className="dashboard__feature-card" delay={0.3} onClick={() => navigate('/azkar')} hover>
            <div className="dashboard__feature-header">
              <div className="dashboard__feature-icon" style={{ background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.25)' }}>
                <Star size={20} color="var(--color-gold)" />
              </div>
              <span className="dashboard__feature-streak">⭐ Azkar</span>
            </div>
            <h3 className="dashboard__feature-title">Daily Azkar</h3>
            <div className="dashboard__azkar-rings">
              {[
                { label: 'Morning', key: 'morning', color: '#F59E0B' },
                { label: 'Evening', key: 'evening', color: '#6366F1' },
                { label: 'After ṣalah', key: 'afterSalah', color: '#10B981' },
              ].map(az => (
                <div key={az.key} className="dashboard__azkar-item">
                  <RingProgress
                    value={azkarProgress[az.key]?.done ? 100 : (azkarProgress[az.key]?.completed / Math.max(azkarProgress[az.key]?.total, 1)) * 100}
                    size={52}
                    stroke={4}
                    color={az.color}
                    animated
                  >
                    <span style={{ fontSize: '10px', color: az.color }}>
                      {azkarProgress[az.key]?.done ? '✓' : `${azkarProgress[az.key]?.completed || 0}`}
                    </span>
                  </RingProgress>
                  <span style={{ fontSize: '10px', color: 'var(--text-secondary)', marginTop: 4, textAlign: 'center' }}>{az.label}</span>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* Recovery Card */}
          {recovery.enabled && (
            <GlassCard className="dashboard__feature-card dashboard__recovery-card" variant="default" delay={0.35} onClick={() => navigate('/recovery')} hover>
              <div className="dashboard__feature-header">
                <div className="dashboard__feature-icon" style={{ background: 'rgba(139,92,246,0.12)', borderColor: 'rgba(139,92,246,0.25)' }}>
                  <RefreshCw size={20} color="#8B5CF6" />
                </div>
                <span className="dashboard__recovery-badge">Recovery</span>
              </div>
              <h3 className="dashboard__feature-title">Recovery</h3>
              <div className="dashboard__recovery-stats">
                <div className="dashboard__recovery-stat">
                  <span className="dashboard__recovery-num">{recovery.currentStreak}</span>
                  <span className="dashboard__recovery-lbl">Clean Days</span>
                </div>
                <div className="dashboard__recovery-stat">
                  <span className="dashboard__recovery-num">{recovery.urgesAvoided}</span>
                  <span className="dashboard__recovery-lbl">Urges Resisted</span>
                </div>
              </div>
              <button className="dashboard__emergency-btn" onClick={(e) => { e.stopPropagation(); navigate('/recovery/emergency'); }}>
                🆘 I Need Help
              </button>
            </GlassCard>
          )}
        </div>

        {/* ── Daily Spiritual & Health Tip ─────────────────── */}
        <GlassCard className="dashboard__tip-banner" padding="lg" delay={0.38} variant="gold">
          <div className="dashboard__tip-banner-body">
            <span className="dashboard__tip-banner-icon">💡</span>
            <div className="dashboard__tip-banner-info">
              <h4 className="dashboard__tip-banner-title">Daily Health & Sunnah Tip</h4>
              <p className="dashboard__tip-banner-desc">
                <strong>Natural Dopamine Reset:</strong> Cold water Wudu stimulates the parasympathetic nervous system, cooling stress triggers and resetting dopamine spikes naturally by 250% (biologically matching Sunnah Ghusl benefits).
              </p>
            </div>
          </div>
        </GlassCard>

        {/* ── Quick Actions ─────────────────────────────────── */}
        <GlassCard className="dashboard__quick-card" delay={0.4}>
          <div className="dashboard__section-header">
            <h3>{t('quick_actions', 'Quick Actions')}</h3>
          </div>
          <div className="dashboard__quick-grid">
            {QUICK_ACTIONS.map((action, i) => {
              const Icon = action.icon;
              return (
                <motion.button
                  key={action.label}
                  className="dashboard__quick-btn"
                  onClick={() => navigate(action.path)}
                  initial={{ opacity: 0, scale: 0.85 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.5 + i * 0.04, type: 'spring', stiffness: 280 }}
                  whileHover={{ scale: 1.06, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  style={{ '--action-color': action.color, '--action-bg': action.bg }}
                >
                  <div className="dashboard__quick-icon">
                    <Icon size={22} color={action.color} />
                  </div>
                  <span className="dashboard__quick-label">{action.label}</span>
                </motion.button>
              );
            })}
          </div>
        </GlassCard>
      </div>
    </div>
  );
}

const PrayerEmoji = { fajr: '🌅', dhuhr: '☀️', asr: '🌤', maghrib: '🌇', isha: '🌙' };

function Particles() {
  const particles = Array.from({ length: 20 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    y: Math.random() * 100,
    size: Math.random() * 3 + 1,
    delay: Math.random() * 8,
    duration: Math.random() * 6 + 6,
  }));

  return (
    <div className="dashboard__particles">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="dashboard__particle"
          style={{ left: `${p.x}%`, top: `${p.y}%`, width: p.size, height: p.size }}
          animate={{ y: [0, -80, 0], opacity: [0, 0.6, 0] }}
          transition={{ duration: p.duration, delay: p.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  );
}
