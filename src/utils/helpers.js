import { state } from "../game/state.js";

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

const copyMatrix = (target, source) => {
  for (let i = 0; i < source.length; i++) {
    for (let j = 0; j < source[i].length; j++) {
      target[i][j] = source[i][j];
    }
  }
};

export { printGameArray, $, openDialog, transpose, copyMatrix };
