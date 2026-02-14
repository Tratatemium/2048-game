import { state } from "../game/state.js"
import { setupUIButtons } from "./ui.buttons.js";
import { $ } from "../utils/helpers.js";
import { animationController } from "../game/animation.controller.js";

const setupUI = () => {
  setupUIButtons();
};

const resetUI = () => {
  ["main", "header"].forEach(selector =>
    $(selector).classList.remove("win", "defeat")
  );
};

const renderScore = () => {
  $(".current-score-span").textContent = state.score;
};

const createTile = (element, gameField, x, y) => {
  const tile = document.createElement("div");
  tile.className = `tile`;
  tile.id = element.id;
  tile.style.setProperty("--x", x);
  tile.style.setProperty("--y", y);
  gameField.appendChild(tile);

  const tileInner = document.createElement("div");
  tileInner.className = `tile-inner tile-${element.value}`;
  tile.appendChild(tileInner);

  const tileText = document.createElement("div");
  tileText.textContent = element.value;
  tileText.className = `tile-text`;
  tileInner.appendChild(tileText);
};

const renderTiles = async (gameArray = state.gameArray) => {
  const gameField = $(".game-field");
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const tileMap = new Map(tiles.map((tile) => [tile.id, tile]));
  const usedIds = new Set();

  gameArray.forEach((row, y) => {
    row.forEach((element, x) => {
      if (!element.id) return;

      usedIds.add(element.id);
      const tile = tileMap.get(element.id);

      if (!tile) {
        createTile(element, gameField, x, y);
      } else {
        tile.style.setProperty("--x", x);
        tile.style.setProperty("--y", y);
      }
    });
  });

  tiles.forEach((tile) => {
    if (!usedIds.has(tile.id)) tile.remove();
  });

  await animationController.runTransition();
};

const showEndGame = (result) => {
  ["main", "header"].forEach(selector =>
    $(selector).classList.add(result)
  );

  $(".endgame-message h2").textContent =
    result === "win" ? "You Won!" : "Game over";

  $(".endgame-score").textContent = state.score;
  $(".endgame-moves").textContent = state.moves;
};

export { setupUI, resetUI, renderScore, renderTiles, showEndGame };
