// Plik: /src/components/Gramophone/Gramophone.jsx (NOWA WERSJA)

import React from 'react';
import './Gramophone.css';
import ScrollStack, { ScrollStackItem } from '../ScrollStack/ScrollStack'; 

import nowaFalaCover from '../../assets/NowafalaCover.jpg'; 
import trapstarCover from '../../assets/trapstarCover.jpg';
import tadCover from '../../assets/tadCover.jpg';
import toxicCover from '../../assets/toxicCover.jpg'; 


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

function Gramophone({ contentProgress }) {
  
  return (
    <div className="Gramophone-section">
      
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
      
    </div>
  );
}

export default Gramophone;