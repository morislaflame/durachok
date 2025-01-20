import React from 'react';
import Hand from './Hand';
import { Card } from '../types/types';
import styles from './styles/Player.module.css';
import Avatar from './Avatar';
import UserActions from './UserActions';
import avatarImage from '../assets/avatar.jpg';

interface PlayerProps {
  isOpponent: boolean;
  avatarUrl?: string;
  onStartGame?: () => void;
  cards: Card[];
}

const Player: React.FC<PlayerProps> = ({ isOpponent, onStartGame, cards }) => {
//   const [cards, setCards] = useState<Card[]>([]);

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
        <UserActions onStartGame={onStartGame} />
        <Avatar imageUrl={avatarImage} size="small" alt="Player avatar" />
        <span className={styles.playerName}>
          Player
        </span>
        <span className={styles.cardsCount}>{cards.length}</span>
      </div>
      
    </div>
  );
};

export default Player;