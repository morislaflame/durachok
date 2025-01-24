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
  onCardDrop?: (cardId: string, position: { x: number; y: number }) => void;
  shouldRevert?: boolean; // Новый пропс для указания, нужно ли вернуть карту
  onRevertComplete?: () => void; // Новый пропс для уведомления о завершении возврата
  onDragStart?: () => void; // Новый пропс для уведомления о начале перетаскивания
}

const CardItem: React.FC<CardItemProps> = ({ card, onClick, onCardDrop, shouldRevert, onRevertComplete, onDragStart }) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (card.location !== 'player') return;

    const element = cardRef.current;
    if (!element) {
      console.error(`Card element for ${card.id} not found`);
      return;
    }

    const draggable = Draggable.create(element, {
      type: "x,y",
      onPress: function () {
        console.log(`Drag started for card ${card.id}`);
        if (onDragStart) {
          onDragStart();
        }
      },
      onDragEnd: function () {
        console.log(`Drag ended for card ${card.id}`);
        if (onCardDrop) {
          // Получаем текущую позицию карты относительно окна
          const rect = element.getBoundingClientRect();
          onCardDrop(card.id, { x: rect.left, y: rect.top });
        }
      },
    })[0];

    return () => {
      gsap.set(element, { x: 0, y: 0 });
      draggable.kill();
      console.log(`Draggable killed for card ${card.id}`);
    };
  }, [card.location, onCardDrop, onDragStart, card.id]);

  useEffect(() => {
    if (shouldRevert && card.location === 'player') {
      const element = cardRef.current;
      if (element) {
        console.log(`Reverting card ${card.id} to original position`);
        gsap.to(element, {
          x: 0,
          y: 0,
          duration: 0.8,
          ease: "power4.out",
          onComplete: () => {
            if (onRevertComplete) {
              onRevertComplete();
              console.log(`Revert complete for card ${card.id}`);
            }
          },
        });
      } else {
        console.error(`Element for card ${card.id} not found during revert`);
      }
    }
  }, [shouldRevert, card.location, onRevertComplete, card.id]);

  const isFaceUp = 
    card.location === 'player' || 
    card.location === 'trump' ||
    card.location === 'table'; // Показываем лицо, если на столе

  return (
    <div
      ref={cardRef}
      className={`cardWrapper ${styles.cardWrapper}`}
      data-flip-id={card.id} // Уникальный ID
      onClick={onClick}
      style={{ touchAction: 'none' }} // Для предотвращения конфликтов с Draggable
    >
      {isFaceUp ? (
        <CardFace card={card} isPlayerCard={card.location === 'player'} isTableCard={card.location === 'table'} />
      ) : (
        <div className={styles.cardBack} />
      )}
    </div>
  );
};

export default CardItem;
