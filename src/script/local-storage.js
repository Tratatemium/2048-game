import { state } from "../game/state.js";
import { setupNewGame } from "./new-game.js";
import { updateGameField } from "./dom-manipiulation.js";

const saveGame = () => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
};

const loadGame = () => {
  const saved = localStorage.getItem("game-state");

  if (!saved) {
    setupNewGame();
    return;
  }

  try {
    const savedState = JSON.parse(saved);
    if (savedState && typeof savedState === "object") {
      Object.assign(state, savedState);
      updateGameField();
    } else {
      throw new Error("Saved state is not an object");
    }
  } catch (err) {
    console.error("Invalid game-state data:", err);
    setupNewGame();
  }
};

const deleteSave = () => {
  localStorage.removeItem(STORAGE_KEY);
};

export { saveGame, loadGame, deleteSave };
