import { defineConfig } from "vitest/config";
import tsconfigPaths from "vite-tsconfig-paths";

export default defineConfig({
  plugins: [tsconfigPaths()],
  resolve: {
    alias: {
      // graph.ts é server-only; gen scripts (Node) precisam de noop pra usar getPosicao etc.
      "server-only": new URL("../vitest.server-only-shim.ts", import.meta.url).pathname,
    },
  },
  test: { include: [".scratch/gen-*.test.ts"], environment: "node" },
});
