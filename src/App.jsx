import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import '../src/i18n/index.js';
import { useAppStore } from './store';
import AppShell from './components/layout/AppShell';

// Pages
import Onboarding from './features/onboarding/Onboarding';
import Auth from './features/auth/Auth';
import Dashboard from './features/dashboard/Dashboard';

// Lazy-loadable screens
import { Suspense, lazy } from 'react';

const Salah     = lazy(() => import('./features/salah/Salah'));
const Quran     = lazy(() => import('./features/quran/Quran'));
const QuranReader = lazy(() => import('./features/quran/QuranReader'));
const Azkar     = lazy(() => import('./features/azkar/Azkar'));
const Habits    = lazy(() => import('./features/habits/Habits'));
const Fasting   = lazy(() => import('./features/fasting/Fasting'));
const Recovery  = lazy(() => import('./features/recovery/Recovery'));
const Emergency = lazy(() => import('./features/recovery/Emergency'));
const Notes     = lazy(() => import('./features/notes/Notes'));
const AICoach   = lazy(() => import('./features/aiCoach/AICoach'));
const Dua       = lazy(() => import('./features/azkar/Azkar'));
const Hadith    = lazy(() => import('./features/hadith/Hadith'));
const Charity   = lazy(() => import('./features/charity/Charity'));
const Family    = lazy(() => import('./features/family/Family'));
const Qibla     = lazy(() => import('./features/qibla/Qibla'));
const Profile   = lazy(() => import('./features/profile/Profile'));
const Settings  = lazy(() => import('./features/settings/Settings'));

function PageLoader() {
  return (
    <div style={{
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      minHeight: '60vh', flexDirection: 'column', gap: '1rem'
    }}>
      <div style={{
        width: 40, height: 40, borderRadius: '50%',
        border: '3px solid rgba(16,185,129,0.2)',
        borderTopColor: 'var(--color-emerald)',
        animation: 'spin-slow 0.8s linear infinite'
      }} />
      <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Loading...</p>
    </div>
  );
}

function ProtectedRoute({ children }) {
  const { onboardingComplete } = useAppStore();
  if (!onboardingComplete) return <Navigate to="/onboarding" replace />;
  return children;
}

export default function App() {
  const { onboardingComplete } = useAppStore();

  return (
    <BrowserRouter>
      <Suspense fallback={<PageLoader />}>
        <Routes>
          {/* Onboarding */}
          <Route path="/onboarding" element={<Onboarding />} />

          {/* Auth */}
          <Route path="/auth" element={<Auth />} />

          {/* Main App Shell */}
          <Route element={
            <ProtectedRoute>
              <AppShell />
            </ProtectedRoute>
          }>
            <Route index element={<Dashboard />} />
            <Route path="salah"            element={<Salah />} />
            <Route path="quran"            element={<Quran />} />
            <Route path="quran/reader"     element={<QuranReader />} />
            <Route path="quran/reader/:surah" element={<QuranReader />} />
            <Route path="azkar"            element={<Azkar />} />
            <Route path="habits"           element={<Habits />} />
            <Route path="fasting"          element={<Fasting />} />
            <Route path="recovery"         element={<Recovery />} />
            <Route path="recovery/emergency" element={<Emergency />} />
            <Route path="notes"            element={<Notes />} />
            <Route path="ai"               element={<AICoach />} />
            <Route path="dua"              element={<Dua />} />
            <Route path="hadith"           element={<Hadith />} />
            <Route path="charity"          element={<Charity />} />
            <Route path="family"           element={<Family />} />
            <Route path="qibla"            element={<Qibla />} />
            <Route path="tasbih"           element={<Azkar />} />
            <Route path="profile"          element={<Profile />} />
            <Route path="settings"         element={<Settings />} />
          </Route>

          {/* Catch all */}
          <Route path="*" element={<Navigate to={onboardingComplete ? '/' : '/onboarding'} replace />} />
        </Routes>
      </Suspense>
    </BrowserRouter>
  );
}
