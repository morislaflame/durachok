import React from 'react';
import Hand from './Hand';
import { Card } from '../types/types';
import styles from './styles/Opponent.module.css';
import Avatar from './Avatar';
import avatarImage from '../assets/avatar.jpg';

interface OpponentProps {
  cards: Card[];
  avatarUrl?: string;
}

const Opponent: React.FC<OpponentProps> = ({ cards }) => {
  return (
    <div className={styles.opponentContainer}>
      <Avatar imageUrl={avatarImage} size="small" alt="Opponent avatar" />
      <Hand 
        cards={cards} 
        isOpponent={true}
      />
    </div>
  );
};

export default Opponent;