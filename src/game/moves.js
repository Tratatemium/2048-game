import { renderTiles } from "../ui/ui.render.js";
import * as line from "../utils/line.utils.js";
import { transpose } from "../utils/helpers.js";

const transformRows = (gameArray, transformation, direction) => {
  let changed = false;
  let totalScore = 0;

  const applyDirection = (row) => {
    if (direction === "left") {
      return transformation(row);
    } else if (direction === "right") {
      const { line, gainedScore } = transformation([...row].reverse());
      return { line: line.reverse(), gainedScore };
    }
    throw new Error(`Unknown direction: ${direction}`);
  };

  gameArray.forEach((row, i) => {
    const { line: transformedRow, gainedScore } = applyDirection(row);
    totalScore += gainedScore;

    const rowChanged = transformedRow.some(
      (tile, index) => tile.value !== row[index].value,
    );
    if (rowChanged) changed = true;

    gameArray[i] = transformedRow;
  });

  return { changed, gainedScore: totalScore };
};

const directionsMap = {
  left: { rowDirection: "left", isVertical: false },
  right: { rowDirection: "right", isVertical: false },
  up: { rowDirection: "left", isVertical: true },
  down: { rowDirection: "right", isVertical: true },
};

const processMove = async (gameArray, direction) => {
  const { isVertical, rowDirection } = directionsMap[direction];

  const getOrientedBoard = (board) => (isVertical ? transpose(board) : board);

  let workingBoard = getOrientedBoard(gameArray);
  let moveScore = 0;
  let changed = false;

  for (const transformation of [line.slide, line.merge]) {
    const result = transformRows(workingBoard, transformation, rowDirection);
    if (result.changed) {
      const boardToRender = getOrientedBoard(workingBoard);
      await renderTiles(boardToRender);
      changed = true;
    }
    moveScore += result.gainedScore || 0;
  }

  if (isVertical) {
    const restored = transpose(workingBoard);
    for (let i = 0; i < gameArray.length; i++) {
      gameArray[i] = restored[i];
    }
  }

  return { changed, moveScore };
};

export { processMove };
