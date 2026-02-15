import { STORAGE_KEY } from "../config.js";
import { createEmptyBoard } from "../utils/helpers.js";
import { getTestArray } from "../test/test.js";

const state = {
  gameArray: [],
  score: 0,
  moves: 0,

  addScore(score) {
    this.score += score;
  },

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
    try {
      const parsed = JSON.parse(saved);
      Object.assign(this, parsed);
      return true;
    } catch (err) {
      this.deleteSaved();
      return false;
    }
  },

  deleteSaved() {
    localStorage.removeItem(STORAGE_KEY);
  },

  reset() {
    this.score = 0;
    this.moves = 0;
    this.gameArray = createEmptyBoard();
  },

  loadTest(testMode) {
    this.score = 0;
    this.moves = 0;
    this.gameArray = getTestArray(testMode);
  },
};

export { state };
