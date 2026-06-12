import { motion } from 'framer-motion';
import { Award, Calendar, BookOpen, Clock, Heart, Zap, User, Star } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import RingProgress from '../../components/ui/RingProgress';
import { useAppStore } from '../../store';
import './Profile.css';

const BADGES = [
  { id: 1, title: 'Early Bird', desc: 'Prayed Fajr on time 7 days in a row.', icon: '🌅', unlocked: true, date: 'June 5, 2026' },
  { id: 2, title: 'Quran Explorer', desc: 'Read 50 pages of Quran.', icon: '📖', unlocked: true, date: 'June 10, 2026' },
  { id: 3, title: 'Charity Champion', desc: 'Donated 3 times this month.', icon: '💚', unlocked: true, date: 'June 11, 2026' },
  { id: 4, title: 'Sunnah Keeper', desc: 'Completed 10 Sunnah habits.', icon: '⭐', unlocked: false, date: null },
  { id: 5, title: 'Ramadan Spirit', desc: 'Fasted 5 Sunnah days.', icon: '🌕', unlocked: false, date: null },
  { id: 6, title: 'Night Owl', desc: 'Prayed Tahajjud 3 times.', icon: '🌙', unlocked: false, date: null },
];

export default function Profile() {
  const { userProfile, habits, todaySalah, quranProgress } = useAppStore();

  const xpNeeded = 1000;
  const currentXP = userProfile.xp || 320;
  const xpPercent = Math.min((currentXP / xpNeeded) * 100, 100);

  // Derive stats from app state
  const completedPrayersToday = Object.values(todaySalah).filter(p => p.completed).length;
  const completedHabitsToday = habits.filter(h => h.completedToday).length;

  const stats = [
    { label: 'Completed Salah', val: '142', sub: `${completedPrayersToday} today`, icon: '🕌', color: 'var(--color-emerald)' },
    { label: 'Quran Pages', val: `${quranProgress.totalPages || 12}`, sub: `${quranProgress.todayPages || 0} today`, icon: '📖', color: '#6366F1' },
    { label: 'Habits Completed', val: '88', sub: `${completedHabitsToday} today`, icon: '🔥', color: '#F59E0B' },
    { label: 'Sunnah Fasts', val: '6', sub: 'Active logs', icon: '🌙', color: '#EC4899' },
  ];

  return (
    <div className="profile page-container">
      <motion.h1 className="profile__title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
        Profile
      </motion.h1>

      {/* User Card */}
      <GlassCard className="profile__user-card" padding="lg" delay={0.05}>
        <div className="profile__user-layout">
          <div className="profile__avatar-container">
            <div className="profile__avatar">
              {userProfile.avatar || <User size={48} color="rgba(255,255,255,0.7)" />}
            </div>
            <div className="profile__level-badge">Level {userProfile.level}</div>
          </div>

          <div className="profile__user-info">
            <h2 className="profile__username">{userProfile.name}</h2>
            <div className="profile__joined">
              <Calendar size={14} />
              <span>Joined June 2026</span>
            </div>

            {/* XP Progress Bar */}
            <div className="profile__xp-section">
              <div className="profile__xp-header">
                <span className="profile__xp-lbl">Experience Points</span>
                <span className="profile__xp-val">{currentXP} / {xpNeeded} XP</span>
              </div>
              <div className="profile__xp-bar-bg">
                <div className="profile__xp-bar-fg" style={{ width: `${xpPercent}%` }} />
              </div>
              <span className="profile__xp-sub">{xpNeeded - currentXP} XP until Level {userProfile.level + 1}</span>
            </div>
          </div>
        </div>
      </GlassCard>

      {/* Stats Grid */}
      <h3 className="profile__section-title">Islamic Analytics</h3>
      <div className="profile__stats-grid">
        {stats.map((s, i) => (
          <GlassCard key={s.label} className="profile__stat-card" padding="md" delay={0.1 + i * 0.05}>
            <div className="profile__stat-body">
              <div className="profile__stat-info">
                <span className="profile__stat-label">{s.label}</span>
                <h3 className="profile__stat-val">{s.val}</h3>
                <span className="profile__stat-sub">{s.sub}</span>
              </div>
              <div className="profile__stat-icon" style={{ backgroundColor: `${s.color}15`, border: `1px solid ${s.color}30` }}>
                <span style={{ fontSize: '1.25rem' }}>{s.icon}</span>
              </div>
            </div>
          </GlassCard>
        ))}
      </div>

      {/* Achievements Badges Section */}
      <div className="profile__achievements-header">
        <h3 className="profile__section-title">Badges & Achievements</h3>
        <span className="profile__badges-count">
          {BADGES.filter(b => b.unlocked).length} / {BADGES.length} Unlocked
        </span>
      </div>

      <div className="profile__badges-grid">
        {BADGES.map((b, i) => (
          <GlassCard 
            key={b.title} 
            className={`profile__badge-card ${!b.unlocked ? 'profile__badge-card--locked' : ''}`} 
            padding="md" 
            delay={0.15 + i * 0.05}
          >
            <div className="profile__badge-icon">{b.icon}</div>
            <h4 className="profile__badge-title">{b.title}</h4>
            <p className="profile__badge-desc">{b.desc}</p>
            {b.unlocked ? (
              <span className="profile__badge-status">Unlocked {b.date}</span>
            ) : (
              <span className="profile__badge-status profile__badge-status--locked">Locked</span>
            )}
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
