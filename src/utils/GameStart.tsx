// utils/GameStart.tsx
import React, { useEffect } from 'react';
import { Card, Suit, Rank } from '../types/types';

interface GameStartProps {
  // Возвращает массив cards со всеми картами (изначально в deck)
  onGameInitialized: (cards: Card[]) => void;
}

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

const GameStart: React.FC<GameStartProps> = ({ onGameInitialized }) => {
  const createAllDeck = (): Card[] => {
    const deck: Card[] = [];
    let idCount = 0;
    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({
          id: 'card_' + (idCount++),
          suit,
          rank,
          location: 'deck', // ВСЁ в колоде изначально
        });
      }
    }

    // Перемешаем
    for (let i = deck.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [deck[i], deck[j]] = [deck[j], deck[i]];
    }

    return deck;
  };

  useEffect(() => {
    // Вызывается один раз (т.к. [] - пустой массив зависимостей)
    const initialDeck = createAllDeck();
    onGameInitialized(initialDeck);
    // Если линтер ругается на onGameInitialized, можно отключить:
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return null;
};

export default GameStart;
