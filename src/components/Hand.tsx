import React from 'react';
import Card from './Card';
import { Card as CardType } from '../types/types';
import styles from './styles/Hand.module.css';

interface HandProps {
  cards: CardType[];
  isOpponent: boolean;
  onCardSelect?: (card: CardType) => void;
}

const Hand: React.FC<HandProps> = ({ cards, isOpponent, onCardSelect }) => {
  return (
    <div className={styles.handContainer}>
      {cards.map((card, index) => {
        const overlap = Math.min(30, 400 / cards.length);
        const marginLeft = index === 0 ? 0 : -overlap;
        
        return (
          <div 
            key={`${card.suit}-${card.rank}`} 
            className={styles.cardWrapper}
            style={{ marginLeft: `${marginLeft}px`, zIndex: index }}
          >
            {isOpponent ? (
              <div className={styles.cardBack} />
            ) : (
              <Card 
                card={card}
                onClick={() => onCardSelect?.(card)}
              />
            )}
          </div>
        );
      })}
    </div>
  );
};

export default Hand;