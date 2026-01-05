/* eslint-disable */
import React, { createContext, useContext } from 'react';

const ThemeContext = createContext<any>(null);

export const ZentheaThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const value = {
    theme: 'light',
    setTheme: () => {},
  };
  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    return {
      theme: 'light',
      setTheme: () => {},
    };
  }
  return context;
};
