// Plik: /src/components/About/JellyDread.jsx

// 1. Upewnij się, że 'useEffect' jest zaimportowany
import React, { useRef, useEffect } from 'react';
import {
  motion,
  useMotionValue,
  useSpring,
  useTransform,
  animate,
} from 'framer-motion';
import './JellyDread.css';

const springConfig = { stiffness: 400, damping: 30 };
const CANVAS_CENTER = 500;

export function JellyDread({
  dreadId,
  onDragReport,
  onDragStart,
  onDragEnd,
  children
}) {
  const isDraggingRef = useRef(false);
  const initialTipY = 140;

  // A. Kotwica (bez zmian)
  const anchorX = CANVAS_CENTER;
  const anchorY = CANVAS_CENTER;

  // B. Końcówka (bez zmian)
  const tipX = useMotionValue(anchorX);
  const tipY = useMotionValue(anchorY + initialTipY);

  // === OSTATECZNA LOGIKA DLA ŚRODKA (C) ===

  // 1. Definiujemy "idealny środek" (tak jak ostatnio)
  const idealMidX = useTransform(tipX, (v) => (anchorX + v) / 2);
  const idealMidY = useTransform(tipY, (v) => (anchorY + v) / 2);

  // 2. RĘCZNIE obliczamy wartości startowe dla sprężyn
  //    (500 + 500) / 2 = 500
  const initialMidX = (anchorX + tipX.get()) / 2; 
  //    (500 + 600) / 2 = 550
  const initialMidY = (anchorY + tipY.get()) / 2;

  // 3. Inicjujemy sprężyny TWARDO tymi LICZBAMI
  const midX = useSpring(initialMidX, springConfig);
  const midY = useSpring(initialMidY, springConfig);

  // 4. Przywracamy useEffect, aby podłączyć sprężyny do 'idealMidX/Y'
  useEffect(() => {
    // Kiedy 'idealMidX' się zmienia, aktualizuj sprężynę 'midX'
    const unsubX = idealMidX.onChange((v) => midX.set(v));
    const unsubY = idealMidY.onChange((v) => midY.set(v));

    return () => {
      unsubX();
      unsubY();
    };
    // Zależnościami są teraz 'idealMidX' i 'idealMidY'
  }, [idealMidX, idealMidY, midX, midY]);

  // 5. Usuń mylące, stare komentarze, które tam zostały
  
  // === KONIEC ZMIAN ===

  // Ścieżka SVG (bez zmian, teraz dostanie 500, 550 na starcie)
  const svgPath = useTransform(
    [midX, midY, tipX, tipY],
    ([mX, mY, tX, tY]) => {
      // W spoczynku: M 500 500 Q 500 550 500 600
      return `M ${anchorX} ${anchorY} Q ${mX} ${mY} ${tX} ${tY}`;
    }
  );

  // Handlery (bez zmian)
  const handleDrag = (event, info) => {
    tipX.set(anchorX + info.offset.x);
    tipY.set(anchorY + initialTipY + info.offset.y);
    if (onDragReport) onDragReport(info.offset.x);
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
    if (onDragStart) onDragStart();
  };

  const handleDragEnd = () => {
    isDraggingRef.current = false;
    if (onDragEnd) onDragEnd();
    animate(tipX, anchorX, { ...springConfig, duration: 0.5 });
    animate(tipY, anchorY + initialTipY, { ...springConfig, duration: 0.5 });
  };

  // Transformacje dla uchwytu (bez zmian)
  const handleX = useTransform(tipX, (v) => v - CANVAS_CENTER);
  const handleY = useTransform(tipY, (v) => v - CANVAS_CENTER);


  return (
    <div className="jelly-dread-container">
      {/* Uchwyt (bez zmian) */}
      <motion.div
        className="jelly-dread-handle"
        drag
        dragConstraints={{ left: -150, right: 150, top: -50, bottom: 100 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
        style={{ x: handleX, y: handleY }}
      />

      {/* SVG (bez zmian) */}
      <svg className="jelly-dread-svg">
        <defs>
          {children}
        </defs>
        {/* Biały obrys pod spodem */}
        <motion.path
          d={svgPath}
          stroke="#ffffff"
          strokeWidth="20"
          strokeLinecap="butt"
          pathLength="1"
          strokeDasharray="0 0.2 0.8 0" /* ukryj pierwsze 20%, maluj resztę */
          strokeDashoffset="0"
          fill="none"
        />
        <motion.path
          d={svgPath} 
          stroke={`url(#${dreadId})`}
          strokeWidth="18" 
          strokeLinecap="round"
          fill="none"
        />
      </svg>
    </div>
  );
}