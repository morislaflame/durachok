// PlayerHand.tsx
import React from 'react';
import { Card as CardType } from '../../types/types';
import Card from './Card';
import styles from './styles/Hand.module.css';

interface PlayerHandProps {
  cards: CardType[];
  onCardSelect?: (card: CardType) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ cards, onCardSelect }) => {
  return (
    <div className={`${styles.handContainer} player-hand`}>
      {cards.map((card, index) => {
        const overlap = Math.min(35, 400 / cards.length);
        const marginLeft = index === 0 ? 0 : -overlap;
        const rotationAngle = (index - cards.length / 2) * 3;
        
        return (
          <div 
            key={card.id}
            className={`${styles.cardWrapper} cardWrapper`}
            style={{ 
              marginLeft: `${marginLeft}px`, 
              zIndex: index,
              transform: `rotate(${rotationAngle}deg)`,
              transformOrigin: 'bottom center'
            }}
            onClick={() => onCardSelect?.(card)}
          >
            <Card card={card} isPlayerCard={true} />
          </div>
        );
      })}
    </div>
  );
};

export default PlayerHand;
