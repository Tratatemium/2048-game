import { renderTiles } from "../ui/ui.render.js";
import * as line from "../utils/line.utils.js";
import { transpose } from "../utils/helpers.js";

const transformRows = async (gameArray, transformFn, direction, onChanged) => {
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

  if (changed && onChanged) await onChanged();

  return { changed, gainedScore: totalScore };
};

const processMove = async (gameArray, direction) => {
  let totalScore = 0;
  let changed = false;

  const slideResult = await transformRows(
    gameArray,
    line.slide,
    direction,
    renderTiles,
  );
  changed = changed || slideResult.changed;

  const mergeResult = await transformRows(
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
  left: async (gameArray) => await processMove(gameArray, "left"),
  right: async (gameArray) => await processMove(gameArray, "right"),
  up: async (gameArray) => {
    const transposed = transpose(gameArray);
    const { changed, totalScore } = await processMove(transposed, "left");

    const restored = transpose(transposed);

    for (let i = 0; i < gameArray.length; i++) {
      gameArray[i] = restored[i];
    }

    return { changed, totalScore };
  },
  down: async (gameArray) => {
    const transposed = transpose(gameArray);
    const { changed, totalScore } = await processMove(transposed, "right");

    const restored = transpose(transposed);

    for (let i = 0; i < gameArray.length; i++) {
      gameArray[i] = restored[i];
    }

    return { changed, totalScore };
  },
};

export { makeMove };
