import React from 'react';
import { Card, Suit } from '../../types/types';
import CardFace from './CardFace';
import styles from './styles/CardItem.module.css';

interface CardItemProps {
  card: Card;
  trumpSuit?: Suit | null; 
  onClick?: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onClick }) => {
  // Если карта у игрока — показываем лицо.
  // Если карта == trump — тоже показываем лицо, 
  // иначе рубашка.
  const isFaceUp = 
    card.location === 'player' || 
    card.location === 'trump';

  // Проверим, козырь ли это:

  return (
    <div
      className={`cardWrapper ${styles.cardWrapper}`}
      data-flip-id={card.id}
      onClick={onClick}
    >
      {isFaceUp ? (
        <CardFace card={card} isPlayerCard={card.location === 'player'} />
      ) : (
        <div className={styles.cardBack} />
      )}
    </div>
  );
};

export default CardItem;
