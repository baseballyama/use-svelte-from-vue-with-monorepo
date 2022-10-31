import { defineConfig } from "vite";
import { svelte } from "@sveltejs/vite-plugin-svelte";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [svelte()],
  build: {
    emptyOutDir: false,
    outDir: "dist",
    sourcemap: true,
    minify: true,
    lib: {
      entry: {
        Counter: "./src/lib/Counter.svelte",
      },
      formats: ["es", "cjs"],
    },
  },
});
