import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import { captureFlipState, animateFlip, FlipState } from './animations/dealCards';
import { Card, Suit, Rank } from '../../types/types';
import CardItem from './CardItem';
import Opponent from './Opponent';
import Player from './Player';

import styles from './styles/GameBoard.module.css';

const suits: Suit[] = ['hearts', 'diamonds', 'clubs', 'spades'];
const ranks: Rank[] = ['6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];

function createAllDeck(): Card[] {
  const deck: Card[] = [];
  let idCount = 0;
  for (const suit of suits) {
    for (const rank of ranks) {
      deck.push({
        id: 'card_' + (idCount++),
        suit,
        rank,
        location: 'deck', // изначально все в колоде
      });
    }
  }

  // Перемешаем
  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }
  return deck;
}

const GameBoard: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);
  const flipStateRef = useRef<FlipState | null>(null);

  // 1) При первом рендере — создаём колоду
  useEffect(() => {
    const initialDeck = createAllDeck();
    setCards(initialDeck);
  }, []);

  // 2) Когда `cards` меняется, если есть сохранённое flipState — запускаем анимацию
  useLayoutEffect(() => {
    if (flipStateRef.current) {
      animateFlip(flipStateRef.current, () => {
        flipStateRef.current = null;
      });
    }
  }, [cards]);

  // 3) Нажатие "Start Game": снимаем Flip-состояние и меняем `location`
  const handleStartGame = () => {
    flipStateRef.current = captureFlipState();

    setCards(prev => {
      const updated = [...prev];
      // Первые 6 -> player
      for (let i = 0; i < 6 && i < updated.length; i++) {
        updated[i].location = 'player';
      }
      // Следующие 6 -> opponent
      for (let i = 6; i < 12 && i < updated.length; i++) {
        updated[i].location = 'opponent';
      }
      return updated;
    });
  };

  /**
   * Единая функция для вычисления позиции (top/left/transform/…)
   * в зависимости от card.location и её индекса в группе.
   */
  const getCardStyle = (card: Card): React.CSSProperties => {
    const sameLocationCards = cards.filter(c => c.location === card.location);
    const indexInGroup = sameLocationCards.findIndex(c => c.id === card.id);

    switch (card.location) {
      case 'deck': {
        // Положим колоду слева
        return {
          position: 'absolute',
          top: '10%',
          left: '5%',
          transform: `rotate(${indexInGroup}deg)`,
          zIndex: 1000 - indexInGroup,
        };
      }
      case 'player': {
        // Веер внизу
        const overlap = Math.min(30, 400 / sameLocationCards.length);
        const offsetX = -((sameLocationCards.length - 1) * overlap) / 2;
        const rotationAngle = (indexInGroup - sameLocationCards.length / 2) * 3;

        return {
          position: 'absolute',
          bottom: '20%',
          left: '50%',
          transform: `translateX(${offsetX + overlap * indexInGroup}px) rotate(${rotationAngle}deg)`,
          transformOrigin: 'bottom center',
          zIndex: 10 + indexInGroup,
        };
      }
      case 'opponent': {
        // Веер сверху
        const overlap = Math.min(30, 400 / sameLocationCards.length);
        const offsetX = -((sameLocationCards.length - 1) * overlap) / 2;
        const rotationAngle = (indexInGroup - sameLocationCards.length / 2) * 5;

        return {
          position: 'absolute',
          top: '10%',
          left: '50%',
          transform: `translateX(${offsetX + overlap * indexInGroup}px) rotate(${rotationAngle}deg)`,
          zIndex: 10 + indexInGroup,
        };
      }
      default:
        return {};
    }
  };

  // Считаем сколько карт у player/opponent (для отображения в их компонентах)
  const playerCards = cards.filter(c => c.location === 'player');
  const opponentCards = cards.filter(c => c.location === 'opponent');

  return (
    <div className={styles.gameBoard}>

      <Opponent cards={opponentCards} />

      <Player onStartGame={handleStartGame} cards={playerCards} />

      {/* Все карты одной простынёй */}
      {cards.map((card) => {
        const style = getCardStyle(card);
        return (
          <div key={card.id} style={style}>
            <CardItem card={card} />
          </div>
        );
      })}
    </div>
  );
};

export default GameBoard;
