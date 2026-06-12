import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Users, Award, Target, Zap, Share2, Plus, CheckCircle2 } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import RingProgress from '../../components/ui/RingProgress';
import { useAppStore } from '../../store';
import './Family.css';

const INITIAL_MEMBERS = [
  { id: 1, name: 'Ibrahim (You)', deenScore: 85, completedPrayers: 4, quranPages: 6, avatar: '🧕', role: 'Parent' },
  { id: 2, name: 'Amina (Spouse)', deenScore: 92, completedPrayers: 5, quranPages: 8, avatar: '👩', role: 'Parent' },
  { id: 3, name: 'Yusuf (Son)', deenScore: 70, completedPrayers: 3, quranPages: 4, avatar: '👦', role: 'Child' },
  { id: 4, name: 'Layla (Daughter)', deenScore: 95, completedPrayers: 5, quranPages: 10, avatar: '👧', role: 'Child' },
];

const SHARED_CHALLENGES = [
  { id: 1, title: 'Khatm Al-Quran', desc: 'Read the entire Quran together by the end of Ramadan.', progress: 62, target: '30 Juz', current: '18.6 Juz', icon: '📖' },
  { id: 2, title: 'Fajr in Congregation', desc: 'Pray Fajr together at home or mosque for 7 consecutive days.', progress: 85, target: '7 Days', current: '6 Days', icon: '🕌' },
];

export default function Family() {
  const { userProfile } = useAppStore();
  const [members, setMembers] = useState(INITIAL_MEMBERS);
  const [challenges, setChallenges] = useState(SHARED_CHALLENGES);
  const [inviteModal, setInviteModal] = useState(false);
  const [inviteEmail, setInviteEmail] = useState('');
  const [invitedList, setInvitedList] = useState([]);

  const handleInvite = (e) => {
    e.preventDefault();
    if (!inviteEmail) return;
    setInvitedList([...invitedList, inviteEmail]);
    setInviteEmail('');
    // Alert or small micro-feedback could be shown here
  };

  // Sort members by deenScore descending for the leaderboard
  const sortedLeaderboard = [...members].sort((a, b) => b.deenScore - a.deenScore);

  return (
    <div className="family page-container">
      <div className="family__header">
        <div>
          <motion.h1 className="family__title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
            Family Dashboard
          </motion.h1>
          <p className="family__sub">Grow together in Deen, support each other, and compete in good deeds</p>
        </div>
        <Button variant="emerald" onClick={() => setInviteModal(true)}>
          <Plus size={18} style={{ marginRight: '0.5rem' }} />
          Invite Member
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="family__summary">
        <GlassCard className="family__summary-card" padding="lg" delay={0.05}>
          <div className="family__summary-body">
            <div className="family__summary-info">
              <span className="family__summary-label">Family Deen Score</span>
              <h2 className="family__summary-val">85.5%</h2>
              <p className="family__summary-desc">Top 5% of families this week! 🌟</p>
            </div>
            <RingProgress value={85.5} size={80} strokeWidth={8} color="var(--color-emerald)" />
          </div>
        </GlassCard>

        <GlassCard className="family__summary-card" padding="lg" delay={0.1}>
          <div className="family__summary-body">
            <div className="family__summary-info">
              <span className="family__summary-label">Active Challenges</span>
              <h2 className="family__summary-val">{challenges.length}</h2>
              <p className="family__summary-desc">Both goals on track to complete</p>
            </div>
            <div className="family__summary-icon-holder">
              <Target size={32} color="var(--color-gold)" />
            </div>
          </div>
        </GlassCard>
      </div>

      <div className="family__grid">
        {/* Members List */}
        <div className="family__col">
          <h3 className="family__section-title">
            <Users size={18} className="family__section-icon" />
            Family Members
          </h3>
          <div className="family__members-list">
            {members.map((m, idx) => (
              <GlassCard key={m.id} className="family__member-card" padding="md" delay={0.15 + idx * 0.05}>
                <div className="family__member-layout">
                  <div className="family__member-avatar">{m.avatar}</div>
                  <div className="family__member-details">
                    <div className="family__member-header-row">
                      <span className="family__member-name">{m.name}</span>
                      <span className="family__member-role">{m.role}</span>
                    </div>
                    <div className="family__member-stats">
                      <span className="family__member-stat">🕌 Salah: {m.completedPrayers}/5</span>
                      <span className="family__member-stat">📖 Quran: {m.quranPages} pgs</span>
                    </div>
                  </div>
                  <div className="family__member-score">
                    <span className="family__score-num">{m.deenScore}</span>
                    <span className="family__score-lbl">XP</span>
                  </div>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>

        {/* Leaderboard & Challenges */}
        <div className="family__col">
          <h3 className="family__section-title">
            <Award size={18} className="family__section-icon" />
            Weekly Leaderboard
          </h3>
          <GlassCard className="family__leaderboard-card" padding="md" delay={0.2}>
            <div className="family__leaderboard">
              {sortedLeaderboard.map((m, idx) => (
                <div key={m.id} className="family__leaderboard-row">
                  <div className="family__rank">
                    {idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `${idx + 1}`}
                  </div>
                  <div className="family__leaderboard-avatar">{m.avatar}</div>
                  <div className="family__leaderboard-name">{m.name}</div>
                  <div className="family__leaderboard-score-bar-container">
                    <div 
                      className="family__leaderboard-score-bar" 
                      style={{ width: `${m.deenScore}%`, backgroundColor: idx === 0 ? 'var(--color-gold)' : 'var(--color-emerald)' }} 
                    />
                  </div>
                  <div className="family__leaderboard-score-val">{m.deenScore}%</div>
                </div>
              ))}
            </div>
          </GlassCard>

          <h3 className="family__section-title" style={{ marginTop: '2rem' }}>
            <Target size={18} className="family__section-icon" />
            Shared Challenges
          </h3>
          <div className="family__challenges-list">
            {challenges.map((c, idx) => (
              <GlassCard key={c.id} className="family__challenge-card" padding="md" delay={0.25 + idx * 0.05}>
                <div className="family__challenge-header">
                  <span className="family__challenge-icon">{c.icon}</span>
                  <div className="family__challenge-meta">
                    <h4 className="family__challenge-title">{c.title}</h4>
                    <p className="family__challenge-desc">{c.desc}</p>
                  </div>
                </div>
                <div className="family__challenge-progress-row">
                  <div className="family__challenge-bar-bg">
                    <div className="family__challenge-bar-fg" style={{ width: `${c.progress}%` }} />
                  </div>
                  <span className="family__challenge-percent">{c.progress}%</span>
                </div>
                <div className="family__challenge-footer">
                  <span className="family__challenge-current">Current: {c.current}</span>
                  <span className="family__challenge-target">Target: {c.target}</span>
                </div>
              </GlassCard>
            ))}
          </div>
        </div>
      </div>

      {/* Invite Modal */}
      <AnimatePresence>
        {inviteModal && (
          <div className="family__modal-overlay">
            <motion.div 
              className="family__modal"
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
            >
              <h3 className="family__modal-title">Invite to Family Circle</h3>
              <p className="family__modal-sub">Add a family member to start sharing goals, tracking consistency, and competing in daily habits.</p>
              
              <form onSubmit={handleInvite} className="family__modal-form">
                <input 
                  type="email" 
                  placeholder="Enter email address" 
                  value={inviteEmail} 
                  onChange={(e) => setInviteEmail(e.target.value)} 
                  className="family__modal-input"
                  required
                />
                <div className="family__modal-actions">
                  <Button variant="ghost" type="button" onClick={() => setInviteModal(false)}>Cancel</Button>
                  <Button variant="emerald" type="submit">Send Invitation</Button>
                </div>
              </form>

              {invitedList.length > 0 && (
                <div className="family__invited-section">
                  <h4 className="family__invited-title">Pending Invitations</h4>
                  <div className="family__invited-list">
                    {invitedList.map((email, idx) => (
                      <div key={idx} className="family__invited-item">
                        <span>{email}</span>
                        <span className="family__invited-status">Sent</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
