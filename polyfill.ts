// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

// deno-lint-ignore-file ban-types no-explicit-any
import { type MapLike, memo } from "./memo.ts";

Function.prototype.memo = function <A extends any[], R>(
  this: (...args: A) => R,
  cache?: MapLike<object, R>,
  keys?: (args: A) => unknown[],
): (...args: A) => R {
  return memo(this, cache, keys);
};

declare global {
  interface Function {
    memo<A extends any[], R>(
      this: (...args: A) => R,
      cache?: MapLike<object, R>,
      keys?: (args: A) => unknown[],
    ): (...args: A) => R;
  }
}
