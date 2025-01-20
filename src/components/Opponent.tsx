import React from 'react';
import Hand from './Hand';
import { Card } from '../types/types';
import styles from './styles/Opponent.module.css';
import Avatar from './Avatar';

interface OpponentProps {
  cards: Card[];
  avatarUrl?: string;
}

const Opponent: React.FC<OpponentProps> = ({ cards, avatarUrl }) => {
  return (
    <div className={styles.opponentContainer}>
        <Avatar imageUrl={avatarUrl} size="small" alt="Opponent avatar" />
      <Hand 
        cards={cards} 
        isOpponent={true}
      />
    </div>
  );
};

export default Opponent;