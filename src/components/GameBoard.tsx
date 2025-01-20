import React, { useState } from 'react';
import Player from './Player';
import Deck from './Deck';
import { Card } from '../types/types';
import styles from './styles/GameBoard.module.css';
import Opponent from './Opponent';

const GameBoard: React.FC = () => {
  const [attackingCards, setAttackingCards] = useState<Card[]>([]);
  const [defendingCards, setDefendingCards] = useState<Card[]>([]);
  const [trump, setTrump] = useState<Card | null>(null);

  return (
    <div className={styles.container}>
      <div className={styles.playersContainer}>
        <Opponent cards={[]} avatarUrl="/opponent-avatar.png" />
        
        <div className={styles.playingField}>
          <Deck trump={trump} />
          
          <div className={styles.tableCards}>
            {attackingCards.map((card, index) => (
              <div key={`attack-${index}`} className={styles.cardSlot}>
                {/* Атакующие карты */}
              </div>
            ))}
            {defendingCards.map((card, index) => (
              <div key={`defend-${index}`} className={styles.cardSlot}>
                {/* Защищающиеся карты */}
              </div>
            ))}
          </div>
        </div>

        <Player isOpponent={false} />
      </div>
    </div>
  );
};

export default GameBoard;