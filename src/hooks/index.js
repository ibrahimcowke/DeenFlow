// Custom hooks for Muslim Life OS

import { useState, useEffect, useCallback } from 'react';
import {
  getPrayerTimesForCurrentLocation,
  getNextPrayer, getCurrentPrayer, formatCountdown,
  DEMO_PRAYER_TIMES,
} from '../services/prayerTimes';
import { useAppStore } from '../store';

/**
 * Hook: Prayer Times
 */
export function usePrayerTimes() {
  const { prayerTimes, setPrayerTimes, setPrayerLocation } = useAppStore();
  const [loading, setLoading] = useState(!prayerTimes);
  const [error, setError] = useState(null);
  const [nextPrayer, setNextPrayer] = useState(null);
  const [currentPrayer, setCurrentPrayer] = useState('');
  const [countdown, setCountdown] = useState('');

  useEffect(() => {
    if (prayerTimes) { setLoading(false); return; }
    getPrayerTimesForCurrentLocation()
      .then(({ data, coords }) => {
        setPrayerTimes(data);
        setPrayerLocation(coords);
        setLoading(false);
      })
      .catch(() => {
        setPrayerTimes(DEMO_PRAYER_TIMES);
        setError('Using demo times. Enable location for accurate times.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    const update = () => {
      if (!prayerTimes) return;
      setNextPrayer(getNextPrayer(prayerTimes));
      setCurrentPrayer(getCurrentPrayer(prayerTimes));
    };
    update();
    const i = setInterval(update, 30000);
    return () => clearInterval(i);
  }, [prayerTimes]);

  useEffect(() => {
    if (!nextPrayer) return;
    const i = setInterval(() => setCountdown(formatCountdown(nextPrayer.minsLeft)), 60000);
    setCountdown(formatCountdown(nextPrayer?.minsLeft || 0));
    return () => clearInterval(i);
  }, [nextPrayer]);

  return { prayerTimes, loading, error, nextPrayer, currentPrayer, countdown };
}

/**
 * Hook: Countdown Timer
 */
export function useCountdown(targetMins) {
  const [display, setDisplay] = useState(formatCountdown(targetMins));
  useEffect(() => {
    setDisplay(formatCountdown(targetMins));
    const i = setInterval(() => setDisplay(formatCountdown(targetMins)), 60000);
    return () => clearInterval(i);
  }, [targetMins]);
  return display;
}

/**
 * Hook: Local Storage state
 */
export function useLocalStorage(key, defaultValue) {
  const [value, setValue] = useState(() => {
    try { return JSON.parse(localStorage.getItem(key)) ?? defaultValue; }
    catch { return defaultValue; }
  });
  const set = useCallback((v) => {
    setValue(v);
    localStorage.setItem(key, JSON.stringify(v));
  }, [key]);
  return [value, set];
}

/**
 * Hook: Tasbih counter
 */
export function useTasbih(target = 33) {
  const [count, setCount] = useState(0);
  const [vibrating, setVibrating] = useState(false);

  const tap = useCallback(() => {
    setCount(c => {
      const next = c + 1;
      if (next >= target && navigator.vibrate) { navigator.vibrate(100); }
      return next;
    });
    // Vibrate on each tap
    if (navigator.vibrate) navigator.vibrate(25);
  }, [target]);

  const reset = useCallback(() => setCount(0), []);
  const completed = count >= target;
  const pct = Math.min((count / target) * 100, 100);

  return { count, tap, reset, completed, pct };
}

/**
 * Hook: Breathing Exercise
 */
export function useBreathing() {
  const [phase, setPhase] = useState('inhale'); // inhale | hold | exhale | rest
  const [seconds, setSeconds] = useState(4);
  const [active, setActive] = useState(false);

  const PHASES = { inhale: 4, hold: 4, exhale: 6, rest: 2 };
  const PHASE_ORDER = ['inhale', 'hold', 'exhale', 'rest'];

  useEffect(() => {
    if (!active) return;
    let s = PHASES[phase];
    setSeconds(s);
    const i = setInterval(() => {
      s--;
      setSeconds(s);
      if (s <= 0) {
        const nextPhase = PHASE_ORDER[(PHASE_ORDER.indexOf(phase) + 1) % PHASE_ORDER.length];
        setPhase(nextPhase);
      }
    }, 1000);
    return () => clearInterval(i);
  }, [active, phase]);

  return {
    phase, seconds, active,
    start: () => setActive(true),
    stop: () => { setActive(false); setPhase('inhale'); },
  };
}

/**
 * Hook: Deen Score
 */
export function useDeenScore() {
  const { getDeenScore } = useAppStore();
  return getDeenScore();
}
