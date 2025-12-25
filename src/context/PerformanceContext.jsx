import React, { createContext, useContext, useState, useCallback, useMemo } from "react";

const PerformanceContext = createContext({
  tier: "high", // 'high' | 'medium' | 'low'
  setFps: () => { },
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
