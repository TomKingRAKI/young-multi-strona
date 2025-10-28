// Plik: /src/App.jsx

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero/Hero';
import Preloader from './components/Preloader/Preloader';
import NewSong from './components/NewSong/NewSong';
import Header from './components/Header/Header';
import MenuOverlay from './components/MenuOverlay/MenuOverlay'; // 1. Importujemy Menu
import { motionValue } from 'framer-motion';

const globalScrollY = motionValue(0);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [headerTheme, setHeaderTheme] = useState('dark');
  const newSongRef = useRef(null);

  // --- ZMIANA 1: Dodajemy "włącznik" menu ---
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Funkcje do otwierania i zamykania
  const openMenu = () => setIsMenuOpen(true);
  const closeMenu = () => setIsMenuOpen(false);
  // ------------------------------------------

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

  // --- ZMIANA 2: Wymuszamy biały header, gdy menu jest otwarte ---
  // Jeśli menu jest otwarte, 'effectiveTheme' zawsze będzie 'light' (białe ikony).
  // Jeśli jest zamknięte, będzie działać logika scrollowania.
  const effectiveTheme = isMenuOpen ? 'light' : headerTheme;
  // -----------------------------------------------------------

  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>
      
      {/* 3. Przekazujemy 'effectiveTheme' i funkcję 'openMenu' */}
      <Header 
        headerTheme={effectiveTheme} 
        onMenuClick={openMenu}    // Funkcja do otwierania
        onCloseClick={closeMenu}  // Funkcja do zamykania
        isMenuOpen={isMenuOpen}   // Stan (true/false)
      />
      
      {/* 4. Renderujemy MenuOverlay tylko, gdy 'isMenuOpen' jest true */}
      {/* (Później dodamy tu AnimatePresence dla animacji) */}
      {isMenuOpen && <MenuOverlay onCloseClick={closeMenu} />}
      
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