import React from 'react';
import { Card } from '../../types/types';
import styles from './styles/Player.module.css';
import Avatar from './Avatar';
import UserActions from './UserActions';

interface PlayerProps {
  onStartGame?: () => void;
  onBeat?: () => void;               // <--- новая пропса
  isBeatVisible?: boolean;           // <--- новая пропса
  cards: Card[];
  onTakeCards?: () => void;
  isTakeVisible?: boolean;
}

const Player: React.FC<PlayerProps> = ({ onStartGame, onBeat, isBeatVisible, cards, onTakeCards, isTakeVisible }) => {
  return (
    <div className={styles.playerContainer}>
      <div className={styles.playerInfo}>
        <UserActions
          onStartGame={onStartGame}
          onBeat={onBeat}
          isBeatVisible={isBeatVisible}
          onTakeCards={onTakeCards}
          isTakeVisible={isTakeVisible}
        />
        <Avatar imageUrl={'/emoji.png'} size="small" alt="Player avatar" />
      </div>
    </div>
  );
};

export default Player;
