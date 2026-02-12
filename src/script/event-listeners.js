import { setupNewGame } from "./new-game.js";
import { $ } from "./utils.js"

/**
 * PLAY AGAIN BUTTON - Appears when game ends (replaces restart button)
 */
$(".play-again-button").addEventListener("click", () => setupNewGame());

/**
 * RESTART GAME FUNCTIONALITY - Shows confirmation dialog before restarting
 */
const restartDialog = document.querySelector(".restart-dialog");

$(".restart-game-button-desktop").addEventListener("click", () => {
  if (!restartDialog.open) restartDialog.showModal();
});

$(".restart-game-button-mobile").addEventListener("click", () => {
  if (!restartDialog.open) restartDialog.showModal();
});

$(".yes-restart-button").addEventListener("click", () => {
  setupNewGame();
  restartDialog.close();
});

$(".cancel-button").addEventListener("click", () => restartDialog.close());

/**
 * ABOUT/MENU DIALOG - Triggered by menu button, closed by close button or Escape key
 */
const aboutGameDialog = document.querySelector(".about-game-dialog");

$(".menu-button").addEventListener("click", () => {
  if (!aboutGameDialog.open) aboutGameDialog.showModal();
});

$(".close-about-game-dialog-button").addEventListener("click", () =>
  aboutGameDialog.close(),
);

export { restartDialog, aboutGameDialog };
