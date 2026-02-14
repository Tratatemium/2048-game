import { renderTiles } from "../ui/ui.render.js";
import * as line from "../utils/line.utils.js";
import { transpose } from "../utils/helpers.js";

const transformRows = (gameArray, transformFn, direction) => {
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

  return { changed, gainedScore: totalScore };
};

const dirMap = {
  left: { rowDirection: "left", vertical: false },
  right: { rowDirection: "right", vertical: false },
  up: { rowDirection: "left", vertical: true },
  down: { rowDirection: "right", vertical: true },
};

const processMove = async (gameArray, direction) => {
  let totalScore = 0;
  let changed = false;
  const isVertical = dirMap[direction].vertical;
  const rowDirection = dirMap[direction].rowDirection;

  let workingBoard = isVertical ? transpose(gameArray) : gameArray;

  const slideResult = transformRows(workingBoard, line.slide, rowDirection);
  if (slideResult.changed) {
    const boardToRender = isVertical ? transpose(workingBoard) : workingBoard;
    await renderTiles(boardToRender)
  }
  changed = changed || slideResult.changed;

  const mergeResult = transformRows(workingBoard, line.merge, rowDirection);
  if (mergeResult.changed) {
    const boardToRender = isVertical ? transpose(workingBoard) : workingBoard;
    await renderTiles(boardToRender);
  }
  changed = changed || mergeResult.changed;
  totalScore += mergeResult.gainedScore || 0;

  if (isVertical) {
    const restored = transpose(workingBoard);
    for (let i = 0; i < gameArray.length; i++) {
      gameArray[i] = restored[i];
    }
  }

  return { changed, totalScore };
};

export { processMove };
