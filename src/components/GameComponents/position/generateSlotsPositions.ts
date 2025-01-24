// generateSlotsPositions.ts
/**
 * Генерирует координаты (top/left) для слотов на столе,
 * поддерживая до 3 слотов в ряд и до 2 рядов.
 * @param totalSlots Общее количество слотов (постоянных + временных).
 * @returns Массив объектов с top и left в процентах.
 */
export function generateSlotsPositions(totalSlots: number): { top: number; left: number }[] {
    const positions: { top: number; left: number }[] = [];
  
    if (totalSlots === 0) return positions;
  
    const maxPerRow = 3;
    const rows = Math.ceil(totalSlots / maxPerRow);
  
    for (let i = 0; i < totalSlots; i++) {
      if (rows === 1) {
        // Один ряд, распределение равномерно
        const left = 20 + (60 / (totalSlots + 1)) * (i + 1);
        const top = 50;
        positions.push({ top, left });
      } else if (rows === 2) {
        if (i < maxPerRow) {
          // Верхний ряд
          if (totalSlots >= 3) {
            // Если в верхнем ряду три слота
            if (i === 0) {
              positions.push({ top: 30, left: 20 });
            } else if (i === 1) {
              positions.push({ top: 28, left: 50 });
            } else if (i === 2) {
              positions.push({ top: 30, left: 80 });
            }
          } else {
            // Если в верхнем ряду меньше трёх слотов
            const left = 30 + (40 / (totalSlots + 1)) * (i + 1);
            const top = 30;
            positions.push({ top, left });
          }
        } else {
          // Нижний ряд
          const lowerIndex = i - maxPerRow;
          const cardsInSecondRow = totalSlots - maxPerRow;
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
  
    console.log('Generated slot positions:', positions);
    return positions;
  }
