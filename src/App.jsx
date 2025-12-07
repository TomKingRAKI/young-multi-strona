// Plik: /src/App.jsx

import React, { useState } from 'react';
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

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);

  // Scroll navigation values
  const START_GRAMO = 5000;
  const KONIEC_GRAMO = 10000;
  const MERCH_START = 13892;
  const CONTACT_START = 18330;

  const handleSectionClick = (sectionId) => {
    let targetScroll = 0;
    const vh = window.innerHeight;

    switch (sectionId) {
      case 'home':
        targetScroll = 0;
        break;
      case 'nowa-piosenka':
        targetScroll = vh;
        break;
      case 'dyskolgrafia':
        targetScroll = START_GRAMO + 660;
        break;
      case 'o-mnie':
        targetScroll = KONIEC_GRAMO + 1500;
        break;
      case 'merch':
        targetScroll = MERCH_START + 3000;
        break;
      case 'kontakt':
        targetScroll = CONTACT_START;
        break;
      default:
        targetScroll = 0;
    }

    window.scrollTo({ top: targetScroll });
    setTimeout(() => setIsMenuOpen(false), 300);
  };

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
        />

        <AnimatePresence mode='wait'>
          {isMenuOpen && <MenuOverlay onSectionClick={handleSectionClick} />}
        </AnimatePresence>

        <main>
          <Hero scrollY={scrollY} startAnimation={!isLoading} />
          <NewSong isMenuOpen={isMenuOpen} />
          <Merch />
          <Contact />
        </main>
      </>
    </>
  );
}

export default App;