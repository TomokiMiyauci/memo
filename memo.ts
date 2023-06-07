// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.

// deno-lint-ignore-file ban-types

import { createCompositeKey, Node } from "./composite_key.ts";

export function memo<T, Args extends unknown[], R>(
  fn: (this: T, ...args: Args) => R,
  cache: CacheMap<object, R> = new WeakMap<object, R>(),
): (this: T, ...args: Args) => R {
  const node = new Node();
  const compositeKey = createCompositeKey(node);

  return function memoized(this: T, ...args: Args): R {
    const key = compositeKey(this, new.target, ...args);

    if (cache.has(key)) return cache.get(key)!;

    const value = fn.apply(this, args);

    cache.set(key, value);

    return value;
  };
}

export interface CacheMap<K, V> {
  /**
   * @returns a specified element.
   */
  get(key: K): V | undefined;

  /**
   * @returns a boolean indicating whether an element with the specified key exists or not.
   */
  has(key: K): boolean;

  /**
   * Adds a new element with a specified key and value.
   * @param key Must be an object.
   */
  set(key: K, value: V): void;
}
