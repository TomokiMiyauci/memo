import { BuildOptions } from "https://deno.land/x/dnt@0.34.0/mod.ts";

export const makeOptions = (version: string): BuildOptions => ({
  test: false,
  shims: {},
  typeCheck: true,
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
    "https://deno.land/x/upsert@1.1.0/mod.ts": {
      name: "@miyauci/upsert",
      version: "1.1.0",
    },
    "https://deno.land/x/isx@1.4.0/is_string.ts": {
      name: "@miyauci/isx",
      version: "1.4.0",
      subPath: "is_string.js",
    },
    "https://deno.land/x/isx@1.4.0/is_object.ts": {
      name: "@miyauci/isx",
      version: "1.4.0",
      subPath: "is_object.js",
    },
    "https://deno.land/x/isx@1.4.0/is_function.ts": {
      name: "@miyauci/isx",
      version: "1.4.0",
      subPath: "is_function.js",
    },
  },
});
