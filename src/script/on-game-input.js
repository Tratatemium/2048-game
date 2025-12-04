import { state } from "./main.js";
import { playerLost } from "./loose-condition.js"
import { updateGameField, slide, merge, addNumberAtRundom } from "./dom-manipiulation.js";
import { restartDialog, aboutGameDialog } from "./main";
import { saveGame } from "./local-storage.js";


/**
 * Processes a game input direction and executes the corresponding move
 * Handles animation blocking, game state validation, tile sliding/merging,
 * win/loss detection, and post-move cleanup
 * 
 * @param {string} direction - The movement direction ('Left', 'Right', 'Up', 'Down')
 */
export const onGameInput = (direction) =>{

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
    }, state.animationDuration); // Wait longer to account for delayed merge animations
    
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
        }, state.animationDuration);
    }
    saveGame();

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
    }, state.animationDuration * 2); // Wait for animations to complete before checking game state
};