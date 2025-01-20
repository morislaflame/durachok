import React from 'react';
import { Card as CardType } from '../types/types';
import styles from './styles/Hand.module.css';

interface OpponentHandProps {
  cards: CardType[];
}

const OpponentHand: React.FC<OpponentHandProps> = ({ cards }) => {
  return (
    <div className={styles.opponentHandContainer}>
      {cards.map((card, index) => {
        const overlap = Math.min(30, 400 / cards.length);
        const marginLeft = index === 0 ? 0 : -overlap;
        
        return (
          <div 
            key={`${card.suit}-${card.rank}`}
            className={`${styles.cardWrapper} opponent-card-${index}`}
            style={{ 
              marginLeft: `${marginLeft}px`, 
              zIndex: index,
              transform: `rotate(${(index - cards.length / 2) * 10}deg)`,
              opacity: 0,
              visibility: 'hidden'
            }}
          >
            <div className={styles.cardBack} />
          </div>
        );
      })}
    </div>
  );
};

export default OpponentHand;