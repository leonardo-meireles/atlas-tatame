import { defineConfig } from "vitest/config";

export default defineConfig({
  test: {
    environment: "node",
    globals: true,
    include: [".scratch/figuras-grapplemap-pipeline/extract_tecnicas.test.ts"],
  },
});
