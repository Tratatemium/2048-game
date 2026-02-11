import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  base: "/2048-game/",
  root: ".",
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
      },
    },
  },
});