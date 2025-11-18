// Plik: /src/App.jsx

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero/Hero';
import Preloader from './components/Preloader/Preloader';
import NewSong from './components/NewSong/NewSong';
import Header from './components/Header/Header';
import MenuOverlay from './components/MenuOverlay/MenuOverlay';
import Merch from './components/Merch/Merch';
import { motionValue } from 'framer-motion';

const globalScrollY = motionValue(0);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [headerTheme, setHeaderTheme] = useState('dark');
  const newSongRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // Tu była logika z 'isThemeLocked', która jest OK
  const [isThemeLocked, setIsThemeLocked] = useState(false);

  const openMenu = () => {
    setIsMenuOpen(true);
    setIsThemeLocked(true); // Zablokuj motyw na 'light'
  };

  const closeMenu = () => {
    setIsMenuOpen(false); // Rozpocznij animację 'exit'
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, []);

  // OPTYMALIZACJA: Aktualizujemy globalScrollY i sprawdzamy pozycję dla motywu Hero
  useEffect(() => {
    const handleScroll = () => {
      globalScrollY.set(window.scrollY);
      
      // Sprawdzamy czy jesteśmy w sekcji Hero (przed NewSong)
      // Hero ma height: 100vh, więc gdy scrollY < viewportHeight, jesteśmy w Hero
      const viewportHeight = window.innerHeight;
      if (window.scrollY < viewportHeight * 0.9) {
        // Jesteśmy w Hero - ustawiamy motyw na 'dark' (czarne ikony)
        if (headerTheme !== 'dark' && !isThemeLocked) {
          setHeaderTheme('dark');
        }
      }
    };
    
    // Sprawdzamy też przy załadowaniu
    handleScroll();
    
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [headerTheme, isThemeLocked]);

  // Logika motywu bez 'themeOverride'
  const effectiveTheme = (isMenuOpen || isThemeLocked) ? 'light' : headerTheme;

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>
      
      <Header 
        headerTheme={effectiveTheme} 
        onMenuClick={openMenu}
        onCloseClick={closeMenu}
        isMenuOpen={isMenuOpen}
      />
      
      <AnimatePresence 
        mode='wait' 
        onExitComplete={() => setIsThemeLocked(false)} // Odblokuj motyw
      >
        {isMenuOpen && <MenuOverlay />} 
      </AnimatePresence>
      
      {!isLoading && (
        <main>
          <Hero scrollY={globalScrollY} /> 
          {/* Przekazujemy tylko ref, bez 'setThemeOverride' */}
          <NewSong 
            ref={newSongRef} 
            setHeaderTheme={setHeaderTheme} 
            isMenuOpen={isMenuOpen}
          />
          <Merch />
        </main>
      )}
    </>
  );
}

export default App;