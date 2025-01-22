// generateOpponentPositions.ts
/**
 * Генерируем координаты (top/left) для numOpponents оппонентов,
 * чтобы равномерно расставить их по верхней части стола.
 * Можно настроить startLeft, endLeft, top и т.д. 
 */
export function generateOpponentSeatPositions(numOpponents: number): { top: string; left: string }[] {
  // Если нет оппонентов
  if (numOpponents <= 0) {
    return [];
  }

  // Если только 1 оппонент, ставим по центру
  if (numOpponents === 1) {
    return [{ top: '5%', left: '50%' }];
  }

  const result: { top: string; left: string }[] = [];

  const leftStart = 20;
  const leftEnd = 80;
  // numOpponents-1 чтобы раскидать точки между start..end
  const segment = (leftEnd - leftStart) / (numOpponents - 1);

  for (let seatIndex = 0; seatIndex < numOpponents; seatIndex++) {
    const leftVal = leftStart + segment * seatIndex;
    result.push({
      top: '5%',
      left: `${leftVal}%`,
    });
  }

  return result;
}
