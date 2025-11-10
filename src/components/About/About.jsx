// Plik: /src/components/About/About.jsx (ZAKTUALIZOWANY)

import React, { useState, useCallback, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import './About.css'; // Ten plik też zaraz zaktualizujemy
import { JellyDread } from './JellyDread';

// 1. Zaimportuj swoje 'head.png'
import headImg from '../../assets/head.png';

// 2. Wklejamy tu wszystkie 10 ciekawostek
const factsLeft = [
  "Pamiętasz Multigameplayguy? Tak, to byłem ja. Zaczynałem od gierek w 2010. Cała scena pluła, że 'jutuber' bierze się za muzykę. A potem? Moja 'Nowa Fala' wjechała na 1. miejsce OLiS. Szach-mat.",
  "Muzyka to jedno, ale YFL to co innego. Zbudowałem własną wytwórnię, która ogarnia wszystko – od rapu po gaming. Gramy po swojemu, nikt mi nie mówi, co mam robić.",
  "Mówili, że 'Trapstar' to będzie klapa. Skończyło się na podwójnej platynie. Potem 'Toxic' pyknął diament. Chyba jednak nie wiedzą, co mówią.",
  "W 2018 zrobiliśmy z Bedoesem 'Nowy Karnawał'. Ten numer był rekordem na polskim Spotify. To był moment, kiedy cała Polska usłyszała, że idzie nowe.",
  "Mało kto wie, ale zanim 'Nowa Fala' pozamiatała, wydałem mixtape 'Więcej dymu'. To były fundamenty pod to, co miało nadejść. Zawsze byłem krok przed nimi.",
];
const factsRight = [
  "Jak nie jestem w biurze, to znajdziesz mnie na Twitchu. Zwykle na #1 miejscu w kraju. Zaczynałem od gierek i nigdy tak naprawdę z tym nie skończyłem.",
  "Nagrywałem z Ninja'ą, największą gwiazdą Fortnite na świecie, zanim to było modne. Zawsze szukałem okazji, żeby wejść na wyższy level, globalnie.",
  "Wszyscy pytają: 'raper czy streamer?'. A ja pytam: 'czemu nie oba?'. Zbudowałem karierę na graniu, a potem drugą na rapie. Łączenie światów to mój styl.",
  "Wychowałem się na CS-ie. Zanim były miliony na koncie, były godziny na serwerach. To tam nauczyłem się rywalizacji i parcia do celu.",
  "YFL to nie tylko ciuchy i muzyka. To też esport. Zainwestowałem w drużyny, bo wiem, że gaming to przyszłość. A ja zawsze jestem tam, gdzie przyszłość.",
];

// 3. Pozycje startowe dla 7 dredów (musisz je dostosować 'na oko')
const dreadPositions = [
  // (Centrum jest teraz na x: 500)
  { x: 355, y: 400 }, // Lewy 1 (obniżone ~+30)
  { x: 395, y: 380 }, // Lewy 2
  { x: 445, y: 360 }, // Lewy 3
  { x: 485, y: 360 }, // Środek
  { x: 525, y: 360 }, // Prawy 1
  { x: 575, y: 380 }, // Prawy 2
  { x: 615, y: 400 }, // Prawy 3
];

function About({ externalOpacity }) {
  // Stan na to, które okienko jest widoczne (null, 'left', 'right')
  const [activeInfo, setActiveInfo] = useState(null);
  // Stan na wylosowany tekst
  const [infoText, setInfoText] = useState('');

  // Handler, który losuje tekst i pokazuje okienko
  const showInfo = useCallback((direction) => {
    if (direction === 'left') {
      const fact = factsLeft[Math.floor(Math.random() * factsLeft.length)];
      setInfoText(fact);
      setActiveInfo('left');
    } else if (direction === 'right') {
      const fact = factsRight[Math.floor(Math.random() * factsRight.length)];
      setInfoText(fact);
      setActiveInfo('right');
    }
  }, []); // Puste [], bo 'facts' się nie zmieniają

  // Handler do raportowania przeciągania
  const handleDragReport = (offsetX) => {
    // Jeśli już coś pokazujemy, nie rób nic
    if (activeInfo) return;

    if (offsetX < -100) {
      // Pociągnięto mocno w lewo
      showInfo('left');
    } else if (offsetX > 100) {
      // Pociągnięto mocno w prawo
      showInfo('right');
    }
  };

  // Handler, który chowa okienko po puszczeniu dreda
  const handleDragEnd = () => {
    setActiveInfo(null);
  };

  return (
    <motion.section
      className="about-section"
      style={{ opacity: externalOpacity }} // Nadal sterowane przez NewSong.jsx
    >
      
      {/* 1. Tło (Głowa) */}
      <div className="about-avatar-container">
        <img
          src={headImg}
          alt="Young Multi Head Outline"
          className="about-head"
        />

        {/* 2. Interaktywne Dredy */}
        {dreadPositions.map((pos, i) => (
          <motion.div
            key={i}
            className="jelly-dread-wrapper" // Nowa klasa
            style={{ 
              x: pos.x, // Ustawia pozycję X "szpilki"
              y: pos.y, // Ustawia pozycję Y "szpilki"
            }}
          >
            <JellyDread
              dreadId={`dread-gradient-${i}`} // ID jest nadal potrzebne
              onDragReport={handleDragReport}
              onDragEnd={handleDragEnd}
            >
              {/* === NOWOŚĆ: Przekazujemy definicję jako 'children' === */}
              <linearGradient
                id={`dread-gradient-${i}`} // ID musi pasować do dreadId
                gradientUnits="userSpaceOnUse"
                x1="0" y1="500" x2="0" y2="700"
                spreadMethod="pad"
                colorInterpolation="sRGB"
              >
                {/* Przyspieszony gradient: szybki czarny start, szybkie przejście do białego */}
                <stop offset="0%" stopColor="#000000" />
                <stop offset="20%" stopColor="#000000" />
                <stop offset="50%" stopColor="#ffffff" />
                <stop offset="100%" stopColor="#ffffff" />
              </linearGradient>
              {/* === KONIEC NOWOŚCI === */}
            </JellyDread>
          </motion.div>
        ))}
      </div>

      {/* 3. Wyskakujące okienka z ciekawostkami */}
      <AnimatePresence>
        {activeInfo && (
          <motion.div
            className={`about-info-box ${
              activeInfo === 'left' ? 'info-left' : 'info-right'
            }`}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
          >
            {infoText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* 4. Tytuł "O MNIE" (leży na wierzchu) */}
      <div className="about-content">
        <h1 className="about-title">O MNIE</h1>
        {/* Usunęliśmy stary tekst, bo teraz jest w okienkach */}
      </div>
    </motion.section>
  );
}

export default About;