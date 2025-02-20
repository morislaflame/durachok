// Opponent.tsx
import React from 'react';
import { Card } from '../../types/types';
import styles from './styles/Opponent.module.css';
import Avatar from './Avatar';
import avatarImage from '../../assets/avatar.jpg';

interface OpponentProps {
  cards: Card[];
  playerId: string;
}


const Opponent: React.FC<OpponentProps> = ({ cards, playerId }) => {
  // Можем вывести, сколько карт у этого оппонента, или имя вида "Opponent #3"
  const name = `Opponent #${playerId}`;


  return (
    <div className={styles.opponentContainer}>
      <Avatar imageUrl={avatarImage} size="small" alt={name} />
      <div className={styles.opponentInfo}>
        <span className={styles.opponentName}>{name}</span>
        <span className={styles.cardsCount}>Cards: {cards.length}</span>
      </div>
    </div>
  );
};




export default Opponent;
