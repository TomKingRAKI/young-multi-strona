import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const PerformanceContext = createContext({
  tier: "high", // 'high' | 'medium' | 'low'
  setFps: () => {},
});

export const PerformanceProvider = ({ children }) => {
  const [tier, setTier] = useState("high");

  const setFps = useCallback((fps) => {
    let newTier = "high";
    if (fps < 30) {
      newTier = "low";
    } else if (fps < 55) {
      newTier = "medium";
    } else {
      newTier = "high";
    }

    // Console Log as requested
    console.log(
      `%c[Performance] FPS detected: ${fps.toFixed(
        1
      )} | Tier set to: ${newTier}`,
      fps < 30
        ? "color: red; font-weight: bold;"
        : fps < 55
        ? "color: orange; font-weight: bold;"
        : "color: green; font-weight: bold;"
    );

    setTier(newTier);
  }, []);

  const contextValue = useMemo(() => ({ tier, setFps }), [tier, setFps]);

  return (
    <PerformanceContext.Provider value={contextValue}>
      {children}
    </PerformanceContext.Provider>
  );
};

export const usePerformance = () => useContext(PerformanceContext);
