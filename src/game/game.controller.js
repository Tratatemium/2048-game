import { state, storage, resetState } from "./state.js";
import { animationController } from "./animation.controller.js";
import { processMove } from "./moves.js";
import { addNumberAtRandom } from "../utils/random.js";
import { resetUI, renderTiles, renderScore, showEndGame } from "../ui/ui.render.js";
import { score } from "./score.js";
import { getGameResult } from "./rules.js";
import { $, printGameArray } from "../utils/helpers.js";

const setupNewGame = async () => {
  storage.delete();
  resetState();
  resetUI();

  addNumberAtRandom(state.gameArray);
  addNumberAtRandom(state.gameArray);

  renderScore();
  await renderTiles();
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

  const { changed, totalScore } = await processMove(state.gameArray, direction);
  if (!changed) return;
  addNumberAtRandom(state.gameArray);
  await renderTiles();
  state.moves++;
  score.add(totalScore);
  renderScore();
  storage.save(state);

  printGameArray();

  const result = getGameResult(state.gameArray);
  if (result) showEndGame(result);
};

export { setupNewGame, onGameInput };
