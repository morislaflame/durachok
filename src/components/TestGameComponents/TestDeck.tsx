import React from 'react';
import TestCard from './TestCard';
import styles from './styles/TestDeck.module.css';
import { Card } from '../../types/types';
import { useTransition, animated } from 'react-spring';

interface TestDeckProps {
  cards: Card[];
}

const TestDeck: React.FC<TestDeckProps> = ({ cards }) => {
  const transitions = useTransition(cards, {
    keys: (card: Card) => card.id,
    from: { opacity: 0, transform: 'scale(0.5)' },
    enter: { opacity: 1, transform: 'scale(1)' },
    leave: { opacity: 0, transform: 'scale(0.5)' },
    config: { tension: 300, friction: 20 },
  });

  return (
    <div className={styles.deck}>
      {transitions((style, card) => (
        <animated.div
          style={{
            ...style,
            top: `${cards.indexOf(card) * 0.2}px`,
            left: `${cards.indexOf(card) * 0.2}px`,
            zIndex: cards.indexOf(card),
            position: 'absolute',
          }}
          key={card.id}
        >
          <TestCard card={card} />
        </animated.div>
      ))}
      <div className={styles.deckCount}>{cards.length}</div>
    </div>
  );
};

export default TestDeck;
