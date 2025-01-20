import React, { useState } from 'react';
import './App.css';
import GameBoard from './components/GameBoard';

function App() {
  const [isGameStarted, setIsGameStarted] = useState(false);

  return (
    <div className="app">
      {!isGameStarted ? (
        <button onClick={() => setIsGameStarted(true)}>
          Начать игру
        </button>
      ) : (
        <GameBoard />
      )}
    </div>
  );
}

export default App;