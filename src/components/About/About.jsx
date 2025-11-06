import React from 'react';
import { motion, useTransform, useMotionValue } from 'framer-motion';
import './About.css';

function About({ contentProgress }) {
  // Jeśli contentProgress nie jest przekazany (np. w podglądzie na karcie),
  // tworzymy stałą wartość 1, aby sekcja była zawsze widoczna
  const defaultProgress = useMotionValue(1);
  const progressValue = contentProgress || defaultProgress;

  // Animacja pojawiania się sekcji About
  // Zaczyna się gdy contentProgress osiągnie 0.95 (gdy zaczyna się flip)
  // Zawsze używamy useTransform, ale jeśli contentProgress nie istnieje,
  // progressValue będzie zawsze 1, więc animacja nie będzie działać
  const aboutOpacity = useTransform(
    progressValue,
    [0.95, 1.0],
    [0, 1]
  );

  const aboutScale = useTransform(
    progressValue,
    [0.95, 1.0],
    [0.8, 1]
  );

  // Jeśli contentProgress nie istnieje, ustawiamy wartości na 1 (pełna widoczność)
  // W przeciwnym razie używamy animowanych wartości
  const finalOpacity = contentProgress ? aboutOpacity : 1;
  const finalScale = contentProgress ? aboutScale : 1;

  return (
    <motion.section 
      className="about-section"
      style={{
        opacity: finalOpacity,
        scale: finalScale,
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