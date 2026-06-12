import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, BookOpen, Wind, Activity, Check, RotateCcw, Volume2, Shield, Phone, MessageCircle } from 'lucide-react';
import { useAppStore } from '../../store';
import GlassCard from '../../components/ui/GlassCard';
import './Emergency.css';

const HELP_OPTIONS = [
  { icon: '🌬️', label: 'Deep Breathing', action: 'breathe', color: '#06B6D4' },
  { icon: '💪', label: 'Push-up Challenge', action: 'pushup', color: '#EF4444' },
  { icon: '🚶', label: 'Walk Challenge', action: 'walk', color: '#F59E0B' },
  { icon: '🚿', label: 'Cold Shower Tip', action: 'coldshower', color: '#00F2FE' },
  { icon: '📞', label: 'Call Partner', action: 'partner', color: '#10B981' },
];

export default function Emergency() {
  const navigate = useNavigate();
  const { recovery } = useAppStore();
  const contacts = recovery.contacts || [];

  const [activeAction, setActiveAction] = useState('breathe'); // default to breathing
  const [breathing, setBreathing] = useState(false);
  const [breathPhase, setBreathPhase] = useState('Inhale'); // Inhale, Hold, Exhale
  const [dhikrCount, setDhikrCount] = useState(0);
  const [pushupCount, setPushupCount] = useState(0);

  // Play beep sound for feedback
  const playFeedBeep = (freq = 800) => {
    try {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      const ctx = new AudioContextClass();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.08);
      osc.start();
      osc.stop(ctx.currentTime + 0.08);
    } catch(e) {}
  };

  // Breathing cycle metronome
  useEffect(() => {
    let interval = null;
    if (activeAction === 'breathe' && breathing) {
      let step = 0;
      interval = setInterval(() => {
        step = (step + 1) % 3;
        if (step === 0) {
          setBreathPhase('Inhale');
          playFeedBeep(600);
        } else if (step === 1) {
          setBreathPhase('Hold');
          playFeedBeep(800);
        } else {
          setBreathPhase('Exhale');
          playFeedBeep(500);
        }
      }, 4000); // 4 seconds per phase
    }
    return () => clearInterval(interval);
  }, [breathing, activeAction]);

  const handleAction = (action) => {
    setActiveAction(action);
    setBreathing(false);
  };

  return (
    <div className="emergency">
      <div className="emergency__bg">
        <div className="emergency__bg-orb emergency__bg-orb--1" />
        <div className="emergency__bg-orb emergency__bg-orb--2" />
      </div>

      <div className="emergency__content" style={{ maxWidth: '600px', width: '100%' }}>
        {/* Header */}
        <div className="emergency__header" style={{ marginBottom: '1.5rem' }}>
          <button className="emergency__back" onClick={() => navigate('/recovery')}>
            <ArrowLeft size={20} />
          </button>
          <div className="emergency__header-text" style={{ textAlign: 'center' }}>
            <p className="emergency__bismillah">بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ</p>
            <h1 className="emergency__title" style={{ fontSize: '1.75rem', fontWeight: 900 }}>Emergency Action Center</h1>
            <p className="emergency__sub" style={{ fontSize: '0.85rem' }}>Stay steady. The urge wave peaks in 10 minutes and will pass.</p>
          </div>
        </div>

        {/* Dynamic Mode Display Panel */}
        <GlassCard padding="lg" style={{ width: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '260px', justifyContent: 'center', border: '1px solid rgba(16, 185, 129, 0.25)', marginBottom: '1.5rem' }}>
          <AnimatePresence mode="wait">
            
            {activeAction === 'breathe' && (
              <motion.div key="breathe" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 700, color: '#06B6D4', marginBottom: '0.5rem' }}>Deep Breathing Challenge</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Slow down your central nervous system. Click start and sync your breath (4s Inhale, 4s Hold, 4s Exhale).
                </p>
                <motion.button 
                  onClick={() => { setBreathing(b => !b); playFeedBeep(600); }}
                  animate={{ scale: breathing ? (breathPhase === 'Inhale' ? 1.35 : breathPhase === 'Hold' ? 1.35 : 1) : 1 }}
                  transition={{ duration: 4, ease: 'easeInOut' }}
                  style={{
                    width: '110px', height: '110px', borderRadius: '50%', background: 'rgba(6, 182, 212, 0.15)', border: '2px solid rgba(6, 182, 212, 0.4)', color: 'white', fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', boxShadow: '0 0 20px rgba(6, 182, 212, 0.2)'
                  }}
                >
                  <span>{breathing ? breathPhase : 'Start'}</span>
                </motion.button>
              </motion.div>
            )}

            {activeAction === 'pushup' && (
              <motion.div key="pushup" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 700, color: '#EF4444', marginBottom: '0.5rem' }}>Push-up Challenge</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Force dopamine receptors to reset by triggering skeletal muscle exhaustion. Tap counter for each pushup done.
                </p>
                <button 
                  onClick={() => { playFeedBeep(500); setPushupCount(c => c + 1); }}
                  style={{
                    background: 'var(--grad-gold)', border: 'none', color: 'white', padding: '1rem 2rem', borderRadius: '12px', fontSize: '1.1rem', fontWeight: 700, cursor: 'pointer', display: 'flex', gap: '0.5rem', alignItems: 'center', boxShadow: '0 5px 15px rgba(245, 158, 11, 0.3)'
                  }}
                >
                  💪 Push-ups Completed: {pushupCount}
                </button>
                <button onClick={() => setPushupCount(0)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '0.75rem', cursor: 'pointer' }}>Reset Challenge Counter</button>
              </motion.div>
            )}

            {activeAction === 'walk' && (
              <motion.div key="walk" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 700, color: '#F59E0B', marginBottom: '0.5rem' }}>Walk Challenge</h4>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '400px' }}>
                  Stand up immediately. Walk to another room or go outside for a 5-minute brisk walk. 
                  Changing your physical environment breaks the cognitive trigger loop in the brain's focus center.
                </p>
                <div style={{ marginTop: '1.25rem', fontSize: '2.5rem' }}>🚶‍♂️💨</div>
              </motion.div>
            )}

            {activeAction === 'coldshower' && (
              <motion.div key="coldshower" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                <h4 style={{ fontWeight: 700, color: '#00F2FE', marginBottom: '0.5rem' }}>Cold Shower Reminder</h4>
                <p style={{ fontSize: '0.875rem', lineHeight: 1.6, color: 'var(--text-secondary)', maxWidth: '400px' }}>
                  Go to the bathroom and wash your face/head with freezing water, or take a full cold shower. 
                  Cold-water immersion triggers a substantial release of norepinephrine and raises your baseline dopamine levels by 2.5x, instantly crushing cravings.
                </p>
                <div style={{ marginTop: '1.25rem', fontSize: '2.5rem' }}>🚿❄️</div>
              </motion.div>
            )}

            {activeAction === 'partner' && (
              <motion.div key="partner" initial={{ opacity:0 }} animate={{ opacity:1 }} exit={{ opacity:0 }} style={{ textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%' }}>
                <h4 style={{ fontWeight: 700, color: '#10B981', marginBottom: '0.5rem' }}>Call Accountability Partner</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '1.25rem' }}>
                  Do not suffer in isolation. Reach out to your registered emergency contacts immediately.
                </p>
                
                <div className="emergency__contacts-grid" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '0.75rem', maxHeight: '180px', overflowY: 'auto' }}>
                  {contacts.length === 0 ? (
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>No sponsors registered yet. Add contacts in Recovery Profile screen.</p>
                  ) : (
                    contacts.map(c => (
                      <div key={c.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '0.75rem 1rem', background: 'rgba(255,255,255,0.02)', border: '1px solid var(--glass-border)', borderRadius: '10px' }}>
                        <div style={{ textAlign: 'left' }}>
                          <span style={{ display: 'block', fontWeight: 600, fontSize: '0.85rem' }}>{c.name}</span>
                          <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{c.phone}</span>
                        </div>
                        <div style={{ display: 'flex', gap: '0.5rem' }}>
                          <a href={`tel:${c.phone}`} style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                            <Phone size={14} />
                          </a>
                          <a href={`https://wa.me/${c.phone}`} target="_blank" rel="noopener noreferrer" style={{ width: '32px', height: '32px', borderRadius: '50%', background: 'rgba(16, 185, 129, 0.15)', border: '1px solid rgba(16, 185, 129, 0.3)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#10b981' }}>
                            <MessageCircle size={14} />
                          </a>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </motion.div>
            )}

          </AnimatePresence>
        </GlassCard>

        {/* Islamic Reminder Verse */}
        <div className="emergency__verse" style={{ width: '100%', marginBottom: '1.5rem' }}>
          <p className="emergency__verse-ar" style={{ fontSize: '1.25rem' }}>أَلَا بِذِكْرِ اللَّهِ تَطْمَئِنُّ الْقُلُوبُ</p>
          <p className="emergency__verse-en" style={{ fontSize: '0.8rem' }}>"Verily, in the remembrance of Allah do hearts find rest." (Quran 13:28)</p>
        </div>

        {/* Help Options Grid */}
        <div className="emergency__grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '0.5rem', width: '100%' }}>
          {HELP_OPTIONS.map((opt, i) => (
            <motion.button
              key={opt.action}
              className={`emergency__option ${activeAction === opt.action ? 'emergency__option--active' : ''}`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: i * 0.04, type: 'spring' }}
              whileTap={{ scale: 0.95 }}
              onClick={() => handleAction(opt.action)}
              style={{
                display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.4rem', background: activeAction === opt.action ? 'rgba(255,255,255,0.08)' : 'rgba(255,255,255,0.03)', border: activeAction === opt.action ? `1.5px solid ${opt.color}` : '1px solid var(--glass-border)', borderRadius: '12px', padding: '0.85rem 0.25rem', cursor: 'pointer', color: 'white'
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{opt.icon}</span>
              <span style={{ fontSize: '0.65rem', fontWeight: 600, textAlign: 'center', whiteSpace: 'nowrap' }}>{opt.label}</span>
            </motion.button>
          ))}
        </div>
      </div>
    </div>
  );
}
