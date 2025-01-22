// components/CardFace.tsx
import React from 'react';
import { Card as CardType } from '../../types/types';
import styles from './styles/Card.module.css';

interface CardFaceProps {
  card: CardType;
  isPlayerCard?: boolean;
}

const CardFace: React.FC<CardFaceProps> = ({ card, isPlayerCard }) => {
  const getSuitSymbol = (suit: string) => {
    switch (suit) {
      case 'hearts': return '♥';
      case 'diamonds': return '♦';
      case 'clubs': return '♣';
      case 'spades': return '♠';
      default: return suit;
    }
  };

  const suitClass = (card.suit === 'hearts' || card.suit === 'diamonds')
    ? styles.suitRed 
    : styles.suitBlack;

  return (
    <div className={`${styles.container} ${isPlayerCard ? styles.playerCard : ''}`}>
      <div className={styles.topValue}>
        <span className={styles.rank}>{card.rank}</span>
        <span className={`${styles.suit} ${suitClass}`}>
          {getSuitSymbol(card.suit)}
        </span>
      </div>
      <div className={styles.bottomValue}>
        <span className={styles.rank}>{card.rank}</span>
        <span className={`${styles.suit} ${suitClass}`}>
          {getSuitSymbol(card.suit)}
        </span>
      </div>
    </div>
  );
};

export default CardFace;
