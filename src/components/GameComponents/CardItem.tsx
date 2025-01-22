// CardItem.tsx
import React, { useRef, useEffect } from 'react';
import { Card, Suit } from '../../types/types';
import CardFace from './CardFace';
import styles from './styles/CardItem.module.css';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';

gsap.registerPlugin(Draggable);

interface CardItemProps {
  card: Card;
  trumpSuit?: Suit | null; 
  onClick?: () => void;
}

const CardItem: React.FC<CardItemProps> = ({ card, onClick }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (card.location !== 'player') return;

    const element = cardRef.current;
    if (!element) return;

    const draggable = Draggable.create(element, {
      type: "x,y",
      onDragEnd: function () {
        // Анимация возврата на исходную позицию (x: 0, y: 0)
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
        });
      },
    })[0];

    return () => {
      draggable.kill();
    };
  }, [card.location]);

  const isFaceUp = 
    card.location === 'player' || 
    card.location === 'trump';

  return (
    <div
      ref={cardRef}
      className={`cardWrapper ${styles.cardWrapper}`}
      data-flip-id={card.id} // Уникальный ID
      onClick={onClick}
      style={{ touchAction: 'none' }} // Для предотвращения конфликтов с Draggable
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
