import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store';
import Button from '../../components/ui/Button';
import './Onboarding.css';

const LANGUAGES = [
  { code: 'en', name: 'English',  nativeName: 'English',  flag: '🇬🇧', dir: 'ltr' },
  { code: 'so', name: 'Somali',   nativeName: 'Soomaali', flag: '🇸🇴', dir: 'ltr' },
  { code: 'ar', name: 'Arabic',   nativeName: 'العربية',  flag: '🇸🇦', dir: 'rtl' },
];

const FEATURES = [
  { icon: '🕌', title: 'Prayer Tracking',      desc: 'Never miss a Salah' },
  { icon: '📖', title: 'Quran Goals',           desc: 'Read daily with streaks' },
  { icon: '⭐', title: 'Azkar & Dhikr',         desc: 'Morning & evening Azkar' },
  { icon: '💚', title: 'Recovery Support',       desc: 'Spiritual strength daily' },
];

export default function Onboarding() {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { setLanguage, setOnboardingComplete, setGoals, language } = useAppStore();

  const [step, setStep] = useState(0);
  const [selectedLang, setSelectedLang] = useState(language || 'en');
  const [goals, setGoalsLocal] = useState({
    quranGoalType: 'page', // 'ayah', 'page', 'maqrah', 'hizb', 'juz'
    quranGoalValue: 5,
    quranPagesDaily: 5,
    azkarDaily: 100,
    trackSalah: true,
    trackRecovery: false,
    trackHabits: true,
  });

  const next = () => {
    if (step < 3) setStep(s => s + 1);
    else finish();
  };

  const finish = () => {
    // Calculate page equivalents
    let calculatedPages = goals.quranGoalValue;
    if (goals.quranGoalType === 'juz') calculatedPages = goals.quranGoalValue * 20;
    else if (goals.quranGoalType === 'hizb') calculatedPages = goals.quranGoalValue * 10;
    else if (goals.quranGoalType === 'maqrah') calculatedPages = Math.ceil(goals.quranGoalValue * 2.5);
    else if (goals.quranGoalType === 'ayah') calculatedPages = Math.ceil(goals.quranGoalValue / 15);

    const finalGoals = {
      ...goals,
      quranPagesDaily: calculatedPages
    };

    setGoals(finalGoals);
    setOnboardingComplete(true);
    navigate('/');
  };

  const handleLangSelect = (lang) => {
    setSelectedLang(lang.code);
    setLanguage(lang.code);
    i18n.changeLanguage(lang.code);
    localStorage.setItem('ml-lang', lang.code);
  };

  return (
    <div className="onboarding">
      {/* Background */}
      <div className="onboarding__bg">
        <div className="onboarding__bg-orb onboarding__bg-orb--1" />
        <div className="onboarding__bg-orb onboarding__bg-orb--2" />
        <div className="onboarding__bg-pattern" />
      </div>

      <AnimatePresence mode="wait">
        {/* ── Step 0: Welcome ─────────────────────────────── */}
        {step === 0 && (
          <motion.div
            key="step0"
            className="onboarding__screen"
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.04 }}
            transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          >
            {/* Mosque Silhouette */}
            <motion.div
              className="onboarding__mosque"
              initial={{ y: 60, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.9, ease: [0.34, 1.56, 0.64, 1] }}
            >
              <MosqueSVG />
            </motion.div>

            <motion.div
              className="onboarding__welcome-text"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5, duration: 0.6 }}
            >
              <p className="onboarding__bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
              <h1 className="onboarding__title text-gradient-hero">
                {t('onboarding_1_title', 'Welcome To Muslim Life OS')}
              </h1>
              <p className="onboarding__subtitle">{t('onboarding_1_subtitle', 'Your Complete Islamic Companion')}</p>
            </motion.div>

            <motion.div
              className="onboarding__actions"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button variant="primary" size="xl" fullWidth onClick={next}>
                {t('get_started', 'Get Started')}
              </Button>
              <button className="onboarding__skip" onClick={finish}>
                {t('skip', 'Skip')}
              </button>
            </motion.div>
          </motion.div>
        )}

        {/* ── Step 1: Features ─────────────────────────────── */}
        {step === 1 && (
          <motion.div
            key="step1"
            className="onboarding__screen"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.45 }}
          >
            <div className="onboarding__features-header">
              <h1 className="onboarding__title">{t('onboarding_2_title', 'Your Islamic Journey')}</h1>
              <p className="onboarding__subtitle">{t('onboarding_2_subtitle', 'Everything you need in one beautiful app')}</p>
            </div>
            <div className="onboarding__features-grid">
              {FEATURES.map((f, i) => (
                <motion.div
                  key={f.title}
                  className="onboarding__feature-card"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                >
                  <span className="onboarding__feature-icon">{f.icon}</span>
                  <h3 className="onboarding__feature-title">{f.title}</h3>
                  <p className="onboarding__feature-desc">{f.desc}</p>
                </motion.div>
              ))}
            </div>
            <div className="onboarding__actions">
              <Button variant="primary" size="lg" fullWidth onClick={next}>{t('next', 'Next')}</Button>
            </div>
          </motion.div>
        )}

        {/* ── Step 2: Language ─────────────────────────────── */}
        {step === 2 && (
          <motion.div
            key="step2"
            className="onboarding__screen"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="onboarding__title">{t('onboarding_3_title', 'Choose Your Language')}</h1>
            <p className="onboarding__subtitle">{t('onboarding_3_subtitle', 'Select your preferred language')}</p>
            <div className="onboarding__lang-cards">
              {LANGUAGES.map((lang, i) => (
                <motion.button
                  key={lang.code}
                  className={`onboarding__lang-card ${selectedLang === lang.code ? 'onboarding__lang-card--active' : ''}`}
                  onClick={() => handleLangSelect(lang)}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 + i * 0.1 }}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <span className="onboarding__lang-flag">{lang.flag}</span>
                  <span className="onboarding__lang-name">{lang.nativeName}</span>
                  <span className="onboarding__lang-sub">{lang.name}</span>
                  {selectedLang === lang.code && (
                    <motion.div className="onboarding__lang-check" layoutId="lang-check">✓</motion.div>
                  )}
                </motion.button>
              ))}
            </div>
            <div className="onboarding__actions">
              <Button variant="primary" size="lg" fullWidth onClick={next}>{t('next', 'Next')}</Button>
            </div>
          </motion.div>
        )}

        {/* ── Step 3: Goals ────────────────────────────────── */}
        {step === 3 && (
          <motion.div
            key="step3"
            className="onboarding__screen"
            initial={{ opacity: 0, x: 60 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -60 }}
            transition={{ duration: 0.45 }}
          >
            <h1 className="onboarding__title">{t('onboarding_4_title', 'Set Your Goals')}</h1>
            <p className="onboarding__subtitle">{t('onboarding_4_subtitle', 'Personalise your Islamic journey')}</p>

            <div className="onboarding__goals">
              {/* Quran Advanced Goals */}
              <div className="onboarding__goal-item onboarding__goal-item--advanced">
                <label className="onboarding__goal-label">📖 Set Quran Goal Metric & Target</label>
                <div className="onboarding__goal-inputs">
                  <select 
                    value={goals.quranGoalType}
                    onChange={(e) => setGoalsLocal(g => ({ ...g, quranGoalType: e.target.value, quranGoalValue: 1 }))}
                    className="onboarding__select"
                  >
                    <option value="ayah">Ayahs</option>
                    <option value="page">Pages</option>
                    <option value="maqrah">Maqrahs (Rub el Hizb)</option>
                    <option value="hizb">Hizbs</option>
                    <option value="juz">Juzs</option>
                  </select>
                  <div className="onboarding__stepper">
                    <button type="button" onClick={() => setGoalsLocal(g => ({ ...g, quranGoalValue: Math.max(1, g.quranGoalValue - 1) }))} className="onboarding__step-btn">−</button>
                    <span className="onboarding__step-val">{goals.quranGoalValue}</span>
                    <button type="button" onClick={() => setGoalsLocal(g => ({ ...g, quranGoalValue: Math.min(150, g.quranGoalValue + 1) }))} className="onboarding__step-btn">+</button>
                  </div>
                </div>
              </div>

              {/* Azkar count */}
              <div className="onboarding__goal-item">
                <label className="onboarding__goal-label">⭐ {t('azkar_daily', 'Azkar count per day?')}</label>
                <div className="onboarding__stepper">
                  <button onClick={() => setGoalsLocal(g => ({ ...g, azkarDaily: Math.max(33, g.azkarDaily - 33) }))} className="onboarding__step-btn">−</button>
                  <span className="onboarding__step-val">{goals.azkarDaily}</span>
                  <button onClick={() => setGoalsLocal(g => ({ ...g, azkarDaily: Math.min(500, g.azkarDaily + 33) }))} className="onboarding__step-btn">+</button>
                </div>
              </div>

              {/* Toggles */}
              {[
                { key: 'trackSalah',    label: t('track_salah', 'Track daily prayers?'),    emoji: '🕌' },
                { key: 'trackRecovery', label: t('track_recovery', 'Enable recovery tracking?'), emoji: '💪' },
                { key: 'trackHabits',   label: t('track_habits', 'Track Islamic habits?'), emoji: '✅' },
              ].map(item => (
                <div key={item.key} className="onboarding__goal-item onboarding__goal-item--toggle">
                  <label className="onboarding__goal-label">{item.emoji} {item.label}</label>
                  <button
                    className={`onboarding__toggle ${goals[item.key] ? 'onboarding__toggle--on' : ''}`}
                    onClick={() => setGoalsLocal(g => ({ ...g, [item.key]: !g[item.key] }))}
                  >
                    <span className="onboarding__toggle-thumb" />
                  </button>
                </div>
              ))}
            </div>

            <div className="onboarding__actions">
              <Button variant="primary" size="xl" fullWidth onClick={finish}>
                {t('get_started', 'Start My Journey')} 🚀
              </Button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Progress dots */}
      <div className="onboarding__dots">
        {[0, 1, 2, 3].map(i => (
          <motion.div
            key={i}
            className={`onboarding__dot ${step === i ? 'onboarding__dot--active' : ''}`}
            animate={{ width: step === i ? 24 : 8 }}
            transition={{ type: 'spring', stiffness: 400, damping: 20 }}
          />
        ))}
      </div>
    </div>
  );
}

function MosqueSVG() {
  return (
    <svg viewBox="0 0 400 260" fill="none" xmlns="http://www.w3.org/2000/svg" className="onboarding__mosque-svg">
      {/* Main dome */}
      <ellipse cx="200" cy="100" rx="80" ry="70" fill="url(#md1)" opacity="0.9"/>
      {/* Body */}
      <rect x="120" y="100" width="160" height="120" fill="url(#md2)" rx="4"/>
      {/* Door */}
      <path d="M175 220 L175 160 Q200 140 225 160 L225 220 Z" fill="rgba(0,0,0,0.3)"/>
      {/* Windows */}
      <ellipse cx="150" cy="145" rx="14" ry="18" fill="rgba(245,158,11,0.3)" stroke="rgba(245,158,11,0.5)" strokeWidth="1"/>
      <ellipse cx="250" cy="145" rx="14" ry="18" fill="rgba(245,158,11,0.3)" stroke="rgba(245,158,11,0.5)" strokeWidth="1"/>
      {/* Minarets */}
      <rect x="80" y="80" width="22" height="140" fill="url(#md3)" rx="4"/>
      <ellipse cx="91" cy="78" rx="12" ry="20" fill="url(#md1)"/>
      <rect x="298" y="80" width="22" height="140" fill="url(#md3)" rx="4"/>
      <ellipse cx="309" cy="78" rx="12" ry="20" fill="url(#md1)"/>
      {/* Crescent */}
      <path d="M200 30 C192 38 192 54 200 62 C192 56 184 46 188 36 Z" fill="var(--color-gold)" opacity="0.9"/>
      <circle cx="200" cy="20" r="6" fill="var(--color-gold)" opacity="0.8"/>
      {/* Stars */}
      <circle cx="160" cy="50" r="2" fill="var(--color-gold)" opacity="0.5"/>
      <circle cx="240" cy="40" r="1.5" fill="var(--color-gold)" opacity="0.4"/>
      <circle cx="130" cy="70" r="1" fill="white" opacity="0.3"/>
      <circle cx="270" cy="60" r="1.5" fill="white" opacity="0.3"/>
      {/* Ground */}
      <rect x="0" y="220" width="400" height="40" fill="url(#groundGrad)" opacity="0.4"/>
      <defs>
        <linearGradient id="md1" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#10B981"/>
          <stop offset="1" stopColor="#059669"/>
        </linearGradient>
        <linearGradient id="md2" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#1E293B"/>
          <stop offset="1" stopColor="#0F172A"/>
        </linearGradient>
        <linearGradient id="md3" x1="0" y1="0" x2="0" y2="1" gradientUnits="objectBoundingBox">
          <stop stopColor="#1E293B"/>
          <stop offset="1" stopColor="#0a1628"/>
        </linearGradient>
        <linearGradient id="groundGrad" x1="0" y1="0" x2="1" y2="0" gradientUnits="objectBoundingBox">
          <stop stopColor="transparent"/>
          <stop offset="0.5" stopColor="#10B981"/>
          <stop offset="1" stopColor="transparent"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
