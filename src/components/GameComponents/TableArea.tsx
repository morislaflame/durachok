// TableArea.tsx
import React, { forwardRef } from 'react';
import styles from './styles/TableArea.module.css';

interface TableAreaProps {
  /** Флаг, указывающий, активна ли подсветка зоны стола */
  isActive: boolean;
  children: React.ReactNode;
}

const TableArea = forwardRef<HTMLDivElement, TableAreaProps>(({ isActive, children }, ref) => {
  return (
    <div 
      ref={ref} 
      className={`${styles.tableArea} ${isActive ? styles.active : ''}`}
    >
      {/* Визуальное обозначение стола */}
      <div className={styles.tableBackground}></div>
      {/* Контейнер для карт на столе */}
      <div className={styles.tableCardsContainer}>
        {children}
      </div>
    </div>
  );
});

export default TableArea;
