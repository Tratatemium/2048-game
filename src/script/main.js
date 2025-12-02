import { updateGameField, slide, merge, addNumberAtRundom } from "./dom-manipiulation.js"
import { setupNewGame } from "./new-game.js"


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
        state.gameArray
            .map(row => row.map(el => el.value).join(' '))
            .join('\n')
    );
};

/* #endregion UTILITY FUNCTIONS */


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
        const emptySpacesExist = state.gameArray.some((row) => row.some((el) => el.value === 0));
        
        // If empty spaces exist, game is not over
        if (emptySpacesExist) return false;
        
        // Step 2: Check if any adjacent tiles can be merged (horizontal)
        for (let i = 0; i < state.gameArray.length; i++) {
            for (let j = 0; j < state.gameArray.length - 1; j++) {
                if (state.gameArray[i][j].value === state.gameArray[i][j + 1].value) return false;
            }
        }
        
        // Step 3: Check if any adjacent tiles can be merged (vertical)
        for (let i = 0; i < state.gameArray.length - 1; i++) {
            for (let j = 0; j < state.gameArray.length; j++) {
                if (state.gameArray[i][j].value === state.gameArray[i + 1][j].value) return false;
            }
        }
        
        // No empty spaces and no possible merges = game over
        return true;
    };

/* #endregion GAME LOGIC - BOARD MANAGEMENT */





/* ================================================================================================= */
/* #region INPUT HANDLING & GAME CONTROLS                                                           */
/* ================================================================================================= */

    /**
     * Handles keyboard input for game controls and dialog management
     * Processes arrow keys for game movement and Escape key for dialog closing
     * Ignores input when dialogs are open (except Escape)
     * 
     * @param {KeyboardEvent} event - The keyboard event object containing key information
     */
    const onKeyDown = (event) => {

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

        switch (event.key) {
            case 'ArrowLeft':
                onGameInput('Left');
                break;
            case 'ArrowRight':
                onGameInput('Right');
                break;
            case 'ArrowDown':
                onGameInput('Down');
                break;
            case 'ArrowUp':
                onGameInput('Up');
                break;        
            default:
                break;
        }
    };

    /**
     * Initiates touch/swipe gesture tracking for mobile input
     * Records the starting position and enables swipe detection
     * 
     * @param {number} x - The starting X coordinate of the touch/swipe
     * @param {number} y - The starting Y coordinate of the touch/swipe
     */
    const onSwipeStart = (x, y) => {
        startX, lastX = x;
        startY, lastY = y;
        isSwiping = true;
    };

    /**
     * Processes ongoing touch/swipe movement and determines direction
     * Calculates movement distance and triggers game input when threshold is reached
     * Prevents multiple triggers per swipe and determines primary movement axis
     * 
     * @param {number} x - Current X coordinate of the touch/swipe
     * @param {number} y - Current Y coordinate of the touch/swipe
     */
    const onSwipeMove = (x, y) => {
        if (!isSwiping) return;         // Not currently swiping
        if (swipeRegisterd) return;     // Already registered a swipe for this gesture

        // Calculate movement distance from last position
        const dx = x - lastX;
        const dy = y - lastY;

        // Check if movement exceeds threshold distance
        if (Math.abs(dx) >= swipeTreshold || Math.abs(dy) >= swipeTreshold) {
            // Determine primary movement direction (horizontal vs vertical)
            if (Math.abs(dx) > Math.abs(dy)) {
                // Horizontal movement is dominant
                if (dx > 0) onGameInput('Right');
                else onGameInput('Left');
            } else {
                // Vertical movement is dominant
                if (dy > 0) onGameInput('Down');
                else onGameInput('Up');
            }
            // Reset trigger point and mark swipe as processed
            lastX = x;
            lastY = y;
            swipeRegisterd = true;
        }
    };

    /**
     * Ends touch/swipe gesture tracking and resets swipe state
     * Clears all swipe flags to prepare for the next gesture
     */
    const onSwipeEnd = () => {
        isSwiping = false;      // No longer tracking swipe movement
        swipeRegisterd = false; // Ready to register new swipe
    };

    /**
     * Processes a game input direction and executes the corresponding move
     * Handles animation blocking, game state validation, tile sliding/merging,
     * win/loss detection, and post-move cleanup
     * 
     * @param {string} direction - The movement direction ('Left', 'Right', 'Up', 'Down')
     */
    const onGameInput = (direction) =>{

        // ==========================================
        // ANIMATION BLOCKING 
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

        // Tiles are given transition animation only when they need to slide
        Array.from(tiles).forEach(tile => {
            tile.classList.add('transition')
        });
        
        // Remove transition class after all animations complete (including potential merge delay)
        setTimeout(() => {
            Array.from(document.querySelectorAll('.tile')).forEach(tile => {
                tile.classList.remove('transition')
            });
        }, animationDuration); // Wait longer to account for delayed merge animations
        
        // Ignore input when dialogs are open
        if (restartDialog.open || aboutGameDialog.open)  return; 

        // ==========================================
        // WIN STATE BLOCKING - Prevent input during victory state
        // ==========================================

        const main = document.querySelector('main');
        if (Array.from(main.classList).includes('win')) return;

        // ==========================================
        // NO DISPLAY BLOCKING - Prevent input when the game is not displayed
        // ==========================================

        if (window.getComputedStyle(main).display === 'none') return;


        // ==========================================
        // GAME MOVE PROCESSING - Handle directional input
        // ==========================================
        
        // Track if any changes occurred to determine if we need to add a new tile
        let somethingMerged = false;  // Flag for merge operations
        let somethingSlid = false;    // Flag for slide operations

        switch (direction) {

            //  ⇐  LEFT  ⇐
            case 'Left':
                // PHASE 1: SLIDE - Move all tiles to the left (remove gaps)
                for (let i = 0; i < state.gameArray.length; i++) {
                    let row = structuredClone(state.gameArray[i]);           // Copy current row
                    const lineBefore = structuredClone(row);           // Save original for comparison
                    row = slide(row);                                  // Apply slide operation
                    
                    // Check if anything actually moved during the slide
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;                          // Mark that tiles moved
                        // Update the game array with new positions
                        for (let j = 0; j < state.gameArray.length; j ++) {
                            state.gameArray[i][j].value = row[j].value;
                            state.gameArray[i][j].id = row[j].id;
                        }
                    }                    
                }
                // If tiles slid, update DOM to trigger slide animation
                if (somethingSlid) updateGameField();

                // PHASE 2: MERGE - Combine adjacent tiles with same values
                for (let i = 0; i < state.gameArray.length; i++) {
                    let row = structuredClone(state.gameArray[i]);           // Copy current row state
                    const lineBefore = structuredClone(row);           // Save for comparison
                    row = merge(row);                                  // Apply merge operation
                    
                    // Check if any merges occurred
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingMerged = true;                        // Mark that tiles merged
                        // Update the game array with merged values
                        for (let j = 0; j < state.gameArray.length; j ++) {
                            state.gameArray[i][j].value = row[j].value;
                            state.gameArray[i][j].id = row[j].id;
                        }
                    }
                }
                // Don't update DOM immediately for merge - will be handled by delayed update below
                
                break;

            //  ⇒  RIGHT  ⇒    
            case 'Right':
                // PHASE 1: SLIDE - Move all tiles to the right
                // Trick: reverse row, slide left, then reverse back to simulate right slide
                for (let i = 0; i < state.gameArray.length; i++) {
                    let row = structuredClone(state.gameArray[i]);           // Copy current row
                    const lineBefore = structuredClone(row);           // Save original
                    row = slide(row.reverse()).reverse();              // Reverse → slide → reverse back
                    
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;
                        for (let j = 0; j < state.gameArray.length; j ++) {
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
                    row = merge(row.reverse()).reverse();              // Same reverse trick for merging
                    
                    if (row.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingMerged = true;
                        for (let j = 0; j < state.gameArray.length; j ++) {
                            state.gameArray[i][j].value = row[j].value;
                            state.gameArray[i][j].id = row[j].id;
                        }
                    }
                }
                // Don't update DOM immediately for merge - will be handled by delayed update below
                break;

            //  ⇑  UP  ⇑    
            case 'Up':
                // PHASE 1: SLIDE - Move all tiles upward
                // Work with columns instead of rows (extract column, process, put back)
                for (let j = 0; j < state.gameArray.length; j++) {
                    // Extract column j from all rows
                    let column = structuredClone(state.gameArray.map((row) => row[j]));
                    const lineBefore = structuredClone(column);        // Save original column
                    column = slide(column);                            // Slide tiles up (toward index 0)
                    
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;
                        // Put the modified column back into the game array
                        for (let i = 0; i < state.gameArray.length; i ++) {
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
                    column = merge(column);                            // Merge adjacent tiles in column
                    
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingMerged = true;
                        // Put merged column back into game array
                        for (let i = 0; i < state.gameArray.length; i ++) {
                            state.gameArray[i][j].value = column[i].value;
                            state.gameArray[i][j].id = column[i].id;
                        }
                    }
                }
                // Don't update DOM immediately for merge - will be handled by delayed update below
                break;

            //  ⇓  DOWN  ⇓    
            case 'Down':
                // PHASE 1: SLIDE - Move all tiles downward  
                // Trick: reverse column, slide up, reverse back to simulate down slide
                for (let j = 0; j < state.gameArray.length; j++) {
                    let column = structuredClone(state.gameArray.map((row) => row[j]));
                    const lineBefore = structuredClone(column);        // Save original column
                    column = slide(column.reverse()).reverse();        // Reverse → slide → reverse back
                    
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingSlid = true;
                        // Put modified column back into game array
                        for (let i = 0; i < state.gameArray.length; i ++) {
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
                    column = merge(column.reverse()).reverse();        // Same reverse trick for merging
                    
                    if (column.some((element, index) => element.value !== lineBefore[index].value)) {
                        somethingMerged = true;
                        for (let i = 0; i < state.gameArray.length; i ++) {
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
        
        
        // ==========================================
        // POST-MOVE PROCESSING & DELAYED DOM UPDATE - Handle consequences of valid moves including animations
        // ==========================================
        

        // If there were just mergers or just slides 
        if (somethingSlid !== somethingMerged) {
            addNumberAtRundom();           // Add new tile (2 or 4) to random empty space
            updateGameField();             // Update DOM to show new tile
            state.moves++;                       // Increment move counter

            // Update score display in the UI
            const scoreSpan = document.querySelector('.current-score-span');
            scoreSpan.textContent = state.score;

        // If there were both - wait for the slide animation, than show mwergers and new tiles
        } else if (somethingSlid && somethingMerged) {
            setTimeout(() => {
                addNumberAtRundom();
                updateGameField();
                state.moves++;

                const scoreSpan = document.querySelector('.current-score-span');
                scoreSpan.textContent = state.score;
            }, animationDuration);
        }
        

        // ==========================================
        // GAME STATE CHECKING - Check for win/lose conditions
        // ==========================================
        
        // Delay checking game state to allow animations to complete
        setTimeout(() => {
            // Check for win condition (2048 tile exists)
            const playerWon = state.gameArray.some((row) => row.some((el) => el.value === 2048));
            
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
                scoreSpan.textContent = state.score;
                const movesSpan = document.querySelector('.endgame-moves');
                movesSpan.textContent = state.moves;

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
                scoreSpan.textContent = state.score;
                const movesSpan = document.querySelector('.endgame-moves');
                movesSpan.textContent = state.moves;
            }
        }, animationDuration * 2); // Wait for animations to complete before checking game state
    };

/* #endregion INPUT HANDLING & GAME CONTROLS */




/* ================================================================================================= */
/* #region GLOBAL VARIABLES & GAME STATE                                                            */
/* ================================================================================================= */

/**
 * GAME STATE VARIABLES
 * These variables maintain the current state of the game
 */

export let state = {
    gameArray: [],
    score: 0,
    moves: 0,
};

// let state.gameArray;    // 4x4 array representing the game board
// let score = 0;    // Current player score (sum of merged tile values)
// let moves = 0;    // Number of moves made in current game

// Get animation duration from CSS custom property to keep JS and CSS in sync
const animationDuration = parseFloat(getComputedStyle(document.documentElement)
    .getPropertyValue('--animation-duration')) * 1000; // Convert seconds to milliseconds

/* #endregion GLOBAL VARIABLES & GAME STATE */


/* ================================================================================================= */
/* #region TESTING & DEBUG CONFIGURATIONS                                                           */
/* ================================================================================================= */


/**
 * DEBUG/TESTING ARRAY - Uncomment to test with all tile values
 * This pre-filled array is useful for testing animations and styling
 */
// state.gameArray = [
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
 * WIN / DEFEAT TESTING ARRAY - Uncomment to test win condition
 * Board is one move away from win (two 1024 tiles that can merge to 2048) or defeat (only one tile is empty)
 */
// state.gameArray = [
//         [
//             { id: 1, value: 2, x: 0, y: 0 },
//             { id: 2, value: 4, x: 1, y: 0 },
//             { id: 3, value: 8, x: 2, y: 0 },
//             { id: 4, value: 16, x: 3, y: 0 }
//         ],
//         [
//             { id: 5, value: 32, x: 0, y: 1 },
//             { id: 6, value: 64, x: 1, y: 1 },
//             { id: 7, value: 1024, x: 2, y: 1 },
//             { id: 8, value: 1024, x: 3, y: 1 }
//         ],
//         [
//             { id: 9, value: 8, x: 0, y: 2 },
//             { id: 10, value: 16, x: 1, y: 2 },
//             { id: 11, value: 32, x: 2, y: 2 },
//             { id: 12, value: 64, x: 3, y: 2 }
//         ],
//         [
//             { id: 13, value: 2, x: 0, y: 3 },
//             { id: 14, value: 4, x: 1, y: 3 },
//             { id: 15, value: 8, x: 2, y: 3 },
//             { id: null, value: 0, x: 3, y: 3 }  // Only one empty space
//         ]
//     ];
// updateGameField();

/* #endregion TESTING & DEBUG CONFIGURATIONS */


/* ================================================================================================= */
/* #region GAME INITIALIZATION & STARTUP                                                            */
/* ================================================================================================= */

/**
 * NORMAL GAME STARTUP - Uncomment to start with empty board
 * Comment out the testing arrays above and uncomment this line for normal gameplay
 */
setupNewGame();

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




/* ================================================================================================= */
/* #region MOBILE TOUCH/SWIPE SUPPORT                                                               */
/* ================================================================================================= */

/**
 * SWIPE DETECTION CONFIGURATION & STATE
 * Variables for tracking touch gestures on mobile devices
 */
const swipeTreshold = 25;        // Minimum distance in pixels to register as a swipe
let startX, startY = 0;          // Initial touch position coordinates
let lastX, lastY = 0;            // Current/last known touch position
let isSwiping = false;           // Whether a touch gesture is currently active
let swipeRegisterd = false;      // Whether current gesture has already triggered a game move

/**
 * TOUCH EVENT LISTENERS - Enable mobile swipe controls
 * Maps touch events to swipe detection functions
 */

// Start swipe detection when user touches screen
document.addEventListener('touchstart', event => {
    const touches = event.touches[0];
    onSwipeStart(touches.clientX, touches.clientY);
});

// Track finger movement during swipe
document.addEventListener('touchmove', event => {
    const touches = event.touches[0];
    onSwipeMove(touches.clientX, touches.clientY);
});

// End swipe detection when user lifts finger
document.addEventListener('touchend', onSwipeEnd);

/* #endregion MOBILE TOUCH/SWIPE SUPPORT */