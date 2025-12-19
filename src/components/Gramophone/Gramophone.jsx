// Plik: /src/components/Gramophone/Gramophone.jsx

import React, { useState, useEffect } from 'react';
import { useTransform, motion } from 'framer-motion';
import './Gramophone.css';
import ScrollStack, { ScrollStackItem } from '../ScrollStack/ScrollStack';

import nowaFalaCover from '../../assets/NowafalaCover.avif';
import trapstarCover from '../../assets/trapstarCover.avif';
import tadCover from '../../assets/tadCover.avif';
import toxicCover from '../../assets/toxicCover.avif';

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

function Gramophone({ contentProgress, isMenuOpen, style, zoomTargetRef }) {

  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const perspectiveProgress = useTransform(
    contentProgress,
    [0.59, 0.65],
    [0, 1]
  );

  // === POPRAWKA 3D DLA MOBILE ===
  // Na desktopie: mocny skos (-25deg).
  // Na mobile: delikatny skos (-10deg) lub prawie brak, żeby treść się mieściła.
  const skewX3D = isMobile ? 0 : -25;
  const skewY3D = isMobile ? 0 : 7;
  const scale3D = isMobile ? 1 : 0.85;

  const skewX2D = 0;
  const skewY2D = 0;
  const scale2D = 1;

  const skewX = useTransform(perspectiveProgress, [0, 1], [skewX3D, skewX2D]);
  const skewY = useTransform(perspectiveProgress, [0, 1], [skewY3D, skewY2D]);
  const scale = useTransform(perspectiveProgress, [0, 1], [scale3D, scale2D]);

  const flipProgress = useTransform(
    contentProgress,
    [0.61, 0.65],
    [0, 1]
  );

  const flipRotationY = useTransform(flipProgress, [0, 1], [0, 180]);
  const frontOpacity = useTransform(flipProgress, [0, 0.5, 1], [1, 1, 0]);
  const backOpacity = useTransform(flipProgress, [0, 0.5, 1], [0, 0, 1]);

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
          willChange: 'transform'
        }}
      >
        <div className="gramophone-css-grid" />
      </motion.div>

      <motion.div
        className="gramophone-content-world"
        style={{
          skewX: skewX,
          skewY: skewY,
          scale: scale,
          x: '0%',
          willChange: 'transform' // Ensure 3D transforms are GPU accelerated
        }}
      >
        <h1 className="gramophone-title-static">
          DYSKOGRAFIA
        </h1>

        <ScrollStack
          className="gramophone-scroller"
          itemDistance={20}
          // Na mobile karty muszą być bliżej siebie w pionie
          itemStackDistance={isMobile ? 40 : 20}
          baseScale={0.9}
          stackPosition={isMobile ? "0%" : "0%"}
          // Na mobile startujemy ciut niżej, żeby nie zasłaniać tytułu
          scaleEndPosition={isMobile ? "80%" : "80%"}
          scrollProgress={contentProgress}
        >
          {albums.map((album) => (
            <ScrollStackItem
              key={album.id}
              itemClassName={`album-card album-style-${album.styleId}`}
            >
              <div className="album-header">
                <h2>{album.title}</h2>
                <p>{album.year}</p>
              </div>

              <div className="album-content">
                <div className="album-desc">
                  <h3>Opis</h3>
                  <p>{album.desc}</p>
                </div>

                <div className="album-cover">
                  {album.id === 4 ? (
                    <div className="album-cover-flip-container">
                      <motion.div
                        className="album-cover-flip-front"
                        style={{ rotateY: flipRotationY, opacity: frontOpacity }}
                      >
                        <img src={album.cover} alt={album.title} loading="lazy" />
                      </motion.div>
                      <motion.div
                        className="album-cover-flip-back"
                        style={{
                          rotateY: useTransform(flipRotationY, (ry) => ry - 180),
                          opacity: backOpacity,
                          // Ważne: Flexbox żeby wycentrować celownik
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        {/* === TU JEST NASZ NIEWIDZIALNY CELOWNIK === */}
                        <div
                          ref={zoomTargetRef}
                          style={{ width: '10px', height: '10px', background: 'transparent' }}
                        />
                      </motion.div>
                    </div>
                  ) : (
                    <img src={album.cover} alt={album.title} loading="lazy" />
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
    </motion.div>
  );
}

export default Gramophone;