import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Home, Moon, BookOpen, Star, RefreshCw } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import './BottomNav.css';

const TABS = [
  { path: '/',      icon: Home,     key: 'nav_home',   label: 'Home' },
  { path: '/salah', icon: Moon,     key: 'nav_salah',  label: 'Salah' },
  { path: '/quran', icon: BookOpen, key: 'nav_quran',  label: 'Quran' },
  { path: '/azkar', icon: Star,     key: 'nav_azkar',  label: 'Azkar' },
  { path: '/recovery', icon: RefreshCw, key: 'nav_recovery', label: 'Recovery' },
];

export default function BottomNav() {
  const { t } = useTranslation();

  return (
    <nav className="bottom-nav">
      <div className="bottom-nav__track">
        {TABS.map((tab) => (
          <NavLink
            key={tab.path}
            to={tab.path}
            end={tab.path === '/'}
            className={({ isActive }) => `bottom-nav__item ${isActive ? 'bottom-nav__item--active' : ''}`}
          >
            {({ isActive }) => (
              <>
                <motion.span
                  className="bottom-nav__icon"
                  animate={{ scale: isActive ? 1.15 : 1, y: isActive ? -2 : 0 }}
                  transition={{ type: 'spring', stiffness: 500, damping: 20 }}
                >
                  <tab.icon size={22} />
                </motion.span>
                <span className="bottom-nav__label">{t(tab.key, tab.label)}</span>
                {isActive && (
                  <motion.span
                    className="bottom-nav__dot"
                    layoutId="bottom-nav-dot"
                    transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                  />
                )}
              </>
            )}
          </NavLink>
        ))}
      </div>
    </nav>
  );
}
