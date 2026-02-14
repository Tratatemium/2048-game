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
import { score } from "./score.js";
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

const isInputBlocked = () => isUIBlocked() || animationController.isAnimating();

const finalizeMove = async (moveScore) => {
  addNumberAtRandom(state.gameArray);
  await renderTiles();

  state.moves++;
  score.add(moveScore);

  renderScore();
  state.save();
};

const checkAndHandleEndGame = () => {
  const result = getGameResult(state.gameArray);
  if (result) showEndGame(result);
};

const onGameInput = async (direction) => {
  if (isInputBlocked()) return;

  const { changed, moveScore } = await processMove(state.gameArray, direction);
  if (!changed) {
    return; // No move occurred
  }

  await finalizeMove(moveScore);
  checkAndHandleEndGame();
};

export { setupNewGame, onGameInput, checkAndHandleEndGame };
