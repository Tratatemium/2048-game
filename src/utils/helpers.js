import { state } from "../game/state.js";
import { BOARD_SIZE } from "../config.js";

const printGameArray = () => {
  console.log("-------");
  console.log(
    state.gameArray
      .map((row) => row.map((el) => el.value).join(" "))
      .join("\n"),
  );
};

const $ = (sel) => document.querySelector(sel);

const openDialog = (dialog) => {
  if (!dialog.open) dialog.showModal();
};

const transpose = (matrix) =>
  matrix[0].map((_, colIndex) => matrix.map((row) => row[colIndex]));

const createEmptyBoard = () =>
  Array.from({ length: BOARD_SIZE }, (_, i) =>
    Array.from({ length: BOARD_SIZE }, (_, j) => ({
      id: null,
      value: 0,
    })),
  );

export { printGameArray, $, openDialog, transpose, createEmptyBoard };
