import React from 'react';
import { Card as CardType } from '../types/types';
import Card from './Card';
import styles from './styles/Deck.module.css';

interface DeckProps {
  trump?: CardType | null;
}

const Deck: React.FC<DeckProps> = ({ trump }) => {
  return (
    <div className={styles.deckContainer}>
      <div className={styles.deckPile}>
        <div className={styles.cardBackPile} />
      </div>
      
      {trump && (
        <div className={styles.trumpCard}>
          <Card card={trump} />
        </div>
      )}
    </div>
  );
};

export default Deck;