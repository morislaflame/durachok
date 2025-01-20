import React, { useState } from 'react';
import Player from './Player';
import Deck from './Deck';
import { Card } from '../types/types';
import styles from './styles/GameBoard.module.css';
import Opponent from './Opponent';
import GameStart from '../utils/GameStart';

const GameBoard: React.FC = () => {
  const [playerCards, setPlayerCards] = useState<Card[]>([]);
  const [opponentCards, setOpponentCards] = useState<Card[]>([]);
  const [trump, setTrump] = useState<Card | null>(null);
  const [deck, setDeck] = useState<Card[]>([]);
  const [isGameStarted, setIsGameStarted] = useState(false);

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