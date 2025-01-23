// generateSlotsPositions.ts
/**
 * Генерирует координаты (top/left) для слотов на столе,
 * поддерживая до 3 слотов в ряд и до 2 рядов.
 * @param currentCount Текущее количество слотов.
 * @returns Массив объектов с top и left в процентах.
 */
export function generateSlotsPositions(currentCount: number): { top: number; left: number }[] {
    const positions: { top: number; left: number }[] = [];
  
    if (currentCount === 0) return positions;
  
    const maxPerRow = 3;
    const rows = Math.ceil(currentCount / maxPerRow);
  
    for (let i = 0; i < currentCount; i++) {
      if (rows === 1) {
        // Одно ряд, распределение равномерно
        const left = 20 + (60 / (currentCount + 1)) * (i + 1);
        const top = 50;
        positions.push({ top, left });
      } else if (rows === 2) {
        if (i < maxPerRow) {
          // Верхний ряд
          if (currentCount >= 3) {
            // Если в верхнем ряду три слота
            if (i === 0) {
              positions.push({ top: 30, left: 20 });
            } else if (i === 1) {
              positions.push({ top: 28, left: 45 });
            } else if (i === 2) {
              positions.push({ top: 30, left: 70 });
            }
          } else {
            // Если в верхнем ряду меньше трёх слотов
            const left = 30 + (40 / (currentCount + 1)) * (i + 1);
            const top = 30;
            positions.push({ top, left });
          }
        } else {
          // Нижний ряд
          const lowerIndex = i - maxPerRow;
          const cardsInSecondRow = currentCount - maxPerRow;
          const left = 30 + (40 / (cardsInSecondRow + 1)) * (lowerIndex + 1);
          const top = 55;
          positions.push({ top, left });
        }
      } else {
        // Больше двух рядов не предусмотрено, но можно расширить при необходимости
        const left = 30 + (40 / (maxPerRow + 1)) * ((i % maxPerRow) + 1);
        const top = 30 + 25 * Math.floor(i / maxPerRow); // Распределение по вертикали
        positions.push({ top, left });
      }
    }
  
    return positions;
  }
  