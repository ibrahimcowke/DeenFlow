// Firebase Configuration — Muslim Life OS
// Replace with your actual Firebase project config
import { initializeApp } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { getAnalytics } from 'firebase/analytics';

const firebaseConfig = {
  apiKey:            import.meta.env.VITE_FIREBASE_API_KEY            || 'demo-api-key',
  authDomain:        import.meta.env.VITE_FIREBASE_AUTH_DOMAIN        || 'demo.firebaseapp.com',
  projectId:         import.meta.env.VITE_FIREBASE_PROJECT_ID         || 'muslim-life-os-demo',
  storageBucket:     import.meta.env.VITE_FIREBASE_STORAGE_BUCKET     || 'muslim-life-os-demo.appspot.com',
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || '000000000000',
  appId:             import.meta.env.VITE_FIREBASE_APP_ID             || '1:000:web:000',
  measurementId:     import.meta.env.VITE_FIREBASE_MEASUREMENT_ID     || 'G-XXXXXXXXXX',
};

const app = initializeApp(firebaseConfig);

export const auth     = getAuth(app);
export const db       = getFirestore(app);
export const storage  = getStorage(app);
export const googleProvider = new GoogleAuthProvider();

// Analytics only in production
let analytics = null;
if (typeof window !== 'undefined' && import.meta.env.PROD) {
  analytics = getAnalytics(app);
}
export { analytics };

export default app;
