"use client";
import React from "react";
// OPTYMALIZACJA: Usunęliśmy motion - używamy zwykłych div z CSS hover
import "./Boxes.css"; 

export const BoxesCore = ({
  className,
  ...rest
}) => {
  const rows = new Array(150).fill(1);
  const cols = new Array(100).fill(1);

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