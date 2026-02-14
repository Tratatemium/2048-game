import { state, storage, createEmptyBoard } from "./state.js";
import { animationController } from "./animation.controller.js";
import { makeMove } from "./moves.js";
import { addNumberAtRandom } from "../utils/random.js";
import { renderTiles, renderScore, showEndGame } from "../ui/ui.render.js";
import { score } from "./score.js";
import { getGameResult } from "./rules.js";
import { $ } from "../utils/helpers.js";

const setupNewGame = () => {
  storage.delete();

  state.score = 0;
  renderScore();
  state.moves = 0;

  ["main", "header"].forEach((selector) =>
    $(selector).classList.remove("win", "defeat"),
  );

  state.gameArray = createEmptyBoard();
  addNumberAtRandom(state.gameArray);
  addNumberAtRandom(state.gameArray);

  renderTiles();
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
  renderTiles();
  state.moves++;
  score.add(totalScore);
  renderScore();
  storage.save(state);

  const result = getGameResult(state.gameArray);
  if (result) showEndGame(result);
};

export { setupNewGame, onGameInput };
