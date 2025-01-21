// UserActions.tsx
import React from 'react';

interface Props {
  onStartGame?: () => void;
}

const UserActions: React.FC<Props> = ({ onStartGame }) => {
  return (
    <button onClick={onStartGame}>
      Start Game
    </button>
  );
};

export default UserActions;
