import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { BookOpen, Bookmark, Search, Target, ArrowRight, Award, Settings, X, Plus, Minus } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import RingProgress from '../../components/ui/RingProgress';
import Button from '../../components/ui/Button';
import { useAppStore } from '../../store';
import { SURAH_NAMES, SURAH_ARABIC_NAMES } from '../../services/quran';
import './Quran.css';

const TABS = ['All', 'Recent', 'Bookmarks', 'Hifz'];

// Full Quran 114 Surahs metadata (ayah counts, type)
const ALL_SURAH_META = [
  { ayahs: 7, type: 'Makki' }, { ayahs: 286, type: 'Madani' }, { ayahs: 200, type: 'Madani' },
  { ayahs: 176, type: 'Madani' }, { ayahs: 120, type: 'Madani' }, { ayahs: 165, type: 'Makki' },
  { ayahs: 206, type: 'Makki' }, { ayahs: 75, type: 'Madani' }, { ayahs: 129, type: 'Madani' },
  { ayahs: 109, type: 'Makki' }, { ayahs: 123, type: 'Makki' }, { ayahs: 111, type: 'Makki' },
  { ayahs: 43, type: 'Madani' }, { ayahs: 52, type: 'Makki' }, { ayahs: 99, type: 'Makki' },
  { ayahs: 128, type: 'Makki' }, { ayahs: 111, type: 'Makki' }, { ayahs: 110, type: 'Makki' },
  { ayahs: 98, type: 'Makki' }, { ayahs: 135, type: 'Makki' }, { ayahs: 112, type: 'Makki' },
  { ayahs: 78, type: 'Madani' }, { ayahs: 118, type: 'Makki' }, { ayahs: 64, type: 'Madani' },
  { ayahs: 77, type: 'Makki' }, { ayahs: 227, type: 'Makki' }, { ayahs: 93, type: 'Makki' },
  { ayahs: 88, type: 'Makki' }, { ayahs: 69, type: 'Makki' }, { ayahs: 60, type: 'Makki' },
  { ayahs: 34, type: 'Makki' }, { ayahs: 30, type: 'Makki' }, { ayahs: 73, type: 'Madani' },
  { ayahs: 54, type: 'Makki' }, { ayahs: 45, type: 'Makki' }, { ayahs: 83, type: 'Makki' },
  { ayahs: 182, type: 'Makki' }, { ayahs: 88, type: 'Makki' }, { ayahs: 75, type: 'Makki' },
  { ayahs: 85, type: 'Makki' }, { ayahs: 54, type: 'Makki' }, { ayahs: 53, type: 'Makki' },
  { ayahs: 89, type: 'Makki' }, { ayahs: 59, type: 'Makki' }, { ayahs: 37, type: 'Makki' },
  { ayahs: 35, type: 'Makki' }, { ayahs: 38, type: 'Madani' }, { ayahs: 29, type: 'Madani' },
  { ayahs: 18, type: 'Madani' }, { ayahs: 45, type: 'Makki' }, { ayahs: 60, type: 'Makki' },
  { ayahs: 49, type: 'Makki' }, { ayahs: 62, type: 'Makki' }, { ayahs: 55, type: 'Makki' },
  { ayahs: 78, type: 'Madani' }, { ayahs: 96, type: 'Makki' }, { ayahs: 29, type: 'Madani' },
  { ayahs: 22, type: 'Madani' }, { ayahs: 24, type: 'Madani' }, { ayahs: 13, type: 'Madani' },
  { ayahs: 14, type: 'Madani' }, { ayahs: 11, type: 'Madani' }, { ayahs: 11, type: 'Madani' },
  { ayahs: 18, type: 'Madani' }, { ayahs: 12, type: 'Madani' }, { ayahs: 12, type: 'Madani' },
  { ayahs: 30, type: 'Makki' }, { ayahs: 52, type: 'Makki' }, { ayahs: 52, type: 'Makki' },
  { ayahs: 44, type: 'Makki' }, { ayahs: 28, type: 'Makki' }, { ayahs: 28, type: 'Makki' },
  { ayahs: 20, type: 'Makki' }, { ayahs: 56, type: 'Makki' }, { ayahs: 40, type: 'Makki' },
  { ayahs: 31, type: 'Madani' }, { ayahs: 50, type: 'Makki' }, { ayahs: 40, type: 'Makki' },
  { ayahs: 46, type: 'Makki' }, { ayahs: 50, type: 'Makki' }, { ayahs: 29, type: 'Makki' },
  { ayahs: 19, type: 'Makki' }, { ayahs: 36, type: 'Makki' }, { ayahs: 25, type: 'Makki' },
  { ayahs: 22, type: 'Makki' }, { ayahs: 17, type: 'Makki' }, { ayahs: 19, type: 'Makki' },
  { ayahs: 26, type: 'Makki' }, { ayahs: 30, type: 'Makki' }, { ayahs: 20, type: 'Makki' },
  { ayahs: 15, type: 'Makki' }, { ayahs: 21, type: 'Makki' }, { ayahs: 11, type: 'Makki' },
  { ayahs: 8, type: 'Makki' }, { ayahs: 8, type: 'Makki' }, { ayahs: 19, type: 'Makki' },
  { ayahs: 5, type: 'Makki' }, { ayahs: 8, type: 'Madani' }, { ayahs: 8, type: 'Makki' },
  { ayahs: 11, type: 'Makki' }, { ayahs: 11, type: 'Makki' }, { ayahs: 8, type: 'Makki' },
  { ayahs: 3, type: 'Makki' }, { ayahs: 9, type: 'Makki' }, { ayahs: 5, type: 'Makki' },
  { ayahs: 4, type: 'Makki' }, { ayahs: 7, type: 'Makki' }, { ayahs: 3, type: 'Makki' },
  { ayahs: 6, type: 'Makki' }, { ayahs: 3, type: 'Madani' }, { ayahs: 5, type: 'Makki' },
  { ayahs: 4, type: 'Makki' }, { ayahs: 5, type: 'Makki' }, { ayahs: 6, type: 'Makki' }
];

// Juz to starting Surah mapping
const JUZ_TO_SURAH = {
  1: 1, 2: 2, 3: 2, 4: 3, 5: 4, 6: 4, 7: 5, 8: 6, 9: 7, 10: 8,
  11: 9, 12: 11, 13: 12, 14: 15, 15: 17, 16: 18, 17: 21, 18: 23, 19: 25, 20: 27,
  21: 29, 22: 33, 23: 36, 24: 39, 25: 41, 26: 46, 27: 51, 28: 58, 29: 67, 30: 78
};

// Quran Surah start pages mapping
const SURAH_START_PAGES = [
  1, 2, 50, 77, 106, 128, 151, 177, 187, 208, 
  221, 235, 249, 255, 262, 267, 282, 293, 305, 312, 
  322, 332, 342, 350, 359, 367, 377, 385, 396, 404, 
  411, 415, 418, 428, 434, 440, 446, 453, 458, 467, 
  477, 483, 489, 496, 499, 502, 507, 511, 515, 518, 
  520, 526, 528, 531, 534, 537, 542, 545, 549, 551, 
  553, 554, 556, 558, 560, 562, 564, 566, 568, 570, 
  572, 574, 575, 577, 578, 580, 582, 583, 585, 586, 
  587, 587, 589, 590, 591, 591, 592, 593, 594, 595, 
  596, 596, 597, 597, 598, 598, 599, 599, 600, 600, 
  601, 601, 602, 602, 602, 603, 603, 603, 604, 604, 
  604, 604, 604, 604
];

const getSurahForPage = (page) => {
  let surah = 1;
  for (let i = 0; i < SURAH_START_PAGES.length; i++) {
    if (SURAH_START_PAGES[i] <= page) {
      surah = i + 1;
    } else {
      break;
    }
  }
  return surah;
};

// ─── Ayah Stepper Picker (Visual) ────────────────────────────────────────────

// SVG arc ring for the live count display
function ArcRing({ pct, size = 110, stroke = 8, color = 'var(--color-emerald)', children }) {
  const r = (size - stroke) / 2;
  const circ = 2 * Math.PI * r;
  const dash = circ * Math.min(pct, 1);
  return (
    <div style={{ position: 'relative', width: size, height: size, flexShrink: 0 }}>
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)', position: 'absolute', top: 0, left: 0 }}>
        {/* Track */}
        <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="rgba(255,255,255,0.05)" strokeWidth={stroke} />
        {/* Progress */}
        <circle
          cx={size/2} cy={size/2} r={r}
          fill="none"
          stroke="url(#arcGrad)"
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={`${dash} ${circ}`}
          style={{ transition: 'stroke-dasharray 0.4s cubic-bezier(.4,0,.2,1)' }}
        />
        <defs>
          <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" />
            <stop offset="100%" stopColor="#f59e0b" />
          </linearGradient>
        </defs>
      </svg>
      {/* Centre content */}
      <div style={{
        position: 'absolute', inset: 0,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
        gap: 2,
      }}>
        {children}
      </div>
    </div>
  );
}

// Diamond-shaped stepper button
function DiamondBtn({ children, active, onMouseDown, onMouseUp, onMouseLeave, onTouchStart, onTouchEnd, disabled }) {
  return (
    <button
      type="button"
      onMouseDown={onMouseDown} onMouseUp={onMouseUp} onMouseLeave={onMouseLeave}
      onTouchStart={onTouchStart} onTouchEnd={onTouchEnd}
      disabled={disabled}
      style={{
        width: 40, height: 40,
        border: 'none', background: 'none',
        padding: 0, cursor: disabled ? 'not-allowed' : 'pointer',
        position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      {/* Diamond shape via rotated square */}
      <div style={{
        width: 32, height: 32,
        borderRadius: 6,
        transform: 'rotate(45deg)',
        background: active
          ? 'linear-gradient(135deg, rgba(16,185,129,0.25), rgba(245,158,11,0.15))'
          : 'rgba(255,255,255,0.04)',
        border: active ? '1.5px solid rgba(16,185,129,0.5)' : '1.5px solid rgba(255,255,255,0.08)',
        transition: 'all 0.15s ease',
        boxShadow: active ? '0 0 10px rgba(16,185,129,0.2)' : 'none',
      }} />
      {/* Icon on top */}
      <span style={{
        position: 'absolute',
        fontSize: '1.1rem', fontWeight: 900, lineHeight: 1,
        color: active ? 'var(--color-emerald)' : 'var(--text-muted)',
        transition: 'color 0.15s ease',
        userSelect: 'none',
      }}>{children}</span>
    </button>
  );
}

function AyahStepper({ label, value, min, max, onChange }) {
  const canDec = value > min;
  const canInc = value < max;
  const holdRef = useRef(null);
  const startHold = (dir) => {
    const step = () => onChange(prev => {
      const next = prev + dir;
      return (next < min || next > max) ? prev : next;
    });
    step();
    holdRef.current = setInterval(step, 110);
  };
  const stopHold = () => clearInterval(holdRef.current);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.35rem' }}>
      {/* Label */}
      <span style={{
        fontSize: '0.6rem', fontWeight: 800, letterSpacing: '0.1em',
        textTransform: 'uppercase', color: 'var(--text-muted)',
      }}>{label}</span>

      {/* + diamond */}
      <DiamondBtn active={canInc} disabled={!canInc}
        onMouseDown={() => startHold(1)} onMouseUp={stopHold} onMouseLeave={stopHold}
        onTouchStart={() => startHold(1)} onTouchEnd={stopHold}
      >＋</DiamondBtn>

      {/* Hexagon value display */}
      <div style={{ position: 'relative', width: 68, height: 68, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <svg viewBox="0 0 68 68" width="68" height="68" style={{ position: 'absolute', top: 0, left: 0 }}>
          <polygon
            points="34,4 60,19 60,49 34,64 8,49 8,19"
            fill="rgba(16,185,129,0.08)"
            stroke="rgba(16,185,129,0.25)"
            strokeWidth="1.5"
          />
        </svg>
        <motion.span
          key={value}
          initial={{ scale: 1.3, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          style={{ fontSize: '1.4rem', fontWeight: 900, color: 'var(--color-emerald)', zIndex: 1, lineHeight: 1 }}
        >
          {value}
        </motion.span>
      </div>

      {/* - diamond */}
      <DiamondBtn active={canDec} disabled={!canDec}
        onMouseDown={() => startHold(-1)} onMouseUp={stopHold} onMouseLeave={stopHold}
        onTouchStart={() => startHold(-1)} onTouchEnd={stopHold}
      >－</DiamondBtn>
    </div>
  );
}

function AyahScrollPicker({ totalAyahs, startAyah, endAyah, onStartChange, onEndChange }) {
  const count = endAyah - startAyah + 1;
  const pct = count / totalAyahs;
  const hasanat = count * 7 * 10; // ~7 letters avg per ayah × 10 hasanat/letter

  const handleStartChange = (updater) => {
    const v = typeof updater === 'function' ? updater(startAyah) : updater;
    onStartChange(v);
    if (endAyah < v) onEndChange(v);
  };
  const handleEndChange = (updater) => {
    const v = typeof updater === 'function' ? updater(endAyah) : updater;
    onEndChange(v);
  };

  return (
    <div style={{ marginTop: '1.25rem', width: '100%' }}>

      {/* ── Main 3-column row ── */}
      <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>

        <AyahStepper label="From" value={startAyah} min={1} max={totalAyahs} onChange={handleStartChange} />

        {/* ── Centre ring + count ── */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem' }}>
          <ArcRing pct={pct} size={108} stroke={7}>
            <motion.span
              key={count}
              initial={{ scale: 1.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              style={{ fontSize: '1.8rem', fontWeight: 900, color: 'var(--color-gold)', lineHeight: 1 }}
            >{count}</motion.span>
            <span style={{ fontSize: '0.5rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
              ayah{count !== 1 ? 's' : ''}
            </span>
          </ArcRing>
          {/* % label under ring */}
          <span style={{ fontSize: '0.6rem', color: 'var(--color-emerald)', fontWeight: 700 }}>
            {Math.round(pct * 100)}% of Surah
          </span>
        </div>

        <AyahStepper label="To" value={endAyah} min={startAyah} max={totalAyahs} onChange={handleEndChange} />
      </div>

      {/* ── Dot-grid range visualizer ── */}
      <div style={{ marginTop: '1.1rem' }}>
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 4,
          padding: '0.65rem', borderRadius: 14,
          background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)',
          maxHeight: 84, overflow: 'hidden',
        }}>
          {Array.from({ length: Math.min(totalAyahs, 60) }).map((_, i) => {
            const ayah = i + 1;
            const inRange = ayah >= startAyah && ayah <= endAyah;
            const isStart = ayah === startAyah;
            const isEnd   = ayah === endAyah;
            return (
              <motion.div
                key={ayah}
                animate={{
                  background: inRange
                    ? isStart || isEnd
                      ? '#10b981'
                      : 'rgba(16,185,129,0.45)'
                    : 'rgba(255,255,255,0.07)',
                  scale: inRange ? 1.15 : 1,
                }}
                transition={{ duration: 0.18 }}
                title={`Ayah ${ayah}`}
                style={{
                  width: 10, height: 10, borderRadius: '50%',
                  cursor: 'default',
                  boxShadow: inRange ? '0 0 4px rgba(16,185,129,0.5)' : 'none',
                }}
              />
            );
          })}
          {totalAyahs > 60 && (
            <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', alignSelf: 'center', marginLeft: 2 }}>
              +{totalAyahs - 60} more
            </span>
          )}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '0.3rem', fontSize: '0.58rem', color: 'var(--text-muted)' }}>
          <span>Ayah {startAyah}</span>
          <span>Ayah {endAyah}</span>
        </div>
      </div>

      {/* ── Hasanat preview chip ── */}
      <div style={{
        marginTop: '0.85rem',
        padding: '0.5rem 0.85rem',
        borderRadius: 12,
        background: 'linear-gradient(90deg, rgba(245,158,11,0.07), rgba(16,185,129,0.07))',
        border: '1px solid rgba(245,158,11,0.18)',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
        fontSize: '0.75rem',
      }}>
        <span style={{ color: 'var(--text-muted)', fontWeight: 600 }}>⚡ Est. Hasanat</span>
        <motion.span
          key={hasanat}
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          style={{ color: 'var(--color-gold)', fontWeight: 900, fontSize: '0.9rem' }}
        >
          ✨ ~{hasanat.toLocaleString()}
        </motion.span>
      </div>

    </div>
  );
}
// ─────────────────────────────────────────────────────────────────────────────



export default function Quran() {
  const navigate = useNavigate();
  const { quranProgress, goals, setGoals, quranBookmarks, userProfile } = useAppStore();
  const [search, setSearch] = useState('');
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoalType, setTempGoalType] = useState(goals.quranGoalType || 'page');
  const [tempGoalValue, setTempGoalValue] = useState(goals.quranGoalValue || 5);
  const [activeSelectorMode, setActiveSelectorMode] = useState('surah');
  const [selectedSurah, setSelectedSurah] = useState('');
  const [selectedAyah, setSelectedAyah] = useState('1');
  const [selectedEndAyah, setSelectedEndAyah] = useState('1');
  const [selectedJuz, setSelectedJuz] = useState('');
  const [selectedHizb, setSelectedHizb] = useState('');
  const [selectedMaqrah, setSelectedMaqrah] = useState('');
  const [selectedPage, setSelectedPage] = useState('');

  const goalPct = Math.min((quranProgress.todayPages / goals.quranPagesDaily) * 100, 100);

  const filteredSurahs = SURAH_NAMES
    .map((name, i) => ({ name, arabic: SURAH_ARABIC_NAMES[i], number: i + 1, ...ALL_SURAH_META[i] }))
    .filter(s => s.name.toLowerCase().includes(search.toLowerCase()) || s.arabic.includes(search));

  const handleSaveGoal = (e) => {
    e.preventDefault();
    let calculatedPages = tempGoalValue;
    if (tempGoalType === 'juz') calculatedPages = tempGoalValue * 20;
    else if (tempGoalType === 'hizb') calculatedPages = tempGoalValue * 10;
    else if (tempGoalType === 'maqrah') calculatedPages = Math.ceil(tempGoalValue * 2.5);
    else if (tempGoalType === 'ayah') calculatedPages = Math.ceil(tempGoalValue / 15);
    setGoals({ quranGoalType: tempGoalType, quranGoalValue: tempGoalValue, quranPagesDaily: calculatedPages });
    setShowGoalModal(false);
  };

  const isReadyToStart =
    activeSelectorMode === 'surah' ? !!selectedSurah
    : activeSelectorMode === 'juz' ? !!selectedJuz
    : activeSelectorMode === 'hizb' ? !!selectedHizb
    : activeSelectorMode === 'hizbQuarter' ? !!selectedMaqrah
    : !!selectedPage;

  const handleStart = () => {
    if (activeSelectorMode === 'surah')
      navigate(`/quran/reader/${selectedSurah}?startAyah=${selectedAyah}&endAyah=${selectedEndAyah}`);
    else if (activeSelectorMode === 'juz')
      navigate(`/quran/reader?type=juz&id=${selectedJuz}`);
    else if (activeSelectorMode === 'hizb')
      navigate(`/quran/reader?type=hizb&id=${selectedHizb}`);
    else if (activeSelectorMode === 'hizbQuarter')
      navigate(`/quran/reader?type=hizbQuarter&id=${selectedMaqrah}`);
    else
      navigate(`/quran/reader?type=page&id=${selectedPage}`);
  };

  function NumGrid({ count, selected, onSelect, label }) {
    return (
      <div>
        <p style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginBottom: '0.6rem', fontWeight: 600 }}>
          Tap to select {label}
        </p>
        <div className="quran__num-grid">
          {Array.from({ length: count }, (_, i) => i + 1).map(n => (
            <motion.button
              key={n} type="button"
              whileTap={{ scale: 0.88 }}
              onClick={() => onSelect(String(n))}
              className={`quran__num-cell ${selected === String(n) ? 'quran__num-cell--active' : ''}`}
            >{n}</motion.button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="quran page-container">

      {/* ── Hero ──────────────────────────────────────── */}
      <motion.div className="quran__hero" initial={{ opacity: 0, y: -16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.45 }}>
        <div className="quran__hero-content">
          <div className="quran__hero-badge">📖 Quran Center</div>
          <h1 className="quran__hero-title">
            <span style={{ background: 'linear-gradient(135deg,#10b981,#f59e0b)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Al-Quran</span>{' '}Al-Karim
          </h1>
          <span className="quran__hero-arabic">القرآن الكريم</span>
          <p className="quran__hero-sub">Read, reflect, and earn Hasanat with every letter</p>

          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <div className="quran__hero-stats">
              <div className="quran__hero-stat">
                <span className="quran__hero-stat-val">{quranProgress.streak}🔥</span>
                <span className="quran__hero-stat-label">Day Streak</span>
              </div>
              <div className="quran__hero-stat">
                <span className="quran__hero-stat-val" style={{ color: 'var(--color-gold)' }}>{(userProfile.totalHasanat || 0).toLocaleString()}✨</span>
                <span className="quran__hero-stat-label">Hasanat</span>
              </div>
              <div className="quran__hero-stat">
                <span className="quran__hero-stat-val">{quranProgress.totalPages}</span>
                <span className="quran__hero-stat-label">Pages Read</span>
              </div>
            </div>
            <div style={{ marginLeft: 'auto' }}>
              <RingProgress value={goalPct} size={78} stroke={6} color="var(--color-emerald)" glow animated>
                <span style={{ fontSize: '0.85rem', fontWeight: 900, color: 'var(--color-emerald)' }}>{Math.round(goalPct)}%</span>
              </RingProgress>
            </div>
          </div>

          <button onClick={() => navigate('/quran/reader')} style={{ marginTop: '1.1rem', width: '100%', padding: '0.75rem 1rem', borderRadius: '14px', border: 'none', background: 'linear-gradient(90deg,#10b981,#059669)', color: 'white', fontWeight: 800, fontSize: '0.88rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', boxShadow: '0 4px 20px rgba(16,185,129,0.35)', fontFamily: 'var(--font-sans)' }}>
            <BookOpen size={15} /> Continue Reading · Page {quranProgress.lastPage}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: '0.7rem' }}>
            <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
              Daily: {quranProgress.todayPages}/{goals.quranPagesDaily} pages{goals.quranGoalType && ` · ${goals.quranGoalValue} ${goals.quranGoalType}`}
            </span>
            <button onClick={() => { setTempGoalType(goals.quranGoalType || 'page'); setTempGoalValue(goals.quranGoalValue || 5); setShowGoalModal(true); }} className="quran__edit-goal-btn">
              <Settings size={11} /> Edit Goal
            </button>
          </div>
        </div>
      </motion.div>

      {/* ── Stats ─────────────────────────────────────── */}
      <div className="quran__stats-row">
        {[
          { icon: '📜', label: 'Pages', val: quranProgress.totalPages },
          { icon: '🔥', label: 'Streak', val: `${quranProgress.streak}d` },
          { icon: '✨', label: 'Hasanat', val: (userProfile.totalHasanat || 0).toLocaleString() },
          { icon: '⭐', label: 'Saved', val: quranBookmarks.length },
        ].map((s, i) => (
          <motion.div key={s.label} className="quran__stat-card" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.06 }}>
            <span className="quran__stat-icon">{s.icon}</span>
            <span className="quran__stat-val">{s.val}</span>
            <span className="quran__stat-label">{s.label}</span>
          </motion.div>
        ))}
      </div>

      {/* ── Search ────────────────────────────────────── */}
      <div className="quran__search">
        <Search size={15} className="quran__search-icon" />
        <input type="text" placeholder="Search surah by name or Arabic…" value={search} onChange={e => setSearch(e.target.value)} className="quran__search-input" />
        {search && <button onClick={() => setSearch('')} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', padding: 0 }}><X size={13} /></button>}
      </div>

      {/* ── Search results ────────────────────────────── */}
      {search ? (
        <motion.div className="quran__surah-list" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
          {filteredSurahs.length === 0
            ? <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '2rem 0' }}>No surahs found</p>
            : filteredSurahs.map((surah, i) => (
              <motion.button key={surah.number} className="quran__surah-row" initial={{ opacity: 0, x: -14 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.015 }} onClick={() => navigate(`/quran/reader/${surah.number}`)}>
                <div className="quran__surah-num">{surah.number}</div>
                <div className="quran__surah-info">
                  <div className="quran__surah-names">
                    <span className="quran__surah-en">{surah.name}</span>
                    <span className="quran__surah-badge">{surah.type}</span>
                  </div>
                  <span className="quran__surah-ar">{surah.arabic}</span>
                </div>
                <div className="quran__surah-right">
                  <span className="quran__surah-ayahs">{surah.ayahs} ayahs</span>
                  <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                </div>
              </motion.button>
            ))}
        </motion.div>
      ) : (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}>

          {/* ── Quick Selection ──────────────────────── */}
          <GlassCard padding="lg" hover={false} glow style={{ marginBottom: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
              <Target size={15} style={{ color: 'var(--color-emerald)' }} />
              <span style={{ fontWeight: 800, fontSize: '0.92rem' }}>Quick Selection</span>
            </div>

            <div className="quran__mode-tabs">
              {[
                { id: 'surah',       label: 'Surah',  emoji: '📖' },
                { id: 'juz',         label: 'Juz',    emoji: '🕋' },
                { id: 'hizb',        label: 'Xizb',   emoji: '🌀' },
                { id: 'hizbQuarter', label: 'Maqrah', emoji: '💠' },
                { id: 'page',        label: 'Page',   emoji: '📜' },
              ].map(m => (
                <button key={m.id} type="button" onClick={() => setActiveSelectorMode(m.id)} className={`quran__tab ${activeSelectorMode === m.id ? 'quran__tab--active' : ''}`}>
                  {m.emoji} {m.label}
                </button>
              ))}
            </div>

            <AnimatePresence mode="wait">
              <motion.div key={activeSelectorMode} className="quran__selector-panel" initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.18 }}>

                {activeSelectorMode === 'surah' && (
                  <div>
                    <h5>Choose Surah &amp; Ayah Range</h5>
                    <select className="quran__form-select" value={selectedSurah} onChange={e => { setSelectedSurah(e.target.value); setSelectedAyah('1'); setSelectedEndAyah('1'); }}>
                      <option value="" disabled>— Select a Surah —</option>
                      {SURAH_NAMES.map((name, i) => <option key={i + 1} value={i + 1}>{i + 1}. {name} ({SURAH_ARABIC_NAMES[i]})</option>)}
                    </select>
                    {selectedSurah && (
                      <motion.div initial={{ opacity: 0, y: 6 }} animate={{ opacity: 1, y: 0 }}>
                        <AyahScrollPicker
                          totalAyahs={ALL_SURAH_META[parseInt(selectedSurah) - 1].ayahs}
                          startAyah={parseInt(selectedAyah)}
                          endAyah={parseInt(selectedEndAyah)}
                          onStartChange={v => { setSelectedAyah(String(v)); if (parseInt(selectedEndAyah) < v) setSelectedEndAyah(String(v)); }}
                          onEndChange={v => setSelectedEndAyah(String(v))}
                        />
                      </motion.div>
                    )}
                  </div>
                )}

                {activeSelectorMode === 'juz'         && <NumGrid count={30}  selected={selectedJuz}    onSelect={setSelectedJuz}    label="Juz" />}
                {activeSelectorMode === 'hizb'        && <NumGrid count={60}  selected={selectedHizb}   onSelect={setSelectedHizb}   label="Xizb" />}
                {activeSelectorMode === 'hizbQuarter' && <NumGrid count={240} selected={selectedMaqrah} onSelect={setSelectedMaqrah} label="Maqrah" />}
                {activeSelectorMode === 'page'        && <NumGrid count={604} selected={selectedPage}   onSelect={setSelectedPage}   label="Page" />}

              </motion.div>
            </AnimatePresence>

            <motion.button
              type="button"
              disabled={!isReadyToStart}
              onClick={handleStart}
              whileTap={{ scale: 0.97 }}
              style={{
                width: '100%', marginTop: '0.85rem', padding: '0.8rem', borderRadius: '14px', border: 'none',
                background: isReadyToStart ? 'linear-gradient(90deg,#10b981,#f59e0b)' : 'rgba(255,255,255,0.05)',
                color: isReadyToStart ? 'white' : 'var(--text-muted)',
                fontWeight: 800, fontSize: '0.88rem',
                cursor: isReadyToStart ? 'pointer' : 'not-allowed',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                boxShadow: isReadyToStart ? '0 4px 20px rgba(16,185,129,0.3)' : 'none',
                transition: 'all 0.25s ease', fontFamily: 'var(--font-sans)',
              }}
            >
              <BookOpen size={15} />
              {isReadyToStart ? 'Start Reading ›' : 'Select an option above'}
            </motion.button>
          </GlassCard>

          {/* ── Bookmarks ─────────────────────────────── */}
          {quranBookmarks && quranBookmarks.length > 0 && (
            <div style={{ marginBottom: '1.5rem' }}>
              <h3 className="quran__section-title"><span>⭐</span> Bookmarks</h3>
              <div className="quran__surah-list">
                {quranBookmarks.map(bm => (
                  <button key={bm.id} className="quran__surah-row" onClick={() => navigate(`/quran/reader/${bm.surah}`)}>
                    <div className="quran__surah-num" style={{ background: 'rgba(245,158,11,0.12)', borderColor: 'rgba(245,158,11,0.25)', color: 'var(--color-gold)' }}>★</div>
                    <div className="quran__surah-info">
                      <div className="quran__surah-names"><span className="quran__surah-en">{SURAH_NAMES[bm.surah - 1] || `Surah ${bm.surah}`}</span></div>
                      <span className="quran__surah-ar">{SURAH_ARABIC_NAMES[bm.surah - 1]}</span>
                    </div>
                    <div className="quran__surah-right">
                      <span className="quran__surah-ayahs">Ayah {bm.ayah}</span>
                      <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* ── All Surahs ────────────────────────────── */}
          <h3 className="quran__section-title"><span>📚</span> All Surahs</h3>
          <div className="quran__surah-list">
            {SURAH_NAMES.map((name, i) => {
              const meta = ALL_SURAH_META[i];
              return (
                <motion.button
                  key={i + 1} className="quran__surah-row"
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-30px' }}
                  transition={{ duration: 0.22 }}
                  onClick={() => navigate(`/quran/reader/${i + 1}`)}
                >
                  <div className="quran__surah-num">{i + 1}</div>
                  <div className="quran__surah-info">
                    <div className="quran__surah-names">
                      <span className="quran__surah-en">{name}</span>
                      <span className="quran__surah-badge">{meta?.type}</span>
                    </div>
                    <span className="quran__surah-ar">{SURAH_ARABIC_NAMES[i]}</span>
                  </div>
                  <div className="quran__surah-right">
                    <span className="quran__surah-ayahs">{meta?.ayahs} ayahs</span>
                    <ArrowRight size={13} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
      )}

      {/* ── Goal Modal ────────────────────────────────── */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="quran__modal-overlay">
            <motion.div className="quran__modal" initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}>
              <div className="quran__modal-header">
                <h3>Daily Reading Goal</h3>
                <button className="quran__modal-close" onClick={() => setShowGoalModal(false)}><X size={18} /></button>
              </div>
              <form onSubmit={handleSaveGoal} className="quran__modal-form">
                <div className="quran__form-group">
                  <label className="quran__form-label">Goal Metric</label>
                  <select value={tempGoalType} onChange={e => { setTempGoalType(e.target.value); setTempGoalValue(1); }} className="quran__form-select">
                    <option value="ayah">Ayahs</option>
                    <option value="page">Pages</option>
                    <option value="maqrah">Maqrahs (Rub el Hizb)</option>
                    <option value="hizb">Hizbs</option>
                    <option value="juz">Juzs</option>
                  </select>
                </div>
                <div className="quran__form-group">
                  <label className="quran__form-label">Daily Target</label>
                  <div className="quran__stepper">
                    <button type="button" onClick={() => setTempGoalValue(v => Math.max(1, v - 1))} className="quran__step-btn"><Minus size={14} /></button>
                    <span className="quran__step-val">{tempGoalValue}</span>
                    <button type="button" onClick={() => setTempGoalValue(v => Math.min(150, v + 1))} className="quran__step-btn"><Plus size={14} /></button>
                  </div>
                  <span className="quran__form-info-hint">
                    ~{tempGoalType === 'juz' ? tempGoalValue * 20 : tempGoalType === 'hizb' ? tempGoalValue * 10 : tempGoalType === 'maqrah' ? Math.ceil(tempGoalValue * 2.5) : tempGoalType === 'ayah' ? Math.ceil(tempGoalValue / 15) : tempGoalValue} pages/day
                  </span>
                </div>
                <div className="quran__modal-actions">
                  <Button variant="ghost" type="button" onClick={() => setShowGoalModal(false)}>Cancel</Button>
                  <Button variant="emerald" type="submit">Save Goal</Button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

