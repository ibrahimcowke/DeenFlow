import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, DollarSign, TrendingUp } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { useAppStore } from '../../store';
import './Charity.css';

const NISAB = 595; // grams of silver × price per gram ≈ $350

export default function Charity() {
  const { donations, totalDonated, addDonation } = useAppStore();
  const [wealth, setWealth] = useState('');
  const zakat = wealth ? (parseFloat(wealth) * 0.025).toFixed(2) : 0;
  const [form, setForm] = useState({ amount: '', type: 'sadaqah', note: '' });
  const [showForm, setShowForm] = useState(false);

  const submit = () => {
    if (!form.amount) return;
    addDonation({ id: Date.now(), amount: parseFloat(form.amount), type: form.type, note: form.note, date: new Date().toISOString() });
    setForm({ amount: '', type: 'sadaqah', note: '' });
    setShowForm(false);
  };

  return (
    <div className="charity page-container">
      <motion.h1 className="charity__title" initial={{ opacity:0,y:-20 }} animate={{ opacity:1,y:0 }}>Charity Center</motion.h1>

      <div className="charity__stats-row">
        <GlassCard className="charity__stat" variant="emerald" padding="md" delay={0.05}>
          <DollarSign size={20} color="var(--color-emerald)"/>
          <span className="charity__stat-val">${totalDonated.toFixed(2)}</span>
          <span className="charity__stat-label">Total Donated</span>
        </GlassCard>
        <GlassCard className="charity__stat" variant="gold" padding="md" delay={0.1}>
          <TrendingUp size={20} color="var(--color-gold)"/>
          <span className="charity__stat-val">{donations.length}</span>
          <span className="charity__stat-label">Donations</span>
        </GlassCard>
      </div>

      {/* Zakat Calculator */}
      <GlassCard className="charity__zakat" delay={0.15} padding="md">
        <h3 className="charity__section-title">Zakat Calculator</h3>
        <div className="charity__zakat-input">
          <label>Total Wealth ($)</label>
          <input type="number" value={wealth} onChange={e=>setWealth(e.target.value)} placeholder="Enter your total wealth" className="charity__input"/>
        </div>
        {wealth && (
          <div className="charity__zakat-result">
            <span>Zakat Due (2.5%)</span>
            <span className="charity__zakat-amount">${zakat}</span>
          </div>
        )}
      </GlassCard>

      {/* Add Donation */}
      <Button variant="primary" icon={Plus} fullWidth onClick={() => setShowForm(s=>!s)}>
        Record Donation
      </Button>

      {showForm && (
        <GlassCard className="charity__form" padding="md" delay={0}>
          <input type="number" placeholder="Amount ($)" value={form.amount} onChange={e=>setForm(f=>({...f,amount:e.target.value}))} className="charity__input"/>
          <select value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))} className="charity__select">
            <option value="sadaqah">Sadaqah</option>
            <option value="zakat">Zakat</option>
            <option value="waqf">Waqf</option>
          </select>
          <input type="text" placeholder="Note (optional)" value={form.note} onChange={e=>setForm(f=>({...f,note:e.target.value}))} className="charity__input"/>
          <div style={{display:'flex',gap:'0.75rem'}}>
            <Button variant="ghost" size="sm" onClick={()=>setShowForm(false)}>Cancel</Button>
            <Button variant="primary" size="sm" onClick={submit}>Save</Button>
          </div>
        </GlassCard>
      )}

      {/* History */}
      <h3 className="charity__section-title" style={{marginTop:'1.5rem'}}>Donation History</h3>
      {donations.length === 0 ? (
        <p style={{color:'var(--text-secondary)',textAlign:'center',padding:'2rem'}}>No donations recorded yet.</p>
      ) : (
        <div className="charity__history">
          {donations.map((d, i) => (
            <GlassCard key={d.id} className="charity__entry" delay={i*0.04} padding="sm">
              <div className="charity__entry-left">
                <span className="charity__type-badge">{d.type}</span>
                <span className="charity__entry-note">{d.note || 'Donation'}</span>
              </div>
              <div className="charity__entry-right">
                <span className="charity__entry-amt">${d.amount.toFixed(2)}</span>
                <span className="charity__entry-date">{new Date(d.date).toLocaleDateString()}</span>
              </div>
            </GlassCard>
          ))}
        </div>
      )}
    </div>
  );
}
