/* ================================================================================================= */
/* #region DOM MANIPULATION                                                                          */
/* ================================================================================================= */


/**
 * Updates the DOM to reflect the current state of the game array
 * Creates new tile elements, updates positions, and removes deleted tiles
 * Handles both tile creation and smooth positioning animations
 */
export const updateGameField = () => {

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
export const slide = (line) => {
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
export const merge = (line) => {
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

/* #endregion */