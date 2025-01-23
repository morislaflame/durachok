import React from 'react';
import { Rank, Suit } from '../../types/types';
import styles from './styles/TestBoard.module.css';

interface TestCard {
    id: string;
    rank: Rank;
    suit: Suit;
}

const TestCard = () => {

    const testCard: TestCard = {
        id: '1',
        rank: '6',
        suit: 'hearts',
    };

  return (
    <div className={`testCard ${styles.testCard}`}>
      <div className={styles.testCardFront}>
        <div className={styles.testCardSuit}>{testCard.suit}</div>
        <div className={styles.testCardRank}>{testCard.rank}</div>
      </div>
    </div>
  );
};

export default TestCard;