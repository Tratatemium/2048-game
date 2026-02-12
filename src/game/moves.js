import * as line from "../utils/line.utils.js";
import { transpose, copyMatrix } from "../utils/helpers.js";

const transformRows = (gameArray, transformFn, direction, onChanged) => {
  let changed = false;
  let totalScore = 0;

  const transform = {
    left: (row) => transformFn(row),
    right: (row) => transformFn([...row].reverse()).reverse(),
  };

  gameArray.forEach((row, i) => {
    const { line: newRow, gainedScore } = transform[direction](row);
    totalScore += gainedScore;

    const rowChanged = newRow.some(
      (tile, index) => tile.value !== row[index].value,
    );
    if (rowChanged) changed = true;

    gameArray[i] = newRow;
  });

  if (changed && onChanged) onChanged();

  return { changed, gainedScore: totalScore };
};

const processMove = (gameArray, direction) => {
  let totalScore = 0;
  let changed = false;

  const slideResult = transformRows(
    gameArray,
    line.slide,
    direction,
    updateGameField,
  );
  changed = changed || slideResult.changed;

  const mergeResult = transformRows(
    gameArray,
    line.merge,
    direction,
    updateGameField,
  );
  changed = changed || mergeResult.changed;
  totalScore += mergeResult.gainedScore || 0;

  return { changed, totalScore };
};

const move = {
  left: (gameArray) => processMove(gameArray, "left"),
  right: (gameArray) => processMove(gameArray, "right"),
  up: (gameArray) => {
    const transposed = transpose(gameArray);
    const result = processMove(transposed, "left");
    copyMatrix(gameArray, transposed);
    return result;
  },
  down: (gameArray) => {
    const transposed = transpose(gameArray);
    const result = processMove(transposed, "right");
    copyMatrix(gameArray, transposed);
    return result;
  },
};

export { move };
