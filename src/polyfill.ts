// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

/// <reference path="./polyfill.d.ts"/>

// deno-lint-ignore-file no-explicit-any

/**
 * Polyfill affects the global object. You must be very careful when using it.
 *
 * @example
 * ```ts
 * import "@miyauci/memo/polyfill";
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
