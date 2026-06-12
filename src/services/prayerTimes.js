// Prayer Times Service — Aladhan.com API
import axios from 'axios';

const BASE_URL = 'https://api.aladhan.com/v1';

/**
 * Fetch prayer times by coordinates
 */
export async function fetchPrayerTimesByCoords(lat, lon, date = new Date()) {
  const d = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const res = await axios.get(`${BASE_URL}/timings/${d}`, {
    params: { latitude: lat, longitude: lon, method: 2 },
  });
  return res.data.data;
}

/**
 * Fetch prayer times by city
 */
export async function fetchPrayerTimesByCity(city, country, date = new Date()) {
  const d = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
  const res = await axios.get(`${BASE_URL}/timingsByCity/${d}`, {
    params: { city, country, method: 2 },
  });
  return res.data.data;
}

/**
 * Get user location and fetch prayer times
 */
export function getPrayerTimesForCurrentLocation() {
  return new Promise((resolve, reject) => {
    if (!navigator.geolocation) {
      reject(new Error('Geolocation not supported'));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        try {
          const data = await fetchPrayerTimesByCoords(pos.coords.latitude, pos.coords.longitude);
          resolve({ data, coords: { lat: pos.coords.latitude, lon: pos.coords.longitude } });
        } catch (err) {
          reject(err);
        }
      },
      () => reject(new Error('Location access denied')),
      { timeout: 8000 }
    );
  });
}

/**
 * Parse Aladhan time string "HH:MM (timezone)" to minutes since midnight
 */
export function timeToMinutes(timeStr) {
  const clean = timeStr.split(' ')[0];
  const [h, m] = clean.split(':').map(Number);
  return h * 60 + m;
}

/**
 * Format time string to 12h display
 */
export function formatPrayerTime(timeStr, use12h = true) {
  const clean = timeStr.split(' ')[0];
  const [h, m] = clean.split(':').map(Number);
  if (!use12h) return clean;
  const ampm = h >= 12 ? 'PM' : 'AM';
  const h12 = h % 12 || 12;
  return `${h12}:${m.toString().padStart(2, '0')} ${ampm}`;
}

/**
 * Get next prayer from current time
 */
export function getNextPrayer(prayerTimes) {
  if (!prayerTimes) return null;
  const prayers = ['Fajr', 'Dhuhr', 'Asr', 'Maghrib', 'Isha'];
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();

  for (const prayer of prayers) {
    const prayerMins = timeToMinutes(prayerTimes.timings[prayer]);
    if (prayerMins > nowMins) return { name: prayer, time: prayerTimes.timings[prayer], minsLeft: prayerMins - nowMins };
  }
  // All prayers passed — next is Fajr tomorrow
  return { name: 'Fajr', time: prayerTimes.timings.Fajr, minsLeft: 0, tomorrow: true };
}

/**
 * Get current active prayer
 */
export function getCurrentPrayer(prayerTimes) {
  if (!prayerTimes) return null;
  const prayers = [
    { name: 'Isha',    key: 'Isha' },
    { name: 'Maghrib', key: 'Maghrib' },
    { name: 'Asr',     key: 'Asr' },
    { name: 'Dhuhr',   key: 'Dhuhr' },
    { name: 'Fajr',    key: 'Fajr' },
  ];
  const now = new Date();
  const nowMins = now.getHours() * 60 + now.getMinutes();
  for (const p of prayers) {
    if (nowMins >= timeToMinutes(prayerTimes.timings[p.key])) return p.name;
  }
  return 'Isha';
}

/**
 * Format countdown "Xh Ym" or "Xm"
 */
export function formatCountdown(mins) {
  if (mins <= 0) return 'Now';
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  if (h > 0) return `${h}h ${m}m`;
  return `${m}m`;
}

/**
 * Hijri date conversion (approximate)
 */
export function getHijriDate() {
  const now = new Date();
  // Using Intl API for Hijri calendar
  try {
    const hijri = new Intl.DateTimeFormat('en-TN-u-ca-islamic', {
      day: 'numeric', month: 'long', year: 'numeric',
    }).format(now);
    return hijri;
  } catch {
    return 'Dhul Hijjah 1447';
  }
}

// Fallback demo prayer times (Makkah)
export const DEMO_PRAYER_TIMES = {
  timings: {
    Fajr: '04:32', Sunrise: '06:05', Dhuhr: '12:14',
    Asr: '15:42', Maghrib: '18:20', Isha: '19:50',
  },
  date: { readable: 'Demo Mode', hijri: { date: '15 Dhul Hijjah 1447' } },
};
