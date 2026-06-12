import { motion } from 'framer-motion';
import './GlassCard.css';

/**
 * Premium Glass Morphism Card
 * variant: 'default' | 'emerald' | 'gold' | 'dark' | 'strong'
 */
export default function GlassCard({
  children,
  className = '',
  variant = 'default',
  padding = 'md',
  hover = true,
  glow = false,
  onClick,
  style = {},
  animate = true,
  delay = 0,
}) {
  const Component = animate ? motion.div : 'div';

  const animProps = animate ? {
    initial: { opacity: 0, y: 12 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4, delay, ease: [0.22, 1, 0.36, 1] },
    whileHover: hover ? { y: -3, scale: 1.01 } : {},
    whileTap: onClick ? { scale: 0.98 } : {},
  } : {};

  return (
    <Component
      className={`glass-card glass-card--${variant} glass-card--pad-${padding} ${glow ? `glass-card--glow-${variant}` : ''} ${onClick ? 'glass-card--clickable' : ''} ${className}`}
      onClick={onClick}
      style={style}
      {...animProps}
    >
      <div className="glass-card__noise" />
      {children}
    </Component>
  );
}
