import React from 'react';
import { Card, PlayerState } from '../../types/types';
import { generateOpponentSeatPositions } from './position/generateOpponentPositions';
import Opponent from './Opponent';

interface OpponentsContainerProps {
  numPlayers: number;
  allOpponentCards: Card[];
  opponents: PlayerState[];
}

const OpponentsContainer: React.FC<OpponentsContainerProps> = ({
  allOpponentCards,
  opponents,
}) => {

  const numOpponents = opponents.length; // или numPlayers - 1
  const seatPositions = generateOpponentSeatPositions(numOpponents);

  return (
    <>
      {opponents.map((opponent, seatIndex) => {
        // Отбираем карты для данного оппонента
        const opponentCards = allOpponentCards.filter(
          (c) => c.playerId === Number(opponent.id)
        );
        const basePos = seatPositions[seatIndex] || seatPositions[seatPositions.length - 1];

        return (
          <div
            key={opponent.id} // используем id в качестве ключа
            style={{
              position: 'absolute',
              top: basePos.top,
              left: basePos.left,
            }}
          >
            <Opponent 
              cards={opponentCards} 
              playerId={opponent.id} // передаём корректный id
            />

          </div>
        );
      })}
    </>
  );
};

export default OpponentsContainer;
