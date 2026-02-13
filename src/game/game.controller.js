import { state, storage } from "./state.js";
import { animationController } from "./animation.controller.js";
import { makeMove } from "./moves.js";
import { addNumberAtRandom } from "../utils/random.js";
import { updateTiles, updateScore } from "../ui/ui.render.js";
import { score } from "./score.js";
import { $ } from "../utils/helpers.js";


const BOARD_SIZE = 4;

const createEmptyBoard = () =>
  Array.from({ length: BOARD_SIZE }, (_, i) =>
    Array.from({ length: BOARD_SIZE }, (_, j) => ({
      id: null,
      value: 0,
      x: j,
      y: i,
    })),
  );

const setupNewGame = () => {
  storage.delete();

  state.score = 0;
  updateScore();
  state.moves = 0;

  ["main", "header"].forEach((selector) =>
    $(selector).classList.remove("win", "defeat"),
  );

  state.gameArray = createEmptyBoard();
  addNumberAtRandom(state.gameArray);
  addNumberAtRandom(state.gameArray);

  updateTiles(state.gameArray);
};

const inputBlocked = () => {
  const main = $("main");
  const notDisplayed = window.getComputedStyle(main).display === "none";
  const winState = main.classList.contains("win");
  const dialogOpen = $(".restart-dialog").open || $(".about-game-dialog").open;
  const animationRunning = animationController.isAnimating();

  return notDisplayed || dialogOpen || winState || animationRunning;
};

const onGameInput = async (direction) => {
  if (inputBlocked()) return;

  const { changed, totalScore } = makeMove[direction](state.gameArray);
  if (!changed) return;

  await animationController.runTransition();

  addNumberAtRandom(state.gameArray);
  updateTiles(state.gameArray);
  state.moves++;
  score.add(totalScore);
  updateScore();
  storage.save(state);
  checkForEndGame();
};

export { setupNewGame, onGameInput };
