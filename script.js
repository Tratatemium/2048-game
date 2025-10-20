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

        // Get all existing tile elements currently in the DOM
        let tiles = Array.from(document.querySelectorAll('.tile'));

        // Process each tile in the game array
        for (const row of gameArray) {
            for (const element of row) {
                // Only process tiles that have content (non-empty tiles have IDs)
                if (element.id) {
                    // Try to find existing DOM element for this tile
                    let tile = tiles.find(tile => tile.id === element.id);

                    if (!tile) {
                        // CREATE NEW TILE: This tile doesn't exist in DOM yet
                        const gameField = document.querySelector('.game-field');
                        tile = document.createElement('div');
                        tile.className = `tile`;                       // Base tile styling
                        tile.id = element.id;                          // Unique identifier
                        tile.style.setProperty('--x', element.x);      // CSS custom property for X position
                        tile.style.setProperty('--y', element.y);      // CSS custom property for Y position
                        gameField.appendChild(tile);

                        // Create the inner content div with the number and styling
                        const tileInner = document.createElement('div');
                        tileInner.className = `tile-inner tile-${element.value}`; // Value-specific styling
                        tile.appendChild(tileInner);

                        const tileText = document.createElement('div');
                        tileText.textContent = element.value;         // Display the tile number
                        tileText.className = `tile-text`;
                        tileInner.appendChild(tileText);
                        
                    } else {
                        // UPDATE EXISTING TILE: Move to new position (triggers CSS animation)
                        tile.style.setProperty('--x', element.x);      // Update X position
                        tile.style.setProperty('--y', element.y);      // Update Y position
                        // Remove this tile from the cleanup list since we're using the list later
                        tiles = tiles.filter(tile => tile.id !== element.id);
                    }
                }
            }
        }

        // CLEANUP: Remove any tiles that are no longer in the game array
        // These are tiles that were merged or otherwise eliminated
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
        // Step 1: Remove all empty tiles (value === 0) to eliminate gaps
        let result = line.filter((element) => element.value !== 0);
        
        // Step 2: Fill the remaining positions with empty tiles
        // This ensures the array maintains its original length
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
        let result = [...line];  // Create a copy to avoid modifying the original
        
        // Step 1: Scan for adjacent pairs with matching values
        for (let i = 0; i < result.length - 1; i++) {
            // Check if current tile and next tile have the same non-zero value
            if (result[i].value === result[i + 1].value && result[i].value !== 0) {
                result[i].value = result[i].value * 2;     // Double the first tile's value
                score = score + result[i].value;           // Add merged number to the score
                result[i].id = crypto.randomUUID();        // Generate new ID for merged tile
                result[i + 1].value = 0;                   // Mark second tile as empty
                result[i + 1].id = null;                   // Remove second tile's ID
                // Note: We don't increment i here, so each tile can only merge once per move
            }
        }

        // Step 2: Remove the empty tiles created by merging
        result = result.filter((element) => element.value !== 0);

        // Step 3: Fill remaining positions with empty tiles to maintain array length
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
        // Step 1: Find all empty positions on the board
        let emptySpaces = [];

        // Scan the entire 4x4 grid for empty tiles (value === 0)
        for (let i = 0; i < gameArray.length; i++) {
            for (let j = 0; j < gameArray.length; j++) {
                if (gameArray[i][j].value === 0) {
                    emptySpaces.push([i, j]);  // Store coordinates [row, column]
                }
            }
        }

        // Step 2: Add a new tile if there are empty spaces available
        if (emptySpaces.length > 0) {
            // Pick a random empty position
            const randomSpace = Math.floor(Math.random() * emptySpaces.length);
            const [randomX, randomY] = emptySpaces[randomSpace];

            // Generate new tile value (80% chance for 2, 20% chance for 4)
            const newValue = Math.random() > 0.2 ? 2 : 4;
            
            // Place the new tile in the selected position
            gameArray[randomX][randomY].value = newValue;
            gameArray[randomX][randomY].id = crypto.randomUUID();  // Generate unique ID
        }
        // Note: If no empty spaces exist, the function does nothing (game might be over)
    };


    /**
     * Checks if the game is over (defeat condition)
     * Game is over when no empty spaces exist AND no valid moves are possible
     * @returns {boolean} - True if game is over, false if moves are still possible
     */
    const playerLost = () => {
        // Step 1: Check if there are any empty spaces
        const emptySpacesExist = gameArray.some((row) => row.some((el) => el.value === 0));
        
        // If empty spaces exist, game is not over
        if (emptySpacesExist) return false;
        
        // Step 2: Check if any adjacent tiles can be merged (horizontal)
        for (let i = 0; i < gameArray.length; i++) {
            for (let j = 0; j < gameArray.length - 1; j++) {
                if (gameArray[i][j].value === gameArray[i][j + 1].value) return false;
            }
        }
        
        // Step 3: Check if any adjacent tiles can be merged (vertical)
        for (let i = 0; i < gameArray.length - 1; i++) {
            for (let j = 0; j < gameArray.length; j++) {
                if (gameArray[i][j].value === gameArray[i + 1][j].value) return false;
            }
        }
        
        // No empty spaces and no possible merges = game over
        return true;
    };


    const setupNewGame = () => {

        score = 0;
        const scoreSpan = document.querySelector('.current-score-span');
        scoreSpan.textContent = score;
        moves = 0;

        const main = document.querySelector('main');
        main.classList.remove('defeat');

        /**
         * Initialize the game board as a 4x4 grid of empty tiles
         * Each tile object contains:
         * - id: Unique identifier (null for empty tiles)
         * - value: Tile number (0 for empty tiles)  
         * - x: Column position (0-3)
         * - y: Row position (0-3)
         */
        gameArray = Array.from({ length: 4 }, (_, i) =>
            Array.from({ length: 4 }, (_, j) => ({
                id: null,        // No ID for empty tiles
                value: 0,        // 0 represents an empty space
                x: j,            // Column index (0 = leftmost)
                y: i             // Row index (0 = topmost)
            }))
        );

        // Add two random tiles (standard 2048 starting condition)
        addNumberAtRundom();
        addNumberAtRundom();

        // Render the initial game state to the DOM
        updateGameField();
    };


    /**
     * Handles keyboard input for game controls
     * Processes arrow key presses to move tiles in the specified direction
     * Manages the slide and merge logic for each direction
     * @param {KeyboardEvent} event - The keyboard event containing the pressed key
     */
    const onKeyDown = (event) => {

        // Check if there are any ongoing CSS transitions
        const tiles = document.querySelectorAll('.tile');
        const hasTransitions = Array.from(tiles).some(tile => {
            const animations = tile.getAnimations();
            // CSS transitions appear as CSSTransition objects
            return animations.some(anim => 
                anim.constructor.name === 'CSSTransition' && 
                anim.playState === 'running'
            );
        });

        // Also check for fadeIn animations on tile-inner elements
        const tileInners = document.querySelectorAll('.tile-inner');
        const hasFadeInAnimations = Array.from(tileInners).some(tileInner => {
            const animations = tileInner.getAnimations();
            return animations.length > 0 && animations.some(anim => anim.playState === 'running');
        });

        // If animations are running, ignore the key press
        if (hasTransitions || hasFadeInAnimations) {
            return;
        }

        // Track if any changes occurred to determine if we need to add a new tile
        let somethingMerged = false;  // Flag for merge operations
        let somethingSlid = false;    // Flag for slide operations

        switch (event.key) {

            //  ⇐  LEFT  ⇐
            case 'ArrowLeft':
                // PHASE 1: SLIDE - Move all tiles to the left (remove gaps)
                for (let i = 0; i < gameArray.length; i++) {
                    let row = structuredClone(gameArray[i]);           // Copy current row
                    const lineBefore = structuredClone(row);           // Save original for comparison
                    row = slide(row);                                  // Apply slide operation
                    
                    // Check if anything actually moved during the slide
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;                          // Mark that tiles moved
                        // Update the game array with new positions
                        for (let j = 0; j < gameArray.length; j ++) {
                            gameArray[i][j].value = row[j].value;
                            gameArray[i][j].id = row[j].id;
                        }
                    }                    
                }
                // If tiles slid, update DOM to trigger slide animation
                if (somethingSlid) updateGameField();

                // PHASE 2: MERGE - Combine adjacent tiles with same values
                for (let i = 0; i < gameArray.length; i++) {
                    let row = structuredClone(gameArray[i]);           // Copy current row state
                    const lineBefore = structuredClone(row);           // Save for comparison
                    row = merge(row);                                  // Apply merge operation
                    
                    // Check if any merges occurred
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingMerged = true;                        // Mark that tiles merged
                        // Update the game array with merged values
                        for (let j = 0; j < gameArray.length; j ++) {
                            gameArray[i][j].value = row[j].value;
                            gameArray[i][j].id = row[j].id;
                        }
                    }
                }
                // Update DOM after merge with delay if slide animation happened first
                if (somethingMerged) setTimeout(() => updateGameField(), somethingSlid ? 150 : 0);
                
                break;

            //  ⇒  RIGHT  ⇒    
            case 'ArrowRight':
                // PHASE 1: SLIDE - Move all tiles to the right
                // Trick: reverse row, slide left, then reverse back to simulate right slide
                for (let i = 0; i < gameArray.length; i++) {
                    let row = structuredClone(gameArray[i]);           // Copy current row
                    const lineBefore = structuredClone(row);           // Save original
                    row = slide(row.reverse()).reverse();              // Reverse → slide → reverse back
                    
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;
                        for (let j = 0; j < gameArray.length; j ++) {
                            gameArray[i][j].value = row[j].value;
                            gameArray[i][j].id = row[j].id;
                        }
                    }                    
                }
                if (somethingSlid) updateGameField();

                // PHASE 2: MERGE - Combine tiles moving right
                for (let i = 0; i < gameArray.length; i++) {
                    let row = structuredClone(gameArray[i]);
                    const lineBefore = structuredClone(row);
                    row = merge(row.reverse()).reverse();              // Same reverse trick for merging
                    
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

            //  ⇑  UP  ⇑    
            case 'ArrowUp':
                // PHASE 1: SLIDE - Move all tiles upward
                // Work with columns instead of rows (extract column, process, put back)
                for (let j = 0; j < gameArray.length; j++) {
                    // Extract column j from all rows
                    let column = structuredClone(gameArray.map((row) => row[j]));
                    const lineBefore = structuredClone(column);        // Save original column
                    column = slide(column);                            // Slide tiles up (toward index 0)
                    
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;
                        // Put the modified column back into the game array
                        for (let i = 0; i < gameArray.length; i ++) {
                            gameArray[i][j].value = column[i].value;
                            gameArray[i][j].id = column[i].id;
                        }
                    }
                }
                if (somethingSlid) updateGameField();
                
                // PHASE 2: MERGE - Combine tiles moving upward
                for (let j = 0; j < gameArray.length; j++) {
                    let column = structuredClone(gameArray.map((row) => row[j]));
                    const lineBefore = structuredClone(column);
                    column = merge(column);                            // Merge adjacent tiles in column
                    
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingMerged = true;
                        // Put merged column back into game array
                        for (let i = 0; i < gameArray.length; i ++) {
                            gameArray[i][j].value = column[i].value;
                            gameArray[i][j].id = column[i].id;
                        }
                    }
                }
                if (somethingMerged) setTimeout(() => updateGameField(), somethingSlid ? 150 : 0);
                break;

            //  ⇓  DOWN  ⇓    
            case 'ArrowDown':
                // PHASE 1: SLIDE - Move all tiles downward  
                // Trick: reverse column, slide up, reverse back to simulate down slide
                for (let j = 0; j < gameArray.length; j++) {
                    let column = structuredClone(gameArray.map((row) => row[j]));
                    const lineBefore = structuredClone(column);        // Save original column
                    column = slide(column.reverse()).reverse();        // Reverse → slide → reverse back
                    
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;
                        // Put modified column back into game array
                        for (let i = 0; i < gameArray.length; i ++) {
                            gameArray[i][j].value = column[i].value;
                            gameArray[i][j].id = column[i].id;
                        }
                    }
                }
                if (somethingSlid) updateGameField();
                
                // PHASE 2: MERGE - Combine tiles moving downward
                for (let j = 0; j < gameArray.length; j++) {
                    let column = structuredClone(gameArray.map((row) => row[j]));
                    const lineBefore = structuredClone(column);
                    column = merge(column.reverse()).reverse();        // Same reverse trick for merging
                    
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
                // Ignore any other key presses
        }

        // After any valid move (slide or merge), add a new tile to the board
        if (somethingSlid || somethingMerged) {
            addNumberAtRundom();
            updateGameField();
            moves++;

            const scoreSpan = document.querySelector('.current-score-span');
            scoreSpan.textContent = score;
        }

        setTimeout(() => {
            const playerWon = gameArray.some((row) => row.some((el) => el.value === 2048));
            if (playerWon) {
                const main = document.querySelector('main');
                main.classList.add('win');

                const h2Message = document.querySelector('.endgame-message h2');
                h2Message.textContent = 'You Won!';
                const scoreSpan = document.querySelector('.endgame-score');
                scoreSpan.textContent = score;
                const movesSpan = document.querySelector('.endgame-moves');
                movesSpan.textContent = moves;

            } else {
                if (playerLost()) {

                    const main = document.querySelector('main');
                    main.classList.add('defeat');

                    const h2Message = document.querySelector('.endgame-message h2');
                    h2Message.textContent = 'Game over';

                    const scoreSpan = document.querySelector('.endgame-score');
                    scoreSpan.textContent = score;
                    const movesSpan = document.querySelector('.endgame-moves');
                    movesSpan.textContent = moves;
                }
            }
        }, 400);        
    };



// #endregion FUNCTIONS


// ========================================
// GAME INITIALIZATION
// ========================================

let gameArray;
let score = 0;
let moves = 0;


/**
 * DEBUG/TESTING ARRAY - Uncomment to test with all tile values
 * This pre-filled array is useful for testing animations and styling
 */
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
// updateGameField();

/**
 * DEFEAT TESTING ARRAY - Uncomment to test defeat condition
 * Board is one move away from defeat (15/16 tiles filled, no merges possible)
 */
    gameArray = [
        [
            { id: 1, value: 2, x: 0, y: 0 },
            { id: 2, value: 4, x: 1, y: 0 },
            { id: 3, value: 8, x: 2, y: 0 },
            { id: 4, value: 16, x: 3, y: 0 }
        ],
        [
            { id: 5, value: 32, x: 0, y: 1 },
            { id: 6, value: 64, x: 1, y: 1 },
            { id: 7, value: 2, x: 2, y: 1 },
            { id: 8, value: 4, x: 3, y: 1 }
        ],
        [
            { id: 9, value: 8, x: 0, y: 2 },
            { id: 10, value: 16, x: 1, y: 2 },
            { id: 11, value: 32, x: 2, y: 2 },
            { id: 12, value: 64, x: 3, y: 2 }
        ],
        [
            { id: 13, value: 2, x: 0, y: 3 },
            { id: 14, value: 4, x: 1, y: 3 },
            { id: 15, value: 8, x: 2, y: 3 },
            { id: null, value: 0, x: 3, y: 3 }  // Only one empty space
        ]
    ];
    updateGameField();


// ========================================
// GAME STARTUP
// ========================================

// setupNewGame();

// ========================================
// EVENT LISTENERS
// ========================================

// Set up keyboard controls for the game

document.addEventListener('keydown', (event) => onKeyDown(event));

const restartGameButton = document.querySelector('.restart-game-button');
restartGameButton.addEventListener('click', () => setupNewGame());

const playAgainButton = document.querySelector('.play-again-button');
playAgainButton.addEventListener('click', () => setupNewGame());

