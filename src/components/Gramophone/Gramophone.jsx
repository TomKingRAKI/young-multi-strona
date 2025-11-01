// Plik: /src/components/Gramophone/Gramophone.jsx

import React from 'react';
import './Gramophone.css';
import ScrollStack, { ScrollStackItem } from '../ScrollStack/ScrollStack'; 

const albums = [
  { id: 1, title: 'NOWA FALA', year: '2023' },
  { id: 2, title: 'TRAPSTAR', year: '2021' },
  { id: 3, title: 'TRAPPER OF THE YEAR', year: '2019' },
  { id: 4, title: 'INNE ALBUMY', year: '...' },
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
        itemStackDistance={10}  
        baseScale={0.9}         
        
        // ZMIANA: Definiujemy początek i koniec animacji
        stackPosition="10%"     // Koniec (przypięcie) na 10% od góry
        scaleEndPosition="80%"  // Start na 80% od góry
        
        scrollProgress={contentProgress}
      >
        {albums.map((album) => (
          <ScrollStackItem 
            key={album.id} 
            itemClassName="album-card"
          >
            <h2>{album.title}</h2>
            <p>{album.year}</p>
          </ScrollStackItem>
        ))}
        
      </ScrollStack>
      
    </div>
  );
}

export default Gramophone;