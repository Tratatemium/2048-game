import { setupNewGame } from "./new-game.js";
import { loadGame } from "./local-storage.js";
import { checkForEndGame } from "./end-game.js";
import { injectTestArray } from "./test.js";

const init = ({ initMode = "normal", testMode }) => {
  switch (initMode) {
    case "normal":
      loadGame();
      break;
    case "test":
      injectTestArray(testMode)
      break;
    default:
      throw new Error('init(): mode must be "normal" or "test"')
  }  
  checkForEndGame();
};

init({initMode: "normal"});
// init({initMode: "test", testMode: "allTiles"})
// init({initMode: "test", testMode: "winLoose"})

/* ================================================================================================= */
/* #region EVENT LISTENERS & DOM INTERACTIONS                                                       */
/* ================================================================================================= */

// ==========================================
// BUTTON EVENT HANDLERS
// ==========================================

/**
 * PLAY AGAIN BUTTON - Starts a new game after win/defeat
 * Appears when game ends (replaces restart button)
 */
const playAgainButton = document.querySelector(".play-again-button");
playAgainButton.addEventListener("click", () => setupNewGame());

/**
 * RESTART GAME FUNCTIONALITY - Shows confirmation dialog before restarting
 * Uses modal dialog to prevent accidental game resets
 */
export const restartDialog = document.querySelector(".restart-dialog");
const restartGameButtonDesktop = document.querySelector(
  ".restart-game-button-desktop",
);
const restartGameButtonMobile = document.querySelector(
  ".restart-game-button-mobile",
);

// Show restart confirmation dialog
restartGameButtonDesktop.addEventListener("click", () => {
  if (!restartDialog.open) restartDialog.showModal();
});
restartGameButtonMobile.addEventListener("click", () => {
  if (!restartDialog.open) restartDialog.showModal();
});

// Confirm restart - start new game and close dialog
const yesRestartButton = document.querySelector(".yes-restart-button");
yesRestartButton.addEventListener("click", () => {
  setupNewGame();
  restartDialog.close();
});

// Cancel restart - just close the dialog
const cancelButton = document.querySelector(".cancel-button");
cancelButton.addEventListener("click", () => restartDialog.close());

/**
 * ABOUT/MENU DIALOG FUNCTIONALITY - Shows game information
 * Triggered by menu button, closed by close button or Escape key
 */
export const aboutGameDialog = document.querySelector(".about-game-dialog");
const menuButton = document.querySelector(".menu-button");

// Show about game dialog
menuButton.addEventListener("click", () => {
  if (!aboutGameDialog.open) aboutGameDialog.showModal();
});

// Close about game dialog
const closeAboutGameDialogButton = document.querySelector(
  ".close-about-game-dialog-button",
);
closeAboutGameDialogButton.addEventListener("click", () =>
  aboutGameDialog.close(),
);

/* #endregion EVENT LISTENERS & DOM INTERACTIONS */
