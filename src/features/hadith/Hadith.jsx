import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';
import { Bookmark, Search, Award, HelpCircle, BookOpen, ChevronRight, RotateCcw } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import { HADITHS } from '../../utils/islamicData';
import { useAppStore } from '../../store';
import './Hadith.css';

const QUIZ_QUESTIONS = [
  {
    id: 1,
    question: "Which surah is known as the 'Heart of the Quran'?",
    options: ["Surah Ya-Sin", "Surah Al-Mulk", "Surah Al-Ikhlas", "Surah Ar-Rahman"],
    correct: 0,
    explanation: "The Prophet ﷺ said: 'Everything has a heart, and the heart of the Quran is Ya-Sin.' (Tirmidhi)."
  },
  {
    id: 2,
    question: "In which month was the Holy Quran first revealed to Prophet Muhammad ﷺ?",
    options: ["Rajab", "Sha'ban", "Ramadan", "Dhul-Hijjah"],
    correct: 2,
    explanation: "The Quran was revealed in the month of Ramadan, during Laylat al-Qadr (The Night of Decree)."
  },
  {
    id: 3,
    question: "What is the name of the cave in which the Prophet ﷺ received the first revelation?",
    options: ["Cave Thawr", "Cave Hira", "Cave Safa", "Cave Marwah"],
    correct: 1,
    explanation: "The Prophet ﷺ was in Cave Hira on Mount al-Noor when Angel Jibreel brought him the first verses of Surah Al-Alaq."
  },
  {
    id: 4,
    question: "How many rak'ahs are there in the obligatory Friday congregational prayer (Jum'ah)?",
    options: ["4 Rak'ahs", "2 Rak'ahs", "3 Rak'ahs", "8 Rak'ahs"],
    correct: 1,
    explanation: "The Jum'ah congregational prayer consists of 2 obligatory rak'ahs prayed behind the Imam, replacing Dhuhr."
  },
  {
    id: 5,
    question: "Who was the first muezzin (caller to prayer) in Islam?",
    options: ["Salman al-Farsi (RA)", "Bilal ibn Rabah (RA)", "Abu Bakr as-Siddiq (RA)", "Ali ibn Abi Talib (RA)"],
    correct: 1,
    explanation: "Bilal ibn Rabah (RA), a close companion of the Prophet ﷺ, was appointed as the very first caller to prayer in Medina due to his beautiful voice."
  }
];

export default function Hadith() {
  const { userProfile, setUserProfile } = useAppStore();
  const [activeTab, setActiveTab] = useState('hadiths'); // 'hadiths', 'quiz'
  const [favs, setFavs] = useState([]);
  const daily = HADITHS[new Date().getDay() % HADITHS.length];
  const toggleFav = (id) => setFavs(f => f.includes(id) ? f.filter(x => x !== id) : [...f, id]);

  // Quiz States
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAns, setSelectedAns] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleAnswerClick = (optionIdx) => {
    if (isAnswered) return;
    setSelectedAns(optionIdx);
    setIsAnswered(true);
    if (optionIdx === QUIZ_QUESTIONS[currentQ].correct) {
      setScore(s => s + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQ < QUIZ_QUESTIONS.length - 1) {
      setCurrentQ(c => c + 1);
      setSelectedAns(null);
      setIsAnswered(false);
    } else {
      // Award XP
      const xpGained = score * 10;
      const nextLevelXp = userProfile.level * 100;
      let newXp = (userProfile.xp || 0) + xpGained;
      let newLevel = userProfile.level || 1;
      
      if (newXp >= nextLevelXp) {
        newXp = newXp - nextLevelXp;
        newLevel += 1;
      }
      setUserProfile({ xp: newXp, level: newLevel });
      setQuizCompleted(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQ(0);
    setSelectedAns(null);
    setIsAnswered(false);
    setScore(0);
    setQuizCompleted(false);
  };

  return (
    <div className="hadith page-container">
      {/* Hadith Navigation Tabs */}
      <div className="hadith__tabs">
        <button 
          className={`hadith__tab-btn ${activeTab === 'hadiths' ? 'hadith__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('hadiths')}
        >
          📖 Hadith Explorer
        </button>
        <button 
          className={`hadith__tab-btn ${activeTab === 'quiz' ? 'hadith__tab-btn--active' : ''}`}
          onClick={() => setActiveTab('quiz')}
        >
          🎯 Islamic Quiz Arena
        </button>
      </div>

      <AnimatePresence mode="wait">
        {activeTab === 'hadiths' ? (
          <motion.div 
            key="hadiths" 
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
          >
            <motion.h1 className="hadith__title">Hadith Center</motion.h1>
            
            <GlassCard className="hadith__daily" variant="gold" delay={0.1} padding="lg">
              <div className="hadith__daily-label">📖 Daily Hadith</div>
              <p className="hadith__arabic">{daily.arabic}</p>
              <p className="hadith__translation">{daily.translation}</p>
              <div className="hadith__meta">
                <span>{daily.narrator}</span>
                <span className="hadith__source">{daily.source}</span>
              </div>
            </GlassCard>

            <h3 className="hadith__section-title">Hadith Collection</h3>
            <div className="hadith__list">
              {HADITHS.map((h, i) => (
                <GlassCard key={h.id} className="hadith__item" delay={0.15 + i*0.05} padding="md">
                  <div className="hadith__item-header">
                    <span className="hadith__cat">{h.category}</span>
                    <button className={`hadith__fav ${favs.includes(h.id) ? 'hadith__fav--active' : ''}`} onClick={() => toggleFav(h.id)}>
                      <Bookmark size={16} fill={favs.includes(h.id) ? 'currentColor' : 'none'} />
                    </button>
                  </div>
                  <p className="hadith__arabic">{h.arabic}</p>
                  <p className="hadith__translation">{h.translation}</p>
                  <div className="hadith__meta">
                    <span>{h.narrator}</span>
                    <span className="hadith__source">{h.source}</span>
                  </div>
                </GlassCard>
              ))}
            </div>
          </motion.div>
        ) : (
          <motion.div 
            key="quiz"
            initial={{ opacity: 0, y: 15 }} 
            animate={{ opacity: 1, y: 0 }} 
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.2 }}
            className="quiz__container"
          >
            <h1 className="hadith__title">Islamic Quiz Arena</h1>
            
            {!quizCompleted ? (
              <GlassCard padding="lg" style={{ width: '100%' }}>
                {/* Progress */}
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.8rem', color: 'var(--text-secondary)', marginBottom: '0.5rem' }}>
                  <span>Question {currentQ + 1} of {QUIZ_QUESTIONS.length}</span>
                  <span>Score: {score}</span>
                </div>
                <div className="quiz__progress-bar">
                  <div className="quiz__progress-fill" style={{ width: `${((currentQ + 1) / QUIZ_QUESTIONS.length) * 100}%` }} />
                </div>

                {/* Question */}
                <div className="quiz__question-box">
                  <p className="quiz__question-text">{QUIZ_QUESTIONS[currentQ].question}</p>
                  
                  <div className="quiz__options-grid">
                    {QUIZ_QUESTIONS[currentQ].options.map((option, idx) => {
                      let btnClass = "";
                      if (isAnswered) {
                        if (idx === QUIZ_QUESTIONS[currentQ].correct) {
                          btnClass = "quiz__option-btn--correct";
                        } else if (idx === selectedAns) {
                          btnClass = "quiz__option-btn--incorrect";
                        }
                      }
                      return (
                        <button
                          key={idx}
                          className={`quiz__option-btn ${btnClass}`}
                          disabled={isAnswered}
                          onClick={() => handleAnswerClick(idx)}
                        >
                          {option}
                        </button>
                      );
                    })}
                  </div>

                  {/* Explanation card */}
                  {isAnswered && (
                    <motion.div 
                      className="quiz__explanation-box"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                    >
                      <h5 style={{ fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.25rem', marginBottom: '0.25rem', color: 'var(--color-gold)' }}>
                        <HelpCircle size={14} /> Explanation
                      </h5>
                      <p>{QUIZ_QUESTIONS[currentQ].explanation}</p>
                    </motion.div>
                  )}
                </div>

                {/* Actions */}
                {isAnswered && (
                  <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '1.25rem' }}>
                    <Button variant="emerald" onClick={handleNextQuestion}>
                      {currentQ === QUIZ_QUESTIONS.length - 1 ? 'Finish Quiz' : 'Next Question'}
                      <ChevronRight size={16} style={{ marginLeft: '0.25rem' }} />
                    </Button>
                  </div>
                )}
              </GlassCard>
            ) : (
              <GlassCard padding="lg" className="quiz__results-box">
                <Award size={64} style={{ color: 'var(--color-gold)', margin: '0 auto 1rem auto' }} />
                <h2 className="quiz__results-title">Quiz Completed!</h2>
                <p style={{ color: 'var(--text-secondary)' }}>JazakAllah Khayran for testing your knowledge.</p>
                <div className="quiz__results-score">{score} / {QUIZ_QUESTIONS.length}</div>
                <div className="quiz__results-xp">+{score * 10} XP Awarded</div>
                
                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginTop: '1rem' }}>
                  <Button variant="outline" onClick={resetQuiz}>
                    <RotateCcw size={16} style={{ marginRight: '0.35rem' }} /> Replay Quiz
                  </Button>
                </div>
              </GlassCard>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
