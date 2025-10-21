/* ================================================================================================= */
/* #region UTILITY FUNCTIONS                                                                        */
/* ================================================================================================= */

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

/* #endregion UTILITY FUNCTIONS */


/* ================================================================================================= */
/* #region DOM MANIPULATION                                                                         */
/* ================================================================================================= */





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

/* #endregion GAME LOGIC - CORE MECHANICS */


/* ================================================================================================= */
/* #region GAME LOGIC - BOARD MANAGEMENT                                                            */
/* ================================================================================================= */

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

/* #endregion DOM MANIPULATION */


/* ================================================================================================= */
/* #region GAME LOGIC - CORE MECHANICS                                                              */
/* ================================================================================================= */





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

/* #endregion GAME LOGIC - BOARD MANAGEMENT */


/* ================================================================================================= */
/* #region GAME INITIALIZATION & SETUP                                                              */
/* ================================================================================================= */





/**
     * Sets up a new game by resetting all game state and initializing the board
     * Resets score, moves, removes win/defeat classes, creates empty 4x4 grid,
     * adds two starting tiles, and renders the initial game state
     */
    const setupNewGame = () => {
        // Reset game statistics
        score = 0;
        const scoreSpan = document.querySelector('.current-score-span');
        scoreSpan.textContent = score;
        moves = 0;

        // Reset visual game states (remove win/defeat styling)
        const main = document.querySelector('main');
        main.classList.remove('defeat');
        main.classList.remove('win');

        const header = document.querySelector('header');
        header.classList.remove('defeat');
        header.classList.remove('win')

        // Initialize the game board as a 4x4 grid of empty tiles
        // Each tile object contains:
        // - id: Unique identifier (null for empty tiles)
        // - value: Tile number (0 for empty tiles)  
        // - x: Column position (0-3)
        // - y: Row position (0-3)
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

/* #endregion GAME INITIALIZATION & SETUP */


/* ================================================================================================= */
/* #region INPUT HANDLING & GAME CONTROLS                                                           */
/* ================================================================================================= */


/**
     * Handles keyboard input for game controls
     * Processes arrow key presses to move tiles in the specified direction
     * Manages the slide and merge logic for each direction
     * @param {KeyboardEvent} event - The keyboard event containing the pressed key
     */
    const onKeyDown = (event) => {
        // ==========================================
        // ANIMATION BLOCKING - Prevent input during tile animations
        // ==========================================
        
        // Check if there are any ongoing CSS transitions on tiles
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

        // If animations are running, ignore the key press to prevent conflicts
        if (hasTransitions || hasFadeInAnimations) {
            return;
        }

        // ==========================================
        // DIALOG HANDLING - Handle Escape key for open dialogs
        // ==========================================
        
        if (restartDialog.open || aboutGameDialog.open) {
            if (event.key === 'Escape') {
                restartDialog.close();
                aboutGameDialog.close();
                return;
            } else {
                return; // Ignore other keys when dialogs are open
            }
        }

        // ==========================================
        // WIN STATE BLOCKING - Prevent input during victory state
        // ==========================================

        const main = document.querySelector('main');
        if (Array.from(main.classList).includes('win')) return;

        // ==========================================
        // GAME MOVE PROCESSING - Handle directional input
        // ==========================================
        
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
                // Ignore any other key presses (no valid game move)
                return;
        }

        // ==========================================
        // POST-MOVE PROCESSING - Handle consequences of valid moves
        // ==========================================
        
        // After any valid move (slide or merge), add a new tile to the board
        if (somethingSlid || somethingMerged) {
            addNumberAtRundom();           // Add new tile (2 or 4) to random empty space
            updateGameField();             // Update DOM to show new tile
            moves++;                       // Increment move counter

            // Update score display in the UI
            const scoreSpan = document.querySelector('.current-score-span');
            scoreSpan.textContent = score;
        }

        // ==========================================
        // GAME STATE CHECKING - Check for win/lose conditions
        // ==========================================
        
        // Delay checking game state to allow animations to complete
        setTimeout(() => {
            // Check for win condition (2048 tile exists)
            const playerWon = gameArray.some((row) => row.some((el) => el.value === 2048));
            
            if (playerWon) {
                // VICTORY STATE
                const main = document.querySelector('main');
                main.classList.add('win');
                const header = document.querySelector('header');
                header.classList.add('win');

                // Update endgame message with victory info
                const h2Message = document.querySelector('.endgame-message h2');
                h2Message.textContent = 'You Won!';
                const scoreSpan = document.querySelector('.endgame-score');
                scoreSpan.textContent = score;
                const movesSpan = document.querySelector('.endgame-moves');
                movesSpan.textContent = moves;

            } else if (playerLost()) {
                // DEFEAT STATE
                const main = document.querySelector('main');
                main.classList.add('defeat');
                const header = document.querySelector('header');
                header.classList.add('defeat');

                // Update endgame message with defeat info
                const h2Message = document.querySelector('.endgame-message h2');
                h2Message.textContent = 'Game over';
                const scoreSpan = document.querySelector('.endgame-score');
                scoreSpan.textContent = score;
                const movesSpan = document.querySelector('.endgame-moves');
                movesSpan.textContent = moves;
            }
        }, 400); // Wait for animations to complete before checking game state
    };

/* #endregion INPUT HANDLING & GAME CONTROLS */




/* ================================================================================================= */
/* #region GLOBAL VARIABLES & GAME STATE                                                            */
/* ================================================================================================= */

/**
 * GAME STATE VARIABLES
 * These variables maintain the current state of the game
 */
let gameArray;    // 4x4 array representing the game board
let score = 0;    // Current player score (sum of merged tile values)
let moves = 0;    // Number of moves made in current game

/* #endregion GLOBAL VARIABLES & GAME STATE */


/* ================================================================================================= */
/* #region TESTING & DEBUG CONFIGURATIONS                                                           */
/* ================================================================================================= */


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
    //         { id: 7, value: 2, x: 2, y: 1 },
    //         { id: 8, value: 4, x: 3, y: 1 }
    //     ],
    //     [
    //         { id: 9, value: 8, x: 0, y: 2 },
    //         { id: 10, value: 16, x: 1, y: 2 },
    //         { id: 11, value: 32, x: 2, y: 2 },
    //         { id: 12, value: 64, x: 3, y: 2 }
    //     ],
    //     [
    //         { id: 13, value: 2, x: 0, y: 3 },
    //         { id: 14, value: 4, x: 1, y: 3 },
    //         { id: 15, value: 8, x: 2, y: 3 },
    //         { id: null, value: 0, x: 3, y: 3 }  // Only one empty space
    //     ]
    // ];
    // updateGameField();

/**
 * WIN TESTING ARRAY - Uncomment to test win condition
 * Board is one move away from win (two 1024 tiles that can merge to 2048)
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
            { id: 7, value: 1024, x: 2, y: 1 },
            { id: 8, value: 1024, x: 3, y: 1 }
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

/* #endregion TESTING & DEBUG CONFIGURATIONS */


/* ================================================================================================= */
/* #region GAME INITIALIZATION & STARTUP                                                            */
/* ================================================================================================= */

/**
 * NORMAL GAME STARTUP - Uncomment to start with empty board
 * Comment out the testing arrays above and uncomment this line for normal gameplay
 */
// setupNewGame();

/* #endregion GAME INITIALIZATION & STARTUP */


/* ================================================================================================= */
/* #region EVENT LISTENERS & DOM INTERACTIONS                                                       */
/* ================================================================================================= */

// ==========================================
// KEYBOARD CONTROLS
// ==========================================

/**
 * Main game input handler - listens for arrow keys and other game controls
 */
document.addEventListener('keydown', event => onKeyDown(event));

// ==========================================
// BUTTON EVENT HANDLERS
// ==========================================


/**
 * PLAY AGAIN BUTTON - Starts a new game after win/defeat
 * Appears when game ends (replaces restart button)
 */
const playAgainButton = document.querySelector('.play-again-button');
playAgainButton.addEventListener('click', () => setupNewGame());

/**
 * RESTART GAME FUNCTIONALITY - Shows confirmation dialog before restarting
 * Uses modal dialog to prevent accidental game resets
 */
const restartDialog = document.querySelector('.restart-dialog');
const restartGameButtonDesktop = document.querySelector('.restart-game-button-desktop');
const restartGameButtonMobile = document.querySelector('.restart-game-button-mobile');

// Show restart confirmation dialog
restartGameButtonDesktop.addEventListener('click', () => {
    if (!restartDialog.open) restartDialog.showModal();
});
restartGameButtonMobile.addEventListener('click', () => {
    if (!restartDialog.open) restartDialog.showModal();
});

// Confirm restart - start new game and close dialog
const yesRestartButton = document.querySelector('.yes-restart-button');
yesRestartButton.addEventListener('click', () => {
    setupNewGame();
    restartDialog.close();
});

// Cancel restart - just close the dialog
const cancelButton = document.querySelector('.cancel-button');
cancelButton.addEventListener('click', () => restartDialog.close());

/**
 * ABOUT/MENU DIALOG FUNCTIONALITY - Shows game information
 * Triggered by menu button, closed by close button or Escape key
 */
const aboutGameDialog = document.querySelector('.about-game-dialog');
const menuButton = document.querySelector('.menu-button');

// Show about game dialog
menuButton.addEventListener('click', () => {
    if (!aboutGameDialog.open) aboutGameDialog.showModal();
});

// Close about game dialog
const closeAboutGameDialogButton = document.querySelector('.close-about-game-dialog-button');
closeAboutGameDialogButton.addEventListener('click', () => aboutGameDialog.close());

/* #endregion EVENT LISTENERS & DOM INTERACTIONS */