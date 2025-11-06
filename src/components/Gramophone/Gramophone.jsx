// Plik: /src/components/Gramophone/Gramophone.jsx (NOWA WERSJA - ZOPTYMALIZOWANA)

import React from 'react';
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
    desc: 'Debiutancki album, który uzyskał status złotej płyty.',
    tracklist: ['1. Intro', '2. Nowa Fala', '3. Sport', '4. ...']
  },
  { 
    id: 2, 
    title: 'TRAPSTAR', 
    year: '2018', 
    styleId: 'trapstar',
    cover: trapstarCover,
    desc: 'Album ugruntowujący pozycję na scenie, platynowa płyta.',
    tracklist: ['1. Trapstar', '2. Diamenty', '3. Skan', '4. ...']
  },
  { 
    id: 3, 
    title: 'TRAP AFTER DEATH', 
    year: '2019', 
    styleId: 'tad',
    cover: tadCover,
    desc: 'Mroczniejszy koncept album, status podwójnej platyny.',
    tracklist: ['1. TAD', '2. Demony', '3. Nie wiem', '4. ...']
  },
  { 
    id: 4, 
    title: 'TOXIC', 
    year: '2021', 
    styleId: 'toxic',
    cover: toxicCover,
    desc: 'Eksperymentalne brzmienia, diamentowa płyta.',
    tracklist: ['1. Toxic', '2. Chemia', '3. Od nowa', '4. ...']
  },
];

function Gramophone({ contentProgress, isMenuOpen }) {
  
  // Animacja zmiany perspektywy z 3D na 2D po pokazaniu ostatniej karty (toxic)
  // ScrollStack używa contentProgress w zakresie [0.65, 1.0]
  // Karta TOXIC pojawia się jako ostatnia, więc animacja zaczyna się dopiero przy 0.95
  // aby upewnić się, że karta jest już w pełni widoczna
  const perspectiveProgress = useTransform(
    contentProgress,
    [0.95, 1.0], // Zaczyna się bardzo późno, gdy TOXIC jest już widoczny
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

  // OPTYMALIZACJA: Używamy motion.div z bezpośrednimi motion values zamiast state + useMotionValueEvent
  // To eliminuje re-rendery i działa bezpośrednio z motion values

  return (
    <div className="Gramophone-section">

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
          scale: scale,
          x: '0%',
          y: '0%',
          z: 0,
        }}
      >
      
        <h1 className="gramophone-title-static">
          DYSKOGRAFIA
        </h1>

        <ScrollStack 
          className="gramophone-scroller"
          itemDistance={20}       
          itemStackDistance={20}  
          baseScale={0.9}         
          stackPosition="0%"     
          scaleEndPosition="80%"  
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
                  <h3>Osiągnięcia</h3>
                  <p>{album.desc}</p>
                </div>
                
                <div className="album-cover">
                  {album.cover ? (
                    <img src={album.cover} alt={`Okładka ${album.title}`} />
                  ) : (
                    <div className="cover-placeholder">?</div>
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
    </div>
  );
}

export default Gramophone;