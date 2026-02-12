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

export { printGameArray, $, openDialog };