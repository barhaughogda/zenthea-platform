/* eslint-disable */
import React, { createContext, useContext, useState } from 'react';
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
const CardSystemContext = createContext<any>(null);
// eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
export const CardSystemProvider = ({ children }: any) => {
  const [cards, setCards] = useState<any[]>([]);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any -- TODO: fix legacy code
  const openCard = (type: any, props: any, taskProps?: any) => {
    console.log('Mock openCard', { type, props, taskProps });
  };
  const closeCard = (id: string) => {};

  return (
    <CardSystemContext.Provider value={{ cards, openCard, closeCard }}>
      {children}
    </CardSystemContext.Provider>
  );
};

export const useCardSystem = () => {
  const context = useContext(CardSystemContext);
  return context || { cards: [], openCard: () => {}, closeCard: () => {} };
};
