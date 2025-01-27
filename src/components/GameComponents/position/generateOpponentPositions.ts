export function generateOpponentSeatPositions(numOpponents: number): { top: string; left: string }[] {
  if (numOpponents <= 0) {
    return [];
  }

  // Если только 1 оппонент: ставим в центр сверху
  if (numOpponents === 1) {
    return [{ top: '2%', left: '45%' }];
  }

  const positions: { top: string; left: string }[] = [];

  const leftStart = 10; 
  const leftEnd = 80; 
  const segment = (leftEnd - leftStart) / (numOpponents - 1);

  const peakTop = 2; 
  const step = 2;

  const middle = (numOpponents - 1) / 2;

  for (let seatIndex = 0; seatIndex < numOpponents; seatIndex++) {
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
