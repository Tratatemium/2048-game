import { WIN_TILE } from "../config.js";
import { transpose } from "../utils/helpers.js";

const mergesPossibleInRows = (gameArray) => {
  for (const row of gameArray) {
    for (let i = 0; i < row.length - 1; i++) {
      if (row[i].value === row[i + 1].value) {
        return true;
      }
    }
  }
  return false;
};

const playerLost = (gameArray) =>
  !gameArray.some((row) => row.some((tile) => tile.value === 0)) &&
  !mergesPossibleInRows(gameArray) &&
  !mergesPossibleInRows(transpose(gameArray));

const playerWon = (gameArray) =>
  gameArray.some((row) => row.some((el) => el.value === WIN_TILE));

const getGameResult = (gameArray) => {
  if (playerWon(gameArray)) return "win";
  if (playerLost(gameArray)) return "defeat";
  return null;
};

export { getGameResult };
