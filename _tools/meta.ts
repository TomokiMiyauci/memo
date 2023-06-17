import { BuildOptions } from "https://deno.land/x/dnt@0.37.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  typeCheck: "both",
  entryPoints: ["./mod.ts", "./polyfill.ts"],
  outDir: "./npm",
  package: {
    name: "@miyauci/memo",
    version,
    description:
      "Memoization tools, TC39 proposal-function-memo implementation",
    keywords: [
      "memo",
      "memoize",
      "memoization",
      "cache",
      "cache-map",
      "tc39",
      "proposal-function-memo",
    ],
    license: "MIT",
    homepage: "https://github.com/TomokiMiyauci/memo",
    repository: {
      type: "git",
      url: "git+https://github.com/TomokiMiyauci/memo.git",
    },
    bugs: {
      url: "https://github.com/TomokiMiyauci/memo/issues",
    },
    sideEffects: false,
    type: "module",
    publishConfig: { access: "public" },
  },
  packageManager: "pnpm",
  mappings: {
    "https://deno.land/x/composite_key@1.0.0/mod.ts": {
      name: "composite-key",
      version: "1.0.0",
    },
  },
});
