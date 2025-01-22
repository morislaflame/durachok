// OpponentHand.tsx
import React from 'react';
import { Card as CardType } from '../../types/types';
import styles from './styles/Hand.module.css';

interface OpponentHandProps {
  cards: CardType[];
}

const OpponentHand: React.FC<OpponentHandProps> = ({ cards }) => {
  return (
    <div className={`${styles.opponentHandContainer} opponent-hand`}>
      {cards.map((card, index) => {
        const overlap = Math.min(30, 400 / cards.length);
        const marginLeft = index === 0 ? 0 : -overlap;
        const rotationAngle = (index - cards.length / 2) * 10;
        
        return (
          <div
            key={card.id}
            className={`${styles.cardWrapper} cardWrapper`}
            style={{ 
              marginLeft: `${marginLeft}px`, 
              zIndex: index,
              transform: `rotate(${rotationAngle}deg)`
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
