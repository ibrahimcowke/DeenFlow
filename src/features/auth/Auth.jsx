import { useState } from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Mail, Lock, Eye, EyeOff, AlertCircle } from 'lucide-react';
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      if (mode === 'login') {
        await signInWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else if (mode === 'register') {
        await createUserWithEmailAndPassword(auth, email, password);
        navigate('/');
      } else if (mode === 'forgot') {
        await sendPasswordResetEmail(auth, email);
        alert('Password reset link sent to your email!');
        setMode('login');
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
      {/* Background */}
      <div className="auth__bg">
        <div className="auth__bg-orb auth__bg-orb--1" />
        <div className="auth__bg-orb auth__bg-orb--2" />
        <div className="auth__bg-mosque"><MiniMosqueSVG /></div>
        <div className="auth__bg-pattern" />
      </div>

      <motion.div
        className="auth__card"
        initial={{ opacity: 0, y: 30, scale: 0.96 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Logo */}
        <div className="auth__logo">
          <div className="auth__logo-icon">🕌</div>
          <div>
            <span className="auth__logo-name">DeenFlow</span>
            <span className="auth__logo-sub">Your Deen Companion</span>
          </div>
        </div>

        {/* Title */}
        <div className="auth__header">
          <h1 className="auth__title">
            {mode === 'login' ? t('login', 'Welcome Back') :
             mode === 'register' ? t('register', 'Create Account') :
             t('forgot_password', 'Reset Password')}
          </h1>
          <p className="auth__subtitle">
            {mode === 'login' ? 'Sign in to your account' :
             mode === 'register' ? 'Begin your spiritual journey' :
             'Enter your email to reset'}
          </p>
        </div>

        {/* Error */}
        {error && (
          <div className="auth__error">
            <AlertCircle size={16} />
            {error}
          </div>
        )}

        {/* Form */}
        <form className="auth__form" onSubmit={handleSubmit}>
          <div className="auth__field">
            <label className="auth__label">{t('email', 'Email')}</label>
            <div className="auth__input-wrap">
              <Mail size={16} className="auth__input-icon" />
              <input
                type="email"
                className="auth__input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                required
              />
            </div>
          </div>

          {mode !== 'forgot' && (
            <div className="auth__field">
              <label className="auth__label">{t('password', 'Password')}</label>
              <div className="auth__input-wrap">
                <Lock size={16} className="auth__input-icon" />
                <input
                  type={showPass ? 'text' : 'password'}
                  className="auth__input"
                  placeholder="••••••••"
                  value={password}
                  onChange={e => setPassword(e.target.value)}
                  required
                />
                <button type="button" className="auth__eye" onClick={() => setShowPass(s => !s)}>
                  {showPass ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          )}

          {mode === 'login' && (
            <button type="button" className="auth__forgot" onClick={() => setMode('forgot')}>
              {t('forgot_password', 'Forgot Password?')}
            </button>
          )}

          <Button type="submit" variant="primary" size="lg" fullWidth loading={loading}>
            {mode === 'login' ? t('login', 'Login') :
             mode === 'register' ? t('register', 'Create Account') :
             'Send Reset Link'}
          </Button>
        </form>

        {/* Divider */}
        <div className="auth__divider"><span>{t('or', 'or')}</span></div>

        {/* OAuth */}
        <div className="auth__oauth">
          <button className="auth__oauth-btn" onClick={handleGoogleSignIn} disabled={loading}>
            <GoogleIcon />
            {t('continue_google', 'Continue with Google')}
          </button>
        </div>

        {/* Switch mode */}
        <p className="auth__switch">
          {mode === 'login' ? t('no_account', "Don't have an account?") : t('have_account', 'Already have an account?')}
          {' '}
          <button
            className="auth__switch-btn"
            onClick={() => setMode(mode === 'login' ? 'register' : 'login')}
          >
            {mode === 'login' ? t('register', 'Sign Up') : t('login', 'Login')}
          </button>
        </p>

        {/* Demo mode */}
        <button className="auth__demo" onClick={() => navigate('/')}>
          → Continue in Demo Mode (no account needed)
        </button>
      </motion.div>
    </div>
  );
}

function MiniMosqueSVG() {
  return (
    <svg viewBox="0 0 400 200" fill="none" xmlns="http://www.w3.org/2000/svg" style={{width:'100%',height:'auto'}}>
      <ellipse cx="200" cy="80" rx="70" ry="60" fill="rgba(16,185,129,0.3)"/>
      <rect x="130" y="80" width="140" height="100" fill="rgba(16,185,129,0.2)" rx="3"/>
      <rect x="75" y="65" width="18" height="115" fill="rgba(16,185,129,0.2)" rx="3"/>
      <ellipse cx="84" cy="63" rx="10" ry="17" fill="rgba(16,185,129,0.3)"/>
      <rect x="307" y="65" width="18" height="115" fill="rgba(16,185,129,0.2)" rx="3"/>
      <ellipse cx="316" cy="63" rx="10" ry="17" fill="rgba(16,185,129,0.3)"/>
    </svg>
  );
}

function GoogleIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
    </svg>
  );
}
