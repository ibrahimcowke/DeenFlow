import { Bell, Search, Sun, Moon, Menu } from 'lucide-react';
import { motion } from 'framer-motion';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store';
import './TopBar.css';

export default function TopBar({ onToggleMobileMenu }) {
  const { t } = useTranslation();
  const { theme, setTheme, notifications } = useAppStore();
  const unread = notifications.filter(n => !n.read).length;

  const toggleTheme = () => {
    const themes = ['dark', 'light', 'oled'];
    const idx = themes.indexOf(theme);
    setTheme(themes[(idx + 1) % themes.length]);
  };

  return (
    <header className="topbar">
      {/* Hamburger Menu Button for Mobile */}
      <button 
        className="topbar__menu-btn" 
        onClick={onToggleMobileMenu}
        aria-label="Toggle Navigation Menu"
      >
        <Menu size={20} />
      </button>

      {/* Brand logo for Mobile */}
      <div className="topbar__logo-mobile">
        <span className="topbar__logo-text">DeenFlow</span>
      </div>

      {/* Search */}
      <div className="topbar__search">
        <Search size={16} className="topbar__search-icon" />
        <input
          type="text"
          placeholder={t('ask_anything', 'Search...')}
          className="topbar__search-input"
        />
        <kbd className="topbar__search-kbd">⌘K</kbd>
      </div>

      <div className="topbar__actions">
        {/* Theme Toggle */}
        <motion.button
          className="topbar__btn"
          onClick={toggleTheme}
          whileTap={{ scale: 0.9 }}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
        </motion.button>

        {/* Notifications */}
        <motion.button
          className="topbar__btn topbar__btn--notify"
          whileTap={{ scale: 0.9 }}
          aria-label="Notifications"
        >
          <Bell size={18} />
          {unread > 0 && <span className="topbar__badge">{unread}</span>}
        </motion.button>
      </div>
    </header>
  );
}
