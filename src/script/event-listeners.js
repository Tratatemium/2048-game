import { setupNewGame } from "./new-game.js";
import { $, openDialog } from "../utils/helpers.js";

const setupUIButtons = () => {
  $(".play-again-button").addEventListener("click", () => setupNewGame());

  const restartDialog = $(".restart-dialog");
  [".restart-game-button-desktop", ".restart-game-button-mobile"].forEach(
    (selector) =>
      $(selector).addEventListener("click", () => openDialog(restartDialog)),
  );
  $(".yes-restart-button").addEventListener("click", () => {
    setupNewGame();
    restartDialog.close();
  });
  $(".cancel-button").addEventListener("click", () => restartDialog.close());

  const aboutGameDialog = $(".about-game-dialog");
  $(".menu-button").addEventListener("click", () =>
    openDialog(aboutGameDialog),
  );
  $(".close-about-game-dialog-button").addEventListener("click", () =>
    aboutGameDialog.close(),
  );
};

export { restartDialog, aboutGameDialog };
