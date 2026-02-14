import { setupUI, renderTiles, showEndGame } from "./ui/ui.render.js";
import { setupControls } from "./ui/ui.controls.js";
import { state, storage } from "./game/state.js";
import { getGameResult } from "./game/rules.js";
import { injectTestArray } from "./test/test.js";

const init = async ({ initMode = "normal", testMode }) => {
  setupUI();
  setupControls();

  switch (initMode) {
    case "normal":
      state.load();
      break;
    case "test":
      state.gameArray = injectTestArray(testMode);
      break;
    default:
      throw new Error('init(): mode must be "normal" or "test"');
  }

  await renderTiles();
  
  const result = getGameResult(state.gameArray);
  if (result) showEndGame(result);
};

init({ initMode: "normal" });
// init({initMode: "test", testMode: "allTiles"});
// init({initMode: "test", testMode: "winLoose"});
