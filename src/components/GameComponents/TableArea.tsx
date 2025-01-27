// TableArea.tsx
import React from 'react';
import styles from './styles/TableArea.module.css';
import { Card } from '../../types/types';

interface TableAreaProps {
  isActive: boolean;
  tableCards: Card[];
  cardRefs: { [key: string]: React.RefObject<HTMLDivElement> };
}

const TableArea: React.FC<TableAreaProps> = ({ isActive }) => {

  return (
    <div className={`${styles.tableArea} ${isActive ? styles.active : ''}`}>
      {/* Визуальное обозначение стола */}
      <div className={styles.tableBackground}></div>
      {/* Контейнер для карт на столе */}
      
    </div>
  );
};

export default TableArea;
