// #region FUNCTIONS

    /**
     * Prints the current game array to the console for debugging purposes
     * Displays values in a grid format matching the visual layout
     */
    const printArray = () => {
        console.log('-------');
        console.log(
            gameArray
                .map(row => row.map(el => el.value).join(' '))
                .join('\n')
        );
    };



    /**
     * Updates the DOM to reflect the current state of the game array
     * Creates new tile elements, updates positions, and removes deleted tiles
     * Handles both tile creation and smooth positioning animations
     */
    const updateGameField = () => {

        let tiles = Array.from(document.querySelectorAll('.tile'));

        for (const row of gameArray) {
            for (const element of row) {
                if (element.id) {
                    let tile = tiles.find(tile => tile.id === element.id);

                    if (!tile) {
                        const gameField = document.querySelector('.game-field');
                        tile = document.createElement('div');
                        tile.className = `tile`;
                        tile.id = element.id;
                        tile.style.setProperty('--x', element.x);
                        tile.style.setProperty('--y', element.y);
                        gameField.appendChild(tile);

                        const tileInner = document.createElement('div');
                        tileInner.textContent = element.value;
                        tileInner.className = `tile-inner tile-${element.value}`;
                        tile.appendChild(tileInner);
                        
                    } else {
                        tile.style.setProperty('--x', element.x);
                        tile.style.setProperty('--y', element.y);
                        tiles = tiles.filter(tile => tile.id !== element.id);
                    }
                }
            }
        }

        tiles.forEach((tile) => {
            tile.remove();
        });
    };


    /**
     * Slides tiles by removing empty spaces (moving non-zero tiles together)
     * Does not perform any merging - only repositioning
     * @param {Array} line - Array of tile objects representing a row or column
     * @returns {Array} - Line with empty spaces removed and filled at the end
     */
    const slide = (line) => {
        let result = line.filter((element) => element.value !== 0);
        while (result.length < line.length) {
            result.push({id: null, value: 0});
        }

        return result;
    };

    /**
     * Merges adjacent tiles with the same value
     * Assumes tiles are already slid together (no gaps between non-zero tiles)
     * @param {Array} line - Array of tile objects representing a row or column
     * @returns {Array} - Line with adjacent equal values merged and new empty spaces filled
     */
    const merge = (line) => {
        let result = [...line];
        for (let i = 0; i < result.length - 1; i++) {
            if (result[i].value === result[i + 1].value) {
                result[i].value = result[i].value * 2;
                result[i].id = crypto.randomUUID();
                result[i + 1].value = 0;
                result[i + 1].id = null;
            }
        }

        result = result.filter((element) => element.value !== 0);

        while (result.length < line.length) {
            result.push({id: null, value: 0});
        }

        return result;
    };

    /**
     * Adds a new tile (2 or 4) to a random empty position on the game board
     * 80% chance for value 2, 20% chance for value 4
     * Generates a unique ID for the new tile
     */
    const addNumberAtRundom = () => {
        let emptySpaces = [];

        for (let i = 0; i < gameArray.length; i++) {
            for (let j = 0; j < gameArray.length; j++) {
                if (gameArray[i][j].value === 0) emptySpaces.push([i, j]);
            }
        }

        if (emptySpaces.length > 0) {
            const randomSpace = Math.floor(Math.random() * emptySpaces.length);
            const [randomX, randomY] = emptySpaces[randomSpace];

            const newValue = Math.random() > 0.2 ? 2 : 4;
            gameArray[randomX][randomY].value = newValue;
            gameArray[randomX][randomY].id = crypto.randomUUID();
        }
    };


    /**
     * Handles keyboard input for game controls
     * Processes arrow key presses to move tiles in the specified direction
     * Manages the slide and merge logic for each direction
     * @param {KeyboardEvent} event - The keyboard event containing the pressed key
     */
    const onKeyDown = (event) => {

        let somethingMerged = false;
        let somethingSlid = false;

        switch (event.key) {
            case 'ArrowLeft':
                for (let i = 0; i < gameArray.length; i++) {
                    let row = structuredClone(gameArray[i]);
                    const lineBefore = structuredClone(row);
                    row = slide(row);
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;
                        for (let j = 0; j < gameArray.length; j ++) {
                            gameArray[i][j].value = row[j].value;
                            gameArray[i][j].id = row[j].id;
                        }
                    }                    
                }
                if (somethingSlid) updateGameField();

                for (let i = 0; i < gameArray.length; i++) {
                    let row = structuredClone(gameArray[i]);
                    const lineBefore = structuredClone(row);
                    row = merge(row);
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingMerged = true;
                        for (let j = 0; j < gameArray.length; j ++) {
                            gameArray[i][j].value = row[j].value;
                            gameArray[i][j].id = row[j].id;
                        }
                    }
                }
                if (somethingMerged) setTimeout(() => updateGameField(), somethingSlid ? 150 : 0);
                
                break;
            case 'ArrowRight':
                for (let i = 0; i < gameArray.length; i++) {
                    let row = structuredClone(gameArray[i]);
                    const lineBefore = structuredClone(row);
                    row = slide(row.reverse()).reverse();
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;
                        for (let j = 0; j < gameArray.length; j ++) {
                            gameArray[i][j].value = row[j].value;
                            gameArray[i][j].id = row[j].id;
                        }
                    }                    
                }
                if (somethingSlid) updateGameField();

                for (let i = 0; i < gameArray.length; i++) {
                    let row = structuredClone(gameArray[i]);
                    const lineBefore = structuredClone(row);
                    row = merge(row.reverse()).reverse();
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingMerged = true;
                        for (let j = 0; j < gameArray.length; j ++) {
                            gameArray[i][j].value = row[j].value;
                            gameArray[i][j].id = row[j].id;
                        }
                    }
                }
                if (somethingMerged) setTimeout(() => updateGameField(), somethingSlid ? 150 : 0);
                break;
            case 'ArrowUp':
                for (let j = 0; j < gameArray.length; j++) {
                    let column = structuredClone(gameArray.map((row) => row[j]));
                    const lineBefore = structuredClone(column);
                    column = slide(column);
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;
                        for (let i = 0; i < gameArray.length; i ++) {
                            gameArray[i][j].value = column[i].value;
                            gameArray[i][j].id = column[i].id;
                        }
                    }
                }
                if (somethingSlid) updateGameField();
                
                for (let j = 0; j < gameArray.length; j++) {
                    let column = structuredClone(gameArray.map((row) => row[j]));
                    const lineBefore = structuredClone(column);
                    column = merge(column);
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingMerged = true;
                        for (let i = 0; i < gameArray.length; i ++) {
                            gameArray[i][j].value = column[i].value;
                            gameArray[i][j].id = column[i].id;
                        }
                    }
                }
                if (somethingMerged) setTimeout(() => updateGameField(), somethingSlid ? 150 : 0);
                break;
            case 'ArrowDown':
                for (let j = 0; j < gameArray.length; j++) {
                    let column = structuredClone(gameArray.map((row) => row[j]));
                    const lineBefore = structuredClone(column);
                    column = slide(column.reverse()).reverse();
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;
                        for (let i = 0; i < gameArray.length; i ++) {
                            gameArray[i][j].value = column[i].value;
                            gameArray[i][j].id = column[i].id;
                        }
                    }
                }
                if (somethingSlid) updateGameField();
                
                for (let j = 0; j < gameArray.length; j++) {
                    let column = structuredClone(gameArray.map((row) => row[j]));
                    const lineBefore = structuredClone(column);
                    column = merge(column.reverse()).reverse();
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingMerged = true;
                        for (let i = 0; i < gameArray.length; i ++) {
                            gameArray[i][j].value = column[i].value;
                            gameArray[i][j].id = column[i].id;
                        }
                    }
                }
                if (somethingMerged) setTimeout(() => updateGameField(), somethingSlid ? 150 : 0);
                break;
            default:
        }

        if (somethingSlid || somethingMerged) {
            addNumberAtRundom();
        }
    };



// #endregion FUNCTIONS

// Empty game field
gameArray = Array.from({ length: 4 }, (_, i) =>
    Array.from({ length: 4 }, (_, j) => ({
        id: null,
        value: 0,
        x: j,
        y: i
    }))
);

// This is the array for testing purposes - it has all the numbers
// gameArray = [
//     [
//         { id: 1, value: 2, x: 0, y: 0 },
//         { id: 2, value: 4, x: 1, y: 0 },
//         { id: 3, value: 8, x: 2, y: 0 },
//         { id: 4, value: 16, x: 3, y: 0 }
//     ],
//     [
//         { id: 5, value: 32, x: 0, y: 1 },
//         { id: 6, value: 64, x: 1, y: 1 },
//         { id: 7, value: 128, x: 2, y: 1 },
//         { id: 8, value: 256, x: 3, y: 1 }
//     ],
//     [
//         { id: 9, value: 512, x: 0, y: 2 },
//         { id: 10, value: 1024, x: 1, y: 2 },
//         { id: 11, value: 2048, x: 2, y: 2 },
//         { id: null, value: 0, x: 3, y: 2 }
//     ],
//     [
//         { id: null, value: 0, x: 0, y: 3 },
//         { id: null, value: 0, x: 1, y: 3 },
//         { id: null, value: 0, x: 2, y: 3 },
//         { id: null, value: 0, x: 3, y: 3 }
//     ]
// ];



addNumberAtRundom();
addNumberAtRundom();
updateGameField()


const gameField = document.querySelector('.game-field');
document.addEventListener('keydown', (event) => onKeyDown(event));



