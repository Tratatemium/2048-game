import * as line from "../utils/line.utils.js";
import { transpose, copyMatrix } from "../utils/helpers.js";

const transformRows = (gameArray, transformFn, direction, onChanged) => {
  let changed = false;
  const transform = {
    left: (row) => transformFn(row),
    right: (row) => transformFn([...row].reverse()).reverse(),
  };
  gameArray.forEach((row, i) => {
    const newRow = transform[direction](row);
    const rowChanged = newRow.some(
      (tile, index) => tile.value !== row[index].value,
    );
    if (rowChanged) changed = true;
    gameArray[i] = newRow;
  });
  if (changed && onChanged) onChanged();
  return changed;
};

const processMove = (gameArray, direction) => {
  transformRows(gameArray, line.slide, direction, updateGameField);
  transformRows(gameArray, line.merge, direction, updateGameField);
};

const move = {
  left: (gameArray) => processMove(gameArray, "left"),
  right: (gameArray) => processMove(gameArray, "right"),
  up: (gameArray) => {
    const transposed = transpose(gameArray);
    processMove(transposed, "left");
    copyMatrix(gameArray, transposed);
  },
  down: (gameArray) => {
    const transposed = transpose(gameArray);
    processMove(transposed, "right");
    copyMatrix(gameArray, transposed);
  },
};

export { move };