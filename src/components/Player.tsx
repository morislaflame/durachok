import React, { useState } from 'react';
import Hand from './Hand';
import { Card } from '../types/types';
import styles from './styles/Player.module.css';
import Avatar from './Avatar';

interface PlayerProps {
  isOpponent: boolean;
  avatarUrl?: string;
}

const Player: React.FC<PlayerProps> = ({ isOpponent, avatarUrl }) => {
  const [cards, setCards] = useState<Card[]>([]);

  const handleCardSelect = (card: Card) => {
    // Логика выбора карты
    console.log('Selected card:', card);
  };

  return (
    <div className={styles.playerContainer}>
      <Hand 
        cards={cards} 
        isOpponent={isOpponent}
        onCardSelect={isOpponent ? undefined : handleCardSelect}
      />
      <div className={styles.playerInfo}>
        <Avatar imageUrl={avatarUrl} size="small" alt="Player avatar" />
        <span className={styles.playerName}>
          My name
        </span>
        <span className={styles.cardsCount}>{cards.length}</span>
      </div>
      
    </div>
  );
};

export default Player;