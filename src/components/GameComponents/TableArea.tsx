// TableArea.tsx
import React from 'react';
import styles from './styles/TableArea.module.css';
import { Card } from '../../types/types';
import { generateTablePositions } from './position/generateTablePositions';

interface TableAreaProps {
  isActive: boolean;
  tableCards: Card[];
  cardRefs: { [key: string]: React.RefObject<HTMLDivElement> };
}

const TableArea: React.FC<TableAreaProps> = ({ isActive, tableCards, cardRefs }) => {
  const positions = generateTablePositions(tableCards.length);

  return (
    <div className={`${styles.tableArea} ${isActive ? styles.active : ''}`}>
      {/* Визуальное обозначение стола */}
      <div className={styles.tableBackground}></div>
      {/* Контейнер для карт на столе */}
      <div className={styles.tableCardsContainer}>
        {tableCards.map((card, index) => (
          <div
            key={card.id}
            ref={cardRefs[card.id]}
            style={{
              position: 'absolute',
              left: positions[index].left,
              top: positions[index].top,
              transform: 'translate(-50%, -50%)', // Центрирование карты по позиции
              zIndex: index, // Располагаем карты друг над другом
            }}
            data-flip-id={card.id}
          >
          </div>
        ))}
      </div>
    </div>
  );
};

export default TableArea;
