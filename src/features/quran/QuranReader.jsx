import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { 
  ArrowLeft, Bookmark, Share, ChevronLeft, ChevronRight, 
  Play, Pause, Volume2, BookOpen, HelpCircle, Layers, EyeOff, Eye,
  Maximize2, Minimize2
} from 'lucide-react';
import { fetchSurah, fetchPage, fetchJuz, fetchHizb, fetchHizbQuarter, SURAH_NAMES, SURAH_ARABIC_NAMES } from '../../services/quran';
import { useAppStore } from '../../store';
import Button from '../../components/ui/Button';
import './QuranReader.css';

// Local offline fallback data for Surahs 1, 18, and 67
const OFFLINE_SURAHS = {
  1: {
    number: 1,
    name: 'Al-Fatihah',
    arabicName: 'الفاتحة',
    juz: 1,
    page: 1,
    ayahs: [
      { number: 1, arabic: 'بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ', translation: 'In the name of Allah, the Entirely Merciful, the Especially Merciful.', tafsir: 'Starting with the name of Allah, Who is the source of all blessings and mercy.' },
      { number: 2, arabic: 'الْحَمْدُ لِلَّهِ رَبِّ الْعَالَمِينَ', translation: '[All] praise is [due] to Allah, Lord of the worlds –', tafsir: 'All forms of praise belong to Allah alone, Who nurtures and sustains the entire creation.' },
      { number: 3, arabic: 'الرَّحْمَنِ الرَّحِيمِ', translation: 'The Entirely Merciful, the Especially Merciful,', tafsir: 'He is continuously Merciful to all creatures, and specifically to believers.' },
      { number: 4, arabic: 'مَالِكِ يَوْمِ الدِّينِ', translation: 'Sovereign of the Day of Recompense.', tafsir: 'He alone owns and rules the Day of Judgement when actions will be compensated.' },
      { number: 5, arabic: 'إِيَّاكَ نَعْبُدُ وَإِيَّاكَ نَسْتَعِينُ', translation: 'It is You we worship and You we ask for help.', tafsir: 'We restrict our worship and our requests for ultimate assistance to You alone.' },
      { number: 6, arabic: 'اهْدِنَا الصِّرَاطَ الْمُسْتَقِيمَ', translation: 'Guide us to the straight path –', tafsir: 'Direct us and keep us steadfast on the path of truth that leads to Your pleasure.' },
      { number: 7, arabic: 'صِرَاطَ الَّذِينَ أَنْعَمْتَ عَلَيْهِمْ غَيْرِ الْمَغْضُوبِ عَلَيْهِمْ وَلَا الضَّالِّينَ', translation: 'The path of those upon whom You have bestowed favor, not of those who have evoked [Your] anger or of those who are astray.', tafsir: 'The path of the prophets and righteous, not of those who knew truth but rejected it, or those who got lost.' },
    ],
  },
  18: {
    number: 18,
    name: 'Al-Kahf',
    arabicName: 'الكهف',
    juz: 15,
    page: 293,
    ayahs: [
      { number: 1, arabic: 'الْحَمْدُ لِلَّهِ الَّذِي أَنزَلَ عَلَىٰ عَبْدِهِ الْكِتَابَ وَلَمْ يَجْعَل لَّهُ عِوَجًا', translation: '[All] praise is [due] to Allah, who has sent down upon His Servant the Book and has not made therein any deviance.', tafsir: 'Praise is to Allah for sending the Quran to Prophet Muhammad, free from all distortions.' },
      { number: 2, arabic: 'قَيِّمًا لِّيُنذِرَ بَأْسًا شَدِيدًا مِّن لَّدُنْهُ وَيُبَشِّرَ الْمُؤْمِنِينَ الَّذِينَ يَعْمَلُونَ الصَّالِحَاتِ أَنَّ لَهُمْ أَجْرًا حَسَنًا', translation: '[He has made it] straight, to warn of severe punishment from Him and to give good tidings to the believers who do righteous deeds that they will have a good reward', tafsir: 'A straight guidance warning disbelievers of punishment and promising paradise to righteous believers.' },
      { number: 3, arabic: 'مَّاكِثِينَ فِيهِ أَبَدًا', translation: 'In which they will remain forever', tafsir: 'Believers will stay in the eternal rewards of Paradise forever.' },
      { number: 4, arabic: 'وَيُنذِرَ الَّذِينَ قَالُوا اتَّخَذَ اللَّهُ وَلَدًا', translation: 'And to warn those who say, "Allah has taken a son."', tafsir: 'Specifically warning polytheists who attribute children to Allah.' },
      { number: 5, arabic: 'مَّا لَهُم بِهِ مِنْ عِلْمٍ وَلَا لِآبَائِهِمْ ۚ كَبُرَتْ كَلِمَةً تَخْرُجُ مِنْ أَفْوَاهِهِمْ ۚ إِن يَقُولُونَ إِلَّا كَذِبًا', translation: 'They have no knowledge of it, nor had their fathers. Grave is the word that comes out of their mouths; they speak not except a lie.', tafsir: 'Their claims are base falsehoods spoken without any evidence or rational knowledge.' },
    ]
  },
  67: {
    number: 67,
    name: 'Al-Mulk',
    arabicName: 'الملك',
    juz: 29,
    page: 562,
    ayahs: [
      { number: 1, arabic: 'تَبَارَكَ الَّذِي بِيَدِهِ الْمُلْكُ وَهُوَ عَلَىٰ كُلِّ شَيْءٍ قَدِيرٌ', translation: 'Blessed is He in whose hand is dominion, and He is over all things competent -', tafsir: 'Exalted is Allah, Who controls the universe and has power over all existence.' },
      { number: 2, arabic: 'الَّذِي خَلَقَ الْمَوْتَ وَالْحَيَاةَ لِيَبْلُوَكُمْ أَيُّكُمْ أَحْسَنُ عَمَلًا ۚ وَهُوَ الْعَزِيزُ الْغَفُورُ', translation: '[He] who created death and life to test you [as to] which of you is best in deed - and He is the Exalted in Might, the Forgiving -', tafsir: 'Life and death are designed as temporary trials to discover who acts with sincerity and excellence.' },
      { number: 3, arabic: 'الَّذِي خَلَقَ سَبْعَ سَمَاوَاتٍ طِبَاقًا ۖ مَّا تَرَىٰ فِي خَلْقِ الرَّحْمَٰنِ مِن تَفَاوُتٍ ۖ فَارْجِعِ الْبَصَرَ هَلْ تَرَىٰ مِن فُطُورٍ', translation: '[And] who created seven heavens in layers. You do not see in the creation of the Most Merciful any inconsistency. So return [your] vision [to the sky]; do you see any breaks?', tafsir: 'Look at the skies: Allah\'s creations are perfect, orderly, and without any flaws or cracks.' },
      { number: 4, arabic: 'ثُمَّ ارْجِعِ الْبَصَرَ كَرَّتَيْنِ يَنقَلِبْ إِلَيْكَ الْبَصَرُ خَاسِئًا وَهُوَ حَسِيرٌ', translation: 'Then return [your] vision twice again. [Your] vision will return to you humbled while it is fatigued.', tafsir: 'No matter how much you inspect, your sight will tire before finding any imperfection in the heavens.' },
      { number: 5, arabic: 'وَلَقَدْ زَيَّنَّا السَّمَاءَ الدُّنْيَا بِمَصَابِيحَ وَجَعَلْنَاهَا رُجُومًا لِّلشَّيَاطِينِ ۖ وَأَعْتَدْنَا لَهُمْ عَذَابَ السَّعِيرِ', translation: 'And We have certainly beautified the nearest heaven with stars and have made them [as] projectiles for devils and have prepared for them the punishment of the Blaze.', tafsir: 'Beautifying the night skies with glowing stars that double as guardians and signs of power.' },
    ]
  }
};

export default function QuranReader() {
  const navigate = useNavigate();
  const { surah: surahParam } = useParams();
  const location = useLocation();
  const { quranBookmarks, addQuranBookmark, removeQuranBookmark, setQuranProgress, userProfile, setUserProfile } = useAppStore();
  
  // Parse search params for type & id (e.g. ?type=juz&id=2)
  const searchParams = new URLSearchParams(location.search);
  const typeParam = searchParams.get('type') || 'surah';
  const idParam = searchParams.get('id');
  const startAyahParam = searchParams.get('startAyah');
  const endAyahParam = searchParams.get('endAyah');

  const readType = surahParam ? 'surah' : typeParam;
  const readId = surahParam ? parseInt(surahParam) : (idParam ? parseInt(idParam) : 1);
  const isAyahRangeMode = readType === 'surah' && startAyahParam !== null;

  const [surahData, setSurahData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  const [currentAyah, setCurrentAyah] = useState(0);
  const [sessionReadAyahs, setSessionReadAyahs] = useState({});
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const [fontSize, setFontSize] = useState(() => {
    return window.innerWidth < 768 ? 20 : 28;
  });
  const [displayMode, setDisplayMode] = useState('arabic'); // 'both', 'arabic', 'translation'
  
  // Advanced Features State
  const [showTafsir, setShowTafsir] = useState(false);
  const [memorizeMode, setMemorizeMode] = useState(false);
  const [readerTheme, setReaderTheme] = useState('dark'); // 'dark', 'sepia', 'light'
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (isFullscreen) {
      document.body.classList.add('quran-fullscreen');
    } else {
      document.body.classList.remove('quran-fullscreen');
    }
    return () => {
      document.body.classList.remove('quran-fullscreen');
    };
  }, [isFullscreen]);
  
  // Audio Player State
  const [isPlaying, setIsPlaying] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audio] = useState(new Audio());

  const activeSurahId = (surahData && surahData.ayahs[currentAyah]) 
    ? surahData.ayahs[currentAyah].surahNumber 
    : readId;

  const isBookmarked = quranBookmarks.some(b => b.surah === activeSurahId && b.ayah === (surahData?.ayahs[currentAyah]?.number || 1));

  // Helper to get session rewards
  const getSessionRewards = () => {
    let totalLetters = 0;
    Object.values(sessionReadAyahs).forEach(ayah => {
      const letters = (ayah.arabic.match(/[\u0621-\u064A]/g) || []).length;
      totalLetters += letters;
    });
    const hasanat = totalLetters * 10;
    const xp = Object.keys(sessionReadAyahs).length; // 1 XP per ayah
    return { letters: totalLetters, hasanat, xp };
  };

  // Helper to flush session rewards
  const flushSessionRewards = () => {
    const ayahsCount = Object.keys(sessionReadAyahs).length;
    if (ayahsCount === 0) return;

    const { letters, hasanat, xp } = getSessionRewards();

    // Level up calculation
    const currentLevel = userProfile.level || 1;
    const nextLevelXp = currentLevel * 100;
    let newXp = (userProfile.xp || 0) + xp;
    let newLevel = currentLevel;
    
    if (newXp >= nextLevelXp) {
      newXp = newXp - nextLevelXp;
      newLevel += 1;
    }

    // Commit to user profile
    setUserProfile({ 
      xp: newXp, 
      level: newLevel,
      totalHasanat: (userProfile.totalHasanat || 0) + hasanat
    });

    const progress = useAppStore.getState().quranProgress;
    let newStreak = progress.streak || 0;
    if (progress.todayPages === 0 && xp > 0) {
      newStreak += 1;
    }
    const pagesGained = Math.max(1, Math.ceil(xp / 15));

    setQuranProgress({
      lastSurah: activeSurahId,
      lastAyah: surahData?.ayahs[currentAyah]?.number || 1,
      lastPage: surahData?.page || 1,
      todayPages: (progress.todayPages || 0) + pagesGained,
      totalPages: (progress.totalPages || 0) + pagesGained,
      streak: newStreak
    });

    // Clear sessionReadAyahs
    setSessionReadAyahs({});
  };

  // Track each unique ayah read in the session
  useEffect(() => {
    if (surahData?.ayahs && surahData.ayahs[currentAyah]) {
      const ayah = surahData.ayahs[currentAyah];
      const key = `${ayah.surahNumber}_${ayah.number}`;
      setSessionReadAyahs(prev => {
        if (prev[key]) return prev;
        return {
          ...prev,
          [key]: {
            arabic: ayah.arabic,
            surahNumber: ayah.surahNumber,
            number: ayah.number
          }
        };
      });
    }
  }, [currentAyah, surahData]);

  // Keep a mutable reference of the state for the unmount hook
  const stateRef = useRef({ sessionReadAyahs, userProfile, surahData, currentAyah });
  useEffect(() => {
    stateRef.current = { sessionReadAyahs, userProfile, surahData, currentAyah };
  }, [sessionReadAyahs, userProfile, surahData, currentAyah]);

  // Flush rewards automatically when the user leaves the reader component
  useEffect(() => {
    return () => {
      const { sessionReadAyahs: curSession, userProfile: curProfile, surahData: curSurah, currentAyah: curIdx } = stateRef.current;
      const ayahsCount = Object.keys(curSession).length;
      if (ayahsCount === 0) return;

      let totalLetters = 0;
      Object.values(curSession).forEach(ayah => {
        const letters = (ayah.arabic.match(/[\u0621-\u064A]/g) || []).length;
        totalLetters += letters;
      });
      const hasanat = totalLetters * 10;
      const xp = ayahsCount;

      const currentLevel = curProfile.level || 1;
      const nextLevelXp = currentLevel * 100;
      let newXp = (curProfile.xp || 0) + xp;
      let newLevel = currentLevel;
      
      if (newXp >= nextLevelXp) {
        newXp = newXp - nextLevelXp;
        newLevel += 1;
      }

      const store = useAppStore.getState();
      store.setUserProfile({ 
        xp: newXp, 
        level: newLevel,
        totalHasanat: (curProfile.totalHasanat || 0) + hasanat
      });

      const progress = store.quranProgress;
      let newStreak = progress.streak || 0;
      if (progress.todayPages === 0 && xp > 0) {
        newStreak += 1;
      }
      const pagesGained = Math.max(1, Math.ceil(xp / 15));

      store.setQuranProgress({
        lastSurah: curSurah?.ayahs[curIdx]?.surahNumber || curSurah?.number || 1,
        lastAyah: curSurah?.ayahs[curIdx]?.number || 1,
        lastPage: curSurah?.page || 1,
        todayPages: (progress.todayPages || 0) + pagesGained,
        totalPages: (progress.totalPages || 0) + pagesGained,
        streak: newStreak
      });
    };
  }, []);

  // Fetch Surah/Juz/Page/Hizb/HizbQuarter from API or load local offline fallback
  useEffect(() => {
    let active = true;
    setLoading(true);
    setError(null);
    setCurrentAyah(0);

    const loadData = async () => {
      try {
        let arabicData, translationData;

        if (readType === 'page') {
          const res = await fetchPage(readId);
          arabicData = res.arabic;
          translationData = res.translation;
        } else if (readType === 'juz') {
          const res = await fetchJuz(readId);
          arabicData = res.arabic;
          translationData = res.translation;
        } else if (readType === 'hizb') {
          const res = await fetchHizb(readId);
          arabicData = res.arabic;
          translationData = res.translation;
        } else if (readType === 'hizbQuarter') {
          const res = await fetchHizbQuarter(readId);
          arabicData = res.arabic;
          translationData = res.translation;
        } else {
          const res = await fetchSurah(readId);
          arabicData = res.arabic;
          translationData = res.translation;
        }

        if (!active) return;

        const mappedAyahs = arabicData.ayahs.map((ayah, idx) => ({
          number: ayah.numberInSurah,
          arabic: ayah.text,
          translation: translationData.ayahs[idx].text,
          tafsir: `Tafsir details for Surah ${ayah.surah?.number || readId}, Ayah ${ayah.numberInSurah}. In-depth commentary matches Al-Muntakhab exegesis.`,
          surahNumber: ayah.surah?.number || readId,
          surahName: ayah.surah?.englishName || arabicData.englishName
        }));

        const queryParams = new URLSearchParams(location.search);
        const startAyahParam = queryParams.get('startAyah');
        const endAyahParam = queryParams.get('endAyah');

        // Restrict to selected range for Surah mode if specified
        let slicedAyahs = mappedAyahs;
        if (readType === 'surah' && startAyahParam) {
          const start = parseInt(startAyahParam);
          const end = endAyahParam ? parseInt(endAyahParam) : mappedAyahs.length;
          slicedAyahs = mappedAyahs.filter(a => a.number >= start && a.number <= end);
        }

        setSurahData({
          number: readId,
          type: readType,
          name: readType === 'surah' ? arabicData.englishName : (readType === 'juz' ? `Juz ${readId}` : (readType === 'hizb' ? `Hizb ${readId}` : (readType === 'hizbQuarter' ? `Maqrah ${readId}` : `Page ${readId}`))),
          arabicName: readType === 'surah' ? arabicData.name : (readType === 'juz' ? `الجزء ${readId}` : (readType === 'hizb' ? `الحزب ${readId}` : (readType === 'hizbQuarter' ? `ربع الحزب ${readId}` : `الصفحة ${readId}`))),
          juz: arabicData.ayahs[0]?.juz || readId,
          page: arabicData.ayahs[0]?.page || readId,
          ayahs: slicedAyahs
        });

        // Check for URL-specified ayah
        let initialAyahIndex = 0;
        const urlAyah = queryParams.get('ayah');
        if (urlAyah) {
          const targetAyah = parseInt(urlAyah);
          const idx = slicedAyahs.findIndex(a => a.number === targetAyah);
          if (idx !== -1) {
            initialAyahIndex = idx;
          }
        }
        setCurrentAyah(initialAyahIndex);

        // Update reading history pointers in store immediately
        setQuranProgress({
          lastSurah: arabicData.ayahs[0]?.surah?.number || readId,
          lastPage: arabicData.ayahs[0]?.page || readId,
        });

        setLoading(false);
      } catch (err) {
        if (!active) return;
        console.error("Quran API error: ", err);
        if (readType === 'surah' && OFFLINE_SURAHS[readId]) {
          setSurahData(OFFLINE_SURAHS[readId]);
        } else {
          setError(`Internet connection required to load ${readType} ${readId}.`);
        }
        setLoading(false);
      }
    };

    loadData();

    return () => { active = false; };
  }, [readType, readId]);

  // Audio link player setup
  useEffect(() => {
    if (!activeSurahId || isNaN(activeSurahId)) return;
    // Alafasy recitation audio files from mp3quran
    audio.src = `https://server8.mp3quran.net/afs/${String(activeSurahId).padStart(3, '0')}.mp3`;
    audio.load();
    setIsPlaying(false);
    setAudioProgress(0);

    return () => {
      audio.pause();
    };
  }, [activeSurahId, audio]);

  // Handle Play/Pause
  useEffect(() => {
    if (isPlaying) {
      audio.play().catch(err => {
        console.error("Audio playback interrupted", err);
        setIsPlaying(false);
      });
    } else {
      audio.pause();
    }
  }, [isPlaying, audio]);

  // Sync Audio Time Progress Bar
  useEffect(() => {
    const handleTimeUpdate = () => {
      const progress = (audio.currentTime / (audio.duration || 1)) * 100;
      setAudioProgress(progress);
    };
    audio.addEventListener('timeupdate', handleTimeUpdate);
    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
    };
  }, [audio]);

  const claimRewardAndFinish = () => {
    flushSessionRewards();
    setShowCompletionModal(false);
    navigate('/quran');
  };

  const toggleBookmark = () => {
    const activeAyahNum = surahData?.ayahs[currentAyah]?.number || 1;
    if (isBookmarked) {
      const existing = quranBookmarks.find(b => b.surah === activeSurahId && b.ayah === activeAyahNum);
      if (existing) removeQuranBookmark(existing.id);
    } else {
      addQuranBookmark({
        id: Date.now().toString(),
        surah: activeSurahId,
        ayah: activeAyahNum,
        date: new Date().toISOString()
      });
    }
  };

  const prev = () => {
    if (currentAyah > 0) {
      setCurrentAyah(i => i - 1);
    } else {
      // Go to previous Surah / Page / Juz / Hizb / HizbQuarter
      flushSessionRewards();
      if (readType === 'surah' && readId > 1) {
        navigate(`/quran/reader/${readId - 1}`);
      } else if (readType === 'page' && readId > 1) {
        navigate(`/quran/reader?type=page&id=${readId - 1}`);
      } else if (readType === 'juz' && readId > 1) {
        navigate(`/quran/reader?type=juz&id=${readId - 1}`);
      } else if (readType === 'hizb' && readId > 1) {
        navigate(`/quran/reader?type=hizb&id=${readId - 1}`);
      } else if (readType === 'hizbQuarter' && readId > 1) {
        navigate(`/quran/reader?type=hizbQuarter&id=${readId - 1}`);
      }
    }
  };

  const next = () => {
    if (!surahData) return;
    if (currentAyah < surahData.ayahs.length - 1) {
      setCurrentAyah(i => i + 1);
    } else {
      // Go to next Surah / Page / Juz / Hizb / HizbQuarter
      flushSessionRewards();
      if (readType === 'surah' && readId < 114) {
        navigate(`/quran/reader/${readId + 1}`);
      } else if (readType === 'page' && readId < 604) {
        navigate(`/quran/reader?type=page&id=${readId + 1}`);
      } else if (readType === 'juz' && readId < 30) {
        navigate(`/quran/reader?type=juz&id=${readId + 1}`);
      } else if (readType === 'hizb' && readId < 60) {
        navigate(`/quran/reader?type=hizb&id=${readId + 1}`);
      } else if (readType === 'hizbQuarter' && readId < 240) {
        navigate(`/quran/reader?type=hizbQuarter&id=${readId + 1}`);
      }
    }
  };

  // Scroll active ayah into view smoothly
  useEffect(() => {
    const timer = setTimeout(() => {
      const activeEl = document.querySelector('.reader__ayah--active');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: 'smooth',
          block: 'center'
        });
      }
    }, 100);
    return () => clearTimeout(timer);
  }, [currentAyah, surahData]);

  const sessionRewards = getSessionRewards();

  if (loading) {
    return (
      <div className={`reader reader--theme-${readerTheme}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh' }}>
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1rem' }}>
          <div style={{ width: 44, height: 44, borderRadius: '50%', border: '4px solid rgba(16, 185, 129, 0.1)', borderTopColor: 'var(--color-emerald)', animation: 'spin-slow 0.8s linear infinite' }} />
          <p style={{ color: 'var(--text-secondary)' }}>Loading Surah recitations...</p>
        </div>
      </div>
    );
  }

  if (error && !surahData) {
    return (
      <div className={`reader reader--theme-${readerTheme}`} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '80vh', padding: '2rem' }}>
        <GlassCard padding="lg" style={{ textAlign: 'center', maxWidth: 400 }}>
          <span style={{ fontSize: '3rem' }}>⚠️</span>
          <p style={{ color: 'var(--text-secondary)', margin: '1rem 0' }}>{error}</p>
          <Button variant="emerald" onClick={() => window.location.reload()}>Try Again</Button>
          <Button variant="ghost" style={{ marginTop: '0.5rem' }} onClick={() => navigate('/quran')}>Go Back</Button>
        </GlassCard>
      </div>
    );
  }

  const isPrevDisabled = readId === 1 && currentAyah === 0;
  
  const isNextDisabled = !surahData || (
    currentAyah === surahData.ayahs.length - 1 && (
      (readType === 'surah' && readId === 114) ||
      (readType === 'page' && readId === 604) ||
      (readType === 'juz' && readId === 30) ||
      (readType === 'hizb' && readId === 60) ||
      (readType === 'hizbQuarter' && readId === 240)
    )
  );

  return (
    <div className={`reader reader--theme-${readerTheme}`}>
      {/* Header */}
      <div className="reader__header">
        <button 
          className="reader__back" 
          onClick={() => {
            flushSessionRewards();
            navigate('/quran');
          }}
        >
          <ArrowLeft size={20} />
        </button>
        <div className="reader__title-wrap">
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap' }}>
            {readType === 'surah' ? (
              <select 
                value={readId}
                onChange={(e) => navigate(`/quran/reader/${e.target.value}`)}
                className="reader__reciter-select"
                style={{ fontSize: '1.125rem', fontWeight: 800, paddingRight: '1rem', borderBottom: '1px dashed var(--glass-border)' }}
              >
                {SURAH_NAMES.map((name, idx) => (
                  <option key={idx + 1} value={idx + 1}>
                    {idx + 1}. {name} ({SURAH_ARABIC_NAMES[idx]})
                  </option>
                ))}
              </select>
            ) : readType === 'juz' ? (
              <select 
                value={readId}
                onChange={(e) => navigate(`/quran/reader?type=juz&id=${e.target.value}`)}
                className="reader__reciter-select"
                style={{ fontSize: '1.125rem', fontWeight: 800, paddingRight: '1rem', borderBottom: '1px dashed var(--glass-border)' }}
              >
                {Array.from({ length: 30 }, (_, i) => i + 1).map((juz) => (
                  <option key={juz} value={juz}>
                    Juz {juz}
                  </option>
                ))}
              </select>
            ) : readType === 'hizb' ? (
              <select 
                value={readId}
                onChange={(e) => navigate(`/quran/reader?type=hizb&id=${e.target.value}`)}
                className="reader__reciter-select"
                style={{ fontSize: '1.125rem', fontWeight: 800, paddingRight: '1rem', borderBottom: '1px dashed var(--glass-border)' }}
              >
                {Array.from({ length: 60 }, (_, i) => i + 1).map((hizb) => (
                  <option key={hizb} value={hizb}>
                    Hizb {hizb}
                  </option>
                ))}
              </select>
            ) : readType === 'hizbQuarter' ? (
              <select 
                value={readId}
                onChange={(e) => navigate(`/quran/reader?type=hizbQuarter&id=${e.target.value}`)}
                className="reader__reciter-select"
                style={{ fontSize: '1.125rem', fontWeight: 800, paddingRight: '1rem', borderBottom: '1px dashed var(--glass-border)' }}
              >
                {Array.from({ length: 240 }, (_, i) => i + 1).map((quarter) => (
                  <option key={quarter} value={quarter}>
                    Maqrah {quarter}
                  </option>
                ))}
              </select>
            ) : (
              <select 
                value={readId}
                onChange={(e) => navigate(`/quran/reader?type=page&id=${e.target.value}`)}
                className="reader__reciter-select"
                style={{ fontSize: '1.125rem', fontWeight: 800, paddingRight: '1rem', borderBottom: '1px dashed var(--glass-border)' }}
              >
                {Array.from({ length: 604 }, (_, i) => i + 1).map((page) => (
                  <option key={page} value={page}>
                    Page {page}
                  </option>
                ))}
              </select>
            )}

            {/* Ayah selector dropdown inside active set */}
            {surahData?.ayahs && (
              <select 
                value={currentAyah}
                onChange={(e) => setCurrentAyah(parseInt(e.target.value))}
                className="reader__reciter-select"
                style={{ 
                  fontSize: '1.05rem', 
                  fontWeight: 700, 
                  paddingRight: '1rem', 
                  borderBottom: '1px dashed var(--glass-border)', 
                  marginLeft: '0.75rem',
                  color: 'var(--color-emerald)'
                }}
              >
                {surahData.ayahs.map((a, idx) => (
                  <option key={idx} value={idx}>
                    {readType === 'surah' ? `Ayah ${a.number}` : `${a.surahName} - Ayah ${a.number}`}
                  </option>
                ))}
              </select>
            )}
          </div>

          <span className="reader__surah-meta">
            {surahData ? (
              <>
                Juz {surahData.juz} · Page {surahData.page}
                {isAyahRangeMode && ` · Selected: ${surahData.ayahs.length} Ayahs`}
              </>
            ) : ''}
          </span>
        </div>
        
        <div className="reader__actions">
          <button 
            className={`reader__action-btn ${isBookmarked ? 'reader__action-btn--active' : ''}`} 
            onClick={toggleBookmark}
            title="Bookmark Ayah"
          >
            <Bookmark size={18} fill={isBookmarked ? 'currentColor' : 'none'} />
          </button>

          <button 
            className={`reader__action-btn ${isFullscreen ? 'reader__action-btn--active' : ''}`} 
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? "Exit Fullscreen" : "Fullscreen Mode"}
          >
            {isFullscreen ? <Minimize2 size={18} /> : <Maximize2 size={18} />}
          </button>
        </div>
      </div>

      {/* Reader Controls Bar */}
      <div className="reader__controls">
        <div className="reader__control-group">
          <span className="reader__control-label">View Mode:</span>
          <div className="reader__control-options">
            {[
              { id: 'both', label: 'Both' },
              { id: 'arabic', label: 'Arabic' },
              { id: 'translation', label: 'English' }
            ].map(opt => (
              <button 
                key={opt.id} 
                className={`reader__control-btn ${displayMode === opt.id ? 'reader__control-btn--active' : ''}`}
                onClick={() => setDisplayMode(opt.id)}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="reader__control-group">
          <span className="reader__control-label">Sizing:</span>
          <div className="reader__control-options">
            {[
              { size: window.innerWidth < 768 ? 18 : 24, label: 'A-' },
              { size: window.innerWidth < 768 ? 22 : 28, label: 'A' },
              { size: window.innerWidth < 768 ? 28 : 36, label: 'A+' }
            ].map(sz => (
              <button 
                key={sz.size} 
                className={`reader__control-btn ${fontSize === sz.size ? 'reader__control-btn--active' : ''}`}
                onClick={() => setFontSize(sz.size)}
              >
                {sz.label}
              </button>
            ))}
          </div>
        </div>

        <div className="reader__control-group">
          <span className="reader__control-label">Theme:</span>
          <div className="reader__control-options">
            {[
              { id: 'dark', label: 'Dark' },
              { id: 'sepia', label: 'Sepia' },
              { id: 'light', label: 'Light' }
            ].map(themeOpt => (
              <button 
                key={themeOpt.id} 
                className={`reader__control-btn ${readerTheme === themeOpt.id ? 'reader__control-btn--active' : ''}`}
                onClick={() => setReaderTheme(themeOpt.id)}
              >
                {themeOpt.label}
              </button>
            ))}
          </div>
        </div>

        <div className="reader__control-group" style={{ gap: '0.5rem' }}>
          {/* Memorization Mode Toggle */}
          <button 
            className={`reader__tafsir-toggle ${memorizeMode ? 'reader__tafsir-toggle--active' : ''}`}
            onClick={() => setMemorizeMode(!memorizeMode)}
            title="Memorization Mode (Hides English translation to assist recitation)"
          >
            {memorizeMode ? <EyeOff size={14} style={{ marginRight: '0.25rem' }} /> : <Eye size={14} style={{ marginRight: '0.25rem' }} />}
            Hifz {memorizeMode ? 'ON' : 'OFF'}
          </button>

          <button 
            className={`reader__tafsir-toggle ${showTafsir ? 'reader__tafsir-toggle--active' : ''}`}
            onClick={() => setShowTafsir(!showTafsir)}
          >
            <HelpCircle size={14} style={{ marginRight: '0.25rem' }} />
            Tafsir {showTafsir ? 'ON' : 'OFF'}
          </button>
        </div>
      </div>

      {/* Ayah Display Container */}
      <div className="reader__content">
        {/* Bismillah */}
        {displayMode !== 'translation' && activeSurahId !== 9 && (
          <motion.div
            className="reader__bismillah"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4 }}
          >
            بِسْمِ اللَّهِ الرَّحْمَنِ الرَّحِيمِ
          </motion.div>
        )}

        {/* All Ayahs */}
        <div className="reader__ayahs">
          {surahData.ayahs.map((a, i) => (
            <motion.div
              key={a.number}
              className={`reader__ayah ${i === currentAyah ? 'reader__ayah--active' : ''}`}
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: Math.min(10, i) * 0.05 }}
              onClick={() => setCurrentAyah(i)}
            >
              {displayMode !== 'translation' && (
                <div className="reader__ayah-arabic" style={{ fontSize }}>
                  {a.arabic}
                  <span className="reader__ayah-num">﴿{a.number}﴾</span>
                </div>
              )}
              {displayMode !== 'arabic' && !memorizeMode && (
                <p 
                  className="reader__ayah-translation"
                  style={{ 
                    borderTop: displayMode === 'translation' ? 'none' : '1px solid var(--glass-border)',
                    paddingTop: displayMode === 'translation' ? '0' : '0.75rem',
                    marginTop: displayMode === 'translation' ? '0' : '0.25rem'
                  }}
                >
                  {a.translation}
                </p>
              )}

              {/* Tafsir (Exegesis) Panel */}
              <AnimatePresence>
                {showTafsir && (
                  <motion.div 
                    className="reader__tafsir-box"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                  >
                    <div className="reader__tafsir-title">💡 Explanation (Tafsir):</div>
                    <p className="reader__tafsir-text">{a.tafsir}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Advanced Audio Player Bar */}
      <div className="reader__audio-player">
        <div className="reader__audio-left">
          <button 
            className="reader__play-btn"
            onClick={() => setIsPlaying(!isPlaying)}
            title={isPlaying ? 'Pause Audio' : 'Play Audio Recitation'}
          >
            {isPlaying ? <Pause size={18} fill="white" /> : <Play size={18} fill="white" style={{ marginLeft: 2 }} />}
          </button>
          
          <div className="reader__audio-meta">
            <span className="reader__audio-status">
              {isPlaying ? `Reciting Surah ${activeSurahId}...` : 'Audio Reciter'}
            </span>
            <span style={{ fontSize: '0.85rem', fontWeight: 700 }}>Mishary Alafasy</span>
          </div>
        </div>

        {/* Audio Wave Visualizer */}
        <div className="reader__audio-center">
          <div className="reader__wave-visualizer" style={{ width: '100%', maxWidth: '200px' }}>
            <div style={{ height: 4, background: 'rgba(255, 255, 255, 0.1)', borderRadius: 2, flex: 1, position: 'relative', overflow: 'hidden' }}>
              <div style={{ height: '100%', width: `${audioProgress}%`, background: 'var(--color-emerald)' }} />
            </div>
          </div>
        </div>
        <div className="reader__audio-right">
          <button className="reader__nav-btn" onClick={prev} disabled={isPrevDisabled}>
            <ChevronLeft size={16} /> Prev
          </button>
          <span className="reader__ayah-counter-badge">{currentAyah + 1}/{surahData.ayahs.length}</span>
          
          {isAyahRangeMode && currentAyah === surahData.ayahs.length - 1 ? (
            <button 
              className="reader__nav-btn" 
              onClick={() => setShowCompletionModal(true)}
              style={{
                background: 'var(--color-emerald)',
                color: 'white',
                fontWeight: 700,
                border: 'none',
                boxShadow: '0 0 12px rgba(16, 185, 129, 0.4)'
              }}
            >
              Complete 🎉
            </button>
          ) : (
            <button className="reader__nav-btn" onClick={next} disabled={isNextDisabled}>
              Next <ChevronRight size={16} />
            </button>
          )}
        </div>
      </div>

      {/* Completion & Reward Modal Overlay */}
      <AnimatePresence>
        {showCompletionModal && (
          <div className="reader__modal-overlay">
            <motion.div 
              className="reader__modal"
              initial={{ scale: 0.92, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.92, opacity: 0 }}
            >
              <div className="reader__modal-glow" />
              <span className="reader__modal-emoji">🏆</span>
              <h2 className="reader__modal-title">Reading Completed!</h2>
              <p className="reader__modal-subtitle">Alhamdulillah, you have finished your selected portion.</p>
              <div className="reader__modal-stats">
                <div className="reader__modal-stat-row">
                  <span className="reader__modal-stat-label">Mode:</span>
                  <span className="reader__modal-stat-value" style={{ textTransform: 'capitalize' }}>
                    {readType === 'hizbQuarter' ? 'Maqrah' : readType}
                  </span>
                </div>
                <div className="reader__modal-stat-row">
                  <span className="reader__modal-stat-label">Scope:</span>
                  <span className="reader__modal-stat-value">
                    {readType === 'surah' 
                      ? (isAyahRangeMode 
                          ? `${surahData.name} (Selected: ${surahData.ayahs.length} Ayahs)` 
                          : `${surahData.name} (${surahData.ayahs.length} Ayahs)`)
                      : `${surahData.name}`}
                  </span>
                </div>
                <div className="reader__modal-stat-row">
                  <span className="reader__modal-stat-label">Letters Read:</span>
                  <span className="reader__modal-stat-value" style={{ fontWeight: 700 }}>
                    {sessionRewards.letters} Huroof
                  </span>
                </div>
                <div className="reader__modal-stat-row" style={{ color: 'var(--color-gold)' }}>
                  <span className="reader__modal-stat-label" style={{ color: 'var(--color-gold)' }}>Hasanat Gained:</span>
                  <span className="reader__modal-stat-value" style={{ fontWeight: 800 }}>
                    ✨ +{sessionRewards.hasanat}
                  </span>
                </div>
                <div className="reader__modal-stat-row" style={{ borderTop: '1px solid var(--glass-border)', paddingTop: '0.75rem', marginTop: '0.25rem' }}>
                  <span className="reader__modal-stat-label">Spiritual Reward:</span>
                  <span className="reader__modal-reward">
                    🌟 +{sessionRewards.xp} XP
                  </span>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                <Button variant="emerald" fullWidth onClick={claimRewardAndFinish}>
                  Claim Reward & Finish
                </Button>
                <Button variant="ghost" fullWidth onClick={() => setShowCompletionModal(false)}>
                  Go Back to Reading
                </Button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
