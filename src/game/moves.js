  import * as line from "../utils/line.utils.js"
  
  switch (direction) {
    //  ⇐  LEFT  ⇐
    case "Left":
      // PHASE 1: SLIDE - Move all tiles to the left (remove gaps)
      for (let i = 0; i < state.gameArray.length; i++) {
        let row = structuredClone(state.gameArray[i]); // Copy current row
        const lineBefore = structuredClone(row); // Save original for comparison
        row = slide(row); // Apply slide operation

        // Check if anything actually moved during the slide
        if (
          row.some(
            (element, index) => element.value !== lineBefore[index].value,
          )
        ) {
          somethingSlid = true; // Mark that tiles moved
          // Update the game array with new positions
          for (let j = 0; j < state.gameArray.length; j++) {
            state.gameArray[i][j].value = row[j].value;
            state.gameArray[i][j].id = row[j].id;
          }
        }
      }
      // If tiles slid, update DOM to trigger slide animation
      if (somethingSlid) updateGameField();

      // PHASE 2: MERGE - Combine adjacent tiles with same values
      for (let i = 0; i < state.gameArray.length; i++) {
        let row = structuredClone(state.gameArray[i]); // Copy current row state
        const lineBefore = structuredClone(row); // Save for comparison
        row = merge(row); // Apply merge operation

        // Check if any merges occurred
        if (
          row.some(
            (element, index) => element.value !== lineBefore[index].value,
          )
        ) {
          somethingMerged = true; // Mark that tiles merged
          // Update the game array with merged values
          for (let j = 0; j < state.gameArray.length; j++) {
            state.gameArray[i][j].value = row[j].value;
            state.gameArray[i][j].id = row[j].id;
          }
        }
      }
      // Don't update DOM immediately for merge - will be handled by delayed update below

      break;

    //  ⇒  RIGHT  ⇒
    case "Right":
      // PHASE 1: SLIDE - Move all tiles to the right
      // Trick: reverse row, slide left, then reverse back to simulate right slide
      for (let i = 0; i < state.gameArray.length; i++) {
        let row = structuredClone(state.gameArray[i]); // Copy current row
        const lineBefore = structuredClone(row); // Save original
        row = slide(row.reverse()).reverse(); // Reverse → slide → reverse back

        if (
          row.some(
            (element, index) => element.value !== lineBefore[index].value,
          )
        ) {
          somethingSlid = true;
          for (let j = 0; j < state.gameArray.length; j++) {
            state.gameArray[i][j].value = row[j].value;
            state.gameArray[i][j].id = row[j].id;
          }
        }
      }
      if (somethingSlid) updateGameField();

      // PHASE 2: MERGE - Combine tiles moving right
      for (let i = 0; i < state.gameArray.length; i++) {
        let row = structuredClone(state.gameArray[i]);
        const lineBefore = structuredClone(row);
        row = merge(row.reverse()).reverse(); // Same reverse trick for merging

        if (
          row.some(
            (element, index) => element.value !== lineBefore[index].value,
          )
        ) {
          somethingMerged = true;
          for (let j = 0; j < state.gameArray.length; j++) {
            state.gameArray[i][j].value = row[j].value;
            state.gameArray[i][j].id = row[j].id;
          }
        }
      }
      // Don't update DOM immediately for merge - will be handled by delayed update below
      break;

    //  ⇑  UP  ⇑
    case "Up":
      // PHASE 1: SLIDE - Move all tiles upward
      // Work with columns instead of rows (extract column, process, put back)
      for (let j = 0; j < state.gameArray.length; j++) {
        // Extract column j from all rows
        let column = structuredClone(state.gameArray.map((row) => row[j]));
        const lineBefore = structuredClone(column); // Save original column
        column = slide(column); // Slide tiles up (toward index 0)

        if (
          column.some(
            (element, index) => element.value !== lineBefore[index].value,
          )
        ) {
          somethingSlid = true;
          // Put the modified column back into the game array
          for (let i = 0; i < state.gameArray.length; i++) {
            state.gameArray[i][j].value = column[i].value;
            state.gameArray[i][j].id = column[i].id;
          }
        }
      }
      if (somethingSlid) updateGameField();

      // PHASE 2: MERGE - Combine tiles moving upward
      for (let j = 0; j < state.gameArray.length; j++) {
        let column = structuredClone(state.gameArray.map((row) => row[j]));
        const lineBefore = structuredClone(column);
        column = merge(column); // Merge adjacent tiles in column

        if (
          column.some(
            (element, index) => element.value !== lineBefore[index].value,
          )
        ) {
          somethingMerged = true;
          // Put merged column back into game array
          for (let i = 0; i < state.gameArray.length; i++) {
            state.gameArray[i][j].value = column[i].value;
            state.gameArray[i][j].id = column[i].id;
          }
        }
      }
      // Don't update DOM immediately for merge - will be handled by delayed update below
      break;

    //  ⇓  DOWN  ⇓
    case "Down":
      // PHASE 1: SLIDE - Move all tiles downward
      // Trick: reverse column, slide up, reverse back to simulate down slide
      for (let j = 0; j < state.gameArray.length; j++) {
        let column = structuredClone(state.gameArray.map((row) => row[j]));
        const lineBefore = structuredClone(column); // Save original column
        column = slide(column.reverse()).reverse(); // Reverse → slide → reverse back

        if (
          column.some(
            (element, index) => element.value !== lineBefore[index].value,
          )
        ) {
          somethingSlid = true;
          // Put modified column back into game array
          for (let i = 0; i < state.gameArray.length; i++) {
            state.gameArray[i][j].value = column[i].value;
            state.gameArray[i][j].id = column[i].id;
          }
        }
      }
      if (somethingSlid) updateGameField();

      // PHASE 2: MERGE - Combine tiles moving downward
      for (let j = 0; j < state.gameArray.length; j++) {
        let column = structuredClone(state.gameArray.map((row) => row[j]));
        const lineBefore = structuredClone(column);
        column = merge(column.reverse()).reverse(); // Same reverse trick for merging

        if (
          column.some(
            (element, index) => element.value !== lineBefore[index].value,
          )
        ) {
          somethingMerged = true;
          for (let i = 0; i < state.gameArray.length; i++) {
            state.gameArray[i][j].value = column[i].value;
            state.gameArray[i][j].id = column[i].id;
          }
        }
      }
      // Don't update DOM immediately for merge - will be handled by delayed update below
      break;
    default:
      // Ignore any other key presses (no valid game move)
      return;
  }