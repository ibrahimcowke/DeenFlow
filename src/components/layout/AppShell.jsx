import { useEffect, useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import Sidebar from './Sidebar';
import BottomNav from './BottomNav';
import TopBar from './TopBar';
import { useAppStore } from '../../store';
import './AppShell.css';

export default function AppShell() {
  const { theme, dir, sidebarCollapsed } = useAppStore();
  const [mobileSidebarOpen, setMobileSidebarOpen] = useState(false);
  const location = useLocation();

  // Apply theme and dir to document
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
    document.documentElement.setAttribute('dir', dir);
    document.documentElement.lang = dir === 'rtl' ? 'ar' : 'en';
  }, [theme, dir]);

  // Auto-close sidebar on routing changes
  useEffect(() => {
    setMobileSidebarOpen(false);
  }, [location.pathname]);

  return (
    <div className={`app-shell ${sidebarCollapsed ? 'app-shell--collapsed' : ''}`}>
      {/* Desktop & Mobile Sidebar Drawer */}
      <Sidebar mobileOpen={mobileSidebarOpen} setMobileOpen={setMobileSidebarOpen} />

      {/* Main Content Area */}
      <div className="app-shell__main">
        <TopBar onToggleMobileMenu={() => setMobileSidebarOpen(prev => !prev)} />
        <main className="app-shell__content">
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
              className="app-shell__page"
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      {/* Mobile Bottom Navigation */}
      <BottomNav />

      {/* Mobile Sidebar Overlay Backdrop */}
      {mobileSidebarOpen && (
        <div 
          className="sidebar-overlay" 
          onClick={() => setMobileSidebarOpen(false)}
        />
      )}

      {/* Background Ambiance */}
      <div className="app-shell__bg">
        <div className="app-shell__bg-orb app-shell__bg-orb--1" />
        <div className="app-shell__bg-orb app-shell__bg-orb--2" />
        <div className="app-shell__bg-orb app-shell__bg-orb--3" />
        <div className="app-shell__bg-pattern" />
      </div>
    </div>
  );
}
