import React from 'react';

interface Props {
  onStartGame?: () => void;
  onBeat?: () => void;
  isBeatVisible?: boolean;
}

const UserActions: React.FC<Props> = ({ onStartGame, onBeat, isBeatVisible }) => {
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
    </div>
  );
};

export default UserActions;
