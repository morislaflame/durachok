import React from 'react';
import OpponentHand from './OpponentHand';
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
      <OpponentHand cards={cards} />
    </div>
  );
};

export default Opponent;