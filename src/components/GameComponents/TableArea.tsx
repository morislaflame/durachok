// TableArea.tsx
import React, { forwardRef } from 'react';
import styles from './styles/TableArea.module.css';
import { tablePositions } from './position/cardPositioning';

interface TableAreaProps {
  /** Ссылки на слоты для доступа к их DOM-элементам */
  slotRefs: React.RefObject<HTMLDivElement>[];
  /** Флаг, указывающий, активна ли подсветка зоны стола */
  isActive: boolean;
}

const TableArea = forwardRef<HTMLDivElement, TableAreaProps>(({ slotRefs, isActive }, ref) => {
  return (
    <div ref={ref} className={`${styles.tableArea} ${isActive ? styles.active : ''}`}>
      {/* Визуальное обозначение слотов */}
      {tablePositions.map((pos, index) => (
        <div
          key={index}
          ref={slotRefs[index]}
          className={styles.slot}
          style={{
            top: `${pos.top}%`,
            left: `${pos.left}%`,
            width: '60px',
            height: '85px',
          }}
        />
      ))}
      {/* Визуальное обозначение стола */}
      <div className={styles.tableBackground}></div>
    </div>
  );
});

export default TableArea;
