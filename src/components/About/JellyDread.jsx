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

  // Transformacje dla uchwytu - pozycjonujemy go względem końcówki dreda
  // SVG jest offsetowane o -500px, więc pozycja (500, 500) w SVG = (0, 0) w kontenerze
  // Używamy useMotionValue dla pozycji uchwytu, żeby móc ją kontrolować
  // Pozycja startowa: końcówka dreda jest na (500, 640), więc uchwyt na (0, 140)
  const handleX = useMotionValue(0);
  const handleY = useMotionValue(initialTipY);

  // Handlery - aktualizujemy zarówno końcówkę dreda jak i pozycję uchwytu
  const handleDrag = (event, info) => {
    // Aktualizujemy końcówkę dreda używając offset (względem początku drag)
    tipX.set(anchorX + info.offset.x);
    tipY.set(anchorY + initialTipY + info.offset.y);
    
    // Aktualizujemy pozycję uchwytu - użyjemy offset, bo to jest względne przesunięcie
    handleX.set(info.offset.x);
    handleY.set(initialTipY + info.offset.y);
    
    if (onDragReport) onDragReport(info.offset.x);
  };

  const handleDragStart = () => {
    isDraggingRef.current = true;
    if (onDragStart) onDragStart();
  };

  // ZMIANA: Dodajemy argumenty `event` i `info` do handleDragEnd
  const handleDragEnd = (event, info) => {
    isDraggingRef.current = false;
    if (onDragEnd) onDragEnd();

    // Animujemy końcówkę dreda z powrotem na miejsce (tak jak było)
    animate(tipX, anchorX, { ...springConfig, duration: 0.5 });
    animate(tipY, anchorY + initialTipY, { ...springConfig, duration: 0.5 });

    // KLUCZOWA ZMIANA: Resetujemy pozycję uchwytu, żeby wrócił na swoje miejsce
    // Używamy animate, żeby był płynny powrót (synchronizuje się z końcówką przez useEffect)
    animate(handleX, 0, { ...springConfig, duration: 0.5 });
    animate(handleY, initialTipY, { ...springConfig, duration: 0.5 });
  };

  // Synchronizujemy pozycję uchwytu z końcówką dreda (tylko gdy nie przeciągamy)
  // Gdy końcówka wraca na miejsce, uchwyt też powinien wrócić
  useEffect(() => {
    const unsubX = tipX.onChange((v) => {
      // Aktualizujemy pozycję uchwytu tylko gdy nie przeciągamy
      if (!isDraggingRef.current) {
        // Końcówka jest na pozycji v, więc uchwyt powinien być na (v - CANVAS_CENTER)
        // Ale ponieważ używamy offset podczas drag, resetujemy do 0
        handleX.set(v - CANVAS_CENTER);
      }
    });
    const unsubY = tipY.onChange((v) => {
      // Aktualizujemy pozycję uchwytu tylko gdy nie przeciągamy
      if (!isDraggingRef.current) {
        // Końcówka jest na pozycji v, więc uchwyt powinien być na (v - CANVAS_CENTER)
        handleY.set(v - CANVAS_CENTER);
      }
    });

    return () => {
      unsubX();
      unsubY();
    };
  }, [tipX, tipY, handleX, handleY]);

  return (
    <div className="jelly-dread-container">
      {/* Uchwyt - pozycjonowany względem końcówki dreda */}
      <motion.div
        className="jelly-dread-handle"
        drag // Przywracamy `drag`, żeby w ogóle dało się przeciągać
        dragMomentum={false} // Wyłączamy "pęd", żeby element nie leciał dalej po puszczeniu
        dragSnapToOrigin={false} // Nie resetuj automatycznie, robimy to ręcznie
        dragConstraints={{ left: -150, right: 150, top: -50, bottom: 100 }}
        dragElastic={0.2}
        onDrag={handleDrag}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd} // onDragEnd teraz otrzymuje `info`
        style={{ 
          x: handleX,
          y: handleY
        }}
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