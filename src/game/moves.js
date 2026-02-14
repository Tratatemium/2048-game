import { renderTiles } from "../ui/ui.render.js";
import * as line from "../utils/line.utils.js";
import { transpose } from "../utils/helpers.js";

const transformRows = (gameArray, transformFn, direction, onChanged) => {
  let changed = false;
  let totalScore = 0;

  const transform = {
    left: (row) => transformFn(row),
    right: (row) => {
      const { line, gainedScore } = transformFn([...row].reverse());
      return { line: line.reverse(), gainedScore };
    },
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
    renderTiles,
  );
  changed = changed || slideResult.changed;

  const mergeResult = transformRows(
    gameArray,
    line.merge,
    direction,
    renderTiles,
  );
  changed = changed || mergeResult.changed;
  totalScore += mergeResult.gainedScore || 0;

  return { changed, totalScore };
};

const makeMove = {
  left: (gameArray) => processMove(gameArray, "left"),
  right: (gameArray) => processMove(gameArray, "right"),
  up: (gameArray) => {
    const transposed = transpose(gameArray);
    const { changed, totalScore } = processMove(transposed, "left");

    const restored = transpose(transposed);

    for (let i = 0; i < gameArray.length; i++) {
      gameArray[i] = restored[i];
    }

    return { changed, totalScore };
  },
  down: (gameArray) => {
    const transposed = transpose(gameArray);
    const { changed, totalScore } = processMove(transposed, "right");

    const restored = transpose(transposed);

    for (let i = 0; i < gameArray.length; i++) {
      gameArray[i] = restored[i];
    }

    return { changed, totalScore };
  },
};

export { makeMove };
