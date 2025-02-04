import React from "react";
import GameBoard from "../components/GameComponents/GameBoard.tsx";

export const Game = () => {
    const playerCnt = 2;

    return (
        <div className="app">
            <GameBoard numPlayers={playerCnt} />
        </div>
    );
}