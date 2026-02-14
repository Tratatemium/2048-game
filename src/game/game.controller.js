import { state } from "./state.js";
import { animationController } from "./animation.controller.js";
import { processMove } from "./moves.js";
import { addNumberAtRandom } from "../utils/random.js";
import {
  resetUI,
  renderTiles,
  renderScore,
  showEndGame,
  isUIBlocked,
} from "../ui/ui.render.js";
import { getGameResult } from "./rules.js";

const setupNewGame = async () => {
  state.deleteSaved();
  state.reset();
  resetUI();

  addNumberAtRandom(state.gameArray);
  addNumberAtRandom(state.gameArray);

  renderScore();
  await renderTiles();
};

const setupGame = async () => {
  const isLoaded = state.load();
  if (isLoaded) await renderTiles();
  else await setupNewGame();
};

const setupTest = async (testMode) => {
  state.loadTest(testMode);
  await renderTiles();
};

const checkAndHandleEndGame = () => {
  const result = getGameResult(state.gameArray);
  if (result) showEndGame(result);
};

const isInputBlocked = () => isUIBlocked() || animationController.isAnimating();

const onGameInput = async (direction) => {
  if (isInputBlocked()) return;

  const { changed, moveScore } = await processMove(state.gameArray, direction);
  if (!changed) {
    return; // No move occurred
  }

  state.moves++;
  state.addScore(moveScore);
  renderScore();

  const resultAfterMerge = getGameResult(state.gameArray);

  if (resultAfterMerge === "win") {
    showEndGame("win");
    state.save();
    return; // STOP HERE
  }

  addNumberAtRandom(state.gameArray);
  await renderTiles();

  checkAndHandleEndGame();

  state.save();
};

export { setupNewGame, setupGame, setupTest, checkAndHandleEndGame, onGameInput };
