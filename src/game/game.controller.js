import { state, storage } from "./state.js";
import { animationController } from "./animation.controller.js";
import { makeMove } from "./moves.js";
import { addNumberAtRandom } from "../utils/random.js";
import { updateTiles, updateScore } from "../ui/ui.render.js";
import { score } from "./score.js";
import { $ } from "../utils/helpers.js";

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

  addNumberAtRandom(gameArray);
  updateTiles();
  state.moves++;
  score.add(totalScore);
  updateScore();
  storage.save(state);
  checkForEndGame();
};

export { onGameInput };
