// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

// deno-lint-ignore-file ban-types no-explicit-any

/**
 * ## Polyfill
 *
 * Polyfill affects the global object. You must be very careful when using it.
 *
 * ```ts
 * import "https://deno.land/x/memoization@$VERSION/polyfill.ts";
 *
 * const fib = ((num: number): number => {
 *   if (num < 2) return num;
 *
 *   return fib(num - 1) + fib(num - 2);
 * }).memo();
 *
 * fib(1000);
 * ```
 */

import { type MapLike, memo as _memo } from "./memo.ts";

Function.prototype.memo = function memo<T extends (...args: any) => any>(
  this: T,
  cache?: MapLike<object, ReturnType<T>>,
  keying?: (args: Parameters<T>) => unknown[],
): T {
  return _memo(this, cache, keying);
};

declare global {
  interface Function {
    memo<T extends (...args: any) => any>(
      this: T,
      cache?: MapLike<object, ReturnType<T>>,
      keying?: (args: Parameters<T>) => unknown[],
    ): T;
  }
}
