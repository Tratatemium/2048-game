import { state } from "../game/state.js"
import { setupUIButtons } from "./ui.buttons.js";
import { $ } from "../utils/helpers.js";

const setupUI = () => {
  setupUIButtons();
};

const renderScore = () => {
  $(".current-score-span").textContent = state.score;
};

const createTile = (element, gameField) => {
  const tile = document.createElement("div");
  tile.className = `tile`;
  tile.id = element.id;
  tile.style.setProperty("--x", element.x);
  tile.style.setProperty("--y", element.y);
  gameField.appendChild(tile);

  const tileInner = document.createElement("div");
  tileInner.className = `tile-inner tile-${element.value}`;
  tile.appendChild(tileInner);

  const tileText = document.createElement("div");
  tileText.textContent = element.value;
  tileText.className = `tile-text`;
  tileInner.appendChild(tileText);
};

const renderTiles = (gameArray) => {
  const gameField = $(".game-field");
  const tiles = Array.from(document.querySelectorAll(".tile"));
  const tileMap = new Map(tiles.map((tile) => [tile.id, tile]));
  const usedIds = new Set();

  for (const row of gameArray) {
    for (const element of row) {
      if (!element.id) continue;

      usedIds.add(element.id);
      const tile = tileMap.get(element.id);

      if (!tile) {
        createTile(element, gameField);
      } else {
        tile.style.setProperty("--x", element.x);
        tile.style.setProperty("--y", element.y);
      }
    }
  }

  tiles.forEach((tile) => {
    if (!usedIds.has(tile.id)) tile.remove();
  });
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

export { setupUI, renderScore, renderTiles, showEndGame };
