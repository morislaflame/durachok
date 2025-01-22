// OpponentsContainer.tsx
import React from 'react';
import { Card } from '../../types/types';
import Opponent from './Opponent';
import { generateOpponentSeatPositions } from './position/generateOpponentPositions';

interface OpponentsContainerProps {
  numPlayers: number;
  allOpponentCards: Card[];
}

/**
 * Рендерит всех оппонентов.
 * Если numPlayers=5 => значит 4 оппонента (seatIndex=0..3).
 * Автоматически располагает их в верхней части стола
 * на одинаковом расстоянии (можно подправить seatPositions).
 */
const OpponentsContainer: React.FC<OpponentsContainerProps> = ({
  numPlayers,
  allOpponentCards,
}) => {
  const numOpponents = numPlayers - 1;

  // Генерируем координаты (top/left) для каждого seatIndex
  const seatPositions = generateOpponentSeatPositions(numOpponents);

  // Массив seatIndex: [0..(numOpponents-1)]
  const seatIndices = Array.from({ length: numOpponents }, (_, i) => i);

  return (
    <>
      {seatIndices.map((seatIndex) => {
        // Карты, которые принадлежат конкретному оппоненту
        const opponentCards = allOpponentCards.filter(c => c.seatIndex === seatIndex);

        // Координаты для этого seatIndex
        const basePos = seatPositions[seatIndex] || seatPositions[seatPositions.length - 1];

        return (
          <div
            key={seatIndex}
            style={{
              position: 'absolute',
              top: basePos.top,
              left: basePos.left,
              // можно чуть приподнять/сдвинуть: transform: 'translate(-50%, -50%)' по желанию
            //   transform: 'translate(-50%, 0)' 
            }}
          >
            <Opponent 
              seatIndex={seatIndex} 
              cards={opponentCards} 
            />
          </div>
        );
      })}
    </>
  );
};

export default OpponentsContainer;
