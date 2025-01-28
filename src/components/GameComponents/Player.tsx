import React from 'react';
import { Card } from '../../types/types';
import styles from './styles/Player.module.css';
import Avatar from './Avatar';
import UserActions from './UserActions';
import avatarImage from '../../assets/avatar.jpg';

interface PlayerProps {
  onStartGame?: () => void;
  onBeat?: () => void;               // <--- новая пропса
  isBeatVisible?: boolean;           // <--- новая пропса
  cards: Card[];
}

const Player: React.FC<PlayerProps> = ({ onStartGame, onBeat, isBeatVisible, cards }) => {
  return (
    <div className={styles.playerContainer}>
      <div className={styles.playerInfo}>
        <UserActions
          onStartGame={onStartGame}
          onBeat={onBeat}
          isBeatVisible={isBeatVisible}
        />
        <Avatar imageUrl={avatarImage} size="small" alt="Player avatar" />
        <span className={styles.playerName}>Player</span>
        <span className={styles.cardsCount}>Cards: {cards.length}</span>
      </div>
    </div>
  );
};

export default Player;
