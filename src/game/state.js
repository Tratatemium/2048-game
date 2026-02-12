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

const STORAGE_KEY = "2048-game-state";

const storage = {
  save: (state) => localStorage.setItem(STORAGE_KEY, JSON.stringify(state)),
  load: () => {
    const saved = localStorage.getItem("game-state");
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

export { state, storage };
