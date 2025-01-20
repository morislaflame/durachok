import React from 'react';
import Card from './Card';
import { Card as CardType } from '../types/types';
import styles from './styles/Hand.module.css';

interface PlayerHandProps {
  cards: CardType[];
  onCardSelect?: (card: CardType) => void;
}

const PlayerHand: React.FC<PlayerHandProps> = ({ cards, onCardSelect }) => {
  return (
    <div className={styles.handContainer}>
      {cards.map((card, index) => {
        const overlap = Math.min(35, 400 / cards.length);
        const marginLeft = index === 0 ? 0 : -overlap;
        const rotationAngle = (index - cards.length / 2) * 3; // Небольшой поворот для каждой карты
        
        return (
          <div 
            key={`${card.suit}-${card.rank}`} 
            className={styles.cardWrapper}
            style={{ 
              marginLeft: `${marginLeft}px`, 
              zIndex: index,
              transform: `rotate(${rotationAngle}deg)`,
              transformOrigin: 'bottom center' // Точка вращения снизу по центру
            }}
          >
            <Card 
              card={card}
              onClick={() => onCardSelect?.(card)}
              isPlayerCard={true}
            />
          </div>
        );
      })}
    </div>
  );
};

export default PlayerHand;