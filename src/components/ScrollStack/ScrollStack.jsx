// Plik: /src/components/ScrollStack/ScrollStack.jsx (NOWA OSTATECZNA WERSJA)

import React, { useLayoutEffect, useRef, useCallback, Children, useState, useEffect } from 'react';
import { useTransform, useMotionValueEvent, useSpring } from 'framer-motion';
import './ScrollStack.css';

export const ScrollStackItem = ({ children, itemClassName = '' }) => (
  <div className={`scroll-stack-card ${itemClassName}`.trim()}>{children}</div>
);

const ScrollStack = ({
  children,
  className = '',
  itemDistance = 100, // Zostaje, ale nie jest używane w nowej logice
  itemScale = 0.03,
  itemStackDistance = 30,
  stackPosition = '20%',
  scaleEndPosition = '10%', // Zostaje dla kompatybilności
  baseScale = 0.85,
  rotationAmount = 0,
  blurAmount = 0,
  scrollProgress, 
  isMenuOpen
}) => {
  const scrollerRef = useRef(null);
  const cardsRef = useRef([]);
  const lastTransformsRef = useRef(new Map());
  const isUpdatingRef = useRef(false);

  const cardTopsRef = useRef([]);
  const [simulatedScrollHeight, setSimulatedScrollHeight] = useState(0);
  const latestStackProgress = useRef(0);
  // ZMIANA: Nie potrzebujemy już 'endElementTopRef'

  // --- Funkcje pomocnicze (bez zmian) ---
  const calculateProgress = useCallback((scrollTop, start, end) => {
    // Obsługa odwróconego zakresu (start > end)
    if (start > end) {
      if (scrollTop < end) return 0;
      if (scrollTop > start) return 1;
      // Mapujemy odwrotnie
      return 1 - (scrollTop - end) / (start - end);
    }
    
    if (scrollTop < start) return 0;
    if (scrollTop > end) return 1;
    return (scrollTop - start) / (end - start);
  }, []);

  const parsePercentage = useCallback((value, containerHeight) => {
    if (typeof value === 'string' && value.includes('%')) {
      return (parseFloat(value) / 100) * containerHeight;
    }
    return parseFloat(value);
  }, []);

  const getScrollData = useCallback(() => {
    const scroller = scrollerRef.current;
    return {
      containerHeight: scroller?.clientHeight || 0,
    };
  }, []);

  const getElementOffset = useCallback(
    (i) => {
      return cardTopsRef.current[i] || 0;
    }, []
  );
  
  // --- ZMIANA: CAŁA NOWA LOGIKA AKTUALIZACJI ---
const updateCardTransforms = useCallback((scrollTop) => {
    if (!cardsRef.current.length || isUpdatingRef.current) return;
    isUpdatingRef.current = true;

    const { containerHeight } = getScrollData();
    if (containerHeight === 0) {
      isUpdatingRef.current = false;
      return;
    }

    const stackPositionPx = parsePercentage(stackPosition, containerHeight);
    const scaleEndPositionPx = parsePercentage(scaleEndPosition, containerHeight);

    cardsRef.current.forEach((card, i) => {
      if (!card) return;

      const cardTop = getElementOffset(i); 
      const triggerStart = cardTop - scaleEndPositionPx;
      const triggerEnd = cardTop - stackPositionPx - (itemStackDistance * i);
      
      // To jest nasz "główny" postęp animacji (od 0.0 do 1.0)
      const overallProgress = calculateProgress(scrollTop, triggerStart, triggerEnd);


      // ===================================
      // === NOWA LOGIKA "KWADRATOWA" ===
      // ===================================

      // ETAP 1: Translacja (Dzieje się w pierwszej połowie animacji: 0.0 -> 0.5)
      // Mapujemy overallProgress [0, 0.5] na translateProgress [0, 1]
      const translateProgress = Math.min(1, overallProgress / 0.5); 

      // ETAP 2: Skalowanie (Dzieje się w drugiej połowie animacji: 0.5 -> 1.0)
      // Mapujemy overallProgress [0.5, 1.0] na scaleProgress [0, 1]
      const scaleProgress = Math.max(0, (overallProgress - 0.5) / 0.5);

      // ===================================
      // === ZASTOSOWANIE NOWEJ LOGIKI ===
      // ===================================

      // 1. Skala (Duża -> Mała) - Używa teraz 'scaleProgress'
      const targetScale = baseScale + i * itemScale;
      const scale = 1 - scaleProgress * (1 - targetScale);

      // 2. Translacja Y (Dół -> Góra) - Używa teraz 'translateProgress'
      const totalTranslate = -(cardTop - (stackPositionPx + itemStackDistance * i));
      const translateY = translateProgress * totalTranslate;
      
      // Reszta (Rotację też podpinamy pod 'scaleProgress', aby działo się to na górze)
      const rotation = rotationAmount ? i * rotationAmount * scaleProgress : 0;
      let blur = 0; 

      // --- Zastosowanie transformacji (bez zmian) ---
      const newTransform = {
        translateY: Math.round(translateY * 100) / 100,
        scale: Math.round(scale * 1000) / 1000,
        rotation: Math.round(rotation * 100) / 100,
        blur: Math.round(blur * 100) / 100
      };

      const lastTransform = lastTransformsRef.current.get(i);
      const hasChanged =
        !lastTransform ||
        Math.abs(lastTransform.translateY - newTransform.translateY) > 0.1 ||
        Math.abs(lastTransform.scale - newTransform.scale) > 0.001;

      if (hasChanged) {
        const transform = `translate3d(0, ${newTransform.translateY}px, 0) scale(${newTransform.scale}) rotate(${newTransform.rotation}deg)`;
        const filter = newTransform.blur > 0 ? `blur(${newTransform.blur}px)` : '';
        card.style.transform = transform;
        card.style.filter = filter;
        lastTransformsRef.current.set(i, newTransform);
      }
    });

    isUpdatingRef.current = false;
  }, [
    itemScale, itemStackDistance, stackPosition, scaleEndPosition, baseScale, 
    rotationAmount, blurAmount, 
    calculateProgress, parsePercentage, getScrollData, getElementOffset
  ]);

  // --- Logika mapowania scrolla (z 'useSpring') ---
  const rawStackProgress = useTransform(
    scrollProgress, 
    [0.65, 1.0], // Używamy zakresu 65%-100%
    [0, 1]      
  );

  const stackProgress = useSpring(rawStackProgress, {
    stiffness: 400,
    damping: 90,
    mass: 1
  });

  // --- ZMIANA: useLayoutEffect (poprawka zIndex) ---
  useLayoutEffect(() => {
    const scroller = scrollerRef.current;
    if (!scroller) return;
    const innerContent = scroller.querySelector('.scroll-stack-inner');
    if (!innerContent) return;
    const cards = Array.from(scroller.querySelectorAll('.scroll-stack-card'));
    if (cards.length === 0) return;
    
    cardsRef.current = cards;
    
    const tops = [];
    cards.forEach((card, i) => {
      // Usunęliśmy 'itemDistance' stąd
      card.style.willChange = 'transform, filter';
      card.style.transformOrigin = 'top center';
      
      // === ZMIANA: Karta 0 jest na spodzie (zIndex: 1), Karta 3 na wierzchu (zIndex: 4)
      card.style.zIndex = i + 1;
      
      const cardTop = card.offsetTop; 
      tops.push(cardTop);
    });
    cardTopsRef.current = tops;
    
    const scrollHeight = innerContent.scrollHeight;
    const clientHeight = scroller.clientHeight;
    setSimulatedScrollHeight(scrollHeight - clientHeight);
    
    // Nie potrzebujemy już 'endEl'
    
    updateCardTransforms(0); 

    return () => {
      cardsRef.current = [];
      cardTopsRef.current = [];
      lastTransformsRef.current.clear();
      isUpdatingRef.current = false;
    };
  }, [
    itemDistance, updateCardTransforms, children 
  ]);

  // --- Podpięcie 'stackProgress' (bez zmian) ---
  useMotionValueEvent(stackProgress, "change", (latest) => {
    latestStackProgress.current = latest;
    // `simulatedScrollHeight` musi być dobrze policzone
    const virtualScrollTop = latest * simulatedScrollHeight;
    updateCardTransforms(virtualScrollTop);
  });
  useEffect(() => {
    // Nasłuchujemy tylko na moment ZAMKNIĘCIA menu
    if (isMenuOpen === false) {
      // Menu zostało właśnie zamknięte.
      // Wymuszamy ręczne przeliczenie pozycji kart,
      // używając ostatniej zapisanej pozycji scrolla.
      const virtualScrollTop = latestStackProgress.current * simulatedScrollHeight;
      updateCardTransforms(virtualScrollTop);
    }
  }, [isMenuOpen, updateCardTransforms, simulatedScrollHeight]);
  // --- Render (bez zmian) ---
  return (
    <div className={`scroll-stack-scroller ${className}`.trim()} ref={scrollerRef}>
      <div className="scroll-stack-inner">
        {children}
        {/* Usunęliśmy .scroll-stack-end, bo nie jest potrzebny w tej logice */}
      </div>
    </div>
  );
};

export default ScrollStack;