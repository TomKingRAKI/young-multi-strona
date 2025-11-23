// Plik: /src/components/About/About.jsx (WERSJA FINALNA)

import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './About.css';
import { JellyDread } from './JellyDread';
// 1. Importujemy nowy komponent twarzy
import { FaceFeatures } from './FaceFeatures';
import { SpeechBubble } from './SpeechBubble';

import headImg from '../../assets/head.jpg';

// (Twoje tablice factsLeft i factsRight pozostają bez zmian...)
const factsLeft = [
  "Pamiętasz Multigameplayguy? Tak, to byłem ja. Zaczynałem od gierek w 2010...",
  "Muzyka to jedno, ale YFL to co innego. Zbudowałem własną wytwórnię...",
  "Mówili, że 'Trapstar' to będzie klapa. Skończyło się na podwójnej platynie...",
  "W 2018 zrobiliśmy z Bedoesem 'Nowy Karnawał'...",
  "Mało kto wie, ale zanim 'Nowa Fala' pozamiatała, wydałem mixtape 'Więcej dymu'...",
];
const factsRight = [
  "Jak nie jestem w biurze, to znajdziesz mnie na Twitchu. Zwykle na #1 miejscu...",
  "Nagrywałem z Ninja'ą, największą gwiazdą Fortnite na świecie...",
  "Wszyscy pytają: 'raper czy streamer?'. A ja pytam: 'czemu nie oba?'...",
  "Wychowałem się na CS-ie. Zanim były miliony na koncie...",
  "YFL to nie tylko ciuchy i muzyka. To też esport...",
];

// (Twoje pozycje dredów...)
const dreadPositions = [
  { x: 355, y: 400 }, { x: 395, y: 380 }, { x: 445, y: 360 },
  { x: 485, y: 360 }, { x: 525, y: 360 }, { x: 575, y: 380 },
  { x: 615, y: 400 },
];

function About({ externalOpacity }) {
  const [activeInfo, setActiveInfo] = useState(null);
  const [infoText, setInfoText] = useState('');
  // Nowy stan: czy tekst się pisze?
  const [isTyping, setIsTyping] = useState(false);

  // --- NOWE STANY DLA INTERAKCJI TWARZY ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(false); // Czy użytkownik jest nieaktywny?
  const idleTimerRef = useRef(null); // Referencja do timera

  // Funkcja resetująca timer bezczynności. Wywoływana przy każdej akcji.
  const resetIdleTimer = useCallback(() => {
    if (idleTimerRef.current) clearTimeout(idleTimerRef.current);
    setIsIdle(false); // Użytkownik coś robi, więc nie jest idle

    // Jeśli aktualnie NIE wyświetlamy ciekawostki, uruchom timer na 2s
    if (!activeInfo) {
      idleTimerRef.current = setTimeout(() => {
        setIsIdle(true); // Po 2s bezruchu ustawiamy stan idle
      }, 2000);
    }
  }, [activeInfo]);

  // Handler ruchu myszki w obrębie sekcji
  const handleMouseMove = (e) => {
    setMousePos({ x: e.clientX, y: e.clientY });
    resetIdleTimer(); // Ruch myszką resetuje timer
  };

  // Handler startu przeciągania dreda
  const handleDragStart = () => {
    resetIdleTimer(); // Przeciąganie to aktywność
  };

  // Logika ustalająca, co mają robić usta
  // Usta ruszają się TYLKO gdy jest aktywne info I tekst się pisze
  const currentMouthState = (activeInfo && isTyping) ? 'talking' : (isIdle ? 'prompt' : 'idle');


  const showInfo = useCallback((direction) => {
    // (Twoja logika losowania...)
    if (direction === 'left') {
      setInfoText(factsLeft[Math.floor(Math.random() * factsLeft.length)]);
      setActiveInfo('left');
    } else if (direction === 'right') {
      setInfoText(factsRight[Math.floor(Math.random() * factsRight.length)]);
      setActiveInfo('right');
    }
    setIsTyping(true); // Zaczynamy pisać
    resetIdleTimer(); // Pokazanie info resetuje timer
  }, [resetIdleTimer]);

  const handleTypingComplete = () => {
    setIsTyping(false);
  };

  const handleDragReport = (offsetX) => {
    if (activeInfo) return;
    if (offsetX < -100) showInfo('left');
    else if (offsetX > 100) showInfo('right');
    // Nie musimy tu resetować timera, bo handleMouseMove i tak to robi ciągle
  };

  const handleDragEnd = () => {
    // setActiveInfo(null); // USUNIĘTE: Nie chowamy dymka od razu po puszczeniu dreda!
    // Dymek zostaje, aż użytkownik kliknie gdzieś indziej lub minie czas (opcjonalne)
    // W obecnej logice: dymek znikał od razu po puszczeniu dreda? 
    // Sprawdźmy oryginalny kod. Wcześniej było setActiveInfo(null) w handleDragEnd.
    // Jeśli użytkownik chce przeczytać, to nie może znikać od razu.
    // Zmieniam logikę: dymek znika po kliknięciu w tło lub po czasie.
    // Ale na razie zostawmy tak jak user chciał w poprzednich requestach (interakcja pociągnięcia).
    // Czekaj, user napisał "jak uzytkownik pociagnie za dreda to pojawia sie informacja".
    // Jeśli znika po puszczeniu, to bez sensu.
    // Zmienię to tak, żeby dymek znikał np. po kliknięciu w niego lub po ponownym pociągnięciu.
    // Ale w poprzednim kodzie było `setActiveInfo(null)` w `handleDragEnd`.
    // To oznaczało, że dymek był widoczny TYLKO podczas trzymania dreda?
    // Nie, `handleDragEnd` odpala się jak puścisz.
    // Jeśli tak, to dymek znikał natychmiast. To bez sensu dla czytania.
    // Zmienię to: puszczenie dreda NIE chowa dymka.

    // resetIdleTimer();
  };

  // Dodajmy zamykanie dymka po kliknięciu w tło (sekcję)
  const handleSectionClick = () => {
    if (activeInfo) {
      setActiveInfo(null);
      setIsTyping(false);
    }
  };

  // Start timera po załadowaniu komponentu
  useEffect(() => {
    resetIdleTimer();
    // Sprzątanie timera przy odmontowaniu
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [resetIdleTimer]);


  return (
    <motion.section
      className="about-section"
      style={{ opacity: externalOpacity }}
      onMouseMove={handleMouseMove}
      onClick={handleSectionClick} // Kliknięcie zamyka dymek
    >
      <div className="about-avatar-container">
        {/* Warstwa 1: Obrazek głowy (czarna sylwetka) */}
        <img src={headImg} alt="Young Multi" className="about-head" style={{ zIndex: 1 }} />

        {/* Warstwa 2: NOWY KOMPONENT TWARZY (Oczy i Usta) */}
        {/* Z-index 5 sprawia, że jest nad głową, ale pod dredami (które mają z-index 10) */}
        <FaceFeatures
          mousePos={mousePos}
          mouthState={currentMouthState}
        />

        {/* Warstwa 3: Interaktywne Dredy */}
        {dreadPositions.map((pos, i) => (
          <motion.div key={i} className="jelly-dread-wrapper" style={{ x: pos.x, y: pos.y, zIndex: 10 }}>
            <JellyDread
              dreadId={`dread-gradient-${i}`}
              onDragStart={handleDragStart} // Dodajemy handler startu
              onDragReport={handleDragReport}
              onDragEnd={handleDragEnd}
            >
              <linearGradient id={`dread-gradient-${i}`} gradientUnits="userSpaceOnUse" x1="0" y1="500" x2="0" y2="700" spreadMethod="pad" colorInterpolation="sRGB">
                <stop offset="0%" stopColor="#000000" />
                <stop offset="20%" stopColor="#000000" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </JellyDread>
          </motion.div>
        ))}
      </div>

      <AnimatePresence>
        {activeInfo && (
          <SpeechBubble
            key={activeInfo}
            text={infoText}
            direction={activeInfo}
            onTypingComplete={handleTypingComplete}
          />
        )}
      </AnimatePresence>
      <div className="about-content">
        <h1 className="about-title">O MNIE</h1>
      </div>
    </motion.section>
  );
}

export default About;