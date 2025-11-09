// Plik: /src/components/About/About.jsx (NOWA, POPRAWIONA WERSJA)

import React from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import './About.css';

// Musi przyjmować 'externalOpacity'
function About({ contentProgress, externalOpacity }) {

  // Sprawdzamy, czy komponent jest kontrolowany z zewnątrz
  const isExternallyControlled = (externalOpacity !== undefined);

  // --- Logika wewnętrzna (dla podglądu lub gdy nie jest kontrolowany) ---
  const defaultProgress = useMotionValue(1);
  const progressValue = contentProgress || defaultProgress;

  const internalOpacity = useTransform(
    progressValue,
    [0.95, 1.0], 
    [0, 1]
  );
  const internalScale = useTransform(
    progressValue,
    [0.95, 1.0], 
    [0.8, 1]
  );
  // --- Koniec logiki wewnętrznej ---

  // Używamy 'externalOpacity' jeśli jest podane
  const finalOpacity = isExternallyControlled 
    ? externalOpacity 
    : (contentProgress ? internalOpacity : 1);

  // Jeśli jest kontrolowany, skalę ustawiamy na 1 (bo nie ma już inverseScale)
  const finalScale = isExternallyControlled 
    ? 1 
    : (contentProgress ? internalScale : 1);


  return (
    <motion.section 
      className="about-section"
      style={{
        opacity: finalOpacity, // Używa poprawnej wartości
        scale: finalScale,     // Używa poprawnej wartości
      }}
    >
      <div className="about-content">
        <h1 className="about-title">O MNIE</h1>
        <div className="about-text">
          <p>
            Jestem artystą, który tworzy muzykę pełną emocji i autentyczności.
            Moja twórczość to połączenie różnych stylów i wpływów, które razem tworzą unikalne brzmienie.
          </p>
          <p>
            Przez lata mojej kariery wydałem kilka albumów, które zdobyły uznanie słuchaczy
            i krytyków. Każdy projekt to nowa opowieść, nowe wyzwanie i nowy krok w moim rozwoju artystycznym.
          </p>
          <p>
            Muzyka to moja pasja, sposób na wyrażenie siebie i komunikację z odbiorcami.
            Dzięki niej mogę dzielić się swoimi doświadczeniami, emocjami i spojrzeniem na świat.
          </p>
        </div>
      </div>
    </motion.section>
  );
}

export default About;