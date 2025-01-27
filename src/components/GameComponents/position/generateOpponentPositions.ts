export function generateOpponentSeatPositions(numOpponents: number): { top: string; left: string }[] {
  if (numOpponents <= 0) {
    return [];
  }

  // Если только 1 оппонент: ставим в центр сверху
  if (numOpponents === 1) {
    return [{ top: '5%', left: '50%' }];
  }

  const positions: { top: string; left: string }[] = [];

  // Линейная интерполяция по оси X
  const leftStart = 10;  // начальный % слева
  const leftEnd = 80;    // конечный % справа
  const segment = (leftEnd - leftStart) / (numOpponents - 1);

  // "Пик" (самая верхняя точка)
  const peakTop = 2; 
  const step = 2;

  // "Средний" оппонент (может быть дробным, если numOpponents чётное)
  const middle = (numOpponents - 1) / 2;

  for (let seatIndex = 0; seatIndex < numOpponents; seatIndex++) {
    // Считаем X
    const leftVal = leftStart + segment * seatIndex;

    // Считаем, на сколько текущий seatIndex отстоит от "центра"
    const distanceFromMiddle = Math.abs(seatIndex - middle);

    // Чем дальше от центра, тем ниже:
    const topVal = peakTop + step * distanceFromMiddle;

    positions.push({
      top: `${topVal}%`,
      left: `${leftVal}%`,
    });
  }

  return positions;
}
