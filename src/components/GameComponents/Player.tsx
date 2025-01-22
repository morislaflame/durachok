import React from 'react';
import { Card } from '../../types/types';
import styles from './styles/Player.module.css';
import Avatar from './Avatar';
import UserActions from './UserActions';
import avatarImage from '../../assets/avatar.jpg';

interface PlayerProps {
  onStartGame?: () => void;
  cards: Card[]; // чтобы узнать сколько у игрока карт, если нужно
}

const Player: React.FC<PlayerProps> = ({ onStartGame, cards }) => {
  return (
    <div className={styles.playerContainer}>
      <div className={styles.playerInfo}>
        {/* Кнопка "Start Game" будет здесь */}
        <UserActions onStartGame={onStartGame} />

        <Avatar imageUrl={avatarImage} size="small" alt="Player avatar" />
        
        <span className={styles.playerName}>Player</span>
        <span className={styles.cardsCount}>Cards: {cards.length}</span>
      </div>
    </div>
  );
};

export default Player;
