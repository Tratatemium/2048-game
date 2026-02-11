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

export { state };
