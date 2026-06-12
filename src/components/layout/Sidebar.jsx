import { NavLink } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Home, BookOpen, Moon, Heart, RefreshCw, StickyNote,
  Bot, User, Settings, ChevronLeft, ChevronRight,
  Compass, Star, Coffee, Zap, Gift, Users,
} from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAppStore } from '../../store';
import './Sidebar.css';

const NAV_ITEMS = [
  { path: '/',         icon: Home,       key: 'nav_home',     label: 'Home' },
  { path: '/salah',    icon: Moon,       key: 'nav_salah',    label: 'Salah' },
  { path: '/quran',    icon: BookOpen,   key: 'nav_quran',    label: 'Quran' },
  { path: '/azkar',    icon: Star,       key: 'nav_azkar',    label: 'Azkar' },
  { path: '/habits',   icon: Zap,        key: 'nav_habits',   label: 'Habits' },
  { path: '/fasting',  icon: Coffee,     key: 'fasting',      label: 'Fasting' },
  { path: '/recovery', icon: RefreshCw,  key: 'nav_recovery', label: 'Recovery' },
  { path: '/notes',    icon: StickyNote, key: 'nav_notes',    label: 'Notes' },
  { path: '/ai',       icon: Bot,        key: 'nav_ai',       label: 'AI Coach' },
  { path: '/dua',      icon: Heart,      key: 'dua',          label: 'Dua' },
  { path: '/charity',  icon: Gift,       key: 'charity',      label: 'Charity' },
  { path: '/family',   icon: Users,      key: 'family',       label: 'Family' },
  { path: '/qibla',    icon: Compass,    key: 'qibla_action', label: 'Qibla' },
];

const BOTTOM_ITEMS = [
  { path: '/profile',  icon: User,     key: 'nav_profile',  label: 'Profile' },
  { path: '/settings', icon: Settings, key: 'nav_settings', label: 'Settings' },
];

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { t } = useTranslation();
  const { sidebarCollapsed, setSidebarCollapsed, userProfile } = useAppStore();

  return (
    <motion.aside
      className={`sidebar ${sidebarCollapsed ? 'sidebar--collapsed' : ''} ${mobileOpen ? 'sidebar--open' : ''}`}
      animate={{ 
        width: window.innerWidth <= 768 ? 280 : (sidebarCollapsed ? 72 : 260) 
      }}
      transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
    >
      {/* Logo */}
      <div className="sidebar__logo">
        <div className="sidebar__logo-icon">
          <MosqueIcon />
        </div>
        <AnimatePresence>
          {!sidebarCollapsed && (
            <motion.div
              className="sidebar__logo-text"
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.2 }}
            >
              <span className="sidebar__logo-name">Muslim Life</span>
              <span className="sidebar__logo-sub">OS 2026</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Collapse Toggle */}
        <button
          className="sidebar__toggle"
          onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          aria-label="Toggle sidebar"
        >
          {sidebarCollapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
        </button>
      </div>

      {/* User Profile Quick */}
      {!sidebarCollapsed && (
        <motion.div
          className="sidebar__user"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <div className="sidebar__user-avatar">
            {userProfile.avatar ? (
              <img src={userProfile.avatar} alt={userProfile.name} />
            ) : (
              <span>{(userProfile.name || 'U')[0]}</span>
            )}
          </div>
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{userProfile.name}</span>
            <span className="sidebar__user-level">Level {userProfile.level} · Believer</span>
          </div>
        </motion.div>
      )}

      {/* Navigation */}
      <nav className="sidebar__nav">
        <div className="sidebar__nav-group">
          {NAV_ITEMS.map((item, i) => (
            <SidebarLink
              key={item.path}
              item={item}
              collapsed={sidebarCollapsed}
              t={t}
              delay={i * 0.03}
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </div>

        <div className="sidebar__divider" />

        <div className="sidebar__nav-group">
          {BOTTOM_ITEMS.map((item) => (
            <SidebarLink 
              key={item.path} 
              item={item} 
              collapsed={sidebarCollapsed} 
              t={t} 
              onClick={() => setMobileOpen(false)}
            />
          ))}
        </div>
      </nav>

      {/* Deen Score Footer */}
      {!sidebarCollapsed && (
        <motion.div
          className="sidebar__footer"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
        >
          <div className="sidebar__footer-label">Today's Deen Score</div>
          <div className="sidebar__footer-score">
            <div className="sidebar__footer-bar">
              <motion.div
                className="sidebar__footer-fill"
                initial={{ width: 0 }}
                animate={{ width: '72%' }}
                transition={{ duration: 1.2, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
            <span className="sidebar__footer-val">72%</span>
          </div>
        </motion.div>
      )}
    </motion.aside>
  );
}

function SidebarLink({ item, collapsed, t, delay = 0, onClick }) {
  const Icon = item.icon;
  return (
    <NavLink
      to={item.path}
      end={item.path === '/'}
      onClick={onClick}
      className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
    >
      {({ isActive }) => (
        <>
          <span className={`sidebar__link-icon ${isActive ? 'sidebar__link-icon--active' : ''}`}>
            <Icon size={20} />
            {isActive && (
              <motion.span
                className="sidebar__link-dot"
                layoutId="sidebar-active-dot"
                transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
              />
            )}
          </span>

          {!collapsed && (
            <span className="sidebar__link-label">{t(item.key, item.label)}</span>
          )}
          {collapsed && isActive && <span className="sidebar__link-tooltip">{t(item.key, item.label)}</span>}
        </>
      )}
    </NavLink>
  );
}

function MosqueIcon() {
  return (
    <svg viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg" className="sidebar__mosque-icon">
      <path d="M18 4C15.5 4 13.5 6 13.5 8.5C13.5 10.5 14.7 12.2 16.5 12.8V15H11L8 18H4V32H32V18H28L25 15H19.5V12.8C21.3 12.2 22.5 10.5 22.5 8.5C22.5 6 20.5 4 18 4Z" fill="url(#mg)" stroke="rgba(255,255,255,0.2)" strokeWidth="0.5"/>
      <path d="M12 22C12 19.8 13.8 18 16 18H20C22.2 18 24 19.8 24 22V32H12V22Z" fill="rgba(255,255,255,0.1)"/>
      <defs>
        <linearGradient id="mg" x1="4" y1="4" x2="32" y2="32" gradientUnits="userSpaceOnUse">
          <stop stopColor="#10B981"/>
          <stop offset="1" stopColor="#059669"/>
        </linearGradient>
      </defs>
    </svg>
  );
}
