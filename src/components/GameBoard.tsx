import React, { useState, useEffect } from 'react';
import Player from './Player';
import Deck from './Deck';
import { Card } from '../types/types';
import styles from './styles/GameBoard.module.css';
import Opponent from './Opponent';
import GameStart from '../utils/GameStart';
import { animateDealingCards } from '../utils/dealCards';

const GameBoard: React.FC = () => {
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [opponentCards, setOpponentCards] = useState<Card[]>([]);
  const [trump, setTrump] = useState<Card | null>(null);
  const [deck, setDeck] = useState<Card[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [shouldAnimate, setShouldAnimate] = useState(false);

  useEffect(() => {
    if (shouldAnimate && playerCards.length > 0 && opponentCards.length > 0) {
      // Небольшая задержка, чтобы убедиться, что DOM обновился
      setTimeout(() => {
        animateDealingCards({
          playerCards,
          opponentCards,
          onComplete: () => {
            console.log('Раздача карт завершена');
            setShouldAnimate(false);
          }
        });
      }, 100);
    }
  }, [shouldAnimate, playerCards, opponentCards]);

  const handleGameInitialized = (
    playerCards: Card[],
    opponentCards: Card[],
    trump: Card,
    remainingDeck: Card[]
  ) => {
    setPlayerCards(playerCards);
    setOpponentCards(opponentCards);
    setTrump(trump);
    setDeck(remainingDeck);
    setShouldAnimate(true);
  };

  const handleStartGame = () => {
    setIsGameStarted(true);
  };

  return (
    <div className={styles.container}>
      {isGameStarted && (
        <GameStart onGameInitialized={handleGameInitialized} />
      )}
      
      <div className={styles.playersContainer}>
        <Opponent cards={opponentCards} />
        
        <div className={styles.playingField}>
          <Deck trump={trump} />
          <div className={styles.tableCards}>
            {/* Игровое поле */}
          </div>
        </div>

        <Player 
          isOpponent={false} 
          cards={playerCards}
          onStartGame={!isGameStarted ? handleStartGame : undefined}
        />
      </div>
    </div>
  );
};

export default GameBoard;