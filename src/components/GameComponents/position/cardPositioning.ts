// cardPositioning.ts
import { Card } from '../../../types/types';
import { CSSProperties } from 'react';
import { generateOpponentSeatPositions } from './generateOpponentPositions';
import { TABLE_PAIRS_POSITIONS } from './tablePairsPositions';

/**
 * Возвращает стили (top/left/transform/...) для конкретной карты
 * в зависимости от её location (deck/trump/player/opponent/table)
 * и, если нужно, учитывая seatIndex (какой именно оппонент).
 */


export function getCardStyle(
  card: Card,
  allCards: Card[],
  numPlayers: number,
  containerWidth: number,
): CSSProperties {
  // Группа: все карты, у которых такая же location и такой же seatIndex
  const sameLocationCards = allCards.filter(
    (c) => c.location === card.location 
  );
  
  const indexInGroup = sameLocationCards.findIndex((c) => c.stableId === card.stableId);


//   console.log(`Card ${card.id} in group index ${indexInGroup} out of ${sameLocationCards.length}`);

  switch (card.location) {
    case 'deck':
      return getDeckCardStyle(indexInGroup);

    case 'player':
      return getPlayerCardStyle(indexInGroup, sameLocationCards.length, containerWidth);

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
        return getTablePairStyle(card);

    case 'discard':
        return getDiscardCardStyle(indexInGroup);

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
    zIndex: 10000 - indexInGroup,
    width: '45px',
    height: '65px',
  };
}

// Козырь
export function getTrumpCardStyle(): CSSProperties {
  return {
    position: 'absolute',
    top: '16%',
    left: '-15px',
    transform: 'translate(25px, 30px) rotate(110deg)',
    zIndex: 1,
    width: '45px',
    height: '65px',
  };
}

// Карты игрока (снизу)
function getPlayerCardStyle(indexInGroup: number, totalCards: number, containerWidth: number): CSSProperties {
  // Максимальная ширина, которую может занимать рука (в пикселях)
  const maxHandWidthPercent = 0.8;
  // Максимальная ширина руки в пикселях
  const maxHandWidth = containerWidth * maxHandWidthPercent;
  // Ширина одной карты (как она задана ниже)
  const cardWidth = 60;

  // Вычисляем перекрытие карт по горизонтали
  const calculatedOverlap = totalCards > 1 ? maxHandWidth / (totalCards - 1) : 0;
  const overlap = Math.min(50, calculatedOverlap);

  // Центрирование всей группы карт
  const offsetX = -((totalCards - 1) * overlap) / 2;
  
  // Базовый угол поворота
  const baseRotationAngle = 3;
  // Если карт больше 4, уменьшаем угол поворота пропорционально количеству карт.
  // Таким образом, при totalCards <= 4 rotationScale = 1, а при большем числе карт — коэффициент становится меньше 1.
  const rotationScale = totalCards > 4 ? (4 / totalCards) : 1;
  const rotationAngle = (indexInGroup - totalCards / 2) * baseRotationAngle * rotationScale;

  // Вычисляем вертикальное смещение для эффекта дуги.
  const midIndex = (totalCards - 1) / 2;
  const distanceFromCenter = Math.abs(indexInGroup - midIndex);
  const verticalFactor = 1 - (distanceFromCenter / (midIndex || 1));
  
  // Базовое максимальное вертикальное смещение
  const baseYOffset = 7;
  // Если карт много, максимальное смещение уменьшается
  const scalingFactor = totalCards > 0 ? Math.min(1, 4 / totalCards) : 1;
  const yOffset = verticalFactor * baseYOffset * scalingFactor;
  
  return {
    position: 'absolute',
    // Смещаем карту по вертикали (чем меньше значение top, тем выше карта)
    top: `calc(75% - ${yOffset}px)`,
    left: '45%', // Относительно родительского контейнера (например, GameBoard)
    transform: `translateX(${offsetX + overlap * indexInGroup}px) rotate(${rotationAngle}deg)`,
    transformOrigin: 'bottom center',
    zIndex: 1000 + indexInGroup,
    width: `${cardWidth}px`,
    height: '85px',
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
    width: '45px',
    height: '65px',
  };
}

/**
 * Карты на столе
 * @param tablePositionIndex Индекс позиции карты на столе
 */
function getTablePairStyle(card: Card): CSSProperties {
    // если нет pairIndex или role, возвращаем пустой стиль, 
    // (или можно вообще не рендерить карту)
    if (card.tablePairIndex === undefined || card.tableRole === undefined) {
      return {};
    }
    const pairPos = TABLE_PAIRS_POSITIONS[card.tablePairIndex];
    if (!pairPos) {
      return {};
    }
  
    // Выбираем координаты attack или cover
    const slotPos = (card.tableRole === 'attack') 
      ? pairPos.attack 
      : pairPos.cover;
  
    // Можно сделать zIndex выше для cover, чтобы карта лежала поверх атакующей
    const zIndex = (card.tableRole === 'cover') ? 600 : 500;
  
    return {
      position: 'absolute',
      top: `${slotPos.top}%`,
      left: `${slotPos.left}%`,
      zIndex,
      width: '50px',
      height: '70px',
      transform: 'none',
    };
  }
  

  function getDiscardCardStyle(indexInGroup: number): CSSProperties {
    // Каждая новая карта будет смещена вниз на 8px
    // и дополнительно чуть повёрнута, чтобы показать небольшой "веер" в сбросе.
    const offsetY = indexInGroup * 8;
    const rotate = indexInGroup * 3;
  
    return {
      position: 'absolute',
      top: '30%',
      left: '90%',
      transform: `translateY(${offsetY}px) rotate(${rotate}deg)`,
      zIndex: 700 + indexInGroup,
      width: '45px',
      height: '65px',
      minWidth: '45px',
      minHeight: '65px',
    };
  }
  

