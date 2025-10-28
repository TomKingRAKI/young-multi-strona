// Plik: /src/App.jsx

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero/Hero';
import Preloader from './components/Preloader/Preloader';
import NewSong from './components/NewSong/NewSong';
import Header from './components/Header/Header';
import MenuOverlay from './components/MenuOverlay/MenuOverlay';
import { motionValue } from 'framer-motion';

const globalScrollY = motionValue(0);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [headerTheme, setHeaderTheme] = useState('dark');
  const newSongRef = useRef(null);

  const [isMenuOpen, setIsMenuOpen] = useState(false);
  
  // ZMIANA 1: Dodajemy nowy stan, który "blokuje" zmianę motywu
  const [isThemeLocked, setIsThemeLocked] = useState(false);

  // ZMIANA 2: Funkcja otwierania teraz "blokuje" motyw na jasny
  const openMenu = () => {
    setIsMenuOpen(true);
    setIsThemeLocked(true); // Zablokuj motyw na 'light'
  };

  // ZMIANA 3: Funkcja zamykania tylko rozpoczyna animację
  const closeMenu = () => {
    setIsMenuOpen(false); // Rozpocznij animację 'exit'
    // Nie odblokowujemy motywu jeszcze!
  };

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      globalScrollY.set(window.scrollY);
      if (newSongRef.current) {
        const rect = newSongRef.current.getBoundingClientRect();
        if (rect.top < 100) { 
          setHeaderTheme('light');
        } else {
          setHeaderTheme('dark');
        }
      }
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  // ZMIANA 4: Logika motywu teraz sprawdza też blokadę
  // Motyw jest 'light' JEŚLI menu jest otwarte LUB motyw jest zablokowany
  const effectiveTheme = (isMenuOpen || isThemeLocked) ? 'light' : headerTheme;
  // -----------------------------------------------------------

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
      
      {/* ZMIANA 5: Dodajemy 'onExitComplete' */}
      {/* Ta funkcja odpali się, GDY animacja zamykania SIĘ ZAKOŃCZY */}
      <AnimatePresence 
        mode='wait' 
        onExitComplete={() => setIsThemeLocked(false)} // Odblokuj motyw
      >
        {isMenuOpen && <MenuOverlay />} 
      </AnimatePresence>
      
      {!isLoading && (
        <main>
          <Hero scrollY={globalScrollY} /> 
          <NewSong ref={newSongRef} />
        </main>
      )}
    </>
  );
}

export default App;