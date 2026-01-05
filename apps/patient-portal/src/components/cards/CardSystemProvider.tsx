import React, { createContext, useContext, useState } from 'react';

const CardSystemContext = createContext<any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */>(null);

export const CardSystemProvider = ({ children }: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => {
  const [cards, setCards] = useState<any[] /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */>([]);
  const openCard = (type: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */, props: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */, taskProps?: any /* eslint-disable-line @typescript-eslint/no-explicit-any -- TODO: fix legacy types */) => {
    const id = Math.random().toString(36).substring(7);
    setCards([...cards, { id, type, props, taskProps }]);
  };
  const closeCard = (id: string) => setCards(cards.filter(c => c.id !== id));

  return (
    <CardSystemContext.Provider value={{ cards, openCard, closeCard }}>
      {children}
    </CardSystemContext.Provider>
  );
};

export const useCardSystem = () => {
  const context = useContext(CardSystemContext);
  if (!context) throw new Error('useCardSystem must be used within CardSystemProvider');
  return context;
};
