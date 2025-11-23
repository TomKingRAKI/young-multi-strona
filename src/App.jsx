// Plik: /src/App.jsx

import React, { useState, useEffect } from 'react';
import { AnimatePresence, useScroll, useMotionValueEvent } from 'framer-motion';

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
  const [headerTheme, setHeaderTheme] = useState('light');

  const { scrollY } = useScroll();

  // === MIEJSCE NA TWOJE LICZBY ===
  // Wpisz tutaj liczby, które odczytasz z konsoli:
  const START_GRAMO = 5000; // <--- WPISZ TU POCZĄTEK BIAŁEGO GRAMOFONU (np. 5500)
  const KONIEC_GRAMO = 10000; // <--- WPISZ TU KONIEC GRAMOFONU / START ABOUT (np. 11000)

  // Reszta liczb, które już podałeś:
  const MERCH_START = 13892;
  const CONTACT_START = 18330;


  useMotionValueEvent(scrollY, "change", (latest) => {
    const vh = window.innerHeight;

    // Pokaż aktualną pozycję w konsoli, żebyś mógł spisać liczby
    console.log("AKTUALNY SCROLL:", Math.round(latest));

    // 1. HERO (Szare) -> LIGHT
    if (latest < vh * 0.9) {
      if (headerTheme !== 'light') setHeaderTheme('light');
    }

    // 2. NEW SONG: INDUSTRIAL (Ciemne) -> DARK
    // Od końca Hero do początku Gramofonu
    else if (latest >= vh * 0.9 && latest < START_GRAMO) {
      if (headerTheme !== 'dark') setHeaderTheme('dark');
    }

    // 3. NEW SONG: GRAMOPHONE (Białe) -> LIGHT  <--- TU JEST NAPRAWA
    else if (latest >= START_GRAMO && latest < KONIEC_GRAMO) {
      if (headerTheme !== 'light') setHeaderTheme('light');
    }

    // 4. NEW SONG: ABOUT (Ciemne) -> DARK
    // Od końca Gramofonu do początku Merchu
    else if (latest >= KONIEC_GRAMO && latest < MERCH_START) {
      if (headerTheme !== 'dark') setHeaderTheme('dark');
    }

    // 5. MERCH (Białe wideo) -> LIGHT
    else if (latest >= MERCH_START && latest < CONTACT_START) {
      if (headerTheme !== 'light') setHeaderTheme('light');
    }

    // 6. CONTACT (Ciemne) -> DARK
    else {
      if (headerTheme !== 'dark') setHeaderTheme('dark');
    }
  });

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  const currentTheme = isMenuOpen ? 'dark' : headerTheme;

  // --- NOWA FUNKCJA NAWIGACJI ---
  const handleSectionClick = (sectionId) => {
    let targetScroll = 0;
    const vh = window.innerHeight;

    switch (sectionId) {
      case 'home':
        targetScroll = 0;
        break;
      case 'nowa-piosenka':
        targetScroll = vh; // Start of New Song (after Hero)
        break;
      case 'dyskolgrafia':
        targetScroll = START_GRAMO + 660; // Offset to reach full view
        break;
      case 'o-mnie':
        targetScroll = KONIEC_GRAMO + 1500; // Offset to skip reveal animation
        break;
      case 'merch':
        targetScroll = MERCH_START + 3000; // Offset to avoid white screen
        break;
      case 'kontakt':
        targetScroll = CONTACT_START;
        break;
      default:
        targetScroll = 0;
    }

    // 1. Scroll to target
    window.scrollTo({
      top: targetScroll,

    });

    // 2. Wait for scroll to finish (approx) then close menu
    // Smooth scroll duration depends on distance, but 1200ms is usually enough for long scrolls.
    setTimeout(() => {
      setIsMenuOpen(false);
    }, 300);
  };

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>

      <Header
        theme={currentTheme}
        onMenuClick={openMenu}
        onCloseClick={closeMenu}
        isMenuOpen={isMenuOpen}
      />

      <AnimatePresence mode='wait'>
        {isMenuOpen && <MenuOverlay onSectionClick={handleSectionClick} />}
      </AnimatePresence>

      {!isLoading && (
        <main>
          <Hero scrollY={scrollY} />
          <NewSong isMenuOpen={isMenuOpen} />
          <Merch />
          <Contact />
        </main>
      )}
    </>
  );
}

export default App;