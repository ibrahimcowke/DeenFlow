import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useLocation } from 'react-router-dom';
import { Search, Heart, RotateCcw, Volume2, Plus, Sparkles, BookOpen, Clock, Activity, Copy, Check, Trash2 } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import RingProgress from '../../components/ui/RingProgress';
import Button from '../../components/ui/Button';
import { useAppStore } from '../../store';
import { MORNING_AZKAR, EVENING_AZKAR, AFTER_SALAH_AZKAR, DUA_COLLECTIONS } from '../../utils/islamicData';
import './Azkar.css';

const AZKAR_CATEGORIES = [
  { id: 'morning',   label: 'Morning',     emoji: '🌅', data: MORNING_AZKAR },
  { id: 'evening',   label: 'Evening',     emoji: '🌇', data: EVENING_AZKAR },
  { id: 'afterSalah',label: 'After Salah', emoji: '🕌', data: AFTER_SALAH_AZKAR },
];

const DUA_CATS = ['All', 'Morning', 'Sleep', 'Meals', 'Travel', 'Anxiety', 'Forgiveness', 'Protection', 'Health'];

const DEFAULT_TASBIH_PHRASES = [
  { arabic: 'سُبْحَانَ اللَّهِ', transliteration: 'Subhan Allah', translation: 'Glory be to Allah', count: 33 },
  { arabic: 'الْحَمْدُ لِلَّهِ', transliteration: 'Alhamdulillah', translation: 'Praise be to Allah', count: 33 },
  { arabic: 'اللَّهُ أَكْبَرُ', transliteration: 'Allahu Akbar', translation: 'Allah is the Greatest', count: 33 },
  { arabic: 'أَسْتَغْفِرُ اللَّهَ', transliteration: 'Astaghfirullah', translation: 'I seek Allah\'s forgiveness', count: 100 },
  { arabic: 'لَا حَوْلَ وَلَا قُوَّةَ إِلَّا بِاللَّهِ', transliteration: 'La hawla wa la quwwata illa billah', translation: 'There is no power nor strength except with Allah', count: 33 }
];

export default function Azkar() {
  const location = useLocation();
  const getDefaultTab = () => {
    if (location.pathname.includes('/dua')) return 'dua';
    if (location.pathname.includes('/tasbih')) return 'tasbih';
    return 'daily';
  };

  const [activeMainTab, setActiveMainTab] = useState(getDefaultTab());
  const { setAzkarProgress } = useAppStore();

  // ── Tab 1: Daily Azkar State ────────────────────────────────
  const [activeAzkarCategory, setActiveAzkarCategory] = useState('morning');
  const [azkarCounters, setAzkarCounters] = useState({});

  const activeCatObj = AZKAR_CATEGORIES.find(c => c.id === activeAzkarCategory) || AZKAR_CATEGORIES[0];
  const currentAzkarList = activeCatObj.data;

  // Sound oscillator for feedback
  const playTactileClick = () => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.frequency.setValueAtTime(1200, ctx.currentTime); // 1.2kHz sound
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05); // quick release
      
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      console.log("Audio feedback error", e);
    }
  };

  // Mobile haptic vibration helper
  const triggerHaptic = () => {
    if (window.navigator && window.navigator.vibrate) {
      window.navigator.vibrate(40);
    }
  };

  const tapDhikr = (id, target) => {
    playTactileClick();
    triggerHaptic();
    
    const current = azkarCounters[id] || 0;
    const next = Math.min(current + 1, target);
    
    const nextCounters = { ...azkarCounters, [id]: next };
    setAzkarCounters(nextCounters);
    
    if (next >= target && current < target) {
      const completedCount = currentAzkarList.filter(a => (nextCounters[a.id] || 0) >= a.count).length;
      setAzkarProgress(activeAzkarCategory, { completed: completedCount });
    }
  };

  const totalDoneAzkar = currentAzkarList.filter(a => (azkarCounters[a.id] || 0) >= a.count).length;
  const completionPct = currentAzkarList.length ? (totalDoneAzkar / currentAzkarList.length) * 100 : 0;

  // ── Tab 2: Tasbih Counter State ─────────────────────────────
  const [customPhrases, setCustomPhrases] = useState([]);
  const [activePhraseIndex, setActivePhraseIndex] = useState(0);
  const [tasbihCount, setTasbihCount] = useState(0);
  const [tasbihTarget, setTasbihTarget] = useState(33); // 33, 99, 100, 'unlimited'
  
  // Custom phrase form
  const [showAddForm, setShowAddForm] = useState(false);
  const [customAr, setCustomAr] = useState('');
  const [customTr, setCustomTr] = useState('');
  const [customEn, setCustomEn] = useState('');
  const [customCt, setCustomCt] = useState(33);

  const allPhrases = [...DEFAULT_TASBIH_PHRASES, ...customPhrases];
  const selectedPhrase = allPhrases[activePhraseIndex] || allPhrases[0];

  const handleTasbihTap = () => {
    playTactileClick();
    triggerHaptic();
    
    const nextCount = tasbihCount + 1;
    const targetReached = typeof tasbihTarget === 'number' && nextCount >= tasbihTarget;
    
    setTasbihCount(targetReached ? tasbihTarget : nextCount);
    
    if (targetReached && tasbihCount < tasbihTarget) {
      setTimeout(playTactileClick, 100);
    }
  };

  const resetTasbih = () => {
    setTasbihCount(0);
  };

  const addCustomPhrase = (e) => {
    e.preventDefault();
    if (!customAr.trim() || !customTr.trim()) return;
    const newPhrase = {
      arabic: customAr,
      transliteration: customTr,
      translation: customEn,
      count: customCt,
      custom: true
    };
    setCustomPhrases(prev => [...prev, newPhrase]);
    setActivePhraseIndex(allPhrases.length); // switch to the new phrase
    setCustomAr('');
    setCustomTr('');
    setCustomEn('');
    setShowAddForm(false);
    resetTasbih();
  };

  const deleteCustomPhrase = (indexToDelete) => {
    const defaultLen = DEFAULT_TASBIH_PHRASES.length;
    const customIndex = indexToDelete - defaultLen;
    setCustomPhrases(prev => prev.filter((_, i) => i !== customIndex));
    setActivePhraseIndex(0);
    resetTasbih();
  };

  const currentTasbihProgress = typeof tasbihTarget === 'number' ? (tasbihCount / tasbihTarget) * 100 : 100;

  // ── Tab 3: Dua Center State ─────────────────────────────────
  const [activeDuaCat, setActiveDuaCat] = useState('All');
  const [duaSearch, setDuaSearch] = useState('');
  const [favoritedDuas, setFavoritedDuas] = useState([]);
  const [copiedId, setCopiedId] = useState(null);

  const toggleDuaFav = (id) => {
    setFavoritedDuas(prev => 
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]
    );
  };

  const copyToClipboard = (dua) => {
    const textToCopy = `${dua.arabic}\n\n${dua.translation}\n(${dua.source})`;
    navigator.clipboard.writeText(textToCopy)
      .then(() => {
        setCopiedId(dua.id);
        setTimeout(() => setCopiedId(null), 2000);
      })
      .catch(err => console.error("Clipboard copy failed", err));
  };

  const filteredDuas = DUA_COLLECTIONS.filter(d => 
    (activeDuaCat === 'All' || d.category === activeDuaCat) &&
    (d.translation.toLowerCase().includes(duaSearch.toLowerCase()) || 
     d.arabic.includes(duaSearch) || 
     d.category.toLowerCase().includes(duaSearch.toLowerCase()))
  );

  return (
    <div className="azkar-hub page-container">
      {/* Remembrance Header */}
      <div className="azkar-hub__header">
        <div>
          <motion.h1 className="azkar-hub__title" initial={{ opacity:0, y:-20 }} animate={{ opacity:1, y:0 }}>
            Remembrance Center
          </motion.h1>
          <p className="azkar-hub__sub">Dhikr, daily azkar logs, custom tasbih counters, and authentic Duas</p>
        </div>
      </div>

      {/* Unified Tab Navigation */}
      <div className="azkar-hub__nav">
        {[
          { id: 'daily', label: 'Daily Azkar', icon: '🌅' },
          { id: 'tasbih', label: 'Tasbih Counter', icon: '📿' },
          { id: 'dua', label: 'Dua Book', icon: '🤲' }
        ].map(tab => (
          <button 
            key={tab.id}
            className={`azkar-hub__nav-btn ${activeMainTab === tab.id ? 'azkar-hub__nav-btn--active' : ''}`}
            onClick={() => setActiveMainTab(tab.id)}
          >
            <span style={{ marginRight: '0.4rem' }}>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      <hr className="azkar-hub__divider" />

      {/* Main Tab Render Panel */}
      <div className="azkar-hub__panel">
        <AnimatePresence mode="wait">
          {activeMainTab === 'daily' && (
            <motion.div 
              key="daily" 
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Daily Azkar Header Row */}
              <div className="azkar-hub__section-header">
                <div>
                  <h3 className="azkar-hub__section-title">Daily Azkar Trackers</h3>
                  <p className="azkar-hub__section-sub">Read and tap to record daily remembrances</p>
                </div>
                <RingProgress value={completionPct} size={64} strokeWidth={6} color="var(--color-gold)">
                  <span style={{ fontSize: '0.8rem', fontWeight: 800, color: 'var(--color-gold)' }}>
                    {totalDoneAzkar}/{currentAzkarList.length}
                  </span>
                </RingProgress>
              </div>

              {/* Sub-categories */}
              <div className="azkar-hub__subcats">
                {AZKAR_CATEGORIES.map(c => (
                  <button 
                    key={c.id}
                    className={`azkar-hub__subcat-btn ${activeAzkarCategory === c.id ? 'azkar-hub__subcat-btn--active' : ''}`}
                    onClick={() => setActiveAzkarCategory(c.id)}
                  >
                    <span style={{ marginRight: '0.35rem' }}>{c.emoji}</span>
                    {c.label}
                  </button>
                ))}
              </div>

              {/* Dhikr cards */}
              <div className="azkar-hub__cards-list">
                {currentAzkarList.map((dhikr, idx) => {
                  const current = azkarCounters[dhikr.id] || 0;
                  const completed = current >= dhikr.count;
                  const pctFill = (current / dhikr.count) * 100;

                  return (
                    <GlassCard 
                      key={dhikr.id} 
                      className={`azkar-hub__card ${completed ? 'azkar-hub__card--completed' : ''}`}
                      padding="lg"
                      delay={idx * 0.05}
                    >
                      <span className="azkar-hub__card-num">#{idx + 1}</span>
                      <p className="azkar-hub__card-arabic">{dhikr.arabic}</p>
                      <p className="azkar-hub__card-translit">{dhikr.transliteration}</p>
                      <p className="azkar-hub__card-trans">{dhikr.translation}</p>

                      {/* Progress Bar */}
                      <div className="azkar-hub__progress-bg">
                        <div className="azkar-hub__progress-fg" style={{ width: `${pctFill}%` }} />
                      </div>

                      <div className="azkar-hub__card-footer">
                        <span className="azkar-hub__card-status">
                          {completed ? '✓ Completed' : `${current} of ${dhikr.count} repetitions`}
                        </span>
                        {!completed ? (
                          <button 
                            className="azkar-hub__tap-btn"
                            onClick={() => tapDhikr(dhikr.id, dhikr.count)}
                          >
                            Tap (+1)
                          </button>
                        ) : (
                          <span className="azkar-hub__card-check">✅</span>
                        )}
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeMainTab === 'tasbih' && (
            <motion.div 
              key="tasbih"
              className="azkar-hub__tasbih"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              <div className="azkar-hub__tasbih-layout">
                
                {/* Left Panel: Dhikr Phrase Selection & Custom Creator */}
                <div className="azkar-hub__tasbih-phrases" style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h4 className="azkar-hub__tasbih-subheading" style={{ margin: 0 }}>Select Phrase</h4>
                    <button 
                      onClick={() => setShowAddForm(!showAddForm)}
                      style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.25)', color: 'var(--color-emerald)', padding: '0.3rem 0.65rem', borderRadius: '6px', cursor: 'pointer', fontSize: '0.75rem', fontWeight: 600 }}
                    >
                      {showAddForm ? 'Cancel' : '+ Custom Phrase'}
                    </button>
                  </div>

                  {/* Add custom phrase form */}
                  <AnimatePresence>
                    {showAddForm && (
                      <motion.form 
                        onSubmit={addCustomPhrase}
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', padding: '1rem', borderRadius: '12px', overflow: 'hidden' }}
                      >
                        <input 
                          type="text" placeholder="Arabic text..." required
                          value={customAr} onChange={e => setCustomAr(e.target.value)}
                          className="azkar-hub__input"
                        />
                        <input 
                          type="text" placeholder="Transliteration..." required
                          value={customTr} onChange={e => setCustomTr(e.target.value)}
                          className="azkar-hub__input"
                        />
                        <input 
                          type="text" placeholder="English translation..."
                          value={customEn} onChange={e => setCustomEn(e.target.value)}
                          className="azkar-hub__input"
                        />
                        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginTop: '0.25rem' }}>
                          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Target Count:</span>
                          <input 
                            type="number" min="1" max="999" required
                            value={customCt} onChange={e => setCustomCt(parseInt(e.target.value) || 33)}
                            className="azkar-hub__input" style={{ width: '80px' }}
                          />
                          <Button variant="emerald" type="submit" style={{ padding: '0.4rem 1rem', marginLeft: 'auto' }}>Add</Button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="azkar-hub__phrases-grid" style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', maxHeight: '380px', overflowY: 'auto', paddingRight: '4px' }}>
                    {allPhrases.map((phrase, idx) => (
                      <div 
                        key={idx}
                        style={{ display: 'flex', width: '100%', gap: '0.5rem' }}
                      >
                        <button 
                          className={`azkar-hub__phrase-btn ${activePhraseIndex === idx ? 'azkar-hub__phrase-btn--active' : ''}`}
                          onClick={() => { setActivePhraseIndex(idx); setTasbihTarget(phrase.count || 33); resetTasbih(); }}
                          style={{ flex: 1, textAlign: 'left' }}
                        >
                          <span className="azkar-hub__phrase-ar" style={{ display: 'block', direction: 'rtl', textAlign: 'right', fontSize: '0.95rem' }}>{phrase.arabic}</span>
                          <span className="azkar-hub__phrase-trans">{phrase.transliteration}</span>
                        </button>
                        {phrase.custom && (
                          <button 
                            onClick={() => deleteCustomPhrase(idx)}
                            style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#EF4444', width: '36px', borderRadius: '8px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                            title="Delete custom phrase"
                          >
                            <Trash2 size={14} style={{ margin: 'auto' }} />
                          </button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Right Panel: Main Counter Circle Display */}
                <div className="azkar-hub__tasbih-counter">
                  <GlassCard className="azkar-hub__tasbih-card" padding="lg" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                    {/* Active Phrase info */}
                    <div className="azkar-hub__active-phrase" style={{ textAlign: 'center', width: '100%', marginBottom: '1.25rem' }}>
                      <p className="azkar-hub__active-arabic" style={{ fontSize: '1.5rem', color: 'var(--color-gold)', fontFamily: 'var(--font-arabic)', direction: 'rtl', margin: '0 0 0.5rem 0' }}>{selectedPhrase.arabic}</p>
                      <p className="azkar-hub__active-translit" style={{ fontWeight: 700, margin: '0 0 0.25rem 0' }}>{selectedPhrase.transliteration}</p>
                      <p className="azkar-hub__active-translation" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', margin: 0 }}>"{selectedPhrase.translation}"</p>
                    </div>

                    {/* Circular Tap Counter */}
                    <div className="azkar-hub__ring-wrapper" style={{ display: 'flex', justifyContent: 'center', cursor: 'pointer', marginBottom: '1.5rem' }}>
                      <motion.div 
                        className="azkar-hub__tap-circle"
                        onClick={handleTasbihTap}
                        whileTap={{ scale: 0.94 }}
                        style={{ borderRadius: '50%', padding: '4px', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)' }}
                      >
                        <RingProgress 
                          value={currentTasbihProgress} 
                          size={180} 
                          strokeWidth={10} 
                          color="var(--color-emerald)"
                          glow={tasbihCount >= tasbihTarget}
                        >
                          <div className="azkar-hub__tap-inside" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                            <span className="azkar-hub__tap-label" style={{ fontSize: '0.65rem', color: 'var(--text-secondary)', letterSpacing: '0.1em' }}>TAP</span>
                            <span className="azkar-hub__tap-count" style={{ fontSize: '3rem', fontWeight: 900, color: 'white', lineHeight: 1.1 }}>{tasbihCount}</span>
                            <span className="azkar-hub__tap-target" style={{ fontSize: '0.75rem', color: 'var(--color-emerald)', fontWeight: 600 }}>
                              Target: {typeof tasbihTarget === 'number' ? tasbihTarget : '∞'}
                            </span>
                          </div>
                        </RingProgress>
                      </motion.div>
                    </div>

                    {/* Reset & Setup */}
                    <div className="azkar-hub__tasbih-actions">
                      <div className="azkar-hub__targets">
                        {[33, 99, 100, 'unlimited'].map(target => (
                          <button
                            key={target}
                            className={`azkar-hub__target-btn ${tasbihTarget === target ? 'azkar-hub__target-btn--active' : ''}`}
                            onClick={() => { setTasbihTarget(target); resetTasbih(); }}
                            style={{ padding: '0.35rem 0.65rem', fontSize: '0.75rem', borderRadius: '6px', border: '1px solid var(--glass-border)', color: 'white', cursor: 'pointer', background: tasbihTarget === target ? 'var(--color-emerald)' : 'rgba(255,255,255,0.03)' }}
                          >
                            {target === 'unlimited' ? '∞' : target}
                          </button>
                        ))}
                      </div>

                      <Button variant="ghost" onClick={resetTasbih} className="azkar-hub__reset-btn" style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}>
                        <RotateCcw size={14} style={{ marginRight: '0.25rem' }} />
                        Reset
                      </Button>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeMainTab === 'dua' && (
            <motion.div 
              key="dua"
              initial={{ opacity: 0, y: 15 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.25 }}
            >
              {/* Dua Hub Header & Search */}
              <div className="azkar-hub__dua-header">
                <div>
                  <h3 className="azkar-hub__section-title">Dua Center</h3>
                  <p className="azkar-hub__section-sub">Supplications from the Quran and authentic Sunnah</p>
                </div>
                <div className="azkar-hub__search">
                  <Search size={16} className="azkar-hub__search-icon" />
                  <input 
                    type="text" 
                    placeholder="Search duas, categories..."
                    value={duaSearch}
                    onChange={(e) => setDuaSearch(e.target.value)}
                    className="azkar-hub__search-input"
                  />
                </div>
              </div>

              {/* Dua categories tabs */}
              <div className="azkar-hub__subcats">
                {DUA_CATS.map(c => (
                  <button 
                    key={c}
                    className={`azkar-hub__subcat-btn ${activeDuaCat === c ? 'azkar-hub__subcat-btn--active' : ''}`}
                    onClick={() => setActiveDuaCat(c)}
                  >
                    {c}
                  </button>
                ))}
              </div>

              {/* Dua list */}
              <div className="azkar-hub__cards-list">
                {filteredDuas.length === 0 ? (
                  <GlassCard className="azkar-hub__empty-duas" padding="lg">
                    <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>No authentic Duas found matching your query.</p>
                  </GlassCard>
                ) : (
                  filteredDuas.map((d, idx) => (
                    <GlassCard 
                      key={d.id} 
                      className="azkar-hub__card"
                      padding="lg"
                      delay={idx * 0.05}
                    >
                      <div className="azkar-hub__dua-card-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem' }}>
                        <span className="azkar-hub__dua-tag">{d.category}</span>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          {/* Share Clipboard button */}
                          <button 
                            className="azkar-hub__dua-fav"
                            onClick={() => copyToClipboard(d)}
                            title="Copy Dua to clipboard"
                            style={{ color: copiedId === d.id ? 'var(--color-emerald)' : 'var(--text-secondary)' }}
                          >
                            {copiedId === d.id ? <Check size={16} /> : <Copy size={16} />}
                          </button>
                          
                          <button 
                            className={`azkar-hub__dua-fav ${favoritedDuas.includes(d.id) ? 'azkar-hub__dua-fav--active' : ''}`}
                            onClick={() => toggleDuaFav(d.id)}
                          >
                            <Heart size={16} fill={favoritedDuas.includes(d.id) ? 'currentColor' : 'none'} />
                          </button>
                        </div>
                      </div>
                      <p className="azkar-hub__dua-arabic">{d.arabic}</p>
                      <p className="azkar-hub__dua-translation">{d.translation}</p>
                      <span className="azkar-hub__dua-source">{d.source}</span>
                    </GlassCard>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
