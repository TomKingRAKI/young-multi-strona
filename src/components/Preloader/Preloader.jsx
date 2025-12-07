import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

// Particle configuration for logo explosion
const PARTICLE_COUNT = 30;
const generateParticles = () => {
  return Array.from({ length: PARTICLE_COUNT }, (_, i) => ({
    id: i,
    angle: (i / PARTICLE_COUNT) * 360 + Math.random() * 30,
    speed: 150 + Math.random() * 250,
    size: 8 + Math.random() * 12,
    delay: Math.random() * 0.15
  }));
};

function Preloader({ onComplete }) {
  // === STATES ===
  const [phase, setPhase] = useState('loading'); // 'loading' | 'exploding' | 'warning' | 'done'
  const [issues, setIssues] = useState([]);
  const [screenInfo, setScreenInfo] = useState({ width: 0, height: 0 });
  const [performanceInfo, setPerformanceInfo] = useState({ fps: 0, gpuName: '' });
  const [particles] = useState(generateParticles);
  const fpsRef = useRef({ frames: [], startTime: 0 });

  // === SYSTEM CHECKS ===
  const checkHardwareAcceleration = () => {
    try {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });

      if (!gl) return { hasGPU: false, gpuName: 'Brak' };

      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      let gpuName = 'Nieznane GPU';

      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        gpuName = renderer;

        if (
          renderer.includes('SwiftShader') ||
          renderer.includes('llvmpipe') ||
          renderer.includes('Software') ||
          renderer.includes('Microsoft Basic Render')
        ) {
          return { hasGPU: false, gpuName: renderer };
        }
      }
      return { hasGPU: true, gpuName };
    } catch {
      return { hasGPU: false, gpuName: 'Błąd wykrywania' };
    }
  };

  const checkIsMobile = () => {
    const userAgent = navigator.userAgent.toLowerCase();
    const isMobileUA = /mobile|android|iphone|ipad|ipod|blackberry|iemobile|opera mini|webos/i.test(userAgent);
    const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    const isSmallScreen = window.screen.width <= 1024;
    return isMobileUA || (isSmallScreen && isTouchDevice);
  };

  const checkResolution = (isMobile) => {
    const width = window.screen.width;
    const height = window.screen.height;
    setScreenInfo({ width, height });
    if (isMobile) return true;
    return width >= 1920 && height >= 1080;
  };

  // === FPS MEASUREMENT DURING SCROLL ===
  const measureFPS = () => {
    const now = performance.now();
    fpsRef.current.frames.push(now);
  };

  const calculateFPS = () => {
    const frames = fpsRef.current.frames;
    if (frames.length < 2) return 0;

    let totalDelta = 0;
    for (let i = 1; i < frames.length; i++) {
      totalDelta += frames[i] - frames[i - 1];
    }
    const avgFrameTime = totalDelta / (frames.length - 1);
    return Math.round(1000 / avgFrameTime);
  };

  // === MAIN SEQUENCE ===
  useEffect(() => {
    const runSequence = async () => {
      const detectedIssues = [];

      // 1. Run GPU and resolution checks immediately
      const gpuCheck = checkHardwareAcceleration();
      const isMobile = checkIsMobile();
      const hasResolution = checkResolution(isMobile);

      if (!gpuCheck.hasGPU) {
        detectedIssues.push({
          type: 'gpu',
          icon: '🎮',
          title: 'Akceleracja Sprzętowa Wyłączona',
          description: 'Przeglądarka renderuje grafikę programowo (CPU)'
        });
      }

      if (!hasResolution) {
        detectedIssues.push({
          type: 'resolution',
          icon: '🖥️',
          title: 'Niestandardowa Rozdzielczość',
          description: `Wykryto ${window.screen.width}×${window.screen.height}px`
        });
      }

      // 2. Start FPS measurement
      fpsRef.current = { frames: [], startTime: performance.now() };
      let animationId;
      const trackFPS = () => {
        measureFPS();
        animationId = requestAnimationFrame(trackFPS);
      };
      animationId = requestAnimationFrame(trackFPS);

      // 3. Initial delay
      await new Promise(resolve => setTimeout(resolve, 1000));

      // 4. Scroll to bottom
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 2500));

      // 5. Scroll to top
      window.scrollTo({ top: 0, behavior: 'smooth' });
      await new Promise(resolve => setTimeout(resolve, 1500));

      // 6. Stop FPS measurement and calculate
      cancelAnimationFrame(animationId);
      const avgFPS = calculateFPS();

      setPerformanceInfo({ fps: avgFPS, gpuName: gpuCheck.gpuName });

      // Check if FPS is too low (only if GPU is enabled)
      if (gpuCheck.hasGPU && avgFPS > 0 && avgFPS < 20) {
        detectedIssues.push({
          type: 'performance',
          icon: '🐢',
          title: 'Słaba Wydajność Graficzna',
          description: `Wykryto ${avgFPS} FPS (zalecane: 20+)`
        });
      }

      setIssues(detectedIssues);

      // 7. Decide next phase
      if (detectedIssues.length > 0) {
        setPhase('warning');
      } else {
        // No issues - trigger explosion
        setPhase('exploding');
      }
    };

    runSequence();
  }, []);

  // === EXPLOSION COMPLETE HANDLER ===
  useEffect(() => {
    if (phase === 'exploding') {
      const timer = setTimeout(() => {
        setPhase('done');
        if (onComplete) onComplete();
      }, 800); // Duration of explosion animation
      return () => clearTimeout(timer);
    }
  }, [phase, onComplete]);

  // === HANDLERS ===
  const handleContinue = () => {
    setPhase('exploding');
  };

  const openHelpGuide = () => {
    window.open('https://www.google.com/search?q=jak+włączyć+akcelerację+sprzętową+w+przeglądarce', '_blank');
  };

  // === RENDER ===
  if (phase === 'done') return null;

  return (
    <motion.div
      className="preloader"
      initial={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      <AnimatePresence mode="wait">
        {/* LOADING PHASE */}
        {phase === 'loading' && (
          <motion.div
            key="loading-content"
            className="loader-content-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
          >
            <div className="logo-glow" />
            <div className="shimmer-logo" />
            <motion.p
              className="loading-text"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              Wczytywanie doświadczenia...
            </motion.p>
          </motion.div>
        )}

        {/* EXPLODING PHASE */}
        {phase === 'exploding' && (
          <motion.div
            key="exploding-content"
            className="explosion-container"
            initial={{ opacity: 1 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {particles.map((particle) => (
              <motion.div
                key={particle.id}
                className="logo-particle"
                initial={{
                  x: 0,
                  y: 0,
                  scale: 1,
                  opacity: 1
                }}
                animate={{
                  x: Math.cos(particle.angle * Math.PI / 180) * particle.speed,
                  y: Math.sin(particle.angle * Math.PI / 180) * particle.speed,
                  scale: 0,
                  opacity: 0
                }}
                transition={{
                  duration: 0.7,
                  delay: particle.delay,
                  ease: [0.25, 0.46, 0.45, 0.94]
                }}
                style={{
                  width: particle.size,
                  height: particle.size
                }}
              />
            ))}
          </motion.div>
        )}

        {/* WARNING PHASE */}
        {phase === 'warning' && (
          <motion.div
            key="warning-content"
            className="system-warning-modal"
            initial={{ opacity: 0, scale: 0.9, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          >
            <div className="system-warning-content">
              <div className="warning-icon-large">⚠️</div>

              <h2>Wykryto Problemy</h2>

              <p>
                Ta strona wykorzystuje zaawansowane efekty graficzne.<br />
                Wykryliśmy następujące problemy z Twoim systemem:
              </p>

              <ul className="warning-list">
                {issues.map((issue, index) => (
                  <li key={index}>
                    <span className="issue-icon">{issue.icon}</span>
                    <div className="issue-text">
                      <strong>{issue.title}</strong>
                      <span>{issue.description}</span>
                    </div>
                  </li>
                ))}
              </ul>

              <div className="system-info-box">
                {issues.some(i => i.type === 'resolution') && (
                  <div className="info-row">
                    <span className="info-label">Rozdzielczość:</span>
                    <span className="info-value error">{screenInfo.width} × {screenInfo.height}px</span>
                    <span className="info-required">(wymagane: 1920×1080)</span>
                  </div>
                )}
                {performanceInfo.fps > 0 && (
                  <div className="info-row">
                    <span className="info-label">Wydajność:</span>
                    <span className={`info-value ${performanceInfo.fps < 20 ? 'error' : 'ok'}`}>
                      {performanceInfo.fps} FPS
                    </span>
                    <span className="info-required">(zalecane: 20+)</span>
                  </div>
                )}
                {performanceInfo.gpuName && (
                  <div className="info-row gpu-info">
                    <span className="info-label">GPU:</span>
                    <span className="info-value">{performanceInfo.gpuName}</span>
                  </div>
                )}
              </div>

              <p className="system-suggestion">
                {issues.some(i => i.type === 'gpu') && (
                  <>Włącz „Akcelerację sprzętową" w ustawieniach przeglądarki. </>
                )}
                {issues.some(i => i.type === 'performance') && (
                  <>Twój komputer może mieć problemy z płynnym wyświetlaniem animacji. </>
                )}
                {issues.some(i => i.type === 'resolution') && (
                  <>Strona może wyglądać inaczej na Twojej rozdzielczości. </>
                )}
                <br />
                <strong>Niektóre elementy mogą lagować lub się rozjeżdżać.</strong>
              </p>

              <div className="system-warning-buttons">
                <button className="system-btn-primary" onClick={handleContinue}>
                  Rozumiem, kontynuuj
                </button>

                {issues.some(i => i.type === 'gpu') && (
                  <button className="system-btn-secondary" onClick={openHelpGuide}>
                    Jak włączyć GPU?
                  </button>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* PROGRESS BAR - only during loading */}
      {phase === 'loading' && (
        <div className="bottom-progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 5, ease: "easeInOut" }}
          />
        </div>
      )}
    </motion.div>
  );
}

export default Preloader;