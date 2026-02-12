import { state } from "../script/state.js";
import { updateGameField } from "../script/dom-manipiulation.js";

const testArrays = {
  allTiles: [
    [
      { id: 1, value: 2, x: 0, y: 0 },
      { id: 2, value: 4, x: 1, y: 0 },
      { id: 3, value: 8, x: 2, y: 0 },
      { id: 4, value: 16, x: 3, y: 0 },
    ],
    [
      { id: 5, value: 32, x: 0, y: 1 },
      { id: 6, value: 64, x: 1, y: 1 },
      { id: 7, value: 128, x: 2, y: 1 },
      { id: 8, value: 256, x: 3, y: 1 },
    ],
    [
      { id: 9, value: 512, x: 0, y: 2 },
      { id: 10, value: 1024, x: 1, y: 2 },
      { id: 11, value: 2048, x: 2, y: 2 },
      { id: null, value: 0, x: 3, y: 2 },
    ],
    [
      { id: null, value: 0, x: 0, y: 3 },
      { id: null, value: 0, x: 1, y: 3 },
      { id: null, value: 0, x: 2, y: 3 },
      { id: null, value: 0, x: 3, y: 3 },
    ],
  ],
  winLoose: [
    [
      { id: 1, value: 2, x: 0, y: 0 },
      { id: 2, value: 4, x: 1, y: 0 },
      { id: 3, value: 8, x: 2, y: 0 },
      { id: 4, value: 16, x: 3, y: 0 },
    ],
    [
      { id: 5, value: 32, x: 0, y: 1 },
      { id: 6, value: 64, x: 1, y: 1 },
      { id: 7, value: 1024, x: 2, y: 1 },
      { id: 8, value: 1024, x: 3, y: 1 },
    ],
    [
      { id: 9, value: 8, x: 0, y: 2 },
      { id: 10, value: 16, x: 1, y: 2 },
      { id: 11, value: 32, x: 2, y: 2 },
      { id: 12, value: 64, x: 3, y: 2 },
    ],
    [
      { id: 13, value: 2, x: 0, y: 3 },
      { id: 14, value: 4, x: 1, y: 3 },
      { id: 15, value: 8, x: 2, y: 3 },
      { id: null, value: 0, x: 3, y: 3 }, // Only one empty space
    ],
  ],
};

const injectTestArray = (testMode) => {
  const arrayToInject = testArrays[testMode];
  if (!arrayToInject)
    throw new Error(
      `injectTestArray() does not have a test mode: ${testMode}.`,
    );
  state.gameArray = arrayToInject;
  updateGameField();
};

export { testArrays, injectTestArray };
