import './RingProgress.css';

/**
 * Animated SVG Ring Progress Indicator
 */
export default function RingProgress({
  value = 0,      // 0–100
  size = 80,
  stroke = 6,
  color = 'var(--color-emerald)',
  trackColor = 'rgba(255,255,255,0.08)',
  children,
  className = '',
  animated = true,
  label,
  glow = false,
}) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <div className={`ring-progress ${className}`} style={{ width: size, height: size }}>
      <svg
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
        className="ring-progress__svg"
      >
        {/* Track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={trackColor}
          strokeWidth={stroke}
        />
        {/* Progress */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={stroke}
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          transform={`rotate(-90 ${size / 2} ${size / 2})`}
          className={`ring-progress__arc ${animated ? 'ring-progress__arc--animated' : ''}`}
          style={{ '--ring-final-offset': offset, filter: glow ? `drop-shadow(0 0 6px ${color})` : 'none' }}
        />
      </svg>
      {/* Center content */}
      <div className="ring-progress__center">
        {children || (label && <span className="ring-progress__label">{label}</span>)}
      </div>
    </div>
  );
}
