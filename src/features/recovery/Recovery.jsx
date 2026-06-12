import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Flame, Shield, Activity, BookOpen, BrainCircuit, Calendar, Award, 
  MessageSquare, Phone, Lock, Unlock, Settings, AlertCircle, Plus, X, 
  ChevronRight, UserCheck, Heart, Info, HelpCircle, Share2, Power, EyeOff, 
  Timer, Trash2, CheckCircle2, MessageCircle
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import RingProgress from '../../components/ui/RingProgress';
import Button from '../../components/ui/Button';
import { useAppStore } from '../../store';
import './Recovery.css';

const ACHIEVEMENTS = [
  { days: 3, title: 'First Steps', desc: 'Maintain sobriety for 3 days', emoji: '🎯' },
  { days: 7, title: 'Week One Completed', desc: 'Sobriety for 1 week', emoji: '🛡️' },
  { days: 14, title: 'Fortress of Will', desc: 'Sobriety for 14 days', emoji: '🏰' },
  { days: 30, title: 'Reboot Phase 1', desc: 'Sobriety for 30 days', emoji: '🧠' },
  { days: 60, title: 'Cellular Renewal', desc: 'Sobriety for 60 days', emoji: '🧬' },
  { days: 90, title: 'Prefrontal Rewire', desc: 'Sobriety for 90 days', emoji: '⚡' },
  { days: 180, title: 'Pure Soul', desc: 'Sobriety for 180 days', emoji: '🕊️' },
  { days: 365, title: 'Al-Barakah Year', desc: 'Sobriety for 365 days', emoji: '👑' }
];

const MOODS = [
  { id: 'Calm', emoji: '😌', label: 'Calm' },
  { id: 'Bored', emoji: '🥱', label: 'Bored' },
  { id: 'Lonely', emoji: '😔', label: 'Lonely' },
  { id: 'Angry', emoji: '😡', label: 'Angry' },
  { id: 'Stressed', emoji: '😰', label: 'Stressed' },
  { id: 'Tired', emoji: '😴', label: 'Tired' },
  { id: 'Anxious', emoji: '😬', label: 'Anxious' }
];

const TRIGGERS = [
  'Boredom',
  'Loneliness',
  'Stress',
  'Social Media',
  'Late-night phone usage',
  'Fatigue',
  'Anxiety'
];

export default function Recovery() {
  const navigate = useNavigate();
  
  const { 
    recovery, 
    setRecoveryEnabled, 
    recordRecoveryUrge,
    addRecoveryJournal,
    deleteRecoveryJournal,
    updateProtectionMode,
    addSobrietyReason,
    removeSobrietyReason,
    addSosContact,
    removeSosContact,
    userProfile
  } = useAppStore();

  const [activeTab, setActiveTab] = useState('overview'); // 'overview', 'urges', 'journal', 'insights', 'profile'
  
  // Ticking sobriety clock
  const [sobrietyTime, setSobrietyTime] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  // Urge Log form states
  const [logOutcome, setLogOutcome] = useState('resist'); // 'resist', 'relapse'
  const [logIntensity, setLogIntensity] = useState(5);
  const [logMood, setLogMood] = useState('Calm');
  const [logTrigger, setLogTrigger] = useState('Boredom');
  const [logTime, setLogTime] = useState('Night');
  const [logNotes, setLogNotes] = useState('');
  const [logSuccess, setLogSuccess] = useState(false);

  // Journal form states
  const [journalReflection, setJournalReflection] = useState('');
  const [journalLessons, setJournalLessons] = useState('');
  const [journalVictory, setJournalVictory] = useState('');
  const [journalMood, setJournalMood] = useState('Calm');
  const [journalSuccess, setJournalSuccess] = useState(false);

  // Accountability and SOS form states
  const [partnerName, setPartnerName] = useState('');
  const [partnerPhone, setPartnerPhone] = useState('');
  const [showInviteCopied, setShowInviteCopied] = useState(false);
  const [newReasonText, setNewReasonText] = useState('');

  // Protection / Focus mode simulation
  const [focusActive, setFocusActive] = useState(false);
  const [focusDuration, setFocusDuration] = useState(30); // minutes
  const [focusTimeLeft, setFocusTimeLeft] = useState(0); // seconds
  const [focusUnlockHold, setFocusUnlockHold] = useState(0); // progress bar 0-100 for exit
  const [isHoldingUnlock, setIsHoldingUnlock] = useState(false);

  const getSobrietyStartDate = () => {
    const lastRelapseLog = recovery.logs?.find(l => l.outcome === 'relapse');
    return lastRelapseLog ? lastRelapseLog.date : (recovery.startDate || new Date().toISOString());
  };

  // Ticking clock effect
  useEffect(() => {
    if (!recovery.enabled || !recovery.startDate) return;
    
    const updateClock = () => {
      const start = new Date(getSobrietyStartDate()).getTime();
      const now = new Date().getTime();
      const diff = now - start;
      
      if (diff <= 0) {
        setSobrietyTime({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }
      
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      setSobrietyTime({ days, hours, minutes, seconds });
    };
    
    updateClock();
    const interval = setInterval(updateClock, 1000);
    return () => clearInterval(interval);
  }, [recovery.enabled, recovery.startDate, recovery.logs]);

  // Focus mode countdown effect
  useEffect(() => {
    let interval = null;
    if (focusActive && focusTimeLeft > 0) {
      interval = setInterval(() => {
        setFocusTimeLeft(t => t - 1);
      }, 1000);
    } else if (focusActive && focusTimeLeft === 0) {
      setFocusActive(false);
    }
    return () => clearInterval(interval);
  }, [focusActive, focusTimeLeft]);

  // Focus mode hold-to-unlock effect
  useEffect(() => {
    let interval = null;
    if (isHoldingUnlock) {
      interval = setInterval(() => {
        setFocusUnlockHold(h => {
          if (h >= 100) {
            setFocusActive(false);
            setIsHoldingUnlock(false);
            return 0;
          }
          return h + 5;
        });
      }, 50);
    } else {
      setFocusUnlockHold(0);
    }
    return () => clearInterval(interval);
  }, [isHoldingUnlock]);

  if (!recovery.enabled) {
    return (
      <div className="waaci page-container">
        <div className="waaci__hero">
          <div className="waaci__hero-glow" />
          <motion.div 
            className="waaci__hero-content"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <div className="waaci__hero-logo">Waaci</div>
            <h1 className="waaci__hero-title">Spiritual Recovery Companion</h1>
            <p className="waaci__hero-subtitle">
              A scientific, private, and commitment-focused recovery tool for Muslim youth. 
              Track streaks, analyze triggers, log daily reflections, and shield your mind.
            </p>
            <div className="waaci__hero-features">
              <div className="waaci__feat-row">🛡️ <span>100% Private, Local Storage Only</span></div>
              <div className="waaci__feat-row">📊 <span>Urge Logging & Trigger Pattern Analysis</span></div>
              <div className="waaci__feat-row">🧠 <span>AI Risk Predictions & Recommendations</span></div>
              <div className="waaci__feat-row">🔒 <span>Protection Mode (App/Website Blocker)</span></div>
            </div>
            <Button variant="emerald" size="lg" className="waaci__enable-btn" onClick={() => setRecoveryEnabled(true)}>
              Initialize Waaci Dashboard
            </Button>
          </motion.div>
        </div>
      </div>
    );
  }

  // Handle logging an urge event
  const handleLogUrgeSubmit = (e) => {
    e.preventDefault();
    recordRecoveryUrge(
      logOutcome === 'resist',
      parseInt(logIntensity),
      logMood,
      logTrigger,
      logTime,
      logNotes
    );
    setLogSuccess(true);
    setLogNotes('');
    setTimeout(() => {
      setLogSuccess(false);
    }, 3000);
  };

  // Handle saving journal entry
  const handleJournalSubmit = (e) => {
    e.preventDefault();
    addRecoveryJournal(journalReflection, journalLessons, journalVictory, journalMood);
    setJournalReflection('');
    setJournalLessons('');
    setJournalVictory('');
    setJournalSuccess(true);
    setTimeout(() => {
      setJournalSuccess(false);
    }, 3000);
  };

  // Handle adding custom reasons
  const handleAddReason = (e) => {
    e.preventDefault();
    if (newReasonText.trim()) {
      addSobrietyReason(newReasonText.trim());
      setNewReasonText('');
    }
  };

  // Handle adding SOS Sponsor
  const handleAddContact = (e) => {
    e.preventDefault();
    if (partnerName.trim() && partnerPhone.trim()) {
      addSosContact(partnerName.trim(), partnerPhone.trim());
      setPartnerName('');
      setPartnerPhone('');
    }
  };

  // Copy sync code
  const handleCopyCode = () => {
    const code = `WAACI-${userProfile.name?.toUpperCase() || 'IBRAHIM'}-786`;
    navigator.clipboard.writeText(code);
    setShowInviteCopied(true);
    setTimeout(() => setShowInviteCopied(false), 2000);
  };

  // Generate GitHub-style Heatmap Cells (last 12 weeks = 84 days)
  const generateHeatmap = () => {
    const grid = [];
    const today = new Date();
    const currentDayOfWeek = today.getDay(); // 0 = Sun, 6 = Sat
    
    // Start grid at Sunday 11 weeks ago
    const startOfCurrentWeek = new Date(today);
    startOfCurrentWeek.setDate(today.getDate() - currentDayOfWeek);
    
    const gridStartDate = new Date(startOfCurrentWeek);
    gridStartDate.setDate(startOfCurrentWeek.getDate() - 11 * 7);
    
    for (let i = 0; i < 84; i++) {
      const cellDate = new Date(gridStartDate);
      cellDate.setDate(gridStartDate.getDate() + i);
      
      const dateKey = `${cellDate.getFullYear()}-${String(cellDate.getMonth() + 1).padStart(2, '0')}-${String(cellDate.getDate()).padStart(2, '0')}`;
      
      // Check store's heatmap object.
      // If no status is saved, check if date is today or past. If so, default to 'clean' status
      // (no urge logged = clean). If future, leave undefined.
      let status = recovery.heatmap?.[dateKey];
      const isFuture = cellDate > today;
      if (!status && !isFuture) {
        status = 'clean'; // default to clean for past days
      }
      
      grid.push({
        date: cellDate,
        dateKey,
        status, // 'clean', 'difficult', 'relapse', undefined
        isFuture,
        isToday: dateKey === `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, '0')}-${String(today.getDate()).padStart(2, '0')}`
      });
    }
    return grid;
  };

  const heatmapCells = generateHeatmap();

  // AI insights risk prediction logic
  const getAiRiskAssessment = () => {
    const now = new Date();
    const threeDaysAgo = new Date(now.getTime() - 3 * 24 * 60 * 60 * 1000);
    const recentLogs = recovery.logs?.filter(l => new Date(l.date) >= threeDaysAgo) || [];
    
    const hasRelapse = recentLogs.some(l => l.outcome === 'relapse');
    const hasIntenseUrge = recentLogs.some(l => l.outcome === 'resist' && l.intensity >= 7);
    
    if (hasRelapse) {
      return {
        level: 'High Risk Alert',
        score: 88,
        color: '#EF4444',
        advice: 'Receptor overload detected. Your dopamine pathways are hyper-sensitized. Lock your phone, take a cold shower immediately, and make direct contact with your sponsor.',
        alert: 'Highly vulnerable to repeat slips. Activate focus mode immediately.'
      };
    } else if (hasIntenseUrge) {
      return {
        level: 'Elevated Vulnerability',
        score: 55,
        color: '#F59E0B',
        advice: 'You successfully resisted an intense craving recently. Be aware of the "chaser effect". Avoid late-night browsing and ensure your physical environment is clean.',
        alert: 'Post-urge buffer active. Willpower is currently depleted.'
      };
    } else {
      return {
        level: 'Clean & Stable',
        score: 12,
        color: '#10B981',
        advice: 'Your neural baseline is resting stably. Continue committing daily, stay connected to your daily prayers, and maintain your habits.',
        alert: 'Neural receptor levels stabilizing. Keep doing what you are doing.'
      };
    }
  };

  const aiAssessment = getAiRiskAssessment();

  // Calculate trigger analytics values
  const getTriggerAnalytics = () => {
    const logs = recovery.logs || [];
    const counts = {};
    TRIGGERS.forEach(t => { counts[t] = 0; });
    
    let totalUrges = 0;
    logs.forEach(l => {
      if (counts[l.trigger] !== undefined) {
        counts[l.trigger] += 1;
        totalUrges += 1;
      }
    });

    // Sort triggers by count
    const sorted = Object.entries(counts).sort((a, b) => b[1] - a[1]);
    const topTrigger = sorted[0]?.[1] > 0 ? sorted[0][0] : 'None Logged';

    return { counts, totalUrges, topTrigger, sorted };
  };

  const triggerStats = getTriggerAnalytics();

  // Trigger app/web toggles helper
  const handleToggleApp = (app) => {
    const list = recovery.protectionMode?.blockedApps || [];
    const updated = list.includes(app) ? list.filter(a => a !== app) : [...list, app];
    updateProtectionMode({ blockedApps: updated });
  };

  const handleToggleWebsite = (web) => {
    const list = recovery.protectionMode?.blockedWebsites || [];
    const updated = list.includes(web) ? list.filter(w => w !== web) : [...list, web];
    updateProtectionMode({ blockedWebsites: updated });
  };

  // Trigger Focus Mode
  const startFocusSession = () => {
    setFocusTimeLeft(focusDuration * 60);
    setFocusActive(true);
  };

  return (
    <div className="waaci page-container">
      {/* Top Brand Header */}
      <div className="waaci__top-header">
        <div className="waaci__brand">
          <Shield size={28} className="waaci__brand-icon" />
          <div>
            <h1 className="waaci__brand-name">Waaci Recovery</h1>
            <p className="waaci__brand-tag">Commitment. Tracking. Neural Rewiring.</p>
          </div>
        </div>
        
        <div className="waaci__top-actions">
          <Button variant="danger" className="waaci__sos-trigger" onClick={() => navigate('/recovery/emergency')}>
            🚨 Emergency SOS
          </Button>
        </div>
      </div>

      {/* Main Tab Screen Area */}
      <div className="waaci__main-content">
        <AnimatePresence mode="wait">
          {activeTab === 'overview' && (
            <motion.div 
              key="overview"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="waaci__tab-view"
            >
              {/* Sobriety Clock Circle & Stats Block */}
              <div className="waaci__grid-overview">
                <GlassCard className="waaci__stat-hero" glow padding="xl">
                  <div className="waaci__hero-clock-flex">
                    <div className="waaci__ring-container">
                      <RingProgress 
                        value={Math.min((recovery.currentStreak / 30) * 100, 100)} 
                        size={170} 
                        strokeWidth={12} 
                        color="var(--color-emerald)"
                      >
                        <div className="waaci__ring-inner">
                          <Flame size={32} className="waaci__flame-glow" />
                          <span className="waaci__streak-val">{recovery.currentStreak}</span>
                          <span className="waaci__streak-lbl">Clean Days</span>
                        </div>
                      </RingProgress>
                    </div>

                    <div className="waaci__timer-wrapper">
                      <span className="waaci__timer-meta">Live Sobriety Duration</span>
                      <div className="waaci__ticking-digits">
                        <div className="waaci__digit-block">
                          <span className="waaci__digit">{String(sobrietyTime.days).padStart(2, '0')}</span>
                          <span className="waaci__digit-lbl">Days</span>
                        </div>
                        <span className="waaci__digit-sep">:</span>
                        <div className="waaci__digit-block">
                          <span className="waaci__digit">{String(sobrietyTime.hours).padStart(2, '0')}</span>
                          <span className="waaci__digit-lbl">Hours</span>
                        </div>
                        <span className="waaci__digit-sep">:</span>
                        <div className="waaci__digit-block">
                          <span className="waaci__digit">{String(sobrietyTime.minutes).padStart(2, '0')}</span>
                          <span className="waaci__digit-lbl">Mins</span>
                        </div>
                        <span className="waaci__digit-sep">:</span>
                        <div className="waaci__digit-block">
                          <span className="waaci__digit">{String(sobrietyTime.seconds).padStart(2, '0')}</span>
                          <span className="waaci__digit-lbl">Secs</span>
                        </div>
                      </div>
                      
                      <div className="waaci__micro-stats">
                        <div className="waaci__micro-stat-card">
                          <span className="waaci__micro-lbl">Longest Streak</span>
                          <span className="waaci__micro-val">{recovery.longestStreak} Days</span>
                        </div>
                        <div className="waaci__micro-stat-card">
                          <span className="waaci__micro-lbl">Recovery Score</span>
                          <span className="waaci__micro-val">{recovery.score}%</span>
                        </div>
                        <div className="waaci__micro-stat-card">
                          <span className="waaci__micro-lbl">Relapses</span>
                          <span className="waaci__micro-val">{recovery.relapseCount || 0}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </GlassCard>
              </div>

              {/* GitHub-style Heatmap Calendar */}
              <div className="waaci__section-heading">
                <Calendar size={18} />
                <h2>Recovery Heatmap</h2>
              </div>
              <GlassCard padding="lg" className="waaci__heatmap-card">
                <p className="waaci__heatmap-sub">
                  Visual calendar of your recovery path. Days are updated based on urges logged.
                </p>
                <div className="waaci__heatmap-wrapper">
                  <div className="waaci__heatmap-grid">
                    {heatmapCells.map((cell) => {
                      let cellClass = 'waaci__heatmap-cell';
                      if (cell.status === 'clean') cellClass += ' waaci__heatmap-cell--clean';
                      if (cell.status === 'difficult') cellClass += ' waaci__heatmap-cell--difficult';
                      if (cell.status === 'relapse') cellClass += ' waaci__heatmap-cell--relapse';
                      if (cell.isToday) cellClass += ' waaci__heatmap-cell--today';
                      
                      return (
                        <div 
                          key={cell.dateKey} 
                          className={cellClass}
                          title={`${cell.date.toLocaleDateString(undefined, { month: 'short', day: 'numeric', year: 'numeric' })}: ${
                            cell.status === 'clean' ? 'Clean Day' : 
                            cell.status === 'difficult' ? 'Difficult Day (Urges Avoided)' : 
                            cell.status === 'relapse' ? 'Relapse Event' : 'No Data'
                          }`}
                        />
                      );
                    })}
                  </div>
                </div>
                <div className="waaci__heatmap-legend">
                  <div className="waaci__legend-lbl">Less</div>
                  <div className="waaci__heatmap-cell" />
                  <div className="waaci__heatmap-cell waaci__heatmap-cell--clean" title="Clean Day" />
                  <div className="waaci__heatmap-cell waaci__heatmap-cell--difficult" title="Difficult Day (Resisted)" />
                  <div className="waaci__heatmap-cell waaci__heatmap-cell--relapse" title="Relapse Reset" />
                  <div className="waaci__legend-lbl">More</div>
                </div>
              </GlassCard>

              {/* Achievements Badges Grid */}
              <div className="waaci__section-heading">
                <Award size={18} />
                <h2>Recovery Achievements</h2>
              </div>
              <div className="waaci__achievements-grid">
                {ACHIEVEMENTS.map((ach) => {
                  const isUnlocked = recovery.longestStreak >= ach.days;
                  return (
                    <GlassCard 
                      key={ach.days}
                      className={`waaci__achievement-card ${isUnlocked ? 'waaci__achievement-card--unlocked' : ''}`}
                      padding="md"
                    >
                      <div className="waaci__ach-badge">
                        <span className="waaci__ach-emoji">{ach.emoji}</span>
                        {!isUnlocked && <Lock size={14} className="waaci__ach-lock" />}
                      </div>
                      <div className="waaci__ach-info">
                        <h4 className="waaci__ach-title">{ach.title}</h4>
                        <p className="waaci__ach-desc">{ach.desc}</p>
                        <span className="waaci__ach-days">{ach.days} Days Target</span>
                      </div>
                    </GlassCard>
                  );
                })}
              </div>
            </motion.div>
          )}

          {activeTab === 'urges' && (
            <motion.div 
              key="urges"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="waaci__tab-view"
            >
              <div className="waaci__sub-layout">
                {/* Form to Log Urges */}
                <div className="waaci__sub-col">
                  <GlassCard padding="lg">
                    <h2 className="waaci__sub-title">Log Urge Encounter</h2>
                    <p className="waaci__sub-desc">Log your cravings to map out patterns and protect yourself.</p>
                    
                    <form onSubmit={handleLogUrgeSubmit} className="waaci__form">
                      <div className="waaci__form-group">
                        <label className="waaci__label">Outcome</label>
                        <div className="waaci__toggle-buttons">
                          <button
                            type="button"
                            className={`waaci__toggle-btn waaci__toggle-btn--resist ${logOutcome === 'resist' ? 'active' : ''}`}
                            onClick={() => setLogOutcome('resist')}
                          >
                            🛡️ I Resisted It
                          </button>
                          <button
                            type="button"
                            className={`waaci__toggle-btn waaci__toggle-btn--relapse ${logOutcome === 'relapse' ? 'active' : ''}`}
                            onClick={() => setLogOutcome('relapse')}
                          >
                            ⚠️ I Slipped (Reset)
                          </button>
                        </div>
                      </div>

                      <div className="waaci__form-group">
                        <div className="waaci__slider-header">
                          <label className="waaci__label">Urge Intensity (1-10)</label>
                          <span className="waaci__slider-badge" style={{ backgroundColor: logIntensity >= 7 ? 'rgba(239, 68, 68, 0.15)' : logIntensity >= 4 ? 'rgba(245, 158, 11, 0.15)' : 'rgba(16, 185, 129, 0.15)', color: logIntensity >= 7 ? '#ef4444' : logIntensity >= 4 ? '#f59e0b' : '#10b981' }}>
                            {logIntensity} - {
                              logIntensity >= 8 ? 'Extreme' : 
                              logIntensity >= 5 ? 'Strong' : 
                              logIntensity >= 3 ? 'Mild' : 'Fleeting'
                            }
                          </span>
                        </div>
                        <input
                          type="range"
                          min="1"
                          max="10"
                          value={logIntensity}
                          onChange={(e) => setLogIntensity(parseInt(e.target.value))}
                          className="waaci__slider"
                        />
                      </div>

                      <div className="waaci__form-group">
                        <label className="waaci__label">What was your trigger?</label>
                        <select
                          value={logTrigger}
                          onChange={(e) => setLogTrigger(e.target.value)}
                          className="waaci__select"
                        >
                          {TRIGGERS.map(t => (
                            <option key={t} value={t}>{t}</option>
                          ))}
                        </select>
                      </div>

                      <div className="waaci__form-group">
                        <label className="waaci__label">Time of Day</label>
                        <select
                          value={logTime}
                          onChange={(e) => setLogTime(e.target.value)}
                          className="waaci__select"
                        >
                          <option value="Morning">Morning (5 AM - 12 PM)</option>
                          <option value="Afternoon">Afternoon (12 PM - 5 PM)</option>
                          <option value="Evening">Evening (5 PM - 9 PM)</option>
                          <option value="Night">Night (9 PM - 5 AM)</option>
                        </select>
                      </div>

                      <div className="waaci__form-group">
                        <label className="waaci__label">Current Mood State</label>
                        <div className="waaci__moods-grid">
                          {MOODS.map(m => (
                            <button
                              key={m.id}
                              type="button"
                              className={`waaci__mood-badge ${logMood === m.id ? 'active' : ''}`}
                              onClick={() => setLogMood(m.id)}
                            >
                              <span>{m.emoji}</span>
                              <span>{m.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      <div className="waaci__form-group">
                        <label className="waaci__label">Reflective Notes</label>
                        <textarea
                          placeholder="What environmental factors caused this? How can you prevent it next time?"
                          value={logNotes}
                          onChange={(e) => setLogNotes(e.target.value)}
                          className="waaci__textarea"
                          rows={3}
                        />
                      </div>

                      {logSuccess && (
                        <div className="waaci__success-msg">
                          ✓ Urge logged successfully! Keep fighting.
                        </div>
                      )}

                      <Button variant="emerald" type="submit" fullWidth>
                        Save Urge Log Entry
                      </Button>
                    </form>
                  </GlassCard>
                </div>

                {/* Trigger Analysis & Patterns */}
                <div className="waaci__sub-col">
                  <GlassCard padding="lg">
                    <h2 className="waaci__sub-title">Trigger Pattern Analysis</h2>
                    <p className="waaci__sub-desc">Identify which situations require cognitive firewalling.</p>

                    <div className="waaci__trigger-dashboard">
                      <div className="waaci__primary-trigger-card">
                        <span className="waaci__primary-lbl">Top Trigger Source</span>
                        <span className="waaci__primary-val">{triggerStats.topTrigger}</span>
                      </div>
                      <div className="waaci__primary-trigger-card">
                        <span className="waaci__primary-lbl">Cravings Resisted</span>
                        <span className="waaci__primary-val">{recovery.urgesAvoided} Times</span>
                      </div>
                    </div>

                    <div className="waaci__trigger-list">
                      <h4 className="waaci__trigger-list-title">Trigger Frequencies</h4>
                      {triggerStats.sorted.map(([trig, count]) => {
                        const percent = triggerStats.totalUrges > 0 ? Math.round((count / triggerStats.totalUrges) * 100) : 0;
                        return (
                          <div key={trig} className="waaci__trigger-row">
                            <div className="waaci__trig-text-row">
                              <span className="waaci__trig-name">{trig}</span>
                              <span className="waaci__trig-percent">{count} logs ({percent}%)</span>
                            </div>
                            <div className="waaci__trig-progress">
                              <div className="waaci__trig-bar" style={{ width: `${percent || 2}%`, backgroundColor: trig === triggerStats.topTrigger ? 'var(--color-emerald)' : 'rgba(255,255,255,0.15)' }} />
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </GlassCard>

                  {/* Urge History Feed */}
                  <div style={{ marginTop: '1.5rem' }} />
                  <GlassCard padding="lg">
                    <h2 className="waaci__sub-title">Recent Encounters</h2>
                    <div className="waaci__timeline-feed">
                      {(recovery.logs || []).length === 0 ? (
                        <p className="waaci__empty-msg">No urges logged yet. Stay clean!</p>
                      ) : (
                        (recovery.logs || []).slice(0, 5).map((log) => (
                          <div key={log.id} className="waaci__timeline-node">
                            <div className={`waaci__node-indicator ${log.outcome === 'resist' ? 'clean' : 'relapse'}`} />
                            <div className="waaci__node-body">
                              <div className="waaci__node-header">
                                <span className="waaci__node-action">
                                  {log.outcome === 'resist' ? '🛡️ Resisted Urge' : '⚠️ Relapse Reset'}
                                </span>
                                <span className="waaci__node-time">
                                  {new Date(log.date).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                                </span>
                              </div>
                              <p className="waaci__node-detail">
                                Trigger: <strong>{log.trigger}</strong> ({log.timeOfDay}) | Intensity: <strong>{log.intensity}/10</strong>
                              </p>
                              {log.notes && <p className="waaci__node-notes">"{log.notes}"</p>}
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'journal' && (
            <motion.div 
              key="journal"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="waaci__tab-view"
            >
              <div className="waaci__sub-layout">
                {/* Journal Add Form */}
                <div className="waaci__sub-col">
                  <GlassCard padding="lg">
                    <h2 className="waaci__sub-title">Recovery Journal</h2>
                    <p className="waaci__sub-desc">Log daily reflections, lessons learned, and victories to train self-awareness.</p>

                    <form onSubmit={handleJournalSubmit} className="waaci__form">
                      <div className="waaci__form-group">
                        <label className="waaci__label">Daily Reflection</label>
                        <textarea
                          placeholder="How did your day go? What thoughts occupied your mind?"
                          value={journalReflection}
                          onChange={(e) => setJournalReflection(e.target.value)}
                          className="waaci__textarea"
                          rows={4}
                          required
                        />
                      </div>

                      <div className="waaci__form-group">
                        <label className="waaci__label">Lessons Learned</label>
                        <textarea
                          placeholder="What did you learn about your triggers, environment, or spiritual state today?"
                          value={journalLessons}
                          onChange={(e) => setJournalLessons(e.target.value)}
                          className="waaci__textarea"
                          rows={3}
                        />
                      </div>

                      <div className="waaci__form-group">
                        <label className="waaci__label">Victory Log</label>
                        <textarea
                          placeholder="What small battles did you win today? Any positive changes noticed?"
                          value={journalVictory}
                          onChange={(e) => setJournalVictory(e.target.value)}
                          className="waaci__textarea"
                          rows={2}
                        />
                      </div>

                      <div className="waaci__form-group">
                        <label className="waaci__label">Journal Mood</label>
                        <div className="waaci__moods-grid">
                          {MOODS.map(m => (
                            <button
                              key={m.id}
                              type="button"
                              className={`waaci__mood-badge ${journalMood === m.id ? 'active' : ''}`}
                              onClick={() => setJournalMood(m.id)}
                            >
                              <span>{m.emoji}</span>
                              <span>{m.label}</span>
                            </button>
                          ))}
                        </div>
                      </div>

                      {journalSuccess && (
                        <div className="waaci__success-msg">
                          ✓ Journal reflection added. Mashallah!
                        </div>
                      )}

                      <Button variant="emerald" type="submit" fullWidth>
                        Save Daily Journal
                      </Button>
                    </form>
                  </GlassCard>
                </div>

                {/* Journal Feed */}
                <div className="waaci__sub-col">
                  <GlassCard padding="lg">
                    <h2 className="waaci__sub-title">Reflection Feed</h2>
                    <p className="waaci__sub-desc">Chronological journal of your recovery journey.</p>
                    
                    <div className="waaci__journal-list">
                      {(recovery.journalLogs || []).length === 0 ? (
                        <p className="waaci__empty-msg">No reflections logged yet. Write your first entry to start journaling.</p>
                      ) : (
                        (recovery.journalLogs || []).map((j) => (
                          <GlassCard key={j.id} className="waaci__journal-card" padding="md">
                            <div className="waaci__journal-header">
                              <div className="waaci__journal-meta">
                                <span className="waaci__journal-mood-emoji">
                                  {MOODS.find(m => m.id === j.mood)?.emoji || '😌'}
                                </span>
                                <span className="waaci__journal-date">
                                  {new Date(j.date).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                                </span>
                              </div>
                              <button 
                                className="waaci__delete-journal-btn" 
                                onClick={() => deleteRecoveryJournal(j.id)}
                                title="Delete Reflection"
                              >
                                <Trash2 size={14} />
                              </button>
                            </div>
                            
                            <div className="waaci__journal-body">
                              <div className="waaci__j-section">
                                <h5>Reflection</h5>
                                <p>{j.reflection}</p>
                              </div>
                              {j.lessons && (
                                <div className="waaci__j-section">
                                  <h5>Lessons Learned</h5>
                                  <p>{j.lessons}</p>
                                </div>
                              )}
                              {j.victory && (
                                <div className="waaci__j-section">
                                  <h5>Victory Log</h5>
                                  <p className="waaci__j-victory">🏆 {j.victory}</p>
                                </div>
                              )}
                            </div>
                          </GlassCard>
                        ))
                      )}
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'insights' && (
            <motion.div 
              key="insights"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="waaci__tab-view"
            >
              {/* Risk Prediction Panel */}
              <div className="waaci__insights-container">
                <GlassCard padding="xl" glow className="waaci__risk-card">
                  <div className="waaci__risk-flex">
                    <div className="waaci__risk-gauge">
                      <RingProgress 
                        value={aiAssessment.score} 
                        size={150} 
                        strokeWidth={12} 
                        color={aiAssessment.color}
                      >
                        <div style={{ textAlign: 'center' }}>
                          <span className="waaci__risk-percent-lbl" style={{ color: aiAssessment.color }}>
                            {aiAssessment.score}%
                          </span>
                          <span className="waaci__risk-title-lbl">Relapse Risk</span>
                        </div>
                      </RingProgress>
                    </div>

                    <div className="waaci__risk-assessment">
                      <div className="waaci__badge-status" style={{ borderColor: aiAssessment.color, color: aiAssessment.color, backgroundColor: `${aiAssessment.color}15` }}>
                        {aiAssessment.level}
                      </div>
                      <h3 className="waaci__risk-header">Neural Stability Index</h3>
                      <p className="waaci__risk-text">{aiAssessment.advice}</p>
                      
                      <div className="waaci__risk-meta-badge">
                        <AlertCircle size={14} style={{ color: aiAssessment.color }} />
                        <span>{aiAssessment.alert}</span>
                      </div>
                    </div>
                  </div>
                </GlassCard>

                {/* High-Risk Alerts */}
                <div className="waaci__section-heading">
                  <AlertCircle size={18} />
                  <h2>High-Risk Warnings</h2>
                </div>
                <div className="waaci__warnings-grid">
                  {/* Warning 1: Night Hours */}
                  <GlassCard padding="lg" className="waaci__warn-card warning">
                    <div className="waaci__warn-header">
                      <Timer className="waaci__warn-icon" />
                      <h4>Late-Night Phone Usage Alert</h4>
                    </div>
                    <p className="waaci__warn-desc">
                      Our system identifies that 85% of your recorded strong cravings take place between 11 PM and 3 AM. 
                      Entering this timeframe with your phone in bed is a critical risk vector.
                    </p>
                    <div className="waaci__warn-footer">
                      Recommendation: Charge your phone outside your bedroom by 10 PM.
                    </div>
                  </GlassCard>

                  {/* Warning 2: HALT States */}
                  <GlassCard padding="lg" className="waaci__warn-card caution">
                    <div className="waaci__warn-header">
                      <Activity className="waaci__warn-icon" />
                      <h4>Emotional Trigger Vector</h4>
                    </div>
                    <p className="waaci__warn-desc">
                      Your logged urges show a tight correlation with **Boredom** and **Stress** states. 
                      Impulsive screen-unlocking is currently your brain's default coping mechanism.
                    </p>
                    <div className="waaci__warn-footer">
                      Recommendation: Intercept boredom with the breathing toolkit or physical exercise immediately.
                    </div>
                  </GlassCard>
                </div>

                {/* Personalized Recommendations */}
                <div className="waaci__section-heading">
                  <BrainCircuit size={18} />
                  <h2>Personalized Action Recommendations</h2>
                </div>
                <div className="waaci__recs-container">
                  <GlassCard padding="lg" className="waaci__rec-card">
                    <div className="waaci__rec-bullet">1</div>
                    <div className="waaci__rec-body">
                      <h5>Engage the Cold-Shock Reflex</h5>
                      <p>
                        When a craving spikes, perform a cold-water Wudu or take a 60-second freezing shower. 
                        Physiologically, cold exposure releases norepinephrine, which increases focus and raises dopamine baseline by 2.5x without a crash, wiping out urges instantly.
                      </p>
                    </div>
                  </GlassCard>

                  <GlassCard padding="lg" className="waaci__rec-card">
                    <div className="waaci__rec-bullet">2</div>
                    <div className="waaci__rec-body">
                      <h5>Establish Digital Firewalls</h5>
                      <p>
                        Social media feeds are designed to trigger high-dopamine seeking loops. 
                        Use the Website Blocker in the Protection tab to block triggers, and set an daily screen-time limit of 30 minutes.
                      </p>
                    </div>
                  </GlassCard>

                  <GlassCard padding="lg" className="waaci__rec-card">
                    <div className="waaci__rec-body">
                      <h5>Leverage the 10-Minute Deferral Rule</h5>
                      <p>
                        Neurobiologically, a craving wave peaks and recedes within 10 minutes. 
                        Do not try to fight the thought. Acknowledge it, set a timer for 10 minutes, and engage in the Push-up or Breathing challenge in the Emergency Center.
                      </p>
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}

          {activeTab === 'profile' && (
            <motion.div 
              key="profile"
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -15 }}
              transition={{ duration: 0.2 }}
              className="waaci__tab-view"
            >
              <div className="waaci__sub-layout">
                {/* Accountability Partner */}
                <div className="waaci__sub-col">
                  {/* Share invite code */}
                  <GlassCard padding="lg">
                    <h2 className="waaci__sub-title">Accountability Partner</h2>
                    <p className="waaci__sub-desc">Invite a trusted friend or sponsor to share progress and keep you committed.</p>

                    <div className="waaci__sync-code-box">
                      <span className="waaci__sync-label">Your Sync Invite Code</span>
                      <div className="waaci__sync-flex">
                        <code className="waaci__sync-code">WAACI-{userProfile.name?.toUpperCase() || 'IBRAHIM'}-786</code>
                        <button className="waaci__copy-code-btn" onClick={handleCopyCode}>
                          {showInviteCopied ? 'Copied!' : 'Copy Code'}
                        </button>
                      </div>
                    </div>

                    <form onSubmit={(e) => { e.preventDefault(); alert('Friend code synced successfully!'); }} className="waaci__form" style={{ marginTop: '1.5rem' }}>
                      <div className="waaci__form-group">
                        <label className="waaci__label">Sync Partner Code</label>
                        <div className="waaci__input-btn-row">
                          <input 
                            type="text" 
                            placeholder="Enter partner's sync code" 
                            className="waaci__input"
                            required
                          />
                          <Button variant="emerald" type="submit">Link</Button>
                        </div>
                      </div>
                    </form>
                  </GlassCard>

                  {/* SOS Contacts List */}
                  <div style={{ marginTop: '1.5rem' }} />
                  <GlassCard padding="lg">
                    <h2 className="waaci__sub-title">Emergency Sponsors (SOS)</h2>
                    <p className="waaci__sub-desc">Register accountability contacts to call or message directly during critical urge waves.</p>

                    <form onSubmit={handleAddContact} className="waaci__form-row-sos">
                      <input
                        type="text"
                        placeholder="Sponsor Name"
                        value={partnerName}
                        onChange={(e) => setPartnerName(e.target.value)}
                        className="waaci__input"
                        required
                      />
                      <input
                        type="text"
                        placeholder="Phone / WhatsApp"
                        value={partnerPhone}
                        onChange={(e) => setPartnerPhone(e.target.value)}
                        className="waaci__input"
                        required
                      />
                      <Button variant="emerald" type="submit">Add</Button>
                    </form>

                    <div className="waaci__sponsor-list">
                      {(recovery.contacts || []).length === 0 ? (
                        <p className="waaci__empty-msg">No sponsors registered. Add contacts above.</p>
                      ) : (
                        (recovery.contacts || []).map((c) => (
                          <div key={c.id} className="waaci__sponsor-row">
                            <div>
                              <span className="waaci__sponsor-name">{c.name}</span>
                              <span className="waaci__sponsor-phone">{c.phone}</span>
                            </div>
                            <div className="waaci__sponsor-actions">
                              <a href={`tel:${c.phone}`} className="waaci__sponsor-action-btn call" title="Direct Phone Call">
                                <Phone size={14} />
                              </a>
                              <a href={`https://wa.me/${c.phone}`} target="_blank" rel="noopener noreferrer" className="waaci__sponsor-action-btn wa" title="WhatsApp Message">
                                <MessageCircle size={14} />
                              </a>
                              <button className="waaci__sponsor-action-btn delete" onClick={() => removeSosContact(c.id)} title="Delete Sponsor">
                                <Trash2 size={14} />
                              </button>
                            </div>
                          </div>
                        ))
                      )}
                    </div>
                  </GlassCard>

                  {/* Sobriety Motivations */}
                  <div style={{ marginTop: '1.5rem' }} />
                  <GlassCard padding="lg">
                    <h2 className="waaci__sub-title">My Sobriety Reasons</h2>
                    <p className="waaci__sub-desc">Read these motivations during triggers to redirect cognitive focus.</p>
                    
                    <form onSubmit={handleAddReason} className="waaci__form-row-sos">
                      <input
                        type="text"
                        placeholder="Add motivational reason..."
                        value={newReasonText}
                        onChange={(e) => setNewReasonText(e.target.value)}
                        className="waaci__input"
                        required
                      />
                      <Button variant="emerald" type="submit">Add</Button>
                    </form>

                    <div className="waaci__reasons-feed">
                      {(recovery.reasons || []).map((reason, idx) => (
                        <div key={idx} className="waaci__reason-bubble">
                          <span>{reason}</span>
                          <button className="waaci__delete-reason-btn" onClick={() => removeSobrietyReason(reason)}>
                            <X size={12} />
                          </button>
                        </div>
                      ))}
                    </div>
                  </GlassCard>
                </div>

                {/* Protection Mode App/Web Blocking */}
                <div className="waaci__sub-col">
                  <GlassCard padding="lg">
                    <div className="waaci__protection-header">
                      <Lock size={20} className="waaci__shield-green" />
                      <h2 className="waaci__sub-title">Protection Mode</h2>
                    </div>
                    <p className="waaci__sub-desc">Limit screen time and block tempting web spaces to shield your focus.</p>

                    {/* Focus Mode Trigger */}
                    <div className="waaci__focus-activator-box">
                      <h5>Activate Focus Block</h5>
                      <p>
                        Locks down your dashboard and starts a countdown. Use this when facing urge waves.
                      </p>
                      
                      <div className="waaci__focus-duration-select">
                        {[15, 30, 60, 120].map((mins) => (
                          <button
                            key={mins}
                            className={`waaci__duration-btn ${focusDuration === mins ? 'active' : ''}`}
                            onClick={() => setFocusDuration(mins)}
                          >
                            {mins}m
                          </button>
                        ))}
                      </div>

                      <Button variant="emerald" className="waaci__focus-btn" fullWidth onClick={startFocusSession}>
                        🔒 Lock Screen & Focus
                      </Button>
                    </div>

                    <div className="waaci__divider" />

                    {/* App Blocking list */}
                    <div className="waaci__blocking-group">
                      <h5>App Block Rules</h5>
                      <p className="waaci__blocking-sub">Select apps to block under Protection Mode.</p>
                      <div className="waaci__checkbox-list">
                        {['Instagram', 'TikTok', 'X/Twitter', 'Snapchat', 'Reddit'].map((app) => {
                          const isBlocked = recovery.protectionMode?.blockedApps?.includes(app);
                          return (
                            <label key={app} className="waaci__checkbox-row">
                              <input 
                                type="checkbox" 
                                checked={!!isBlocked}
                                onChange={() => handleToggleApp(app)}
                                className="waaci__checkbox"
                              />
                              <span>{app}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="waaci__divider" />

                    {/* Website Blocking list */}
                    <div className="waaci__blocking-group">
                      <h5>Website Filter</h5>
                      <p className="waaci__blocking-sub">Block trigger domains in your mobile browser.</p>
                      <div className="waaci__checkbox-list">
                        {['instagram.com', 'tiktok.com', 'x.com', 'reddit.com'].map((web) => {
                          const isBlocked = recovery.protectionMode?.blockedWebsites?.includes(web);
                          return (
                            <label key={web} className="waaci__checkbox-row">
                              <input 
                                type="checkbox" 
                                checked={!!isBlocked}
                                onChange={() => handleToggleWebsite(web)}
                                className="waaci__checkbox"
                              />
                              <span>{web}</span>
                            </label>
                          );
                        })}
                      </div>
                    </div>

                    <div className="waaci__divider" />

                    {/* Screen Limit Slider */}
                    <div className="waaci__blocking-group">
                      <div className="waaci__slider-header">
                        <h5>Screen Time Limit</h5>
                        <span className="waaci__slider-badge">
                          {recovery.protectionMode?.screenTimeLimit || 120} Min
                        </span>
                      </div>
                      <input
                        type="range"
                        min="15"
                        max="240"
                        step="15"
                        value={recovery.protectionMode?.screenTimeLimit || 120}
                        onChange={(e) => updateProtectionMode({ screenTimeLimit: parseInt(e.target.value) })}
                        className="waaci__slider"
                      />
                    </div>
                  </GlassCard>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Floating Bottom Navigation Tab Bar */}
      <div className="waaci__bottom-bar">
        <div className="waaci__bar-track">
          {[
            { id: 'overview', label: 'Overview', icon: Flame },
            { id: 'urges', label: 'Urges', icon: Activity },
            { id: 'journal', label: 'Journal', icon: BookOpen },
            { id: 'insights', label: 'Insights', icon: BrainCircuit },
            { id: 'profile', label: 'Profile', icon: Shield }
          ].map((tab) => {
            const IconComp = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                className={`waaci__bar-item ${isActive ? 'active' : ''}`}
                onClick={() => setActiveTab(tab.id)}
              >
                <IconComp size={20} className="waaci__bar-icon" />
                <span className="waaci__bar-lbl">{tab.label}</span>
                {isActive && (
                  <motion.span
                    className="waaci__bar-active-dot"
                    layoutId="waaci-bar-dot"
                    transition={{ type: 'spring', stiffness: 400, damping: 28 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Full-Screen Focus Mode Overlay Blocker */}
      <AnimatePresence>
        {focusActive && (
          <motion.div 
            className="waaci__focus-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="waaci__focus-overlay-glow" />
            
            <div className="waaci__focus-container">
              <div className="waaci__focus-lock-icon">
                <Lock size={40} />
              </div>
              <h2 className="waaci__focus-title">Focus Mode Active</h2>
              <p className="waaci__focus-desc">
                Waaci has locked your device and blocked trigger sites. Close your eyes, take deep breaths, and let the urge wave pass.
              </p>

              <div className="waaci__focus-timer">
                {String(Math.floor(focusTimeLeft / 60)).padStart(2, '0')}:
                {String(focusTimeLeft % 60).padStart(2, '0')}
              </div>

              <div className="waaci__breathing-orb" />

              <div className="waaci__focus-exit-box">
                <p className="waaci__exit-label">Need to unlock for emergency?</p>
                <button
                  className="waaci__exit-btn"
                  onMouseDown={() => setIsHoldingUnlock(true)}
                  onMouseUp={() => setIsHoldingUnlock(false)}
                  onMouseLeave={() => setIsHoldingUnlock(false)}
                  onTouchStart={() => setIsHoldingUnlock(true)}
                  onTouchEnd={() => setIsHoldingUnlock(false)}
                >
                  Hold to Unlock
                </button>
                <div className="waaci__unlock-progress-bar">
                  <div className="waaci__unlock-progress" style={{ width: `${focusUnlockHold}%` }} />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
