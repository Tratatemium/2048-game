import { state } from "./main.js"
import { setupNewGame } from "./new-game.js"
import { updateGameField } from "./dom-manipiulation.js";


export const saveGame = () => {
    localStorage.setItem("game-state", JSON.stringify(state));
};

export const loadGame = () => {
    const saved = localStorage.getItem("game-state");

    if (! saved) {
        setupNewGame();
        return;
    }

    try {
        const savedState = JSON.parse(saved);
        Object.assign(state, savedState);
        updateGameField();
    } catch (err) {
        console.error("Invalid game-state data:", err);
    }
};

export const deleteSave = () => {
    localStorage.setItem("game-state", "");
};