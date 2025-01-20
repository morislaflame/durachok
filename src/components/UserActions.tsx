import React from 'react';
import styles from './styles/UserActions.module.css';

interface UserActionsProps {
  onStartGame?: () => void;
}

const UserActions: React.FC<UserActionsProps> = ({ onStartGame }) => {
  return (
    <div className={styles.userActionsContainer}>
      <button 
        className={styles.actionButton}
        onClick={onStartGame}
      >
       Start game
      </button>
    </div>
  );
};

export default UserActions;