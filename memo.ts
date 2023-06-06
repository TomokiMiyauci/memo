// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

import { compositeKey } from "./composite_key.ts";

export function memo<T, Args extends readonly unknown[], R>(
  this: T,
  fn: (...args: Args) => R,
): (...args: Args) => R {
  // deno-lint-ignore ban-types
  const cache = new WeakMap<object, R>();

  return function memoized(this: T, ...args: Args): R {
    const key = compositeKey(this, new.target, ...args);

    if (cache.has(key)) return cache.get(key)!;

    const value = fn(...args);

    cache.set(key, value);

    return value;
  };
}
