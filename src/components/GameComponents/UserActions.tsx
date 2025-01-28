import React from 'react';

interface Props {
  onStartGame?: () => void;
  onBeat?: () => void;
  isBeatVisible?: boolean;
  onTakeCards?: () => void;
  isTakeVisible?: boolean;
}

const UserActions: React.FC<Props> = ({ onStartGame, onBeat, isBeatVisible, onTakeCards, isTakeVisible }) => {
  return (
    <div>
      <button onClick={onStartGame}>
        Start Game
      </button>

      {/* Рендерим кнопку «Бито» только если isBeatVisible === true */}
      {isBeatVisible && (
        <button onClick={onBeat}>
          Бито
        </button>
      )}

      {isTakeVisible && (
        <button onClick={onTakeCards}>
          Take
        </button>
      )}
    </div>
  );
};

export default UserActions;
