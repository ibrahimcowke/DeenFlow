import { motion } from 'framer-motion';
import { useState } from 'react';
import { MapPin, BarChart2, Check, Plus, Minus, Volume2, VolumeX, Radio } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import RingProgress from '../../components/ui/RingProgress';
import { useAppStore } from '../../store';
import { usePrayerTimes } from '../../hooks';
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
    todaySalah, toggleSalah, setSalahAtMosque,
    qadaCounts, incrementQada, decrementQada,
    todaySunnah, toggleSunnah 
  } = useAppStore();

  const { prayerTimes, nextPrayer, countdown } = usePrayerTimes();

  const [heatmap] = useState(generateHeatmap);

  const completedCount = Object.values(todaySalah).filter(p => p.completed).length;
  const completionPct = Math.round((completedCount / 5) * 100);

  // Adhan Settings state
  const [adhanVoice, setAdhanVoice] = useState('makkah');
  const [adhanEnabled, setAdhanEnabled] = useState(true);
  const [playingAdhan, setPlayingAdhan] = useState(false);
  const [audioInstance, setAudioInstance] = useState(null);

  const playTactileClick = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(1000, ctx.currentTime);
      gain.gain.setValueAtTime(0.05, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {}
  };

  const playSynthChime = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const playTone = (freq, start, duration) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
        gain.gain.setValueAtTime(0.06, ctx.currentTime + start);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + start + duration);
        osc.start(ctx.currentTime + start);
        osc.stop(ctx.currentTime + start + duration);
      };
      playTone(329.63, 0, 1.2);
      playTone(392.00, 0.3, 1.2);
      playTone(523.25, 0.6, 1.6);
    } catch (e) {}
  };

  const playAdhanPreview = () => {
    if (playingAdhan) {
      if (audioInstance) {
        audioInstance.pause();
        audioInstance.currentTime = 0;
      }
      setPlayingAdhan(false);
      return;
    }

    playTactileClick();

    const adhanUrls = {
      makkah: 'https://www.islamcan.com/adhan/audio/adhan-makkah.mp3',
      madinah: 'https://www.islamcan.com/adhan/audio/adhan-madinah.mp3',
      bosnia: 'https://www.islamcan.com/adhan/audio/adhan-bosnia.mp3'
    };

    const audio = new Audio(adhanUrls[adhanVoice]);
    audio.volume = 0.4;
    audio.play()
      .then(() => {
        setAudioInstance(audio);
        setPlayingAdhan(true);
        audio.onended = () => setPlayingAdhan(false);
      })
      .catch((e) => {
        console.error("Adhan audio play failed, falling back to synth chime", e);
        playSynthChime();
        setPlayingAdhan(true);
        setTimeout(() => setPlayingAdhan(false), 3000);
      });
  };

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

      {/* Dynamic Prayer Countdown Ring */}
      {nextPrayer && (
        <GlassCard className="salah__countdown-card" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem 1.5rem' }}>
          <div>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', fontWeight: 700 }}>Next Prayer</span>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 900, margin: '0.15rem 0', color: 'white', display: 'flex', alignItems: 'center', gap: '0.35rem' }}>
              <span>🕌</span> {nextPrayer.name}
            </h2>
            <p style={{ fontSize: '0.85rem', color: 'var(--color-gold)', fontWeight: 600 }}>at {nextPrayer.time ? formatPrayerTime(nextPrayer.time) : '--:--'}</p>
          </div>
          
          <RingProgress value={Math.max(0, Math.min(100, (nextPrayer.minsLeft / 360) * 100))} size={90} stroke={8} color="var(--color-gold)" glow animated>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <span style={{ fontSize: '0.875rem', fontWeight: 900, color: 'white' }}>{countdown}</span>
              <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)' }}>remaining</span>
            </div>
          </RingProgress>
        </GlassCard>
      )}

      {/* Adhan & Settings Card */}
      <GlassCard className="salah__adhan-card" style={{ marginBottom: '1.5rem', padding: '1.25rem 1.5rem' }}>
        <h3 style={{ fontWeight: 700, marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span>🔊</span> Adhan Voice Library
        </h3>
        <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>
          Configure audio notifications for prayer times and test premium muezzin voices.
        </p>

        <div className="salah__adhan-grid">
          <div className="salah__adhan-row">
            <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: 600 }}>Adhan Voice</span>
            <div className="salah__voice-select">
              {[
                { id: 'makkah', label: 'Makkah' },
                { id: 'madinah', label: 'Madinah' },
                { id: 'bosnia', label: 'Bosnia' }
              ].map(voice => (
                <button
                  key={voice.id}
                  className={`salah__voice-btn ${adhanVoice === voice.id ? 'active' : ''}`}
                  onClick={() => { setAdhanVoice(voice.id); if (playingAdhan) { audioInstance?.pause(); setPlayingAdhan(false); } }}
                >
                  {voice.label}
                </button>
              ))}
            </div>
          </div>

          <div className="salah__adhan-row">
            <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: 600 }}>Adhan Player</span>
            <button
              className={`salah__toggle-pill ${playingAdhan ? 'active' : ''}`}
              onClick={playAdhanPreview}
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', cursor: 'pointer' }}
            >
              {playingAdhan ? <VolumeX size={14} /> : <Volume2 size={14} />}
              {playingAdhan ? 'Stop' : 'Test Voice'}
            </button>
          </div>

          <div className="salah__adhan-row">
            <span style={{ fontSize: '0.875rem', color: 'white', fontWeight: 600 }}>Audio Triggers</span>
            <button
              className={`salah__toggle-pill ${adhanEnabled ? 'active' : ''}`}
              onClick={() => setAdhanEnabled(!adhanEnabled)}
            >
              {adhanEnabled ? 'Enabled' : 'Disabled'}
            </button>
          </div>
        </div>
      </GlassCard>

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
