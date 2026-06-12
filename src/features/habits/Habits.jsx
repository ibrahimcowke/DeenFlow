import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Check, Zap, Flame, Plus, X } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { useAppStore } from '../../store';
import './Habits.css';

const COLOR_OPTIONS = [
  { hex: '#10B981', label: 'Emerald' },
  { hex: '#F59E0B', label: 'Gold' },
  { hex: '#6366F1', label: 'Indigo' },
  { hex: '#EC4899', label: 'Rose' },
  { hex: '#8B5CF6', label: 'Purple' },
];

export default function Habits() {
  const { habits, toggleHabit, addHabit } = useAppStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [habitName, setHabitName] = useState('');
  const [habitEmoji, setHabitEmoji] = useState('📖');
  const [habitColor, setHabitColor] = useState('#10B981');

  const done = habits.filter(h => h.completedToday).length;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!habitName.trim()) return;

    addHabit({
      id: Date.now().toString(),
      name: habitName,
      icon: habitEmoji,
      streak: 0,
      completedToday: false,
      color: habitColor,
    });

    setHabitName('');
    setHabitEmoji('📖');
    setHabitColor('#10B981');
    setShowAddForm(false);
  };

  return (
    <div className="habits page-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1.5rem' }}>
        <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="habits__title">Daily Habits</h1>
          <p className="habits__sub" style={{ margin: '0.25rem 0 0 0' }}>{done}/{habits.length} completed today</p>
        </motion.div>
        
        <Button 
          variant={showAddForm ? 'ghost' : 'primary'} 
          icon={showAddForm ? X : Plus} 
          onClick={() => setShowAddForm(!showAddForm)}
        >
          {showAddForm ? 'Close' : 'Add Habit'}
        </Button>
      </div>

      {/* Add Custom Habit Form */}
      <AnimatePresence>
        {showAddForm && (
          <motion.div
            initial={{ opacity: 0, y: -10, height: 0 }}
            animate={{ opacity: 1, y: 0, height: 'auto' }}
            exit={{ opacity: 0, y: -10, height: 0 }}
            style={{ overflow: 'hidden', marginBottom: '1.5rem' }}
          >
            <GlassCard padding="lg" style={{ border: '1px solid rgba(16, 185, 129, 0.2)' }}>
              <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <h3 style={{ fontWeight: 700, fontSize: '1.1rem' }}>Create Custom Habit</h3>
                
                <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
                  {/* Name Input */}
                  <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Habit Name</label>
                    <input
                      type="text"
                      placeholder="e.g. Morning Walk, Sadaqah..."
                      value={habitName}
                      onChange={(e) => setHabitName(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', padding: '0.6rem 1rem', borderRadius: '8px', color: 'white', outline: 'none' }}
                      required
                    />
                  </div>

                  {/* Emoji Input */}
                  <div style={{ flex: '0 1 80px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Emoji</label>
                    <input
                      type="text"
                      maxLength="2"
                      value={habitEmoji}
                      onChange={(e) => setHabitEmoji(e.target.value)}
                      style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid var(--glass-border)', padding: '0.6rem 0.5rem', borderRadius: '8px', color: 'white', textAlign: 'center', fontSize: '1.2rem', outline: 'none' }}
                      required
                    />
                  </div>

                  {/* Color Select */}
                  <div style={{ flex: '1 1 150px', display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
                    <label style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-secondary)' }}>Theme Color</label>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', height: '40px' }}>
                      {COLOR_OPTIONS.map((opt) => (
                        <button
                          key={opt.hex}
                          type="button"
                          onClick={() => setHabitColor(opt.hex)}
                          style={{
                            width: '24px',
                            height: '24px',
                            borderRadius: '50%',
                            background: opt.hex,
                            border: habitColor === opt.hex ? '2px solid white' : '2px solid transparent',
                            cursor: 'pointer',
                            boxShadow: habitColor === opt.hex ? `0 0 8px ${opt.hex}` : 'none',
                            transition: 'all 0.2s'
                          }}
                          title={opt.label}
                        />
                      ))}
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '0.5rem' }}>
                  <Button variant="emerald" type="submit">Save Habit</Button>
                </div>
              </form>
            </GlassCard>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="habits__grid">
        {habits.map((habit, i) => (
          <GlassCard
            key={habit.id}
            className={`habits__card ${habit.completedToday ? 'habits__card--done' : ''}`}
            delay={i * 0.05}
            padding="md"
            onClick={() => toggleHabit(habit.id)}
            hover
          >
            <div className="habits__card-top">
              <span className="habits__emoji">{habit.icon}</span>
              <div 
                className={`habits__check ${habit.completedToday ? 'habits__check--done' : ''}`}
                style={{ 
                  borderColor: habit.completedToday ? habit.color : 'rgba(255,255,255,0.15)',
                  boxShadow: habit.completedToday ? `0 0 12px ${habit.color}33` : 'none'
                }}
              >
                {habit.completedToday && <Check size={14} style={{ color: 'white' }} />}
              </div>
            </div>
            <h3 className="habits__name" style={{ color: habit.completedToday ? habit.color : 'white' }}>{habit.name}</h3>
            <div className="habits__streak">
              <Flame size={12} style={{ color: '#F59E0B' }} />
              <span>{habit.streak} day streak</span>
            </div>
          </GlassCard>
        ))}
      </div>
    </div>
  );
}
