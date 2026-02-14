import { $ } from "../utils/helpers.js";

const animationController = (() => {
  let isAnimating = false;

  const getAllTiles = () =>
    Array.from(document.querySelectorAll(".tile, .tile-inner"));

  const startTransition = () => {
    const tiles = getAllTiles();
    tiles.forEach((tile) => tile.classList.add("transition"));
    isAnimating = true;
  };

  const waitForAnimations = async () => {
    const tiles = getAllTiles();
    const animationPromises = tiles.flatMap((tile) =>
      tile.getAnimations().map((anim) => anim.finished),
    );

    await Promise.all(animationPromises);

    getAllTiles().forEach((tile) => tile.classList.remove("transition"));
    isAnimating = false;
  };

  return {
    isAnimating: () => isAnimating,
    runTransition: async () => {
      startTransition();
      await waitForAnimations();
    },
  };
})();

export { animationController };
