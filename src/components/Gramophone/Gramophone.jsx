// Plik: /src/components/Gramophone/Gramophone.jsx (NOWA WERSJA - ZOPTYMALIZOWANA)

import React, { useState, useEffect } from 'react';
import { useTransform, motion } from 'framer-motion';
import './Gramophone.css';
import ScrollStack, { ScrollStackItem } from '../ScrollStack/ScrollStack';

import nowaFalaCover from '../../assets/NowafalaCover.jpg';
import trapstarCover from '../../assets/trapstarCover.jpg';
import tadCover from '../../assets/tadCover.jpg';
import toxicCover from '../../assets/toxicCover.jpg';
import { Boxes } from '../Boxes/Boxes';


// === ZMIANA 2: Aktualizujemy dane ===
// Dodałem 'styleId' do dynamicznych styli, okładki, opisy i tracklisty
const albums = [
  {
    id: 1,
    title: 'NOWA FALA',
    year: '2017',
    styleId: 'nowa-fala',
    cover: nowaFalaCover,
    desc: 'Oficjalny debiut, który zadebiutował na 1. miejscu OLiS. Przełomowy moment przejścia z YouTube do rapu. Album finalnie pokrył się Platyną, a single takie jak "Plecak" czy "Pytasz mnie" stały się wiralami.',
    tracklist: ['1. Nowa Fala', '2. Pytasz mnie', '3. Plecak', '4. Pogba', '5. Diamenty (feat. Bedoes)', '6. ....']
  },
  {
    id: 2,
    title: 'TRAPSTAR',
    year: '2018',
    styleId: 'trapstar',
    cover: trapstarCover,
    desc: 'Album ugruntowujący pozycję na scenie newschoolu. Dojrzalsze brzmienie i mocni goście – m.in. Peja (na tracku "Podziały"), Bedoes i Żabson. Projekt ponownie trafił na szczyt listy OLiS.',
    tracklist: ['1. Trapstar', '2. Skrzydła', '3. Podziały (feat. Peja)', '4. Kosmita (feat. Żabson)', '5. Kiedy odejdę (feat. Bedoes)', '6. ....']
  },
  {
    id: 3,
    title: 'TRAP AFTER DEATH',
    year: '2019',
    styleId: 'tad',
    cover: tadCover,
    desc: 'Mroczny, spójny materiał wyprodukowany w całości przez Fast Life Sharky’ego. Mniej komercyjny, nastawiony na cięższy trap i eksperymenty. Gościnnie m.in. Żabson i Aleshen.',
    tracklist: ['1. 9 żyć', '2. Skate 3', '3. Torba', '4. Modelki (feat. Aleshen)', '5. K4fle! (feat. Żabson)', '6. ....']
  },
  {
    id: 4,
    title: 'TOXIC',
    year: '2021',
    styleId: 'toxic',
    cover: toxicCover,
    desc: 'Wielki powrót w stylu rage/hyperpop po przerwie wydawniczej. Album uzyskał status Platynowej Płyty. Gościnnie pojawili się m.in. White 2115, White Widow i Miszel.',
    tracklist: ['1. Toxic Luv (feat. White 2115)', '2. Bez serca', '3. Beksa', '4. Oscar (feat. White Widow)', '5. Sól', '6. ....']
  },
];

function Gramophone({ contentProgress, isMenuOpen, style }) { // ZMIANA: Przyjmujemy 'style' z propsów

  // --- RESPANSYWNOŚĆ (Mobile Check) ---
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    // Sprawdzamy tylko po zamontowaniu komponentu (client-side)
    setIsMobile(window.innerWidth < 768);

    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Animacja zmiany perspektywy z 3D na 2D po pokazaniu ostatniej karty (toxic)
  // ScrollStack używa contentProgress w zakresie [0.65, 1.0]
  // Karta TOXIC pojawia się jako ostatnia, więc animacja zaczyna się dopiero przy 0.95
  // aby upewnić się, że karta jest już w pełni widoczn

  const perspectiveProgress = useTransform(
    contentProgress,
    [0.59, 0.65], // Zaczyna się bardzo późno, gdy TOXIC jest już widoczny
    [0, 1]
  );

  // Wartości 3D (start)
  const skewX3D = -25;
  const skewY3D = 7;
  const scale3D = 0.85;

  // Wartości 2D (koniec)
  const skewX2D = 0;
  const skewY2D = 0;
  const scale2D = 1;

  // Interpolacja wartości - używamy useTransform zamiast state
  const skewX = useTransform(
    perspectiveProgress,
    [0, 1],
    [skewX3D, skewX2D]
  );
  const skewY = useTransform(
    perspectiveProgress,
    [0, 1],
    [skewY3D, skewY2D]
  );
  const scale = useTransform(
    perspectiveProgress,
    [0, 1],
    [scale3D, scale2D]
  );

  // Animacja odwracania karty Toxic - zaczyna się po zakończeniu animacji perspektywy
  // contentProgress w zakresie [0.95, 0.98] dla animacji flip
  const flipProgress = useTransform(
    contentProgress,
    [0.61, 0.65], // Flip kończy się wcześniej, aby zostawić miejsce na zoom
    [0, 1]
  );

  // Rotacja Y dla efektu flip (0deg -> 180deg)
  const flipRotationY = useTransform(flipProgress, [0, 1], [0, 180]);

  // Opacity dla frontu i tyłu karty
  const frontOpacity = useTransform(flipProgress, [0, 0.5, 1], [1, 1, 0]);
  const backOpacity = useTransform(flipProgress, [0, 0.5, 1], [0, 0, 1]);

  // Animacja przybliżania - tylko do sterowania opacity
  const zoomProgress = useTransform(
    contentProgress,
    [0.64, 0.8],
    [0, 1]
  );

  // OPTYMALIZACJA: Używamy motion.div z bezpośrednimi motion values zamiast state + useMotionValueEvent
  // To eliminuje re-rendery i działa bezpośrednio z motion values

  return (
    <motion.div
      className="Gramophone-section"
      style={style}
    >

      <motion.div
        className="gramophone-background-boxes"
        style={{
          skewX: skewX,
          skewY: skewY,
          scale: scale,
          x: '0%',
          y: '0%',
          z: 0,

        }}
      >
        <Boxes />
      </motion.div>
      <motion.div
        className="gramophone-content-world"
        style={{
          skewX: skewX,
          skewY: skewY,
          scale: scale, // ZMIANA: Już nie łączymy skali, główna skala jest na Gramophone-section
          x: '0%',

        }}
      >

        <h1 className="gramophone-title-static">
          DYSKOGRAFIA
        </h1>

        <ScrollStack
          className="gramophone-scroller"
          itemDistance={20}
          itemStackDistance={isMobile ? 60 : 20} // Większy odstęp na mobile
          baseScale={0.9}
          stackPosition="0%"
          scaleEndPosition={isMobile ? "15%" : "80%"} // Wcześniejszy start animacji na mobile
          scrollProgress={contentProgress}
        >
          {/* === ZMIANA 3: Nowa struktura wewnątrz karty === */}
          {albums.map((album) => (
            <ScrollStackItem
              key={album.id}
              // Dodajemy dynamiczną klasę CSS dla stylów
              itemClassName={`album-card album-style-${album.styleId}`}
            >
              {/* 1. Nagłówek (Tytuł + Data) */}
              <div className="album-header">
                <h2>{album.title}</h2>
                <p>{album.year}</p>
              </div>

              {/* 2. Główna treść (3 kolumny) */}
              <div className="album-content">
                <div className="album-desc">
                  <h3>Opis</h3>
                  <p>{album.desc}</p>
                </div>

                <div className="album-cover">
                  {album.id === 4 ? (
                    // Specjalna animacja flip dla karty Toxic
                    <div className="album-cover-flip-container">
                      {/* Front - okładka albumu */}
                      <motion.div
                        className="album-cover-flip-front"
                        style={{
                          rotateY: flipRotationY,
                          opacity: frontOpacity,
                        }}
                      >
                        {album.cover ? (
                          <img src={album.cover} alt={`Okładka ${album.title}`} />
                        ) : (
                          <div className="cover-placeholder">?</div>
                        )}
                      </motion.div>
                      {/* Back - przezroczysty, aby pokazać sekcję About pod spodem */}
                      <motion.div
                        className="album-cover-flip-back"
                        style={{
                          rotateY: useTransform(flipRotationY, (ry) => ry - 180),
                          opacity: backOpacity,
                        }}
                      >
                        {/* Pusty div - sekcja About jest pod Gramophone, widoczna przez przezroczystość */}
                      </motion.div>
                    </div>
                  ) : (
                    // Zwykłe okładki dla pozostałych albumów
                    album.cover ? (
                      <img src={album.cover} alt={`Okładka ${album.title}`} />
                    ) : (
                      <div className="cover-placeholder">?</div>
                    )
                  )}
                </div>

                <div className="album-tracklist">
                  <h3>Tracklista</h3>
                  <ul>
                    {album.tracklist.map(track => <li key={track}>{track}</li>)}
                  </ul>
                </div>
              </div>
            </ScrollStackItem>
          ))}

        </ScrollStack>
      </motion.div>

      {/* Sekcja About pod Gramophone - widoczna przez przezroczysty odwrócony obrazek */}
    </motion.div>
  );
}

export default Gramophone;