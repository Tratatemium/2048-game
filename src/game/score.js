import { state } from "./state.js";

const score = {
  add: (points) => (state.score += points),
};

export { score };
