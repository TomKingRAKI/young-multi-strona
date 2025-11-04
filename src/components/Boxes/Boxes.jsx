"use client";
import React from "react";
import { motion } from "motion/react";
// ZMIANA: Importujemy nasz nowy CSS
import "./Boxes.css"; 

export const BoxesCore = ({
  className,
  ...rest
}) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);

  // ZMIANA: Używamy szarego koloru do hovera
  const hoverColor = "#e5e5e5"; // Tailwind 'gray-200'

  return (
    <div
      className={className} 
      {...rest}>
      {rows.map((_, i) => (
        // ZMIANA: Używamy naszej klasy CSS
        <motion.div 
          key={`row` + i} 
          className="boxes-row"
        >
          {cols.map((_, j) => (
            <motion.div
              whileHover={{
                backgroundColor: hoverColor, // Używamy naszego koloru
                transition: { duration: 0 },
              }}
              animate={{
                transition: { duration: 2 },
              }}
              key={`col` + j}
              // ZMIANA: Używamy naszej klasy CSS
              className="boxes-col"
            >
              {j % 2 === 0 && i % 2 === 0 ? (
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  // ZMIANA: Używamy naszej klasy CSS
                  className="boxes-svg"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m6-6H6" />
                </svg>
              ) : null}
            </motion.div>
          ))}
        </motion.div>
      ))}
    </div>
  );
};

export const Boxes = React.memo(BoxesCore);