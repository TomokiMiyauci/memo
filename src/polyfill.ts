// Copyright © 2023 Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

/// <reference path="./polyfill.d.ts"/>

// deno-lint-ignore-file no-explicit-any ban-types

/**
 * Polyfill affects the global object.
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
 *
 * @module
 */

import { type MapLike, memo as _memo } from "./memo.ts";

Function.prototype.memo = function memo(
  this: Function,
  cache?: MapLike<object, unknown>,
  keying?: (thisArg: any, args: unknown[], newTarget?: any) => unknown[],
): Function {
  return _memo(this as any, cache, keying);
};
