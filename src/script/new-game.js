/* ================================================================================================= */
/* #region GAME INITIALIZATION & SETUP                                                              */
/* ================================================================================================= */

import { state } from "./main.js"
import { updateGameField, addNumberAtRundom } from "./dom-manipiulation.js"

/**
 * Sets up a new game by resetting all game state and initializing the board
 * Resets score, moves, removes win/defeat classes, creates empty 4x4 grid,
 * adds two starting tiles, and renders the initial game state
 */
export const setupNewGame = () => {
    // Reset game statistics
    state.score = 0;
    const scoreSpan = document.querySelector('.current-score-span');
    scoreSpan.textContent = state.score;
    state.moves = 0;

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
    state.gameArray = Array.from({ length: 4 }, (_, i) =>
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