// CardItem.tsx
import React from 'react';
import { Card, Suit } from '../../types/types';
import CardFace from './CardFace';
import styles from './styles/CardItem.module.css';

interface CardItemProps {
  card: Card;
  trumpSuit?: Suit | null;
  onClick?: () => void;
  style?: React.CSSProperties;
  isDraggable?: boolean;
  isFaceUp?: boolean;
  dataPlayerHand?: string;
}


const CardItem: React.FC<CardItemProps> = React.memo(
  ({ card, onClick, style, isDraggable = false, isFaceUp = false, dataPlayerHand }) => {
    return (
      <div
        className={`${styles.cardBox} cardBox`}
        onClick={onClick}
        style={{
          touchAction: 'none',
          ...style,
          cursor: isDraggable ? 'grab' : 'default', // Изменение курсора для перетаскиваемых карт
          position: 'absolute', // Обеспечение абсолютного позиционирования для корректной анимации
        }}
        data-flip-id={card.id} // Идентификатор для поиска DOM-элемента
        data-player-hand={dataPlayerHand}
      >
        {isFaceUp ? (
          <CardFace
            card={card}
            isPlayerCard={card.location === 'player'}
            isTableCard={card.location === 'table'}
          />
        ) : (
          <div className={styles.cardBack} />
        )}
      </div>
    );
  }
);

export default CardItem;
