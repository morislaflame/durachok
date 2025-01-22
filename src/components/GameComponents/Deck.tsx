import React, { forwardRef } from 'react';
import { Card as CardType } from '../../types/types';
import styles from './styles/Deck.module.css';

interface DeckProps {
  cards: CardType[];
}

const Deck = forwardRef<HTMLDivElement, DeckProps>(({ cards }, ref) => {
  return (
    <div ref={ref} className={styles.deckContainer}>
      <div className={styles.deckPile}>
        {cards.map((card) => (
          <div
            key={card.id}
            className={`cardWrapper ${styles.cardBackPile}`}
          />
        ))}
      </div>
    </div>
  );
});

export default Deck;
