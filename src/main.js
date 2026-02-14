import { setupUI, renderTiles, showEndGame } from "./ui/ui.render.js";
import { setupControls } from "./ui/ui.controls.js";
import { state } from "./game/state.js";
import { setupNewGame, checkAndHandleEndGame } from "./game/game.controller.js";
import { getGameResult } from "./game/rules.js";
import { injectTestArray } from "./test/test.js";

const init = async ({ initMode = "normal", testMode } = {}) => {
  setupUI();
  setupControls();

  switch (initMode) {
    case "normal":
      const isLoaded = state.load();
      if (isLoaded) await renderTiles();
      else setupNewGame();
      break;
    case "test":
      state.gameArray = injectTestArray(testMode);
      await renderTiles();
      break;
    default:
      throw new Error('init(): mode must be "normal" or "test"');
  } 

  checkAndHandleEndGame();
};

init();
// init({initMode: "test", testMode: "allTiles"});
// init({initMode: "test", testMode: "winLoose"});
