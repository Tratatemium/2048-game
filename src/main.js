import { setupUI } from "./ui/ui.render.js";
import { setupControls } from "./ui/ui.controls.js";
import {
  setupGame,
  setupTest,
  checkAndHandleEndGame,
} from "./game/game.controller.js";

const init = async ({ initMode = "normal", testMode } = {}) => {
  setupUI();
  setupControls();

  switch (initMode) {
    case "normal":
      await setupGame();
      break;
    case "test":
      await setupTest(testMode);
      break;
    default:
      throw new Error('init(): mode must be "normal" or "test"');
  }

  checkAndHandleEndGame();
};

init();
// init({initMode: "test", testMode: "allTiles"});
// init({initMode: "test", testMode: "winLoose"});
