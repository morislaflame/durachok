import React from 'react';
import TestCard from './TestCard';
import styles from './styles/TestOpponent.module.css';
import { Card } from '../../types/types';
import { useTransition, animated } from 'react-spring';

interface TestOpponentProps {
  cards: Card[];
}

const TestOpponent: React.FC<TestOpponentProps> = ({ cards }) => {
  const transitions = useTransition(cards, {
    keys: (card: Card) => card.id,
    from: { opacity: 0, transform: 'translateY(-50px)' },
    enter: { opacity: 1, transform: 'translateY(0px)' },
    leave: { opacity: 0, transform: 'translateY(-50px)' },
    config: { tension: 300, friction: 20 },
  });

  return (
    <div className={`testOpponent ${styles.testOpponent}`}>
      {transitions((style, card) => (
        <animated.div style={style} key={card.id}>
          <TestCard card={card} />
        </animated.div>
      ))}
    </div>
  );
};

export default TestOpponent;
