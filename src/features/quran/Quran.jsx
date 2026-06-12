import { useState } from 'react';
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

export default function Quran() {
  const navigate = useNavigate();
  const { quranProgress, goals, setGoals, quranBookmarks } = useAppStore();
  const [activeTab, setActiveTab] = useState('All');
  const [search, setSearch] = useState('');
  
  // Edit Goal modal state
  const [showGoalModal, setShowGoalModal] = useState(false);
  const [tempGoalType, setTempGoalType] = useState(goals.quranGoalType || 'page');
  const [tempGoalValue, setTempGoalValue] = useState(goals.quranGoalValue || 5);

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
          { icon: '📚', label: 'Juz Done', val: Math.floor(quranProgress.totalPages / 20) },
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
        <div className="quran__dropdown-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
          {/* Surah Dropdown */}
          <GlassCard className="quran__selector-card" padding="md" hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📖</span>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Select Surah</h4>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Jump straight to a Surah recitation</p>
            <select
              className="quran__form-select"
              onChange={(e) => {
                if (e.target.value) navigate(`/quran/reader/${e.target.value}`);
              }}
              defaultValue=""
            >
              <option value="" disabled>-- Choose Surah --</option>
              {SURAH_NAMES.map((name, i) => (
                <option key={i + 1} value={i + 1}>
                  {i + 1}. {name} ({SURAH_ARABIC_NAMES[i]})
                </option>
              ))}
            </select>
          </GlassCard>

          {/* Juz Dropdown */}
          <GlassCard className="quran__selector-card" padding="md" hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>🕋</span>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Select Juz (Part)</h4>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Start reading from a specific Juz</p>
            <select
              className="quran__form-select"
              onChange={(e) => {
                if (e.target.value) {
                  navigate(`/quran/reader?type=juz&id=${e.target.value}`);
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>-- Choose Juz --</option>
              {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                <option key={juz} value={juz}>
                  Juz {juz}
                </option>
              ))}
            </select>
          </GlassCard>

          {/* Page Dropdown */}
          <GlassCard className="quran__selector-card" padding="md" hover={false}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>📜</span>
              <h4 style={{ fontWeight: 700, fontSize: '0.95rem' }}>Select Page</h4>
            </div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginBottom: '1rem' }}>Navigate directly to a page number</p>
            <select
              className="quran__form-select"
              onChange={(e) => {
                if (e.target.value) {
                  navigate(`/quran/reader?type=page&id=${e.target.value}`);
                }
              }}
              defaultValue=""
            >
              <option value="" disabled>-- Choose Page --</option>
              {Array.from({ length: 604 }, (_, i) => i + 1).map((page) => (
                <option key={page} value={page}>
                  Page {page}
                </option>
              ))}
            </select>
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
