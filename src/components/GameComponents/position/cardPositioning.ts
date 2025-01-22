// cardPositioning.ts
import { Card } from '../../../types/types';
import { CSSProperties } from 'react';

export function getCardStyle(card: Card, allCards: Card[], numPlayers: number): CSSProperties {
  // Собираем все карты, которые:
  //   1) в той же location
  //   2) у того же seatIndex (если location='opponent')
  const sameLocationCards = allCards.filter(
    (c) => c.location === card.location && c.seatIndex === card.seatIndex
  );

  const indexInGroup = sameLocationCards.findIndex((c) => c.id === card.id);

  switch (card.location) {
    case 'deck':
      return getDeckCardStyle(indexInGroup);

    case 'trump':
      return getTrumpCardStyle();

    case 'player':
      return getPlayerCardStyle(indexInGroup, sameLocationCards.length);

    case 'opponent': {
      const seatIndex = card.seatIndex ?? 0; // если почему-то undefined, возьмём 0
      const numOpponents = numPlayers - 1;
      return getOpponentCardStyle(indexInGroup, sameLocationCards.length, seatIndex, numOpponents);
    }

    default:
      return {};
  }
}

// Колода
function getDeckCardStyle(indexInGroup: number): CSSProperties {
  return {
    position: 'absolute',
    top: '20%',
    left: '-10px',
    zIndex: 1000 - indexInGroup,
  };
}

// Козырь
function getTrumpCardStyle(): CSSProperties {
  return {
    position: 'absolute',
    top: '18%',
    left: '50px',
    transform: 'translate(25px, 30px) rotate(100deg)',
    zIndex: 900,
  };
}

// Игрок (внизу)
function getPlayerCardStyle(indexInGroup: number, totalCards: number): CSSProperties {
  const overlap = Math.min(50, 400 / totalCards);
  const offsetX = -((totalCards - 1) * overlap) / 2;
  const rotationAngle = (indexInGroup - totalCards / 2) * 2;

  return {
    position: 'absolute',
    bottom: '20%',
    left: '40%',
    transform: `translateX(${offsetX + overlap * indexInGroup}px) rotate(${rotationAngle}deg)`,
    transformOrigin: 'bottom center',
    zIndex: 10 + indexInGroup,
  };
}

/**
 * Располагаем карты оппонентов в зависимости от seatIndex.
 * Если numOpponents > 1, равномерно распределяем по ширине (от 10% до 90%).
 * Если numOpponents=1, просто ставим по центру (50%).
 */
function getOpponentCardStyle(
  indexInGroup: number,
  totalCards: number,
  seatIndex: number,
  numOpponents: number
): CSSProperties {
  let baseLeftPercent: number;

  if (numOpponents <= 1) {
    // Только один оппонент, пусть будет по центру
    baseLeftPercent = 50;
  } else {
    // Несколько оппонентов, распределяем по ширине
    baseLeftPercent = 10 + (80 / (numOpponents - 1)) * seatIndex;
  }

  const overlap = Math.min(20, 400 / totalCards);
  const offsetX = -((totalCards - 1) * overlap) / 2;
  const rotationAngle = (indexInGroup - totalCards / 2) * -5;

  return {
    position: 'absolute',
    top: '5%',
    left: `${baseLeftPercent}%`,
    transform: `translateX(${offsetX + overlap * indexInGroup}px) rotate(${rotationAngle}deg)`,
    zIndex: 10 + indexInGroup,
  };
}
