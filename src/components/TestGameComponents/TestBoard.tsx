import React, { useState, useEffect } from 'react';
import TestPlayer from './TestPlayer';
import TestOpponent from './TestOpponent';
import TestDeck from './TestDeck';
import styles from './styles/TestBoard.module.css';
import { Card, Rank, Suit } from '../../types/types';
import { useTransition, animated } from 'react-spring';

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

// Функция для генерации уникальных ID
const generateDeck = (): Card[] => {
  const deck: Card[] = [];
  let id = 1;
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        id: id.toString(),
        suit,
        rank,
        location: 'deck',
      });
      id++;
    }
  }
  return deck;
};

// Функция для перемешивания колоды
const shuffleDeck = (deck: Card[]): Card[] => {
  const shuffled = [...deck];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

const TestBoard: React.FC = () => {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [opponentCards, setOpponentCards] = useState<Card[]>([]);

  useEffect(() => {
    let newDeck = generateDeck();
    newDeck = shuffleDeck(newDeck);
    setDeck(newDeck);
    console.log('Инициализированная колода:', newDeck);
  }, []);

  const dealCards = () => {
    if (deck.length < 12) {
      console.log('Недостаточно карт для раздачи');
      return;
    }

    // Выбираем первые 6 карт для игрока и следующие 6 для оппонента
    const newPlayerCards = deck.slice(0, 6).map(card => ({ ...card, location: 'player' }));
    const newOpponentCards = deck.slice(6, 12).map(card => ({ ...card, location: 'opponent' }));
    const remainingDeck = deck.slice(12);

    console.log('Раздаём карты:');
    console.log('Игрок:', newPlayerCards);
    console.log('Оппонент:', newOpponentCards);
    console.log('Оставшаяся колода:', remainingDeck);

    // Обновляем состояния
    setPlayerCards([...playerCards, ...newPlayerCards]);
    setOpponentCards([...opponentCards, ...newOpponentCards]);
    setDeck(remainingDeck);
  };

  return (
    <div className={`testBoard ${styles.testBoard}`}>
      {/* Колода */}
      <TestDeck cards={deck} />

      {/* Оппонент */}
      <TestOpponent cards={opponentCards} />

      {/* Игрок */}
      <TestPlayer cards={playerCards} />

      {/* Кнопка раздачи карт */}
      <button className={styles.dealButton} onClick={dealCards}>
        Раздать Карты
      </button>
    </div>
  );
};

export default TestBoard;
