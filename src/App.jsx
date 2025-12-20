// Plik: /src/App.jsx

import React, { useState, useRef, useCallback, Suspense, lazy } from 'react';
import { AnimatePresence, useScroll } from 'framer-motion';

// Critical components - load immediately
import Hero from './components/Hero/Hero';
import Preloader from './components/Preloader/Preloader';
import Header from './components/Header/Header';
import MenuOverlay from './components/MenuOverlay/MenuOverlay';
// import CustomCursor from './components/CustomCursor/CustomCursor'; // DISABLED - uncomment to re-enable
import useAdaptiveFavicon from './hooks/useAdaptiveFavicon';
import head1Img from './assets/head1.avif'; // Explicit import for preload

// Lazy-loaded components - load when needed (below the fold)
const NewSong = lazy(() => import('./components/NewSong/NewSong'));
const Merch = lazy(() => import('./components/Merch/Merch'));
const Contact = lazy(() => import('./components/Contact/Contact'));
const NotFound = lazy(() => import('./components/NotFound/NotFound'));

import { PerformanceProvider } from './context/PerformanceContext';

function App() {
  // === PRELOAD CRITICAL CHUNKS ===
  // Start fetching these bundles immediately, even if they are suspended.
  // This ensures that when the Preloader finishes, the code is already here.
  React.useEffect(() => {
    import('./components/NewSong/NewSong');
    import('./components/Merch/Merch');
    import('./components/Contact/Contact');
    import('./components/NotFound/NotFound');
  }, []);

  return (
    <PerformanceProvider>
      <AppContent />
    </PerformanceProvider>
  );
}

function AppContent() {
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
      window.scrollTo({ top: 0, behavior: 'auto' });
      setTimeout(() => setIsMenuOpen(false), 300);
      return;
    }

    // KONTAKT scrolls to very bottom of page
    if (sectionId === 'kontakt') {
      window.scrollTo({ top: document.body.scrollHeight, behavior: 'auto' });
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
          scrollPosition = newSongTop;
          break;
        case 'dyskolgrafia':
          scrollPosition = newSongTop + (newSongHeight * 0.35);
          break;
        case 'o-mnie':
          scrollPosition = newSongTop + (newSongHeight * 0.70);
          break;
        case 'merch':
          if (merchRef?.current) {
            scrollPosition = merchRef.current.offsetTop;
          }
          break;
        default:
          scrollPosition = 0;
      }

      // TELEPORT: Instant scroll as requested
      window.scrollTo({ top: scrollPosition, behavior: 'auto' });
    }

    // Close menu with delay to allow exit animation
    setTimeout(() => setIsMenuOpen(false), 300);
  }, []);

  // === ASSET PRELOADING ===
  React.useEffect(() => {
    // 1. Code Splitting Preload
    import('./components/NewSong/NewSong');
    import('./components/Merch/Merch');
    import('./components/Contact/Contact');
    import('./components/NotFound/NotFound');

    // 2. Heavy Assets Preload
    const preloadImage = (src) => {
      const img = new Image();
      img.src = src;
    };

    // Preload About Head
    preloadImage(head1Img);

    // Explicitly fetching the video to force buffer
    const video = document.createElement('video');
    video.src = '/smoke-transition.mp4';
    video.preload = 'auto';
    video.load();

  }, []);

  const handlePreloaderComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {/* CUSTOM CURSOR - DISABLED
      <CustomCursor />
      */}

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
