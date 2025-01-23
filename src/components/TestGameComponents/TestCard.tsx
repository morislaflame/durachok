import React from 'react';
import { Card } from '../../types/types';
import { useSpring, animated } from 'react-spring';
import styles from './styles/TestCard.module.css';

interface TestCardProps {
  card: Card;
  style?: React.CSSProperties;
}

const TestCard: React.FC<TestCardProps> = ({ card, style }) => {
  // Определяем целевые позиции в зависимости от местоположения карты
  const getTargetPosition = (): { x: number; y: number } => {
    switch (card.location) {
      case 'player':
        return { x: 0, y: -100 }; // Примерное смещение для игрока
      case 'opponent':
        return { x: 0, y: -0 }; // Примерное смещение для оппонента
      default:
        return { x: 0, y: 0 };
    }
  };

  const targetPosition = getTargetPosition();

  const props = useSpring({
    to: { opacity: 1, transform: `translate(${targetPosition.x}px, ${targetPosition.y}px) scale(1)` },
    from: { opacity: 0, transform: 'translate(0px, 0px) scale(0.5)' },
    config: { tension: 300, friction: 20 },
  });

  return (
    <animated.div
      className={`card ${styles.card}`}
      data-id={card.id}
      style={{ ...style, ...props }}
    >
      <div className={styles.cardFront}>
        <div className={styles.cardSuit}>{card.suit}</div>
        <div className={styles.cardRank}>{card.rank}</div>
      </div>
    </animated.div>
  );
};

export default TestCard;
