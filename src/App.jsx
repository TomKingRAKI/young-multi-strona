// Plik: /src/App.jsx
// TO JEST POPRAWNA WERSJA Z LOGIKĄ 'useEffect'

import React, { useState, useEffect, useRef } from 'react';
import { AnimatePresence } from 'framer-motion';
import Hero from './components/Hero/Hero';
import Preloader from './components/Preloader/Preloader';
import NewSong from './components/NewSong/NewSong';
import Header from './components/Header/Header';
import { motionValue } from 'framer-motion';

const globalScrollY = motionValue(0);

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [headerTheme, setHeaderTheme] = useState('dark'); // Zaczyna jako 'dark' (czarne ikony)
  const newSongRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 2000); 
    return () => clearTimeout(timer);
  }, []);

  // Ten useEffect śledzi scroll
  useEffect(() => {
    
    const handleScroll = () => {
      globalScrollY.set(window.scrollY);
      
      if (newSongRef.current) {
        const rect = newSongRef.current.getBoundingClientRect();
        
        // Jeśli góra sekcji NewSong jest 100px (lub mniej) od góry okna...
        if (rect.top < 100) { 
          setHeaderTheme('light'); // ...zmień motyw na 'light' (białe ikony)
        } else {
          setHeaderTheme('dark'); // ...inaczej bądź 'dark' (czarne ikony)
        }
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []); // Uruchom tylko raz


  return (
    <>
      <AnimatePresence>
        {isLoading && <Preloader />}
      </AnimatePresence>
      
      <Header headerTheme={headerTheme} />
      
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