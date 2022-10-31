import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";
import { entry } from "./scripts/constants";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    emptyOutDir: false,
    outDir: "dist",
    sourcemap: true,
    minify: true,
    lib: {
      entry: entry,
      formats: ["es", "cjs"],
    },
  },
});
