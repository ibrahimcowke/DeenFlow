// Quran Service — AlQuran.cloud API
import axios from 'axios';

const BASE = 'https://api.alquran.cloud/v1';

/**
 * Get all Surahs list
 */
export async function fetchSurahList() {
  const res = await axios.get(`${BASE}/surah`);
  return res.data.data;
}

/**
 * Get a specific Surah with Arabic text
 */
export async function fetchSurah(surahNumber) {
  const [arabicRes, translationRes] = await Promise.all([
    axios.get(`${BASE}/surah/${surahNumber}/ar.alafasy`),
    axios.get(`${BASE}/surah/${surahNumber}/en.asad`),
  ]);
  return {
    arabic: arabicRes.data.data,
    translation: translationRes.data.data,
  };
}

/**
 * Get a page of Quran (604 pages)
 */
export async function fetchPage(pageNumber) {
  const [arabicRes, translationRes] = await Promise.all([
    axios.get(`${BASE}/page/${pageNumber}/ar.alafasy`),
    axios.get(`${BASE}/page/${pageNumber}/en.asad`),
  ]);
  return {
    arabic: arabicRes.data.data,
    translation: translationRes.data.data,
  };
}

/**
 * Get a Juz
 */
export async function fetchJuz(juzNumber) {
  const [arabicRes, translationRes] = await Promise.all([
    axios.get(`${BASE}/juz/${juzNumber}/ar.alafasy`),
    axios.get(`${BASE}/juz/${juzNumber}/en.asad`),
  ]);
  return {
    arabic: arabicRes.data.data,
    translation: translationRes.data.data,
  };
}

/**
 * Search in Quran
 */
export async function searchQuran(query, lang = 'en') {
  const edition = lang === 'ar' ? 'ar.alafasy' : 'en.asad';
  const res = await axios.get(`${BASE}/search/${encodeURIComponent(query)}/all/${edition}`);
  return res.data.data;
}

/**
 * Get a random ayah (for daily inspiration)
 */
export async function fetchRandomAyah() {
  const res = await axios.get(`${BASE}/ayah/random/en.asad`);
  return res.data.data;
}

// Local Surah names cache
export const SURAH_NAMES = [
  'Al-Fatihah', 'Al-Baqarah', 'Al-Imran', 'An-Nisa', "Al-Ma'idah",
  'Al-Anam', "Al-A'raf", 'Al-Anfal', 'At-Tawbah', 'Yunus',
  'Hud', 'Yusuf', 'Ar-Ra\'d', 'Ibrahim', 'Al-Hijr',
  'An-Nahl', 'Al-Isra', 'Al-Kahf', 'Maryam', 'Ta-Ha',
  'Al-Anbiya', 'Al-Hajj', 'Al-Muminun', 'An-Nur', 'Al-Furqan',
  'Ash-Shuara', 'An-Naml', 'Al-Qasas', 'Al-Ankabut', 'Ar-Rum',
  'Luqman', 'As-Sajdah', 'Al-Ahzab', 'Saba', 'Fatir',
  'Ya-Sin', 'As-Saffat', 'Sad', 'Az-Zumar', 'Ghafir',
  'Fussilat', 'Ash-Shura', 'Az-Zukhruf', 'Ad-Dukhan', 'Al-Jathiyah',
  'Al-Ahqaf', 'Muhammad', 'Al-Fath', 'Al-Hujurat', 'Qaf',
  'Adh-Dhariyat', 'At-Tur', 'An-Najm', 'Al-Qamar', 'Ar-Rahman',
  'Al-Waqi\'ah', 'Al-Hadid', 'Al-Mujadila', 'Al-Hashr', 'Al-Mumtahanah',
  'As-Saf', 'Al-Jumuah', 'Al-Munafiqun', 'At-Taghabun', 'At-Talaq',
  'At-Tahrim', 'Al-Mulk', 'Al-Qalam', 'Al-Haqqah', 'Al-Ma\'arij',
  'Nuh', 'Al-Jinn', 'Al-Muzzammil', 'Al-Muddaththir', 'Al-Qiyamah',
  'Al-Insan', 'Al-Mursalat', 'An-Naba', 'An-Nazi\'at', 'Abasa',
  'At-Takwir', 'Al-Infitar', 'Al-Mutaffifin', 'Al-Inshiqaq', 'Al-Buruj',
  'At-Tariq', 'Al-Ala', 'Al-Ghashiyah', 'Al-Fajr', 'Al-Balad',
  'Ash-Shams', 'Al-Layl', 'Ad-Duha', 'Ash-Sharh', 'At-Tin',
  'Al-Alaq', 'Al-Qadr', 'Al-Bayyinah', 'Az-Zalzalah', 'Al-Adiyat',
  'Al-Qari\'ah', 'At-Takathur', 'Al-Asr', 'Al-Humazah', 'Al-Fil',
  'Quraysh', "Al-Ma'un", 'Al-Kawthar', 'Al-Kafirun', 'An-Nasr',
  'Al-Masad', 'Al-Ikhlas', 'Al-Falaq', 'An-Nas'
];

export const SURAH_ARABIC_NAMES = [
  'الفاتحة', 'البقرة', 'آل عمران', 'النساء', 'المائدة',
  'الأنعام', 'الأعراف', 'الأنفال', 'التوبة', 'يونس',
  'هود', 'يوسف', 'الرعد', 'إبراهيم', 'الحجر',
  'النحل', 'الإسراء', 'الكهف', 'مريم', 'طه',
  'الأنبياء', 'الحج', 'المؤمنون', 'النور', 'الفرقان',
  'الشعراء', 'النمل', 'القصص', 'العنكبوت', 'الروم',
  'لقمان', 'السجدة', 'الأحزاب', 'سبأ', 'فاطر',
  'يس', 'الصافات', 'ص', 'الزمر', 'غافر',
  'فصلت', 'الشورى', 'الزخرف', 'الدخان', 'الجاثية',
  'الأحقاف', 'محمد', 'الفتح', 'الحجرات', 'ق',
  'الذاريات', 'الطور', 'النجم', 'القمر', 'الرحمن',
  'الواقعة', 'الحديد', 'المجادلة', 'الحشر', 'الممتحنة',
  'الصف', 'الجمعة', 'المنافقون', 'التغابن', 'الطلاق',
  'التحريم', 'الملك', 'القلم', 'الحاقة', 'المعارج',
  'نوح', 'الجن', 'المزمل', 'المدثر', 'القيامة',
  'الإنسان', 'المرسلات', 'النبأ', 'النازعات', 'عبس',
  'التكوير', 'الانفطار', 'المطففين', 'الانشقاق', 'البروج',
  'الطارق', 'الأعلى', 'الغاشية', 'الفجر', 'البلد',
  'الشمس', 'الليل', 'الضحى', 'الشرح', 'التين',
  'العلق', 'القدر', 'البينة', 'الزلزلة', 'العاديات',
  'القارعة', 'التكاثر', 'العصر', 'الهمزة', 'الفيل',
  'قريش', 'الماعون', 'الكوثر', 'الكافرون', 'النصر',
  'المسد', 'الإخلاص', 'الفلق', 'الناس'
];

/**
 * Get a Hizb
 */
export async function fetchHizb(hizbNumber) {
  const [arabicRes, translationRes] = await Promise.all([
    axios.get(`${BASE}/hizb/${hizbNumber}/ar.alafasy`),
    axios.get(`${BASE}/hizb/${hizbNumber}/en.asad`),
  ]);
  return {
    arabic: arabicRes.data.data,
    translation: translationRes.data.data,
  };
}

/**
 * Get a Hizb Quarter (Maqrah)
 */
export async function fetchHizbQuarter(hizbQuarterNumber) {
  const [arabicRes, translationRes] = await Promise.all([
    axios.get(`${BASE}/hizbQuarter/${hizbQuarterNumber}/ar.alafasy`),
    axios.get(`${BASE}/hizbQuarter/${hizbQuarterNumber}/en.asad`),
  ]);
  return {
    arabic: arabicRes.data.data,
    translation: translationRes.data.data,
  };
}

