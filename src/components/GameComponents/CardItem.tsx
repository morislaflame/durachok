// CardItem.tsx
import React from 'react';
import { Card } from '../../types/types';
import CardFace from './CardFace';
import styles from './styles/CardItem.module.css';

interface CardItemProps {
  card: Card;  
  onClick?: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onClick }) => {
  const isFaceUp = (card.location === 'player'); // просто условие
  
  return (
    <div 
      className={`cardWrapper ${styles.cardWrapper}`} 
      data-flip-id={card.id} 
      onClick={onClick}
    >
      {isFaceUp ? (
        <CardFace card={card} isPlayerCard />
      ) : (
        <div className={styles.cardBack} />
      )}
    </div>
  );
};

export default CardItem;
