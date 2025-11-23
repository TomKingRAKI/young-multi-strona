// Plik: /src/components/Preloader/Preloader.jsx

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './Preloader.css';

function Preloader() {
  // --- LOGIKA POZOSTAJE BEZ ZMIAN (Skopiuj poprawioną wersję z poprzedniej odpowiedzi) ---
  const [loading, setLoading] = useState(true);
  const [hasHardwareAcceleration, setHasHardwareAcceleration] = useState(true);
  const [isMobileDevice, setIsMobileDevice] = useState(false);
  const [showHardwareWarning, setShowHardwareWarning] = useState(false);
  const [showMobileWarning, setShowMobileWarning] = useState(false);
  const [canProceed, setCanProceed] = useState(false);

  // 1. PANCERNE WYKRYWANIE AKCELERACJI
  useEffect(() => {
    const checkHardwareAcceleration = () => {
      const canvas = document.createElement('canvas');
      const gl = canvas.getContext('webgl', { failIfMajorPerformanceCaveat: true });
      if (!gl) return false;
      const debugInfo = gl.getExtension('WEBGL_debug_renderer_info');
      if (debugInfo) {
        const renderer = gl.getParameter(debugInfo.UNMASKED_RENDERER_WEBGL);
        if (renderer.includes('SwiftShader') || renderer.includes('llvmpipe') || renderer.includes('Software')) {
          return false;
        }
      }
      return true;
    };
    setHasHardwareAcceleration(checkHardwareAcceleration());
  }, []);

  // 2. WYKRYWANIE MOBILE + RESIZE
  useEffect(() => {
    const checkMobileDevice = () => {
      const width = window.innerWidth;
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = width <= 1024 || /mobile|android|iphone|ipad|tablet|touch/i.test(userAgent);
      setIsMobileDevice(isMobile);
    };
    checkMobileDevice();
    window.addEventListener('resize', checkMobileDevice);
    return () => window.removeEventListener('resize', checkMobileDevice);
  }, []);

  // 3. TIMER
  useEffect(() => {
    if (!loading) return;
    const timer = setTimeout(() => {
      setLoading(false);
      if (!hasHardwareAcceleration) setShowHardwareWarning(true);
      else if (isMobileDevice) setShowMobileWarning(true);
      else setCanProceed(true);
    }, 2500); // Zwiększyłem lekko czas do 2.5s, żeby nacieszyć oko nowym wyglądem

    return () => clearTimeout(timer);
  }, [loading, hasHardwareAcceleration, isMobileDevice]);

  // Handlery...
  const handleHardwareWarningDismiss = () => {
    setShowHardwareWarning(false);
    isMobileDevice ? setShowMobileWarning(true) : setCanProceed(true);
  };
  const handleMobileWarningDismiss = () => {
    setShowMobileWarning(false);
    setCanProceed(true);
  };
  const openHardwareAccelerationGuide = () => {
    window.open('https://www.google.com/search?q=jak+włączyć+akcelerację+sprzętową+w+przeglądarce', '_blank');
  };

  if (canProceed) return null;

  // --- NOWA STRUKTURA JSX ---
  return (
    <motion.div
      className="preloader"
      exit={{ opacity: 0 }}
      transition={{ duration: 0.8, ease: "easeInOut" }} // Dłuższe, płynniejsze wyjście
    >
      <AnimatePresence mode="wait">
        {/* FAZA 1: Ładowanie (Nowy, bogatszy wygląd) */}
        {loading && (
          <motion.div
            key="loading-content"
            className="loader-content-wrapper"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0, scale: 0.95, filter: "blur(10px)" }}
            transition={{ duration: 0.8 }}
          >
            {/* Poświata */}
            <div className="logo-glow" />

            {/* Logo YFL */}
            <div className="shimmer-logo" />

            {/* Tekst pod logo */}
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

        {/* FAZA 2 & 3: Ostrzeżenia (Bez zmian w strukturze, tylko styly z CSS) */}
        {showHardwareWarning && (
          <motion.div
            key="hardware-warning"
            className="warning-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "backOut" }}
          >
            <div className="warning-content">
              <div className="warning-icon">⚠️</div>
              <h2>Akceleracja Sprzętowa Wyłączona</h2>
              <p>
                Wykryliśmy brak wydajnej akceleracji GPU. <br />
                Twoja przeglądarka renderuje stronę programowo.
              </p>
              <p className="warning-suggestion">
                Włącz "Akcelerację sprzętową" w ustawieniach przeglądarki, aby uniknąć lagów.
              </p>
              <div className="warning-buttons">
                <button className="btn-primary" onClick={openHardwareAccelerationGuide}>
                  Jak włączyć?
                </button>
                <button className="btn-secondary" onClick={handleHardwareWarningDismiss}>
                  Kontynuuj (może ciąć)
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {showMobileWarning && (
          <motion.div
            key="mobile-warning"
            className="warning-modal"
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.4, ease: "backOut" }}
          >
            <div className="warning-content">
              <div className="warning-icon">📱</div>
              <h2>Wąski Ekran / Mobile</h2>
              <p>
                Wykryliśmy rozdzielczość ({window.innerWidth}px), która może być za mała.
              </p>
              <p className="warning-suggestion">
                Ta strona najlepiej wygląda na komputerze (Desktop).
              </p>
              <div className="warning-buttons">
                <button className="btn-primary" onClick={handleMobileWarningDismiss}>
                  Wchodzę mimo to
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pasek postępu na samym dole (poza AnimatePresence, znika razem z całym preloaderem) */}
      {loading && (
        <div className="bottom-progress-bar">
          <motion.div
            className="progress-bar-fill"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2.5, ease: "easeInOut" }} // Czas zgodny z timerem
          />
        </div>
      )}
    </motion.div>
  );
}

export default Preloader;