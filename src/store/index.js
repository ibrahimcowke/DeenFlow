// Zustand Global Store — Muslim Life OS
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useAppStore = create(
  persist(
    (set, get) => ({
      // ── User ──────────────────────────────────────────────
      user: null,
      userProfile: {
        name: 'Ibrahim',
        avatar: null,
        level: 1,
        xp: 0,
        joinDate: new Date().toISOString(),
      },
      setUser: (user) => set({ user }),
      setUserProfile: (profile) => set((s) => ({ userProfile: { ...s.userProfile, ...profile } })),

      // ── Onboarding ────────────────────────────────────────
      onboardingComplete: false,
      onboardingStep: 0,
      setOnboardingComplete: (v) => set({ onboardingComplete: v }),
      setOnboardingStep: (step) => set({ onboardingStep: step }),

      // ── Language ──────────────────────────────────────────
      language: 'en',
      dir: 'ltr',
      setLanguage: (lang) => set({ language: lang, dir: lang === 'ar' ? 'rtl' : 'ltr' }),

      // ── Theme ─────────────────────────────────────────────
      theme: 'dark',
      setTheme: (theme) => set({ theme }),
      dashboardLayout: 'glass', // 'glass', 'classic', 'minimal'
      setDashboardLayout: (dashboardLayout) => set({ dashboardLayout }),

      // ── Goals ─────────────────────────────────────────────
      goals: {
        quranGoalType: 'page', // 'ayah', 'page', 'maqrah', 'hizb', 'juz'
        quranGoalValue: 5,
        quranPagesDaily: 5, // Kept for legacy compatibility
        azkarDaily: 100,
        trackSalah: true,
        trackRecovery: false,
        trackHabits: true,
      },
      setGoals: (goals) => set((s) => ({ goals: { ...s.goals, ...goals } })),

      // ── Salah ─────────────────────────────────────────────
      todaySalah: {
        fajr:    { completed: false, atMosque: false, time: null },
        dhuhr:   { completed: false, atMosque: false, time: null },
        asr:     { completed: false, atMosque: false, time: null },
        maghrib: { completed: false, atMosque: false, time: null },
        isha:    { completed: false, atMosque: false, time: null },
      },
      salahHistory: {},
      qadaCounts: {
        fajr: 0,
        dhuhr: 0,
        asr: 0,
        maghrib: 0,
        isha: 0
      },
      todaySunnah: {
        fajrBefore: false,
        dhuhrBefore: false,
        dhuhrAfter: false,
        maghribAfter: false,
        ishaAfter: false
      },
      toggleSalah: (prayer) => set((s) => {
        const updated = { ...s.todaySalah[prayer], completed: !s.todaySalah[prayer].completed };
        return { todaySalah: { ...s.todaySalah, [prayer]: updated } };
      }),
      setSalahAtMosque: (prayer, value) => set((s) => ({
        todaySalah: { ...s.todaySalah, [prayer]: { ...s.todaySalah[prayer], atMosque: value } }
      })),
      incrementQada: (prayer) => set((s) => ({
        qadaCounts: { ...s.qadaCounts, [prayer]: s.qadaCounts[prayer] + 1 }
      })),
      decrementQada: (prayer) => set((s) => ({
        qadaCounts: { ...s.qadaCounts, [prayer]: Math.max(0, s.qadaCounts[prayer] - 1) }
      })),
      toggleSunnah: (key) => set((s) => ({
        todaySunnah: { ...s.todaySunnah, [key]: !s.todaySunnah[key] }
      })),

      // ── Prayer Times ──────────────────────────────────────
      prayerTimes: null,
      prayerLocation: null,
      setPrayerTimes: (times) => set({ prayerTimes: times }),
      setPrayerLocation: (loc) => set({ prayerLocation: loc }),

      // ── Quran ─────────────────────────────────────────────
      quranProgress: {
        lastSurah: 1,
        lastAyah: 1,
        lastPage: 1,
        todayPages: 0,
        totalPages: 0,
        streak: 0,
      },
      quranBookmarks: [],
      quranHighlights: [],
      setQuranProgress: (p) => set((s) => ({ quranProgress: { ...s.quranProgress, ...p } })),
      addQuranBookmark: (bm) => set((s) => ({ quranBookmarks: [...s.quranBookmarks, bm] })),
      removeQuranBookmark: (id) => set((s) => ({ quranBookmarks: s.quranBookmarks.filter(b => b.id !== id) })),

      // ── Azkar ─────────────────────────────────────────────
      azkarProgress: {
        morning: { completed: 0, total: 0, done: false },
        evening: { completed: 0, total: 0, done: false },
        afterSalah: { completed: 0, total: 0, done: false },
      },
      azkarStreak: 0,
      setAzkarProgress: (cat, data) => set((s) => ({
        azkarProgress: { ...s.azkarProgress, [cat]: { ...s.azkarProgress[cat], ...data } }
      })),

      // ── Habits ────────────────────────────────────────────
      habits: [
        { id: 'tahajjud', name: 'Tahajjud', icon: '🌙', streak: 0, completedToday: false, color: '#6366F1' },
        { id: 'witr',     name: 'Witr',     icon: '⭐', streak: 0, completedToday: false, color: '#10B981' },
        { id: 'duha',     name: 'Duha',     icon: '☀️', streak: 0, completedToday: false, color: '#F59E0B' },
        { id: 'quran',    name: 'Quran',    icon: '📖', streak: 0, completedToday: false, color: '#10B981' },
        { id: 'charity',  name: 'Charity',  icon: '💚', streak: 0, completedToday: false, color: '#EC4899' },
        { id: 'istighfar',name: 'Istighfar',icon: '🤲', streak: 0, completedToday: false, color: '#8B5CF6' },
        { id: 'exercise', name: 'Exercise', icon: '💪', streak: 0, completedToday: false, color: '#EF4444' },
      ],
      toggleHabit: (id) => set((s) => ({
        habits: s.habits.map(h => h.id === id ? { ...h, completedToday: !h.completedToday } : h)
      })),
      addHabit: (habit) => set((s) => ({ habits: [...s.habits, habit] })),

      // ── Fasting ───────────────────────────────────────────
      fastingLogs: [],
      todayFasting: false,
      toggleFasting: () => set((s) => ({ todayFasting: !s.todayFasting })),

      recovery: {
        enabled: false,
        startDate: null,
        currentStreak: 0,
        longestStreak: 0,
        urgesAvoided: 0,
        relapseCount: 0,
        score: 100,
        logs: [], // Array of { id, date, outcome: 'resist'|'relapse', intensity: number, mood: string, trigger: string, timeOfDay: string, notes: string }
        journalLogs: [], // Array of { id, date, reflection: string, lessons: string, victory: string, mood: string }
        reasons: [
          'Strengthen my connection with Allah 🤲',
          'Heal my dopamine pathways & erase brain fog 🧠',
          'Build strong willpower and self-control 🛡️',
          'Protect my physical health and mental clarity ⚡',
          'Live an authentic, clean life with peace of mind 🕊️'
        ],
        contacts: [], // SOS contacts { id, name, phone }
        protectionMode: {
          focusActive: false,
          focusDuration: 0,
          blockedApps: ['TikTok', 'Instagram', 'X/Twitter', 'Snapchat'],
          blockedWebsites: ['instagram.com', 'tiktok.com', 'x.com', 'reddit.com'],
          screenTimeLimit: 120
        },
        heatmap: {} // Map of YYYY-MM-DD -> 'clean' | 'difficult' | 'relapse'
      },
      recordRecoveryUrge: (resisted, intensity = 5, mood = 'Calm', trigger = 'Boredom', timeOfDay = 'Night', notes = '') => set((s) => {
        const date = new Date().toISOString();
        const id = Math.random().toString(36).substring(7);
        const newLog = { id, date, outcome: resisted ? 'resist' : 'relapse', intensity, mood, trigger, timeOfDay, notes };
        const updatedLogs = [newLog, ...s.recovery.logs];
        
        let newStreak = s.recovery.currentStreak;
        let newLongest = s.recovery.longestStreak;
        let newUrgesAvoided = s.recovery.urgesAvoided;
        let newRelapseCount = s.recovery.relapseCount || 0;
        
        const d = new Date();
        const dateKey = `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
        const currentDayStatus = resisted ? (intensity >= 7 ? 'difficult' : 'clean') : 'relapse';
        const updatedHeatmap = { ...s.recovery.heatmap, [dateKey]: currentDayStatus };
        
        if (resisted) {
          newUrgesAvoided += 1;
          newStreak += 1;
          if (newStreak > newLongest) {
            newLongest = newStreak;
          }
        } else {
          newStreak = 0; // Relapse resets streak
          newRelapseCount += 1;
        }

        // Compute score: avoided urges vs total logs
        const totalAvoided = updatedLogs.filter(l => l.outcome === 'resist').length;
        const totalEvents = updatedLogs.length;
        const newScore = totalEvents > 0 ? Math.round((totalAvoided / totalEvents) * 100) : 100;

        return {
          recovery: {
            ...s.recovery,
            logs: updatedLogs,
            currentStreak: newStreak,
            longestStreak: newLongest,
            urgesAvoided: newUrgesAvoided,
            relapseCount: newRelapseCount,
            score: newScore,
            heatmap: updatedHeatmap
          }
        };
      }),
      recordUrge: (resisted, trigger = 'unknown', timeOfDay = 'unknown') => {
        get().recordRecoveryUrge(resisted, 5, 'Calm', trigger, timeOfDay, '');
      },
      setRecoveryEnabled: (v) => set((s) => ({ 
        recovery: { 
          ...s.recovery, 
          enabled: v,
          startDate: v ? new Date().toISOString() : null,
          currentStreak: v ? 0 : s.recovery.currentStreak,
          relapseCount: v ? 0 : s.recovery.relapseCount,
          logs: v ? [] : s.recovery.logs,
          journalLogs: v ? [] : s.recovery.journalLogs,
          reasons: v ? [
            'Strengthen my connection with Allah 🤲',
            'Heal my dopamine pathways & erase brain fog 🧠',
            'Build strong willpower and self-control 🛡️',
            'Protect my physical health and mental clarity ⚡',
            'Live an authentic, clean life with peace of mind 🕊️'
          ] : s.recovery.reasons,
          contacts: v ? [] : s.recovery.contacts,
          protectionMode: v ? {
            focusActive: false,
            focusDuration: 0,
            blockedApps: ['TikTok', 'Instagram', 'X/Twitter', 'Snapchat'],
            blockedWebsites: ['instagram.com', 'tiktok.com', 'x.com', 'reddit.com'],
            screenTimeLimit: 120
          } : s.recovery.protectionMode,
          heatmap: v ? {} : s.recovery.heatmap
        } 
      })),
      addRecoveryJournal: (reflection, lessons, victory, mood) => set((s) => {
        const id = Math.random().toString(36).substring(7);
        const date = new Date().toISOString();
        const newJournal = { id, date, reflection, lessons, victory, mood };
        const updatedJournals = [newJournal, ...s.recovery.journalLogs];
        return {
          recovery: {
            ...s.recovery,
            journalLogs: updatedJournals
          }
        };
      }),
      deleteRecoveryJournal: (id) => set((s) => ({
        recovery: {
          ...s.recovery,
          journalLogs: s.recovery.journalLogs.filter(j => j.id !== id)
        }
      })),
      updateProtectionMode: (data) => set((s) => ({
        recovery: {
          ...s.recovery,
          protectionMode: { ...s.recovery.protectionMode, ...data }
        }
      })),
      addSobrietyReason: (reason) => set((s) => ({
        recovery: {
          ...s.recovery,
          reasons: [...s.recovery.reasons, reason]
        }
      })),
      removeSobrietyReason: (reason) => set((s) => ({
        recovery: {
          ...s.recovery,
          reasons: s.recovery.reasons.filter(r => r !== reason)
        }
      })),
      addSosContact: (name, phone) => set((s) => ({
        recovery: {
          ...s.recovery,
          contacts: [...s.recovery.contacts, { id: Math.random().toString(36).substring(7), name, phone }]
        }
      })),
      removeSosContact: (id) => set((s) => ({
        recovery: {
          ...s.recovery,
          contacts: s.recovery.contacts.filter(c => c.id !== id)
        }
      })),

      // ── Notes ─────────────────────────────────────────────
      notes: [],
      folders: [
        { id: 'all', name: 'All Notes', icon: '📋' },
        { id: 'quran', name: 'Quran Notes', icon: '📖' },
        { id: 'dua', name: 'Duas', icon: '🤲' },
        { id: 'journal', name: 'Journal', icon: '✍️' },
      ],
      addNote: (note) => set((s) => ({ notes: [note, ...s.notes] })),
      updateNote: (id, data) => set((s) => ({ notes: s.notes.map(n => n.id === id ? { ...n, ...data } : n) })),
      deleteNote: (id) => set((s) => ({ notes: s.notes.filter(n => n.id !== id) })),

      // ── Charity ───────────────────────────────────────────
      donations: [],
      totalDonated: 0,
      addDonation: (d) => set((s) => ({
        donations: [d, ...s.donations],
        totalDonated: s.totalDonated + d.amount,
      })),

      // ── Deen Score (computed) ─────────────────────────────
      getDeenScore: () => {
        const s = get();
        const salahCount = Object.values(s.todaySalah).filter(p => p.completed).length;
        const salahScore = (salahCount / 5) * 40;
        const quranScore = Math.min((s.quranProgress.todayPages / s.goals.quranPagesDaily), 1) * 25;
        const azkarDone = Object.values(s.azkarProgress).filter(a => a.done).length;
        const azkarScore = (azkarDone / 3) * 20;
        const habitDone = s.habits.filter(h => h.completedToday).length;
        const habitScore = Math.min((habitDone / 5), 1) * 15;
        return Math.round(salahScore + quranScore + azkarScore + habitScore);
      },

      // ── Sidebar ───────────────────────────────────────────
      sidebarCollapsed: false,
      setSidebarCollapsed: (v) => set({ sidebarCollapsed: v }),

      // ── Notifications ─────────────────────────────────────
      notifications: [],
      addNotification: (n) => set((s) => ({ notifications: [n, ...s.notifications] })),
      clearNotifications: () => set({ notifications: [] }),
    }),
    {
      name: 'muslim-life-os-store',
      partialize: (s) => ({
        onboardingComplete: s.onboardingComplete,
        language: s.language,
        dir: s.dir,
        theme: s.theme,
        dashboardLayout: s.dashboardLayout,
        goals: s.goals,
        todaySalah: s.todaySalah,
        salahHistory: s.salahHistory,
        qadaCounts: s.qadaCounts,
        todaySunnah: s.todaySunnah,
        quranProgress: s.quranProgress,
        quranBookmarks: s.quranBookmarks,
        azkarProgress: s.azkarProgress,
        azkarStreak: s.azkarStreak,
        habits: s.habits,
        recovery: s.recovery,
        notes: s.notes,
        folders: s.folders,
        donations: s.donations,
        totalDonated: s.totalDonated,
        userProfile: s.userProfile,
        sidebarCollapsed: s.sidebarCollapsed,
      }),
    }
  )
);
