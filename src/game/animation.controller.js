const animationContoller = (() => {
  let isAnimating = false;

  const getAllTiles = () =>
    Array.from(document.querySelectorAll(".tile, .tile-inner"));

  const checkAnimations = () => {
    const tiles = getAllTiles();
    return tiles.some((tile) =>
      tile.getAnimations().some((anim) => anim.playState === "running"),
    );
  };

  const startTransition = () => {
    getAllTiles().forEach((tile) => tile.classList.add("transition"));
    isAnimating = true;
  };

  const waitForAnimations = async () => {
    const tiles = getAllTiles();
    const promises = tiles.flatMap((tile) =>
      tile.getAnimations().map((anim) => anim.finished),
    );

    await Promise.all(promises);

    getAllTiles().forEach((tile) => tile.classList.remove("transition"));
    isAnimating = false;
  };

  return {
    isAnimating: () => isAnimating || checkAnimations(),
    runTransition: async () => {
      startTransition();
      await waitForAnimations();
    },
  };
})();

export { animationContoller };
