import { WIN_TILE } from "../config.js";

const playerWon = (gameArray) =>
  gameArray.some((row) => row.some((el) => el.value === WIN_TILE));

const playerLost = () => {
  // Step 1: Check if there are any empty spaces
  const emptySpacesExist = state.gameArray.some((row) =>
    row.some((el) => el.value === 0),
  );

  // If empty spaces exist, game is not over
  if (emptySpacesExist) return false;

  // Step 2: Check if any adjacent tiles can be merged (horizontal)
  for (let i = 0; i < state.gameArray.length; i++) {
    for (let j = 0; j < state.gameArray.length - 1; j++) {
      if (state.gameArray[i][j].value === state.gameArray[i][j + 1].value)
        return false;
    }
  }

  // Step 3: Check if any adjacent tiles can be merged (vertical)
  for (let i = 0; i < state.gameArray.length - 1; i++) {
    for (let j = 0; j < state.gameArray.length; j++) {
      if (state.gameArray[i][j].value === state.gameArray[i + 1][j].value)
        return false;
    }
  }

  // No empty spaces and no possible merges = game over
  return true;
};

export { playerWon, playerLost };
