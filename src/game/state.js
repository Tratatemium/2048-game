import { STORAGE_KEY } from "../config.js";
import { createEmptyBoard } from "../utils/helpers.js";

const state = {
  gameArray: [],
  score: 0,
  moves: 0,

  save() {
    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify({
        gameArray: this.gameArray,
        score: this.score,
        moves: this.moves,
      }),
    );
  },

  load() {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return false;
    Object.assign(this, JSON.parse(saved));
    return true;
  },

  deleteSaved() {
    localStorage.removeItem(STORAGE_KEY);
  },

  reset() {
    state.score = 0;
    state.moves = 0;
    state.gameArray = createEmptyBoard();
  }
};

export { state };
