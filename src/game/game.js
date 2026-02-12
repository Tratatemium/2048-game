import { state } from "../game/state.js";
import { makeMove } from "./moves.js";
import { updateTiles, updateScore } from "../ui/ui.render.js";
import { score } from "./score.js";
import { $ } from "../utils/helpers.js";

const checkForAnimations = () => {

};

const onGameInput = (diredtion) => {
  const { changed, totalScore } = makeMove[diredtion](state.gameArray);
};

export const onGameInput2 = (direction) => {
  // ==========================================
  // ANIMATION BLOCKING
  // ==========================================

  // Check if there are any ongoing CSS transitions on tiles
  const tiles = document.querySelectorAll(".tile");
  const hasTransitions = Array.from(tiles).some((tile) => {
    const animations = tile.getAnimations();
    // CSS transitions appear as CSSTransition objects
    return animations.some(
      (anim) =>
        anim.constructor.name === "CSSTransition" &&
        anim.playState === "running",
    );
  });

  // Also check for fadeIn animations on tile-inner elements
  const tileInners = document.querySelectorAll(".tile-inner");
  const hasFadeInAnimations = Array.from(tileInners).some((tileInner) => {
    const animations = tileInner.getAnimations();
    return (
      animations.length > 0 &&
      animations.some((anim) => anim.playState === "running")
    );
  });

  // If animations are running, ignore the key press to prevent conflicts
  if (hasTransitions || hasFadeInAnimations) {
    return;
  }

  // Tiles are given transition animation only when they need to slide
  Array.from(tiles).forEach((tile) => {
    tile.classList.add("transition");
  });

  // Remove transition class after all animations complete (including potential merge delay)
  setTimeout(() => {
    Array.from(document.querySelectorAll(".tile")).forEach((tile) => {
      tile.classList.remove("transition");
    });
  }, state.animationDuration); // Wait longer to account for delayed merge animations

  // Ignore input when dialogs are open
  if (restartDialog.open || aboutGameDialog.open) return;

  // ==========================================
  // WIN STATE BLOCKING - Prevent input during victory state
  // ==========================================

  const main = document.querySelector("main");
  if (Array.from(main.classList).includes("win")) return;

  // ==========================================
  // NO DISPLAY BLOCKING - Prevent input when the game is not displayed
  // ==========================================

  if (window.getComputedStyle(main).display === "none") return;

  // ==========================================
  // GAME MOVE PROCESSING - Handle directional input
  // ==========================================

  // Track if any changes occurred to determine if we need to add a new tile
  let somethingMerged = false; // Flag for merge operations
  let somethingSlid = false; // Flag for slide operations

  // ==========================================
  // POST-MOVE PROCESSING & DELAYED DOM UPDATE - Handle consequences of valid moves including animations
  // ==========================================

  // If there were just mergers or just slides
  if (somethingSlid !== somethingMerged) {
    addNumberAtRundom(); // Add new tile (2 or 4) to random empty space
    updateGameField(); // Update DOM to show new tile
    state.moves++; // Increment move counter

    // If there were both - wait for the slide animation, than show mwergers and new tiles
  } else if (somethingSlid && somethingMerged) {
    setTimeout(() => {
      addNumberAtRundom();
      updateGameField();
      state.moves++;
    }, state.animationDuration);
  }
  saveGame();

  checkForEndGame();
};
