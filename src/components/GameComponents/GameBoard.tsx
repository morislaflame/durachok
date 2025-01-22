// GameBoard.tsx
import React, { useState, useRef } from 'react';
import Opponent from './Opponent';
import Player from './Player';
import Deck from './Deck';
import GameStart from '../../utils/GameStart';

import { captureFlipState, animateFlip, FlipState } from '../../utils/dealCards';
import { Card } from '../../types/types';
import styles from './styles/GameBoard.module.css';

const GameBoard: React.FC = () => {
  const [cards, setCards] = useState<Card[]>([]);

  // Храним FlipState здесь
  const flipStateRef = useRef<FlipState | null>(null);

  /**
   * 1) Когда GameStart закончил инициализацию,
   *    у нас просто все карты = deck (location='deck').
   */
  const handleGameInitialized = (allDeck: Card[]) => {
    setCards(allDeck); // Теперь в Deck будет, допустим, 36 карт
  };

  /**
   * 2) При клике "Start Game" (у игрока):
   *    мы раздаём 6 карт -> player, 6 карт -> opponent,
   *    и запускаем Flip-анимацию.
   */
  const handleStartGame = () => {
    // 1) Снять старое состояние
    flipStateRef.current = captureFlipState();

    // 2) Меняем location (через setState)
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

    // 3) После перерисовки - animateFlip
    requestAnimationFrame(() => {
      if (flipStateRef.current) {
        animateFlip(flipStateRef.current, () => {
          console.log('Flip animation done.');
          flipStateRef.current = null;
        });
      }
    });
  };

  return (
    <div className={styles.container}>
      {/*
        При первом рендере GameStart монтируется,
        вызывает handleGameInitialized(...),
        и мы получаем все карты = 'deck'.
      */}
      <GameStart onGameInitialized={handleGameInitialized} />

      <div className={styles.playersContainer}>
        {/* Оппонент */}
        <Opponent cards={cards.filter(c => c.location === 'opponent')} />

        <div className={`${styles.playingField} playingField`}>
          {/* Колода (location='deck') */}
          <Deck cards={cards.filter(c => c.location === 'deck')} />
          
          <div className={styles.tableCards}>
            {/* Игровое поле (если нужно) */}
          </div>
        </div>

        {/* Игрок */}
        <Player
          isOpponent={false}
          cards={cards.filter(c => c.location === 'player')}
          onStartGame={handleStartGame}
        />
      </div>
    </div>
  );
};

export default GameBoard;
