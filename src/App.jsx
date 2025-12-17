// Plik: /src/App.jsx

import React, { useState, useRef, useCallback } from 'react';
import { AnimatePresence, useScroll } from 'framer-motion';

// Importy komponentów
import Hero from './components/Hero/Hero';
import Preloader from './components/Preloader/Preloader';
import NewSong from './components/NewSong/NewSong';
import Header from './components/Header/Header';
import MenuOverlay from './components/MenuOverlay/MenuOverlay';
import Merch from './components/Merch/Merch';
import Contact from './components/Contact/Contact';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const { scrollY } = useScroll();

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
          <NewSong ref={newSongRef} isMenuOpen={isMenuOpen} />
          <Merch ref={merchRef} />
          <Contact ref={contactRef} />
        </main>
      </>
    </>
  );
}

export default App;
