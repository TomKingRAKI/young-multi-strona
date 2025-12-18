// Plik: /src/App.jsx

import React, { useState, useRef, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, useScroll } from 'framer-motion';

// Critical components - load immediately
import Hero from './components/Hero/Hero';
import Preloader from './components/Preloader/Preloader';
import Header from './components/Header/Header';
import MenuOverlay from './components/MenuOverlay/MenuOverlay';
// import CustomCursor from './components/CustomCursor/CustomCursor'; // DISABLED - uncomment to re-enable
import GrainOverlay from './components/GrainOverlay/GrainOverlay';
import useAdaptiveFavicon from './hooks/useAdaptiveFavicon';

// Lazy-loaded components - load when needed (below the fold)
const NewSong = lazy(() => import('./components/NewSong/NewSong'));
const Merch = lazy(() => import('./components/Merch/Merch'));
const Contact = lazy(() => import('./components/Contact/Contact'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Simple Routing Check
  const path = window.location.pathname;
  const isHome = path === '/' || path === '/index.html';

  if (!isHome) {
    return (
      <Suspense fallback={null}>
        <NotFound />
      </Suspense>
    );
  }

  const { scrollY } = useScroll();

  // === ADAPTIVE FAVICON ===
  useAdaptiveFavicon();

  // === SECTION REFS FOR DYNAMIC NAVIGATION ===
  const heroRef = useRef(null);
  const newSongRef = useRef(null);
  const merchRef = useRef(null);
  const contactRef = useRef(null);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  // === DYNAMIC SCROLL NAVIGATION ===
  // Uses actual DOM positions and calculates offsets for nested sections
  const handleSectionClick = useCallback((sectionId) => {
    // HOME always scrolls to top
    if (sectionId === 'home') {
      window.scrollTo({ top: 0 });
      setTimeout(() => setIsMenuOpen(false), 300);
      return;
    }

    // KONTAKT scrolls to very bottom of page
    if (sectionId === 'kontakt') {
      window.scrollTo({ top: document.body.scrollHeight });
      setTimeout(() => setIsMenuOpen(false), 300);
      return;
    }

    // For sections inside NewSong, calculate scroll position based on percentage
    if (newSongRef?.current) {
      const newSongTop = newSongRef.current.offsetTop;
      const newSongHeight = newSongRef.current.offsetHeight;

      let scrollPosition = 0;

      switch (sectionId) {
        case 'nowa-piosenka':
          // Scroll to start of NewSong
          scrollPosition = newSongTop;
          break;
        case 'dyskolgrafia':
          // Gramophone starts around 35% of NewSong
          scrollPosition = newSongTop + (newSongHeight * 0.35);
          break;
        case 'o-mnie':
          // About starts around 70% of NewSong
          scrollPosition = newSongTop + (newSongHeight * 0.70);
          break;
        case 'merch':
          // Merch is after NewSong
          if (merchRef?.current) {
            scrollPosition = merchRef.current.offsetTop;
          }
          break;
        default:
          scrollPosition = 0;
      }

      window.scrollTo({ top: scrollPosition });
    }

    // Close menu with delay to allow exit animation
    setTimeout(() => setIsMenuOpen(false), 300);
  }, []);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* CUSTOM CURSOR - DISABLED
      <CustomCursor />
      */}

      {/* GRAIN OVERLAY - Film texture */}
      <GrainOverlay />

      {/* UNIFIED PRELOADER */}
      <AnimatePresence>
        {isLoading && <Preloader onComplete={handlePreloaderComplete} />}
      </AnimatePresence>

      {/* MAIN CONTENT */}
      <>
        <Header
          onMenuClick={openMenu}
          onCloseClick={closeMenu}
          isMenuOpen={isMenuOpen}
          startAnimation={!isLoading}
        />

        <AnimatePresence mode='wait'>
          {isMenuOpen && <MenuOverlay onSectionClick={handleSectionClick} />}
        </AnimatePresence>

        <main>
          <Hero ref={heroRef} scrollY={scrollY} startAnimation={!isLoading} />
          <Suspense fallback={null}>
            <NewSong ref={newSongRef} isMenuOpen={isMenuOpen} />
            <Merch ref={merchRef} />
            <Contact ref={contactRef} />
          </Suspense>
        </main>
      </>
    </>
  );
}

export default App;

