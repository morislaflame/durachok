import React from 'react';
import { Card } from '../../types/types';
import styles from './styles/Opponent.module.css';
import Avatar from './Avatar';
import avatarImage from '../../assets/avatar.jpg';

interface OpponentProps {
  cards: Card[]; // чтобы показать, сколько у него карт, если нужно
}

const Opponent: React.FC<OpponentProps> = () => {
  return (
    <div className={styles.opponentContainer}>
      <Avatar imageUrl={avatarImage} size="small" alt="Opponent avatar" />
      <div className={styles.opponentInfo}>
        <span className={styles.opponentName}>Opponent</span>
      </div>
    </div>
  );
};

export default Opponent;
