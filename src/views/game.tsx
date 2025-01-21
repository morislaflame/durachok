import React, {useState} from "react";
import GameBoard from "../components/GameBoard.tsx";

export const Game = () => {
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