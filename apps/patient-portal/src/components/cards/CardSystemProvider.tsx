/* eslint-disable */
import React, { createContext, useContext } from 'react';

const CardSystemContext = createContext<any>(null);

export const CardSystemProvider = ({ children, ...props }: any) => {
  const value = {
    cards: [],
    addCard: () => {},
    removeCard: () => {},
  };
  return (
    <CardSystemContext.Provider value={value}>
      {children}
    </CardSystemContext.Provider>
  );
};

export const useCardSystem = () => {
  const context = useContext(CardSystemContext);
  if (!context) {
    return {
      cards: [],
      addCard: () => {},
      removeCard: () => {},
    };
  }
  return context;
};
