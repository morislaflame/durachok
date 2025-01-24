// cardPositioning.ts
import { Card } from '../../../types/types';
import { CSSProperties } from 'react';
import { generateOpponentSeatPositions } from './generateOpponentPositions';
import { generateSlotsPositions } from './generateSlotsPositions'; // Импортируем новую функцию

/**
 * Возвращает стили (top/left/transform/...) для конкретной карты
 * в зависимости от её location (deck/trump/player/opponent/table)
 * и, если нужно, учитывая seatIndex (какой именно оппонент).
 */
export function getCardStyle(
    card: Card,
    allCards: Card[],
    numPlayers: number,
    tableCardCount: number // Добавляем параметр
  ): CSSProperties {
    // Группа: все карты, у которых такая же location и такой же seatIndex
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
        // Для оппонентов нужно учесть seatIndex
        const seatIndex = card.seatIndex ?? 0;
        const numOpponents = numPlayers - 1;
        return getOpponentCardStyle(
          indexInGroup,
          sameLocationCards.length,
          seatIndex,
          numOpponents
        );
      }
  
      case 'table':
        return getTableCardStyle(card.tablePositionIndex || 0, tableCardCount);
  
      default:
        return {};
    }
  }

// --------- ФУНКЦИИ ДЛЯ РАЗНЫХ LOCATION ----------

// Колода
function getDeckCardStyle(indexInGroup: number): CSSProperties {
  return {
    position: 'absolute',
    top: '20%',
    left: '-10px',
    transform: 'rotate(20deg)',
    zIndex: 1000 - indexInGroup,
  };
}

// Козырь
function getTrumpCardStyle(): CSSProperties {
  return {
    position: 'absolute',
    top: '21%',
    left: '35px',
    transform: 'translate(25px, 30px) rotate(110deg)',
    zIndex: 900,
  };
}

// Карты игрока (снизу)
function getPlayerCardStyle(
  indexInGroup: number,
  totalCards: number
): CSSProperties {
  const overlap = Math.min(50, 400 / totalCards);
  const offsetX = -((totalCards - 1) * overlap) / 2;
  const rotationAngle = (indexInGroup - totalCards / 2) * 2;

  return {
    position: 'absolute',
    bottom: '20%',
    left: '50%', // Центрируем относительно GameBoard
    transform: `translateX(${
      offsetX + overlap * indexInGroup
    }px) rotate(${rotationAngle}deg)`,
    transformOrigin: 'bottom center',
    zIndex: 10 + indexInGroup,
  };
}

/**
 * Карты оппонента:
 * 1) С помощью generateOpponentSeatPositions получаем массив координат
 *    для всех seatIndex (top/left).
 * 2) Берём basePos для текущего seatIndex.
 * 3) "Веером" раскладываем offsetX/rotationAngle вокруг basePos.
 */
function getOpponentCardStyle(
  indexInGroup: number,
  totalCards: number,
  seatIndex: number,
  numOpponents: number
): CSSProperties {
  const seatPositions = generateOpponentSeatPositions(numOpponents);
  // Если seatIndex больше, чем есть в массиве, берём последний
  const basePos = seatPositions[seatIndex] || seatPositions[seatPositions.length - 1];

  const overlap = Math.min(1, 400 / totalCards);
  const offsetX = -((totalCards - 1) * overlap) / 2;
  // Угол, чем больше - тем сильнее веер
  const rotationAngle = (indexInGroup - totalCards / 2) * -5;

  return {
    position: 'absolute',
    top: basePos.top,
    left: basePos.left,
    transform: `translateX(${offsetX + overlap * indexInGroup}px) rotate(${rotationAngle}deg)`,
    zIndex: 10 + indexInGroup,
  };
}

/**
 * Карты на столе
 * @param tablePositionIndex Индекс позиции карты на столе
 * @param totalCards Общее количество карт на столе
 */
function getTableCardStyle(tablePositionIndex: number, totalCards: number): CSSProperties {
  const pos = generateSlotsPositions(totalCards)[tablePositionIndex];
  if (!pos) {
    console.log(`No position found for tablePositionIndex: ${tablePositionIndex}`);
    return {};
  }

  const style = {
    position: 'absolute',
    top: `${pos.top}%`,
    left: `${pos.left}%`,
    transform: 'translate(-50%, -50%)',
    zIndex: 500 + tablePositionIndex,
  };

  console.log(`Card style for tablePositionIndex ${tablePositionIndex}:`, style);
  return style as CSSProperties;
}
