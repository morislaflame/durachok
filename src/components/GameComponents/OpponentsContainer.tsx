// OpponentsContainer.tsx
import React from 'react';
import { Card } from '../../types/types';
import Opponent from './Opponent';

interface OpponentsContainerProps {
  numPlayers: number;
  allOpponentCards: Card[];
}

/**
 * Рендерит всех оппонентов.
 * Если numPlayers=5 => значит 4 оппонента (seatIndex=0..3).
 */
const OpponentsContainer: React.FC<OpponentsContainerProps> = ({ numPlayers, allOpponentCards }) => {
  const numOpponents = numPlayers - 1;

  // Создаём массив seatIndex [0..(numOpponents-1)]
  const seatIndices = Array.from({ length: numOpponents }, (_, i) => i);

  return (
    <>
      {seatIndices.map((seatIndex) => {
        // Карты, которые принадлежат конкретному оппоненту
        const opponentCards = allOpponentCards.filter(c => c.seatIndex === seatIndex);

        return (
          <Opponent 
            key={seatIndex} 
            seatIndex={seatIndex} 
            cards={opponentCards} 
          />
        );
      })}
    </>
  );
};

export default OpponentsContainer;
