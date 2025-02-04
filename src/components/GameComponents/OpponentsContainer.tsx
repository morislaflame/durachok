import { Card } from "../../types/types";
import { PlayerState } from "../../types/types";
import { generateOpponentSeatPositions } from "./position/generateOpponentPositions";
import Opponent from "./Opponent";

interface OpponentsContainerProps {
  numPlayers: number;
  allOpponentCards: Card[];
  opponents: PlayerState[];
}

const OpponentsContainer: React.FC<OpponentsContainerProps> = ({
  numPlayers,
  allOpponentCards,
  opponents,
}) => {
  const numOpponents = numPlayers - 1;
  const seatPositions = generateOpponentSeatPositions(numOpponents);
  const seatIndices = Array.from({ length: numOpponents }, (_, i) => i);

  return (
    <>
      {seatIndices.map((seatIndex) => {
        // Здесь сопоставляем игрока по порядку:
        const opponent = opponents[seatIndex];
        // Отбираем карты для этого оппонента
        const opponentCards = allOpponentCards.filter(c => c.playerId === opponent.id);
        const basePos = seatPositions[seatIndex] || seatPositions[seatPositions.length - 1];

        return (
          <div
            key={seatIndex}
            style={{
              position: 'absolute',
              top: basePos.top,
              left: basePos.left,
            }}
          >
            <Opponent 
              seatIndex={seatIndex} 
              cards={opponentCards} 
              playerId={opponent.id}
            />
          </div>
        );
      })}
    </>
  );
};

export default OpponentsContainer;
