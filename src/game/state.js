import { STORAGE_KEY, BOARD_SIZE } from "../config.js"

let state = {
  gameArray: [],
  score: 0,
  moves: 0,
  animationDuration:
    parseFloat(
      getComputedStyle(document.documentElement).getPropertyValue(
        "--animation-duration",
      ),
    ) * 1000,
};

const storage = {
  save: (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)),

  load: () => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) return null;
    try {
      const savedState = JSON.parse(saved);
      if (savedState && typeof savedState === "object") return savedState;
    } catch (err) {
      console.error("Invalid game-state data:", err);
    }
    return null;
  },

  delete: () => localStorage.removeItem(STORAGE_KEY),
};

const createEmptyBoard = () =>
  Array.from({ length: BOARD_SIZE }, (_, i) =>
    Array.from({ length: BOARD_SIZE }, (_, j) => ({
      id: null,
      value: 0,
    })),
  );

const resetState = () => {
  state.score = 0;
  state.moves = 0;
  state.gameArray = createEmptyBoard();
};

export { state, storage, resetState };
