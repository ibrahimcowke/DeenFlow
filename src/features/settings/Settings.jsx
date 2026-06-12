import { useState } from 'react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { 
  Settings as SettingsIcon, Eye, Bell, Shield, Info, LogOut, 
  ChevronRight, Volume2, Globe, Database, HelpCircle 
} from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { useAppStore } from '../../store';
import i18n from '../../i18n';
import './Settings.css';

export default function Settings() {
  const { t } = useTranslation();
  const { 
    theme, setTheme, language, setLanguage, user, setUser,
    goals, setGoals, dashboardLayout, setDashboardLayout
  } = useAppStore();

  const [madhab, setMadhab] = useState('shafii'); // Hanafi, Shafii
  const [calcMethod, setCalcMethod] = useState('mwl'); // MWL, ISNA, etc.
  const [fontSize, setFontSize] = useState('medium'); // small, medium, large
  
  const [notifications, setNotifications] = useState({
    fajr: true,
    dhuhr: true,
    asr: true,
    maghrib: true,
    isha: true,
    dailyHabits: true,
    quranGoals: true,
  });

  const handleLanguageChange = (lang) => {
    setLanguage(lang);
    i18n.changeLanguage(lang);
    localStorage.setItem('ml-lang', lang);
  };

  const handleThemeChange = (newTheme) => {
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const toggleNotification = (key) => {
    setNotifications(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleSignOut = () => {
    if (window.confirm('Are you sure you want to sign out?')) {
      setUser(null);
      window.location.href = '/auth';
    }
  };

  const handleResetData = () => {
    if (window.confirm('WARNING: This will delete all your local data and habits. This action cannot be undone. Are you sure?')) {
      localStorage.clear();
      window.location.reload();
    }
  };

  return (
    <div className="settings page-container">
      <div className="settings__header">
        <motion.h1 className="settings__title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          Settings
        </motion.h1>
        <p className="settings__sub">Configure appearance, prayer times, notifications and sync account data</p>
      </div>

      <div className="settings__content">
        {/* Appearance Settings */}
        <h3 className="settings__section-title">
          <Eye size={18} className="settings__section-icon" />
          Appearance & Display
        </h3>
        <GlassCard className="settings__card" padding="lg" delay={0.05}>
          {/* Theme selection */}
          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">App Theme</span>
              <span className="settings__row-sub">Choose visual theme for the operating system</span>
            </div>
            <div className="settings__options" style={{ flexWrap: 'wrap', gap: '0.25rem' }}>
              {['dark', 'light', 'oled', 'emerald', 'gold', 'burgundy'].map((t) => (
                <button 
                  key={t}
                  className={`settings__option-btn ${theme === t ? 'settings__option-btn--active' : ''}`}
                  onClick={() => handleThemeChange(t)}
                >
                  {t.toUpperCase()}
                </button>
              ))}
            </div>
          </div>

          <hr className="settings__divider" />

          {/* Dashboard Style Selection */}
          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Dashboard Style</span>
              <span className="settings__row-sub">Choose visual layout variant for the main dashboard</span>
            </div>
            <div className="settings__options" style={{ flexWrap: 'wrap', gap: '0.25rem' }}>
              {[
                { id: 'glass', label: 'Modern Glass' },
                { id: 'classic', label: 'Classic Dark' },
                { id: 'minimal', label: 'Minimal OLED' }
              ].map((layoutOpt) => (
                <button 
                  key={layoutOpt.id}
                  className={`settings__option-btn ${dashboardLayout === layoutOpt.id ? 'settings__option-btn--active' : ''}`}
                  onClick={() => setDashboardLayout(layoutOpt.id)}
                >
                  {layoutOpt.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="settings__divider" />

          {/* Language selection */}
          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Language / Luqad</span>
              <span className="settings__row-sub">App language translation (English, Somali, Arabic)</span>
            </div>
            <div className="settings__options">
              {[
                { code: 'en', label: 'English' },
                { code: 'so', label: 'Soomaali' },
                { code: 'ar', label: 'العربية' }
              ].map((lang) => (
                <button 
                  key={lang.code}
                  className={`settings__option-btn ${language === lang.code ? 'settings__option-btn--active' : ''}`}
                  onClick={() => handleLanguageChange(lang.code)}
                >
                  {lang.label}
                </button>
              ))}
            </div>
          </div>

          <hr className="settings__divider" />

          {/* Font Size selection */}
          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Font Size</span>
              <span className="settings__row-sub">Reading text sizing for Quran reader</span>
            </div>
            <div className="settings__options">
              {['small', 'medium', 'large'].map((sz) => (
                <button 
                  key={sz}
                  className={`settings__option-btn ${fontSize === sz ? 'settings__option-btn--active' : ''}`}
                  onClick={() => setFontSize(sz)}
                >
                  {sz.toUpperCase()}
                </button>
              ))}
            </div>
          </div>
        </GlassCard>

        {/* Prayer Settings */}
        <h3 className="settings__section-title" style={{ marginTop: '2rem' }}>
          <Volume2 size={18} className="settings__section-icon" />
          Prayer & Fiqh Calculations
        </h3>
        <GlassCard className="settings__card" padding="lg" delay={0.1}>
          {/* Madhab */}
          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Asr Calculation (Madhab)</span>
              <span className="settings__row-sub">Hanafi method shifts Asr prayer timing later</span>
            </div>
            <select 
              className="settings__select" 
              value={madhab} 
              onChange={(e) => setMadhab(e.target.value)}
            >
              <option value="shafii">Shafi'i, Maliki, Hanbali (Standard)</option>
              <option value="hanafi">Hanafi</option>
            </select>
          </div>

          <hr className="settings__divider" />

          {/* Calculation Method */}
          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Calculation Method</span>
              <span className="settings__row-sub">Astronomical parameters for prayer calculation</span>
            </div>
            <select 
              className="settings__select" 
              value={calcMethod} 
              onChange={(e) => setCalcMethod(e.target.value)}
            >
              <option value="mwl">Muslim World League (MWL)</option>
              <option value="isna">Islamic Society of North America (ISNA)</option>
              <option value="egypt">Egyptian General Authority of Survey</option>
              <option value="makkah">Umm Al-Qura University, Makkah</option>
              <option value="karachi">University of Islamic Sciences, Karachi</option>
            </select>
          </div>
        </GlassCard>

        {/* Notifications Settings */}
        <h3 className="settings__section-title" style={{ marginTop: '2rem' }}>
          <Bell size={18} className="settings__section-icon" />
          Notifications & Alerts
        </h3>
        <GlassCard className="settings__card" padding="lg" delay={0.15}>
          {Object.entries({
            fajr: 'Fajr Adhan Notification',
            dhuhr: 'Dhuhr Adhan Notification',
            asr: 'Asr Adhan Notification',
            maghrib: 'Maghrib Adhan Notification',
            isha: 'Isha Adhan Notification',
            dailyHabits: 'Daily Habits Check-in reminder',
            quranGoals: 'Quran Goal completion reminder',
          }).map(([key, label], idx) => (
            <div key={key}>
              <div className="settings__row">
                <div className="settings__row-info">
                  <span className="settings__row-label">{label}</span>
                </div>
                <button 
                  className={`settings__toggle ${notifications[key] ? 'settings__toggle--on' : ''}`} 
                  onClick={() => toggleNotification(key)}
                >
                  <span className="settings__toggle-thumb" />
                </button>
              </div>
              {idx < 6 && <hr className="settings__divider" />}
            </div>
          ))}
        </GlassCard>

        {/* Account & Cloud Sync Settings */}
        <h3 className="settings__section-title" style={{ marginTop: '2rem' }}>
          <Database size={18} className="settings__section-icon" />
          Account & Storage
        </h3>
        <GlassCard className="settings__card" padding="lg" delay={0.2}>
          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Cloud Backup & Sync</span>
              <span className="settings__row-sub">Keep your streaks, notes, and habits safe in the cloud</span>
            </div>
            <span className="settings__status-badge">Offline (Local Storage)</span>
          </div>

          <hr className="settings__divider" />

          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Reset Local Database</span>
              <span className="settings__row-sub">Wipe all cached cache and reset onboarding</span>
            </div>
            <Button variant="ghost" onClick={handleResetData} style={{ color: 'var(--color-rose)', borderColor: 'rgba(239, 68, 68, 0.2)' }}>
              Reset All Data
            </Button>
          </div>

          <hr className="settings__divider" />

          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Log Out</span>
              <span className="settings__row-sub">Sign out from your Muslim Life OS account</span>
            </div>
            <Button variant="ghost" onClick={handleSignOut} className="settings__logout-btn">
              <LogOut size={16} style={{ marginRight: '0.5rem' }} />
              Sign Out
            </Button>
          </div>
        </GlassCard>

        {/* About Settings */}
        <h3 className="settings__section-title" style={{ marginTop: '2rem' }}>
          <Info size={18} className="settings__section-icon" />
          About Muslim Life OS
        </h3>
        <GlassCard className="settings__card" padding="lg" delay={0.25} style={{ marginBottom: '2rem' }}>
          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">App Version</span>
            </div>
            <span className="settings__about-val">v1.0.0 (Production Ready)</span>
          </div>
          <hr className="settings__divider" />
          <div className="settings__row">
            <div className="settings__row-info">
              <span className="settings__row-label">Powered By</span>
            </div>
            <span className="settings__about-val">React + Vite + Firebase</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
