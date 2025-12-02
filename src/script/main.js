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
    export const playerLost = () => {
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
    animationDuration: parseFloat(getComputedStyle(document.documentElement)
        .getPropertyValue('--animation-duration')) * 1000,
};

// let state.gameArray;    // 4x4 array representing the game board
// let score = 0;    // Current player score (sum of merged tile values)
// let moves = 0;    // Number of moves made in current game

// Get animation duration from CSS custom property to keep JS and CSS in sync
// const animationDuration = parseFloat(getComputedStyle(document.documentElement)
//     .getPropertyValue('--animation-duration')) * 1000; // Convert seconds to milliseconds

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
export const restartDialog = document.querySelector('.restart-dialog');
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
export const aboutGameDialog = document.querySelector('.about-game-dialog');
const menuButton = document.querySelector('.menu-button');

// Show about game dialog
menuButton.addEventListener('click', () => {
    if (!aboutGameDialog.open) aboutGameDialog.showModal();
});

// Close about game dialog
const closeAboutGameDialogButton = document.querySelector('.close-about-game-dialog-button');
closeAboutGameDialogButton.addEventListener('click', () => aboutGameDialog.close());

/* #endregion EVENT LISTENERS & DOM INTERACTIONS */




