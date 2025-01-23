// generateTablePositions.ts
export function generateTablePositions(tableCardsCount: number): { left: string; top: string }[] {
    const positions: { left: string; top: string }[] = [];
    const centerX = 50; // Центр по оси X в процентах
    const centerY = 50; // Центр по оси Y в процентах
    const spread = 30; // Разброс карт в процентах
  
    if (tableCardsCount === 0) return positions;
  
    // Распределяем карты по горизонтали вокруг центра
    const totalSpread = spread; // Общий разброс
    const step = totalSpread / Math.max(tableCardsCount - 1, 1);
    const startX = centerX - (totalSpread / 2);
  
    for (let i = 0; i < tableCardsCount; i++) {
      const left = startX + step * i;
      positions.push({
        left: `${left}%`,
        top: `${centerY}%`,
      });
    }
  
    return positions;
  }
  