// TableArea.tsx
import React, { forwardRef } from 'react';
import styles from './styles/TableArea.module.css';

interface TableAreaProps {
  /** Флаг, указывающий, активна ли подсветка зоны стола */
  isActive: boolean;
}

/**
 * Компонент, отображающий область стола.
 */
const TableArea = forwardRef<HTMLDivElement, TableAreaProps>(({ isActive }, ref) => {
  return (
    <div ref={ref} className={`${styles.tableArea} ${isActive ? styles.active : ''}`}>
      {/* Визуальное обозначение стола */}
      <div className={styles.tableBackground}></div>
    </div>
  );
});

export default TableArea;
