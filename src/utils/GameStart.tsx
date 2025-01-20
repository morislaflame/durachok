import React, { useEffect } from 'react';
import { Card, Suit, Rank } from '../types/types';

interface GameStartProps {
  onGameInitialized: (playerCards: Card[], opponentCards: Card[], trump: Card, deck: Card[]) => void;
}

const GameStart: React.FC<GameStartProps> = ({ onGameInitialized }) => {
  const createDeck = (): Card[] => {
    const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
    const ranks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    const deck: Card[] = [];

    for (const suit of suits) {
      for (const rank of ranks) {
        deck.push({ suit, rank });
      }
    }

    return shuffleDeck(deck);
  };

  const shuffleDeck = (deck: Card[]): Card[] => {
    const shuffled = [...deck];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const dealInitialCards = () => {
    const deck = createDeck();
    const playerCards = deck.splice(0, 6);
    const opponentCards = deck.splice(0, 6);
    const trump = deck[0];

    onGameInitialized(playerCards, opponentCards, trump, deck);
  };

  useEffect(() => {
    dealInitialCards();
  }, []);

  return null; // Этот компонент не рендерит UI
};

export default GameStart;