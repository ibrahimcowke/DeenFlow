import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Bot, Sparkles } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import './AICoach.css';

const INITIAL_MESSAGES = [
  {
    id: 1, role: 'ai',
    text: "Assalamu Alaikum! 🌙 I'm your Islamic AI Coach. I can help you with questions about Islam, Quran, daily habits, productivity, and spiritual growth. What's on your mind?",
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
  }
];

const SUGGESTED = [
  'How do I improve my Salah?',
  'Best Surahs to memorize first?',
  'Hadith about patience',
  'Dua for anxiety',
  'How to wake up for Fajr?',
  'Islamic productivity tips',
];

const DEMO_REPLIES = [
  "JazakAllahu Khayran for your question. The Prophet ﷺ said: 'The best among you are those who learn the Quran and teach it.' (Bukhari). To connect more deeply with your faith, start with consistency in the small things — a few minutes of Quran daily, your morning Azkar, and focusing on your Salah quality over quantity. 💚",
  "Subhan Allah, that's a beautiful question. Allah says in the Quran: 'Verily, in the remembrance of Allah do hearts find rest.' (13:28). Begin with the essentials: perfect your wudu, pray on time, and recite Surah Al-Fatiha with reflection. Each prayer is a direct conversation with your Creator. 🤲",
  "MashaAllah, your commitment to growth is inspiring! The Prophet ﷺ advised us: 'Take up good deeds only as much as you are able.' Start small, be consistent, and trust in Allah's plan. Remember: istiqamah (steadfastness) is more beloved to Allah than intensity that doesn't last. 🌱",
];

export default function AICoach() {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const send = (text) => {
    if (!text.trim()) return;
    const userMsg = { id: Date.now(), role: 'user', text, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setTyping(true);

    setTimeout(() => {
      const reply = DEMO_REPLIES[Math.floor(Math.random() * DEMO_REPLIES.length)];
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1, role: 'ai', text: reply,
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 2000);
  };

  return (
    <div className="ai-coach">
      {/* Header */}
      <div className="ai-coach__header">
        <div className="ai-coach__header-icon">
          <Bot size={22} color="var(--color-emerald)" />
        </div>
        <div>
          <h1 className="ai-coach__title">Islamic AI Coach</h1>
          <p className="ai-coach__status">● Online · Speaks EN / SO / AR</p>
        </div>
        <Sparkles size={18} style={{ color: 'var(--color-gold)', marginLeft: 'auto' }} />
      </div>

      {/* Suggested Questions */}
      {messages.length <= 1 && (
        <div className="ai-coach__suggested">
          {SUGGESTED.map(q => (
            <motion.button
              key={q}
              className="ai-coach__suggest-btn"
              onClick={() => send(q)}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.97 }}
            >
              {q}
            </motion.button>
          ))}
        </div>
      )}

      {/* Messages */}
      <div className="ai-coach__messages">
        {messages.map((msg, i) => (
          <motion.div
            key={msg.id}
            className={`ai-coach__msg ai-coach__msg--${msg.role}`}
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ delay: i === messages.length - 1 ? 0 : 0, duration: 0.3 }}
          >
            {msg.role === 'ai' && (
              <div className="ai-coach__avatar">🕌</div>
            )}
            <div className="ai-coach__bubble">
              <p className="ai-coach__bubble-text">{msg.text}</p>
              <span className="ai-coach__time">{msg.time}</span>
            </div>
          </motion.div>
        ))}

        {/* Typing indicator */}
        <AnimatePresence>
          {typing && (
            <motion.div
              className="ai-coach__msg ai-coach__msg--ai"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
            >
              <div className="ai-coach__avatar">🕌</div>
              <div className="ai-coach__bubble ai-coach__bubble--typing">
                <div className="ai-coach__dots">
                  {[0, 1, 2].map(i => (
                    <motion.span
                      key={i} className="ai-coach__dot"
                      animate={{ y: [0, -6, 0] }}
                      transition={{ duration: 0.8, delay: i * 0.2, repeat: Infinity }}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="ai-coach__input-area">
        <div className="ai-coach__input-wrap">
          <input
            type="text"
            className="ai-coach__input"
            placeholder="Ask anything about Islam, habits, or productivity..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && send(input)}
          />
          <motion.button
            className="ai-coach__send"
            onClick={() => send(input)}
            disabled={!input.trim()}
            whileTap={{ scale: 0.9 }}
          >
            <Send size={18} />
          </motion.button>
        </div>
        <p className="ai-coach__disclaimer">Add your API key in Settings for full AI capabilities.</p>
      </div>
    </div>
  );
}
