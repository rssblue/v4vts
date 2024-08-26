import { defineConfig } from "vite";
import path from "path";

export default defineConfig({
  test: {
    globals: true,
    environment: "node",
  },
  resolve: {
    alias: {
      v4vts: path.resolve(__dirname, "./src"),
    },
  },
});
