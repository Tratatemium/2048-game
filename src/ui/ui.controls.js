import { $ } from "../utils/helpers.js";
import { onGameInput } from "../game/game.controller.js";

const setupControls = () => {
  /* ================================================================================================= */
  /* KEYBOARD CONTROLS                                                                                 */
  /* ================================================================================================= */

  const restartDialog = $(".restart-dialog");
  const aboutGameDialog = $(".about-game-dialog");

  const handleDialogs = (event) => {
    if (restartDialog.open || aboutGameDialog.open) {
      if (event.key === "Escape") {
        restartDialog.close();
        aboutGameDialog.close();
      }
      return true;
    }
    return false;
  };

  const onKeyDown = (event) => {
    if (event.repeat) return;

    if (handleDialogs(event)) return;

    const keyMap = {
      ArrowLeft: "Left",
      ArrowRight: "Right",
      ArrowDown: "Down",
      ArrowUp: "Up",
    };

    if (keyMap[event.key]) {
      event.preventDefault();
      onGameInput(keyMap[event.key]);
    }
  };

  window.addEventListener("keydown", onKeyDown);

  /* ================================================================================================= */
  /* MOBILE TOUCH/SWIPE CONTROLS                                                                       */
  /* ================================================================================================= */

  const swipeTreshold = 25;
  let startX,
    startY = 0;
  let lastX,
    lastY = 0;
  let isSwiping = false;
  let swipeRegisterd = false;

  const onSwipeStart = (x, y) => {
    startX = lastX = x;
    startY = lastY = y;
    isSwiping = true;
    swipeRegisterd = false; // reset for a new swipe
  };

  const onSwipeMove = (x, y) => {
    if (!isSwiping || swipeRegisterd) return;

    const dx = x - startX;
    const dy = y - startY;

    if (Math.abs(dx) >= swipeTreshold || Math.abs(dy) >= swipeTreshold) {
      // Determine primary movement direction (horizontal vs vertical)
      if (Math.abs(dx) > Math.abs(dy)) {
        onGameInput(dx > 0 ? "Right" : "Left");
      } else {
        onGameInput(dy > 0 ? "Down" : "Up");
      }

      lastX = x;
      lastY = y;
      swipeRegisterd = true;
    }
  };

  const onSwipeEnd = () => {
    isSwiping = false;
    swipeRegisterd = false;
  };

  window.addEventListener("touchstart", (event) => {
    const touch = event.touches[0];
    if (!touch) return;
    onSwipeStart(touch.clientX, touch.clientY);
  });

  window.addEventListener(
    "touchmove",
    (event) => {
      event.preventDefault();
      const touches = event.touches[0];
      onSwipeMove(touches.clientX, touches.clientY);
    },
    { passive: false },
  );

  window.addEventListener("touchend", onSwipeEnd);
};

export { setupControls };
