import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, AlertCircle, Shield } from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  sendPasswordResetEmail,
  signInWithPopup 
} from 'firebase/auth';
import { auth, googleProvider } from '../../services/firebase';
import Button from '../../components/ui/Button';
import './Auth.css';

export default function Auth() {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [mode, setMode] = useState('login'); // 'login' | 'register' | 'forgot'
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPass, setShowPass] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [resetSent, setResetSent] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setResetSent(false);

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        setResetSent(true);
        setTimeout(() => {
          setMode('login');
          setResetSent(false);
        }, 4000);
      }
    } catch (err) {
      console.error(err);
      let msg = err.message;
      if (
        err.code === 'auth/user-not-found' || 
        err.code === 'auth/wrong-password' || 
        err.code === 'auth/invalid-credential'
      ) {
        msg = 'Invalid email or password.';
      } else if (err.code === 'auth/email-already-in-use') {
        msg = 'This email is already registered.';
      } else if (err.code === 'auth/weak-password') {
        msg = 'Password should be at least 6 characters.';
      } else if (err.code === 'auth/invalid-email') {
        msg = 'Please enter a valid email address.';
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    setError('');
    try {
      await signInWithPopup(auth, googleProvider);
      navigate('/');
    } catch (err) {
      console.error(err);
      if (err.code !== 'auth/popup-closed-by-user') {
        setError(err.message);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth">
      {/* Dynamic Animated Ambient Orbs */}
      <div className="auth__bg">
        <div className="auth__bg-orb auth__bg-orb--1" />
        <div className="auth__bg-orb auth__bg-orb--2" />
        <div className="auth__bg-orb auth__bg-orb--3" />
        <div className="auth__bg-pattern" />
      </div>

      <motion.div
        className="auth__card"
        initial={{ opacity: 0, y: 40, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
      >
        {/* Brand Header */}
        <div className="auth__brand-header">
          <div className="auth__logo-ring">
            <Shield size={24} className="auth__logo-shield" />
          </div>
          <div>
            <h2 className="auth__logo-name">DeenFlow</h2>
            <p className="auth__logo-sub">Your Spiritual Guardian</p>
          </div>
        </div>

        {/* VisionOS Pill Mode Selector */}
        {mode !== 'forgot' && (
          <div className="auth__mode-selector">
            <div className="auth__mode-track">
              <button
                type="button"
                className={`auth__mode-btn ${mode === 'login' ? 'active' : ''}`}
                onClick={() => { setMode('login'); setError(''); }}
              >
                Sign In
              </button>
              <button
                type="button"
                className={`auth__mode-btn ${mode === 'register' ? 'active' : ''}`}
                onClick={() => { setMode('register'); setError(''); }}
              >
                Register
              </button>
              {/* Animated active pill background */}
              {mode === 'login' && (
                <motion.div className="auth__mode-pill-bg" layoutId="modePill" />
              )}
              {mode === 'register' && (
                <motion.div className="auth__mode-pill-bg right" layoutId="modePill" />
              )}
            </div>
          </div>
        )}

        {/* Mode Title Text */}
        <div className="auth__title-area">
          <h3 className="auth__title">
            {mode === 'login' ? 'Welcome Back' : 
             mode === 'register' ? 'Begin Your Journey' : 'Reset Password'}
          </h3>
          <p className="auth__subtitle">
            {mode === 'login' ? 'Enter your credentials to access your dashboard' : 
             mode === 'register' ? 'Create a secure account to track your path' : 
             'We will email you a secure password reset link'}
          </p>
        </div>

        {/* Status Alerts */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div 
              className="auth__alert auth__alert--error"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <AlertCircle size={16} />
              <span>{error}</span>
            </motion.div>
          )}

          {resetSent && (
            <motion.div 
              className="auth__alert auth__alert--success"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
            >
              <span>✓ Password reset link sent! Check your inbox.</span>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Main Credentials Form */}
        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__form-group">
            <label className="auth__label">Email Address</label>
            <div className="auth__input-container">
              <Mail size={18} className="auth__input-icon" />
              <input
                type="email"
                placeholder="name@domain.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                className="auth__text-input"
                required
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="auth__form-group">
              <div className="auth__label-row">
                <label className="auth__label">Password</label>
                {mode === 'login' && (
                  <button 
                    type="button" 
                    className="auth__forgot-link" 
                    onClick={() => { setMode('forgot'); setError(''); }}
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="auth__input-container">
                <Lock size={18} className="auth__input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  className="auth__text-input"
                  required
                />
                <button type="button" className="auth__eye-btn" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>
          )}

          <Button type="submit" variant="emerald" size="lg" fullWidth loading={loading} className="auth__submit-btn">
            {mode === 'login' ? 'Sign In to Dashboard' : 
             mode === 'register' ? 'Register Account' : 'Send Reset Link'}
          </Button>

          {mode === 'forgot' && (
            <button 
              type="button" 
              className="auth__back-login" 
              onClick={() => { setMode('login'); setError(''); }}
            >
              ← Back to Sign In
            </button>
          )}
        </form>

        {/* Divider */}
        <div className="auth__divider">
          <span className="auth__divider-line" />
          <span className="auth__divider-text">or continue with</span>
          <span className="auth__divider-line" />
        </div>

        {/* Premium Google Sign-In Option */}
        <button className="auth__google-btn" onClick={handleGoogleSignIn} disabled={loading}>
          <GoogleIcon />
          <span>Continue with Google</span>
        </button>

        {/* Demo Navigation Shortcut */}
        <button type="button" className="auth__demo-bypass" onClick={() => navigate('/')}>
          ⚡ Skip and Enter in Demo Mode
        </button>
      </motion.div>
    </div>
  );
}

function GoogleIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" className="auth__google-svg">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
