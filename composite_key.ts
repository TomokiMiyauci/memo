// deno-lint-ignore-file ban-types

import {
  EmplaceableMap,
  EmplaceableWeakMap,
  isFunction,
  isObject,
  isString,
} from "./deps.ts";

export type Ref = Readonly<{ __proto__: null }>;

function hasLifetime(value: unknown): value is object | Function {
  return isObject(value) || isFunction(value);
}

class RefContainer {
  #value: Ref | undefined;
  get value(): Ref {
    return this.#value ?? (this.#value = Object.freeze({ __proto__: null }));
  }
}

class Compositor extends RefContainer {
  #map: EmplaceableMap<unknown, EmplaceableMap<number, Compositor>> | undefined;
  #weakMap:
    | EmplaceableWeakMap<object, EmplaceableMap<number, Compositor>>
    | undefined;

  get map(): EmplaceableMap<unknown, EmplaceableMap<number, Compositor>> {
    return this.#map ?? (this.#map = new EmplaceableMap());
  }

  get weakMap(): EmplaceableWeakMap<
    object,
    EmplaceableMap<number, Compositor>
  > {
    return this.#weakMap ?? (this.#weakMap = new EmplaceableWeakMap());
  }

  emplace(value: unknown, position: number): Compositor {
    const positions = hasLifetime(value)
      ? this.weakMap.emplace(value, Handler)
      : this.map.emplace(value, Handler);
    const compositor = positions.emplace(position, {
      insert: () => new Compositor(),
    });

    return compositor;
  }
}

class Handler {
  static insert(): EmplaceableMap<number, Compositor> {
    return new EmplaceableMap<number, Compositor>();
  }
}

const compositor = /* @__PURE__ */ new Compositor();
// accepts multiple objects as a key and does identity on the parts of the iterable

export function compositeKey(...parts: readonly unknown[]): Ref {
  const includeObj = parts.some(hasLifetime);

  // does not leak WeakMap paths since there are none added
  if (!includeObj) {
    throw new TypeError(
      "Composite keys must contain a non-primitive component",
    );
  }

  return [...parts.entries()]
    .reduce((acc, [key, value]) => acc.emplace(value, key), compositor)
    .value;
}

const symbols = /* @__PURE__ */ new EmplaceableWeakMap<object, symbol>();

export function compositeSymbol(...parts: readonly unknown[]): symbol {
  if (parts.length === 1 && isString(parts[0])) return Symbol.for(parts[0]);

  const key = compositeKey(symbols, ...parts);

  return symbols.emplace(key, { insert: () => Symbol() });
}
