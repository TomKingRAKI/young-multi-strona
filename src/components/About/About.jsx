import React, { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence, useMotionValue } from 'framer-motion';
import './About.css';
import { JellyDread } from './JellyDread';
import { SpectralGuide } from './SpectralGuide';
// 1. Importujemy nowy komponent twarzy
import { FaceFeatures } from './FaceFeatures';
import { SpeechBubble } from './SpeechBubble';

import headImg from '../../assets/head1.png';

// (Twoje tablice factsLeft i factsRight pozostają bez zmian...)
const factsLeft = [
  "Nazywam się Michał Rychlik, ale wszyscy znają mnie jako Young Multi — zaczynałem jako YouTuber i gamer.",
  "W 2017 wypuściłem mój pierwszy album 'Nowa Fala' i wskoczył od razu na szczyt OLiS.",
  "Zanim zacząłem rapować, byłem jednym z większych gamingowych twórców na polskim YouTube.",
  "Urodziłem się w Głubczycach, w małej miejscowości, z której ruszyłem w stronę muzyki.",
  "To ja założyłem Young Family Label — miejsce, w którym działa też kilku młodych artystów.",
];

const factsRight = [
  "Moja zmiana z YouTubera na rapera wywołała dużo hejtu, ale i tak zrobiłem swoje.",
  "Styl, który robiłem, był mocno inspirowany trapem z USA — i to ludzi najbardziej podzieliło.",
  "Zaczynałem muzykę totalnie sam — zero kontaktów w branży, tylko ja, mikrofon i internet.",
  "Mój przydomek 'Multi' to skrót od dawnej nazwy kanału — MultiGameplayGuy.",
  "Wielu raperów mnie krytykowało, ale finalnie to ja otworzyłem drzwi dla nowych twórców z YouTube.",
];

// (Twoje pozycje dredów...)
const dreadPositions = [
  { x: 355, y: 400 }, { x: 395, y: 380 }, { x: 445, y: 360 },
  { x: 485, y: 360 }, { x: 525, y: 360 }, { x: 575, y: 380 },
  { x: 615, y: 400 },
];

function About({ externalOpacity }) {
  // --- DETEKCJA MOBILE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- LOGIKA MOBILE (Carousel) ---
  const [mobileFactIndex, setMobileFactIndex] = useState(0);
  // Łączymy fakty w jedną tablicę
  const mobileFacts = [...factsLeft, ...factsRight];

  useEffect(() => {
    if (!isMobile) return;
    const interval = setInterval(() => {
      setMobileFactIndex((prev) => (prev + 1) % mobileFacts.length);
    }, 4000); // Zmiana co 4 sekundy
    return () => clearInterval(interval);
  }, [isMobile, mobileFacts.length]);


  // --- LOGIKA DESKTOP (Zachowana) ---
  const [activeInfo, setActiveInfo] = useState(null);
  const [infoText, setInfoText] = useState('');
  // Nowy stan: czy tekst się pisze?
  const [isTyping, setIsTyping] = useState(false);

  // --- NOWE STANY DLA INTERAKCJI TWARZY ---
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [isIdle, setIsIdle] = useState(false); // Czy użytkownik jest nieaktywny?
  const idleTimerRef = useRef(null); // Referencja do timera

  // MotionValue dla duszka (steruje offsetem wybranego dreda)
  const ghostDreadOffsetX = useMotionValue(0);
  const ghostDreadOffsetY = useMotionValue(0);
  // Obiekt, który przekażemy do JellyDread i SpectralGuide
  // Używamy useMemo lub po prostu tworzymy obiekt, ale JellyDread oczekuje {x, y}
  // Ważne: JellyDread używa .get() i .onChange() na x i y, więc to muszą być MotionValues.
  const ghostDreadOffset = { x: ghostDreadOffsetX, y: ghostDreadOffsetY };

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
    if (isMobile) return; // Nie obsługujemy na mobile
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
    // resetIdleTimer();
  };

  // Dodajmy zamykanie dymka po kliknięciu w tło (sekcję)
  const handleSectionClick = () => {
    if (isMobile) return;
    if (activeInfo) {
      setActiveInfo(null);
      setIsTyping(false);
    }
  };

  // Start timera po załadowaniu komponentu
  useEffect(() => {
    if (isMobile) return;
    resetIdleTimer();
    // Sprzątanie timera przy odmontowaniu
    return () => { if (idleTimerRef.current) clearTimeout(idleTimerRef.current); };
  }, [resetIdleTimer, isMobile]);


  // --- RENDEROWANIE ---

  // 1. WIDOK MOBILNY
  if (isMobile) {
    return (
      <section className="about-section mobile-view" style={{ opacity: externalOpacity }}>
        {/* Góra: Tytuł */}
        <div className="mobile-title-container">
          <h1 className="about-title mobile">O MNIE</h1>
        </div>

        {/* Środek: Carousel z faktami */}
        <div className="mobile-carousel-container">
          <AnimatePresence mode="wait">
            <motion.div
              key={mobileFactIndex}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.5 }}
              className="mobile-fact-text"
            >
              {mobileFacts[mobileFactIndex]}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Dół: Statyczna głowa */}
        <img
          src={headImg}
          alt="Young Multi"
          className="about-head mobile-head"
        />
      </section>
    );
  }

  // 2. WIDOK DESKTOP (Oryginalny)
  return (
    <motion.section
      className="about-section"
      style={{ opacity: externalOpacity }}
      onMouseMove={handleMouseMove}
      onClick={handleSectionClick} // Kliknięcie w tło zamyka dymek
    >

      {/* 1. WARSTWA TŁA: TYTUŁ "O MNIE" */}
      {/* Przeniesiony na początek, żeby był "za" głową */}
      <div className="about-content">
        <h1 className="about-title">O MNIE</h1>
      </div>

      {/* 2. WARSTWA ŚRODKOWA: GŁOWA I DREDY */}
      <div className="about-avatar-container">
        {/* A. Zdjęcie głowy */}
        <img
          src={headImg}
          alt="Young Multi"
          className="about-head"
          style={{ zIndex: 1 }}
        />

        {/* B. Komponent Twarzy (Oczy i Usta) */}
        <FaceFeatures
          mousePos={mousePos}
          mouthState={currentMouthState}
        />

        {/* C. Interaktywne Dredy */}
        {dreadPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="jelly-dread-wrapper"
            style={{ x: pos.x, y: pos.y, zIndex: 10 }}
          >
            <JellyDread
              dreadId={`dread-gradient-${i}`}
              onDragStart={handleDragStart}
              onDragReport={handleDragReport}
              onDragEnd={handleDragEnd}
              ghostOffset={i === 3 ? ghostDreadOffset : null} // Tylko dred nr 3 ma ducha
            >
              {/* Definicja gradientu przekazywana jako children (dla kompatybilności z Twoim plikiem) */}
              <linearGradient
                id={`dread-gradient-${i}`}
                gradientUnits="userSpaceOnUse"
                x1="0" y1="500" x2="0" y2="700"
                spreadMethod="pad"
                colorInterpolation="sRGB"
              >
                <stop offset="0%" stopColor="#000000" />
                <stop offset="20%" stopColor="#000000" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
            </JellyDread>
          </motion.div>
        ))}

        {/* D. Spectral Guide (Duszek) */}
        <AnimatePresence>
          {!activeInfo && isIdle && !isMobile && (
            <SpectralGuide
              startPos={{
                x: dreadPositions[3].x - 20,
                y: dreadPositions[3].y + 120 // +140 to offset do końcówki (initialTipY)
              }}
              ghostOffset={ghostDreadOffset}
            />
          )}
        </AnimatePresence>
      </div>

      {/* 3. WARSTWA WIERZCHNIA: DYMEK */}
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

    </motion.section>
  );
}

export default About;