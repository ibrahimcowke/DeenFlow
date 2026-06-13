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

// ─── Ayah Stepper Picker ─────────────────────────────────────────────────────
function AyahStepper({ label, value, min, max, onChange }) {
  const canDec = value > min;
  const canInc = value < max;

  // Press-and-hold support
  const holdRef = useRef(null);
  const startHold = (dir) => {
    const step = () => {
      onChange(prev => {
        const next = prev + dir;
        if (next < min || next > max) return prev;
        return next;
      });
    };
    step();
    holdRef.current = setInterval(step, 120);
  };
  const stopHold = () => clearInterval(holdRef.current);

  return (
    <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
      <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
        {label}
      </span>

      {/* + button */}
      <button
        type="button"
        onMouseDown={() => startHold(1)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(1)}
        onTouchEnd={stopHold}
        disabled={!canInc}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          border: canInc ? '1.5px solid rgba(16,185,129,0.35)' : '1.5px solid var(--glass-border)',
          background: canInc ? 'rgba(16,185,129,0.10)' : 'transparent',
          color: canInc ? 'var(--color-emerald)' : 'var(--text-muted)',
          fontSize: '1.4rem', fontWeight: 700,
          cursor: canInc ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s ease',
          lineHeight: 1,
        }}
      >＋</button>

      {/* Value display */}
      <div style={{
        width: '100%',
        padding: '0.6rem 0',
        background: 'rgba(16,185,129,0.07)',
        border: '1px solid rgba(16,185,129,0.18)',
        borderRadius: '14px',
        textAlign: 'center',
      }}>
        <span style={{ fontSize: '1.6rem', fontWeight: 900, color: 'var(--color-emerald)', lineHeight: 1 }}>
          {value}
        </span>
      </div>

      {/* - button */}
      <button
        type="button"
        onMouseDown={() => startHold(-1)}
        onMouseUp={stopHold}
        onMouseLeave={stopHold}
        onTouchStart={() => startHold(-1)}
        onTouchEnd={stopHold}
        disabled={!canDec}
        style={{
          width: 44, height: 44, borderRadius: '50%',
          border: canDec ? '1.5px solid rgba(16,185,129,0.35)' : '1.5px solid var(--glass-border)',
          background: canDec ? 'rgba(16,185,129,0.10)' : 'transparent',
          color: canDec ? 'var(--color-emerald)' : 'var(--text-muted)',
          fontSize: '1.4rem', fontWeight: 700,
          cursor: canDec ? 'pointer' : 'not-allowed',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          transition: 'all 0.15s ease',
          lineHeight: 1,
        }}
      >－</button>
    </div>
  );
}

function AyahScrollPicker({ totalAyahs, startAyah, endAyah, onStartChange, onEndChange }) {
  const count = endAyah - startAyah + 1;

  const handleStartChange = (updater) => {
    const newVal = typeof updater === 'function' ? updater(startAyah) : updater;
    onStartChange(newVal);
    // Push end forward if it fell behind
    if (endAyah < newVal) onEndChange(newVal);
  };

  const handleEndChange = (updater) => {
    const newVal = typeof updater === 'function' ? updater(endAyah) : updater;
    onEndChange(newVal);
  };

  return (
    <div style={{ marginTop: '1.25rem', width: '100%' }}>
      <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>

        {/* Start stepper */}
        <AyahStepper
          label="From"
          value={startAyah}
          min={1}
          max={totalAyahs}
          onChange={handleStartChange}
        />

        {/* Live count badge in centre */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '0.2rem',
          minWidth: 52,
          paddingTop: '1.6rem', // align with value display
        }}>
          <motion.span
            key={count}
            initial={{ scale: 1.4, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            style={{
              fontSize: '1.75rem',
              fontWeight: 900,
              color: count > 0 ? 'var(--color-gold)' : 'var(--text-muted)',
              lineHeight: 1,
            }}
          >
            {count}
          </motion.span>
          <span style={{ fontSize: '0.55rem', color: 'var(--text-muted)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>
            Ayah{count !== 1 ? 's' : ''}
          </span>
          <span style={{ fontSize: '0.5rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>selected</span>
        </div>

        {/* End stepper */}
        <AyahStepper
          label="To"
          value={endAyah}
          min={startAyah}
          max={totalAyahs}
          onChange={handleEndChange}
        />
      </div>

      {/* Progress bar showing fraction of surah selected */}
      <div style={{ marginTop: '1rem', position: 'relative' }}>
        <div style={{
          height: 6, borderRadius: 99,
          background: 'rgba(255,255,255,0.06)',
          border: '1px solid var(--glass-border)',
          overflow: 'hidden',
        }}>
          <motion.div
            animate={{ width: `${(count / totalAyahs) * 100}%` }}
            transition={{ type: 'spring', stiffness: 200, damping: 25 }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, var(--color-emerald), var(--color-gold))',
              borderRadius: 99,
            }}
          />
        </div>
        <div style={{
          display: 'flex', justifyContent: 'space-between',
          marginTop: '0.3rem',
          fontSize: '0.6rem', color: 'var(--text-muted)',
        }}>
          <span>Ayah {startAyah}</span>
          <span style={{ color: 'var(--color-emerald)', fontWeight: 600 }}>
            {Math.round((count / totalAyahs) * 100)}% of Surah
          </span>
          <span>Ayah {endAyah}</span>
        </div>
      </div>
    </div>
  );
}
// ────────────────────────────────────────────────────────────────────────────


export default function Quran() {

  const navigate = useNavigate();
  const { quranProgress, goals, setGoals, quranBookmarks, userProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  
  // Edit Goal modal state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoalType, setTempGoalType] = useState(goals.quranGoalType || 'page');
  const [tempGoalValue, setTempGoalValue] = useState(goals.quranGoalValue || 5);

  // Selector drop-down states
  const [activeSelectorMode, setActiveSelectorMode] = useState('surah');
  const [selectedSurah, setSelectedSurah] = useState('');
  const [selectedAyah, setSelectedAyah] = useState('1');
  const [selectedEndAyah, setSelectedEndAyah] = useState('1');
  const [selectedJuz, setSelectedJuz] = useState('');
  const [selectedHizb, setSelectedHizb] = useState('');
  const [selectedMaqrah, setSelectedMaqrah] = useState('');
  const [selectedPage, setSelectedPage] = useState('');

  const goalPct = Math.min((quranProgress.todayPages / goals.quranPagesDaily) * 100, 100);

  // Search filter across the full 114 Surahs
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

    setGoals({
      quranGoalType: tempGoalType,
      quranGoalValue: tempGoalValue,
      quranPagesDaily: calculatedPages
    });
    setShowGoalModal(false);
  };

  return (
    <div className="quran page-container">
      {/* Header */}
      <motion.div className="quran__header" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        <h1 className="quran__title">
          <span className="text-gradient-emerald">Quran</span> Center
        </h1>
        <p className="quran__sub">القرآن الكريم</p>
      </motion.div>

      {/* Goal Card */}
      <GlassCard className="quran__goal-card" delay={0.1} glow>
        <div className="quran__goal-body">
          <div className="quran__goal-left">
            <div className="quran__goal-icon">📖</div>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <h3 className="quran__goal-title">Daily Goal</h3>
                <button 
                  onClick={() => {
                    setTempGoalType(goals.quranGoalType || 'page');
                    setTempGoalValue(goals.quranGoalValue || 5);
                    setShowGoalModal(true);
                  }}
                  className="quran__edit-goal-btn"
                  title="Change daily reading goal"
                >
                  <Settings size={14} />
                  <span>Edit Goal</span>
                </button>
              </div>
              <p className="quran__goal-pgs">
                {quranProgress.todayPages} / {goals.quranPagesDaily} pages 
                {goals.quranGoalType && ` (${goals.quranGoalValue} ${goals.quranGoalType}${goals.quranGoalValue > 1 ? 's' : ''})`}
              </p>
              <p className="quran__goal-last">Last: Surah Al-Baqarah · Page {quranProgress.lastPage}</p>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
                <span style={{ fontSize: '0.75rem', color: 'var(--color-emerald)' }}>🔥 {quranProgress.streak} day streak</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Total: {quranProgress.totalPages} pages</span>
              </div>
            </div>
          </div>
          <RingProgress value={goalPct} size={90} stroke={7} color="var(--color-emerald)" glow animated>
            <span style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--color-emerald)' }}>{Math.round(goalPct)}%</span>
          </RingProgress>
        </div>
        <Button variant="primary" size="lg" fullWidth icon={BookOpen} onClick={() => navigate('/quran/reader')}>
          Continue Reading
        </Button>
      </GlassCard>

      {/* Stats Row */}
      <div className="quran__stats-row">
        {[
          { icon: '📜', label: 'Pages Read', val: quranProgress.totalPages },
          { icon: '🔥', label: 'Day Streak', val: `${quranProgress.streak}d` },
          { icon: '✨', label: 'Hasanat Earned', val: userProfile.totalHasanat || 0 },
          { icon: '⭐', label: 'Bookmarks', val: quranBookmarks.length },
        ].map((s, i) => (
          <GlassCard key={s.label} className="quran__stat-card" delay={0.15 + i * 0.05} padding="sm">
            <span className="quran__stat-icon">{s.icon}</span>
            <span className="quran__stat-val">{s.val}</span>
            <span className="quran__stat-label">{s.label}</span>
          </GlassCard>
        ))}
      </div>

      {/* Search */}
      <div className="quran__search">
        <Search size={16} className="quran__search-icon" />
        <input
          type="text" placeholder="Search Surah..."
          value={search} onChange={e => setSearch(e.target.value)}
          className="quran__search-input"
        />
      </div>

      {/* Selector Dropdowns (shown when search is empty) */}
      {!search ? (
        <div style={{ marginBottom: '2rem' }}>
          <GlassCard className="quran__unified-selector-card" padding="lg" hover={false} glow>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              {/* Selector Mode Tabs */}
              <div>
                <h4 style={{ fontWeight: 700, fontSize: '0.95rem', marginBottom: '0.75rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎯</span> Quick Selection Mode
                </h4>
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.5rem' }}>
                  {[
                    { id: 'surah', label: 'Surah & Ayah', emoji: '📖' },
                    { id: 'juz', label: 'Juz (Part)', emoji: '🕋' },
                    { id: 'hizb', label: 'Hizb (Xizb)', emoji: '🌀' },
                    { id: 'hizbQuarter', label: 'Maqrah (Quarter)', emoji: '💠' },
                    { id: 'page', label: 'Page', emoji: '📜' }
                  ].map(mode => (
                    <button
                      key={mode.id}
                      type="button"
                      onClick={() => setActiveSelectorMode(mode.id)}
                      className={`quran__tab ${activeSelectorMode === mode.id ? 'quran__tab--active' : ''}`}
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.35rem',
                        border: activeSelectorMode === mode.id ? '1px solid var(--color-emerald)' : '1px solid var(--glass-border)',
                        background: activeSelectorMode === mode.id ? 'rgba(16, 185, 129, 0.15)' : 'var(--glass-bg)'
                      }}
                    >
                      <span>{mode.emoji}</span>
                      <span>{mode.label}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Dynamic Inputs Container */}
              <div style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '16px', padding: '1.25rem' }}>
                {activeSelectorMode === 'surah' && (
                  <div>
                    <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Choose Surah & Ayah Range</h5>
                    <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
                      <div style={{ flex: '2 1 200px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                        <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Surah</label>
                        <select
                          className="quran__form-select"
                          value={selectedSurah}
                          onChange={(e) => {
                            setSelectedSurah(e.target.value);
                            setSelectedAyah('1');
                            setSelectedEndAyah('1');
                          }}
                        >
                          <option value="" disabled>-- Choose Surah --</option>
                          {SURAH_NAMES.map((name, i) => (
                            <option key={i + 1} value={i + 1}>
                              {i + 1}. {name} ({SURAH_ARABIC_NAMES[i]})
                            </option>
                          ))}
                        </select>
                      </div>

                      {selectedSurah && (
                        <AyahScrollPicker
                          totalAyahs={ALL_SURAH_META[parseInt(selectedSurah) - 1].ayahs}
                          startAyah={parseInt(selectedAyah)}
                          endAyah={parseInt(selectedEndAyah)}
                          onStartChange={(v) => {
                            setSelectedAyah(String(v));
                            if (parseInt(selectedEndAyah) < v) setSelectedEndAyah(String(v));
                          }}
                          onEndChange={(v) => setSelectedEndAyah(String(v))}
                        />
                      )}
                    </div>
                    {selectedSurah && (
                      <div style={{ 
                        marginTop: '1rem', 
                        padding: '0.65rem 0.85rem', 
                        background: 'rgba(16, 185, 129, 0.08)', 
                        border: '1px solid rgba(16, 185, 129, 0.15)', 
                        borderRadius: '12px', 
                        fontSize: '0.85rem', 
                        color: 'var(--color-emerald)', 
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.5rem',
                        fontWeight: 600
                      }}>
                        <span>📊</span> Selected: {parseInt(selectedEndAyah) - parseInt(selectedAyah) + 1} Ayah{parseInt(selectedEndAyah) - parseInt(selectedAyah) + 1 > 1 ? 's' : ''} to read
                      </div>
                    )}
                  </div>
                )}

                {activeSelectorMode === 'juz' && (
                  <div>
                    <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Choose Juz (Part)</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Juz Number (1 to 30)</label>
                      <select
                        className="quran__form-select"
                        value={selectedJuz}
                        onChange={(e) => setSelectedJuz(e.target.value)}
                      >
                        <option value="" disabled>-- Choose Juz --</option>
                        {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                          <option key={juz} value={juz}>
                            Juz {juz}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {activeSelectorMode === 'hizb' && (
                  <div>
                    <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Choose Xizb (Hizb)</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Hizb Number (1 to 60)</label>
                      <select
                        className="quran__form-select"
                        value={selectedHizb}
                        onChange={(e) => setSelectedHizb(e.target.value)}
                      >
                        <option value="" disabled>-- Choose Xizb --</option>
                        {Array.from({ length: 60 }, (_, i) => i + 1).map((hizb) => (
                          <option key={hizb} value={hizb}>
                            Hizb {hizb}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {activeSelectorMode === 'hizbQuarter' && (
                  <div>
                    <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Choose Maqrah (Hizb Quarter)</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Quarter Number (1 to 240)</label>
                      <select
                        className="quran__form-select"
                        value={selectedMaqrah}
                        onChange={(e) => setSelectedMaqrah(e.target.value)}
                      >
                        <option value="" disabled>-- Choose Maqrah --</option>
                        {Array.from({ length: 240 }, (_, i) => i + 1).map((quarter) => (
                          <option key={quarter} value={quarter}>
                            Maqrah {quarter} (Quarter)
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {activeSelectorMode === 'page' && (
                  <div>
                    <h5 style={{ fontWeight: 700, marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Choose Page</h5>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                      <label style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>Page Number (1 to 604)</label>
                      <select
                        className="quran__form-select"
                        value={selectedPage}
                        onChange={(e) => setSelectedPage(e.target.value)}
                      >
                        <option value="" disabled>-- Choose Page --</option>
                        {Array.from({ length: 604 }, (_, i) => i + 1).map((page) => (
                          <option key={page} value={page}>
                            Page {page}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Button */}
              <div>
                <Button
                  variant="emerald"
                  fullWidth
                  icon={BookOpen}
                  disabled={
                    activeSelectorMode === 'surah' ? !selectedSurah
                    : activeSelectorMode === 'juz' ? !selectedJuz
                    : activeSelectorMode === 'hizb' ? !selectedHizb
                    : activeSelectorMode === 'hizbQuarter' ? !selectedMaqrah
                    : !selectedPage
                  }
                  onClick={() => {
                    if (activeSelectorMode === 'surah') {
                      navigate(`/quran/reader/${selectedSurah}?startAyah=${selectedAyah}&endAyah=${selectedEndAyah}`);
                    } else if (activeSelectorMode === 'juz') {
                      navigate(`/quran/reader?type=juz&id=${selectedJuz}`);
                    } else if (activeSelectorMode === 'hizb') {
                      navigate(`/quran/reader?type=hizb&id=${selectedHizb}`);
                    } else if (activeSelectorMode === 'hizbQuarter') {
                      navigate(`/quran/reader?type=hizbQuarter&id=${selectedMaqrah}`);
                    } else {
                      navigate(`/quran/reader?type=page&id=${selectedPage}`);
                    }
                  }}
                >
                  Start Selected Reading
                </Button>
              </div>

            </div>
          </GlassCard>
        </div>
      ) : (
        /* Surah Search List (shown when search is active) */
        <div className="quran__surah-list">
          {filteredSurahs.map((surah, i) => (
            <motion.button
              key={surah.number}
              className="quran__surah-row"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 + i * 0.02 }}
              onClick={() => navigate(`/quran/reader/${surah.number}`)}
              whileHover={{ x: 4 }}
            >
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
                <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
              </div>
            </motion.button>
          ))}
        </div>
      )}

      {/* Bookmarks Section (shown when search is empty) */}
      {!search && quranBookmarks && quranBookmarks.length > 0 && (
        <div style={{ marginTop: '1.5rem' }}>
          <h3 style={{ fontSize: '1.125rem', fontWeight: 700, marginBottom: '0.75rem' }}>Your Bookmarks</h3>
          <div className="quran__surah-list">
            {quranBookmarks.map((bm) => {
              const surahIdx = bm.surah - 1;
              const surahName = SURAH_NAMES[surahIdx] || `Surah ${bm.surah}`;
              const surahArabic = SURAH_ARABIC_NAMES[surahIdx] || '';
              return (
                <button
                  key={bm.id}
                  className="quran__surah-row"
                  onClick={() => navigate(`/quran/reader/${bm.surah}`)}
                  style={{ display: 'flex', alignItems: 'center', width: '100%', gap: '1rem', background: 'var(--glass-bg)', padding: '1rem', borderRadius: '12px', border: '1px solid var(--glass-border)', textAlign: 'left', cursor: 'pointer' }}
                >
                  <div className="quran__surah-num" style={{ color: 'var(--color-gold)' }}>★</div>
                  <div className="quran__surah-info" style={{ flex: 1 }}>
                    <span className="quran__surah-en" style={{ fontWeight: 700 }}>{surahName}</span>
                    <span className="quran__surah-ar" style={{ float: 'right', fontFamily: 'var(--font-arabic)', fontSize: '0.9rem' }}>{surahArabic}</span>
                  </div>
                  <div className="quran__surah-right" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Ayah {bm.ayah}</span>
                    <ArrowRight size={14} style={{ color: 'var(--text-muted)' }} />
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}

      {/* Goal Edit Modal Overlay */}
      <AnimatePresence>
        {showGoalModal && (
          <div className="quran__modal-overlay">
            <motion.div 
              className="quran__modal"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
            >
              <div className="quran__modal-header">
                <h3>Set Daily Reading Goal</h3>
                <button className="quran__modal-close" onClick={() => setShowGoalModal(false)}>
                  <X size={18} />
                </button>
              </div>

              <form onSubmit={handleSaveGoal} className="quran__modal-form">
                <div className="quran__form-group">
                  <label className="quran__form-label">Goal Metric</label>
                  <select 
                    value={tempGoalType} 
                    onChange={(e) => {
                      setTempGoalType(e.target.value);
                      setTempGoalValue(1);
                    }}
                    className="quran__form-select"
                  >
                    <option value="ayah">Ayahs</option>
                    <option value="page">Pages</option>
                    <option value="maqrah">Maqrahs (Rub el Hizb)</option>
                    <option value="hizb">Hizbs</option>
                    <option value="juz">Juzs</option>
                  </select>
                </div>

                <div className="quran__form-group">
                  <label className="quran__form-label">Target repetitions / count</label>
                  <div className="quran__stepper">
                    <button type="button" onClick={() => setTempGoalValue(v => Math.max(1, v - 1))} className="quran__step-btn">
                      <Minus size={14} />
                    </button>
                    <span className="quran__step-val">{tempGoalValue}</span>
                    <button type="button" onClick={() => setTempGoalValue(v => Math.min(150, v + 1))} className="quran__step-btn">
                      <Plus size={14} />
                    </button>
                  </div>
                  <span className="quran__form-info-hint">
                    Calculated daily work: ~{
                      tempGoalType === 'juz' ? tempGoalValue * 20 
                      : tempGoalType === 'hizb' ? tempGoalValue * 10
                      : tempGoalType === 'maqrah' ? Math.ceil(tempGoalValue * 2.5)
                      : tempGoalType === 'ayah' ? Math.ceil(tempGoalValue / 15)
                      : tempGoalValue
                    } pages.
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
