/* ================================================================================================= */
/* #region INPUT HANDLING & GAME CONTROLS                                                           */
/* ================================================================================================= */

import { restartDialog, aboutGameDialog } from "./main";
import { onGameInput } from "./on-game-input";

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


// ==========================================
// KEYBOARD CONTROLS
// ==========================================

/**
 * Main game input handler - listens for arrow keys and other game controls
 */
document.addEventListener('keydown', event => onKeyDown(event));

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