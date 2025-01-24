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
  shouldRevert?: boolean;
  onRevertComplete?: () => void;
}

const CardItem: React.FC<CardItemProps> = React.memo(({
  card,
  onClick,
  onCardDrop,
  shouldRevert,
  onRevertComplete,
}) => {
  const cardRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (card.location !== 'player') return;

    const element = cardRef.current;
    if (!element) {
      console.error(`Card element for ${card.id} not found`);
      return;
    }

    console.log(`Initializing Draggable for card ${card.id}`);

    const draggable = Draggable.create(element, {
      type: "x,y",
      onPress: function () {
        console.log(`Drag started for card ${card.id}`);
      },
      onDragEnd: function () {
        console.log(`Drag ended for card ${card.id}`);
        const rect = element.getBoundingClientRect();
        if (onCardDrop) {
          onCardDrop(card.id, { x: rect.left, y: rect.top });
        }
      },
    })[0];

    return () => {
      if (draggable) {
        draggable.kill();
        gsap.set(element, { x: 0, y: 0 });
        console.log(`Draggable killed for card ${card.id}`);
      }
    };
  }, [card.location, onCardDrop, card.id]);

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
    card.location === 'table';

  return (
    <div
      ref={cardRef}
      className={`cardWrapper ${styles.cardWrapper}`}
      data-flip-id={card.id}
      onClick={onClick}
      style={{ touchAction: 'none', position: 'absolute' }} // Добавлено position: 'absolute' для корректного позиционирования
    >
      {isFaceUp ? (
        <CardFace card={card} isPlayerCard={card.location === 'player'} isTableCard={card.location === 'table'} />
      ) : (
        <div className={styles.cardBack} />
      )}
    </div>
  );
});

export default CardItem;
