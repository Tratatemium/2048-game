import { setupUI } from "./ui/ui.render.js";
import { loadGame } from "./script/local-storage.js";
import { checkForEndGame } from "./script/end-game.js";
import { injectTestArray } from "./test/test.js";

const init = ({ initMode = "normal", testMode }) => {
  setupUI();
  switch (initMode) {
    case "normal":
      loadGame();
      break;
    case "test":
      injectTestArray(testMode);
      break;
    default:
      throw new Error('init(): mode must be "normal" or "test"');
  }
  checkForEndGame();
};

init({ initMode: "normal" });
// init({initMode: "test", testMode: "allTiles"});
// init({initMode: "test", testMode: "winLoose"});
