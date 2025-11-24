"use client";
import React from "react";
// OPTYMALIZACJA: Usunęliśmy motion - używamy zwykłych div z CSS hover
import "./Boxes.css";

export const BoxesCore = ({
  className,
  ...rest
}) => {
  // --- RESPANSYWNOŚĆ (Mobile Check) ---
  const [isMobile, setIsMobile] = React.useState(false);

  React.useEffect(() => {
    setIsMobile(window.innerWidth < 768);
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Mniej kratek na mobile dla lepszej wydajności i wyglądu
  const rowsCount = isMobile ? 40 : 150;
  const colsCount = isMobile ? 20 : 100;

  const rows = new Array(rowsCount).fill(1);
  const cols = new Array(colsCount).fill(1);

  return (
    <div
      className={className}
      {...rest}>
      {rows.map((_, i) => (
        <div
          key={`row` + i}
          className="boxes-row"
        >
          {cols.map((_, j) => (
            <div
              key={`col` + j}
              className="boxes-col"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="boxes-svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);