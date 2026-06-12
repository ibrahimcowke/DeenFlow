import { motion } from 'framer-motion';
import './Button.css';

/**
 * Premium Button component
 * variant: 'primary' | 'secondary' | 'ghost' | 'danger' | 'gold' | 'outline'
 * size: 'sm' | 'md' | 'lg' | 'xl'
 */
export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight,
  disabled = false,
  loading = false,
  fullWidth = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) {
  return (
    <motion.button
      type={type}
      className={`btn btn--${variant} btn--${size} ${fullWidth ? 'btn--full' : ''} ${loading ? 'btn--loading' : ''} ${className}`}
      disabled={disabled || loading}
      onClick={onClick}
      whileHover={{ scale: disabled ? 1 : 1.02 }}
      whileTap={{ scale: disabled ? 1 : 0.97 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      {...props}
    >
      {loading && <span className="btn__spinner" />}
      {Icon && !loading && <Icon size={size === 'sm' ? 14 : size === 'lg' ? 20 : 16} className="btn__icon" />}
      {children && <span className="btn__text">{children}</span>}
      {iconRight && !loading && <iconRight size={16} className="btn__icon btn__icon--right" />}
      <span className="btn__ripple" />
    </motion.button>
  );
}
