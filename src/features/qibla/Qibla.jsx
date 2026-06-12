import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Compass, Navigation, Info, RotateCcw } from 'lucide-react';
import GlassCard from '../../components/ui/GlassCard';
import Button from '../../components/ui/Button';
import './Qibla.css';

export default function Qibla() {
  const [heading, setHeading] = useState(0); // Phone direction relative to North (0-360)
  const [qiblaDirection, setQiblaDirection] = useState(135); // Qibla angle from North (e.g., 135 deg for East-SouthEast)
  const [distance, setDistance] = useState('4,852 km');
  const [isFacingMakkah, setIsFacingMakkah] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);
  const [simulatedHeading, setSimulatedHeading] = useState(0);

  // Calculate if facing Makkah (within a 5-degree threshold)
  useEffect(() => {
    const relativeAngle = (qiblaDirection - heading + 360) % 360;
    // If the Kaaba is aligned with the top of the screen (0 degrees relative)
    if (relativeAngle >= 355 || relativeAngle <= 5) {
      setIsFacingMakkah(true);
    } else {
      setIsFacingMakkah(false);
    }
  }, [heading, qiblaDirection]);

  // Handle device orientation API
  useEffect(() => {
    const handleOrientation = (e) => {
      if (e.alpha !== null) {
        // e.alpha is 0 to 360, compass heading is usually 360 - e.alpha
        setHeading(Math.round(360 - e.alpha));
      }
    };

    if (window.DeviceOrientationEvent) {
      window.addEventListener('deviceorientation', handleOrientation);
    }

    return () => {
      window.removeEventListener('deviceorientation', handleOrientation);
    };
  }, []);

  const requestCompassPermission = async () => {
    if (typeof DeviceOrientationEvent !== 'undefined' && typeof DeviceOrientationEvent.requestPermission === 'function') {
      try {
        const permissionState = await DeviceOrientationEvent.requestPermission();
        if (permissionState === 'granted') {
          setHasPermission(true);
          window.addEventListener('deviceorientation', (e) => {
            if (e.alpha !== null) setHeading(Math.round(360 - e.alpha));
          });
        } else {
          setHasPermission(false);
        }
      } catch (error) {
        console.error('Error requesting device orientation permission', error);
        setHasPermission(false);
      }
    } else {
      // Permission not needed or not supported on this browser (desktop/Android)
      setHasPermission(true);
    }
  };

  // Adjust heading manually for simulation on desktop
  const handleSliderChange = (e) => {
    const val = parseInt(e.target.value);
    setSimulatedHeading(val);
    setHeading(val);
  };

  const resetSimulation = () => {
    setSimulatedHeading(0);
    setHeading(0);
  };

  const relativeAngle = (qiblaDirection - heading + 360) % 360;

  return (
    <div className="qibla page-container">
      <div className="qibla__header">
        <motion.h1 className="qibla__title" initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }}>
          Qibla Finder
        </motion.h1>
        <p className="qibla__sub">Align your device to find the direction of Kaaba in Makkah</p>
      </div>

      <div className="qibla__layout">
        <GlassCard className="qibla__card" padding="lg" delay={0.1}>
          {/* Compass Container */}
          <div className="qibla__compass-container">
            {/* Compass Dial */}
            <div 
              className={`qibla__compass ${isFacingMakkah ? 'qibla__compass--aligned' : ''}`}
              style={{ transform: `rotate(${-heading}deg)` }}
            >
              {/* Degree markings */}
              <div className="qibla__degree qibla__degree--n">N</div>
              <div className="qibla__degree qibla__degree--e">E</div>
              <div className="qibla__degree qibla__degree--s">S</div>
              <div className="qibla__degree qibla__degree--w">W</div>

              {/* Angle Tickmarks */}
              {[...Array(12)].map((_, i) => (
                <div 
                  key={i} 
                  className="qibla__tick" 
                  style={{ transform: `rotate(${i * 30}deg)` }} 
                />
              ))}

              {/* Kaaba Marker */}
              <div 
                className="qibla__kaaba-marker" 
                style={{ transform: `rotate(${qiblaDirection}deg)` }}
              >
                <div className="qibla__kaaba-pointer">🕋</div>
              </div>
            </div>

            {/* Fixed Central Needle */}
            <div className={`qibla__needle ${isFacingMakkah ? 'qibla__needle--aligned' : ''}`}>
              <Navigation size={48} className="qibla__arrow" />
            </div>

            {/* Glowing Aura when Aligned */}
            {isFacingMakkah && <div className="qibla__glow" />}
          </div>

          {/* Heading Info */}
          <div className="qibla__info">
            <h2 className={`qibla__status ${isFacingMakkah ? 'qibla__status--aligned' : ''}`}>
              {isFacingMakkah ? 'Facing Makkah' : `${relativeAngle}° Turn`}
            </h2>
            <div className="qibla__meta-grid">
              <div className="qibla__meta-item">
                <span className="qibla__meta-lbl">Qibla Direction</span>
                <span className="qibla__meta-val">{qiblaDirection}° ESE</span>
              </div>
              <div className="qibla__meta-item">
                <span className="qibla__meta-lbl">Current Heading</span>
                <span className="qibla__meta-val">{heading}°</span>
              </div>
              <div className="qibla__meta-item">
                <span className="qibla__meta-lbl">Distance</span>
                <span className="qibla__meta-val">{distance}</span>
              </div>
            </div>
          </div>

          {/* Device Orientation Permission helper */}
          {hasPermission === null && (
            <Button variant="emerald" className="qibla__permission-btn" onClick={requestCompassPermission}>
              Enable Device Compass
            </Button>
          )}

          <div className="qibla__simulation">
            <div className="qibla__sim-header">
              <span>Simulate Rotation (Desktop/Test)</span>
              <button onClick={resetSimulation} className="qibla__sim-reset" title="Reset Heading">
                <RotateCcw size={14} />
              </button>
            </div>
            <input 
              type="range" 
              min="0" 
              max="359" 
              value={simulatedHeading} 
              onChange={handleSliderChange}
              className="qibla__sim-slider"
            />
          </div>

          <div className="qibla__note">
            <Info size={16} style={{ flexShrink: 0, color: 'var(--color-emerald)' }} />
            <span>Point the top of your phone towards the compass needle. Ensure your phone is held flat and away from magnetic fields.</span>
          </div>
        </GlassCard>
      </div>
    </div>
  );
}
