// From [proposal-richer-keys, compositeKey, polyfill](https://github.com/tc39/proposal-richer-keys/blob/master/compositeKey/polyfill.js)
// deno-lint-ignore-file ban-types

import { partition } from "./deps.ts";

export type Ref = Readonly<{ __proto__: null }>;

function hasLifetime(value: unknown): value is object | Function {
  return value !== null &&
    (typeof value === "object" || typeof value === "function");
}

class CompositeNode {
  private primitiveNodes: Map<unknown, Map<number, CompositeNode>> = new Map();
  private value: Ref | null = null;

  get(): Ref {
    if (this.value === null) {
      return this.value = Object.freeze({ __proto__: null });
    }
    return this.value;
  }

  emplacePrimitive(value: unknown, position: number): CompositeNode {
    if (!this.primitiveNodes.has(value)) {
      this.primitiveNodes.set(value, new Map());
    }

    const positions = this.primitiveNodes.get(value)!;

    if (!positions.has(position)) {
      positions.set(position, new CompositeNode());
    }

    return positions.get(position)!;
  }
}

class CompositeNodeWithLifetime extends CompositeNode {
  private lifetimeNodes: WeakMap<
    object,
    Map<unknown, CompositeNodeWithLifetime>
  > = new WeakMap();

  emplaceLifetime(value: object, position: number): CompositeNodeWithLifetime {
    if (!this.lifetimeNodes.has(value)) {
      this.lifetimeNodes.set(value, new Map());
    }
    const positions = this.lifetimeNodes.get(value)!;

    if (!positions.has(position)) {
      positions.set(position, new CompositeNodeWithLifetime());
    }

    return positions.get(position)!;
  }
}
const compoundStore = /* @__PURE__ */ new CompositeNodeWithLifetime();
// accepts multiple objects as a key and does identity on the parts of the iterable

export function compositeKey(...parts: readonly unknown[]): Ref {
  const [objects, primitives] = partition(
    [...parts.entries()],
    isEntryHasLifetime,
  );

  // does not leak WeakMap paths since there are none added
  if (!objects.length) {
    throw new TypeError(
      "Composite keys must contain a non-primitive component",
    );
  }

  const composites = objects.reduce(lifetimeReducer, compoundStore);

  return primitives
    .reduce(primitiveReducer, composites)
    .get();
}

const symbols = /* @__PURE__ */ new WeakMap<object, symbol>();

export function compositeSymbol(...parts: readonly unknown[]): symbol {
  if (parts.length === 1 && typeof parts[0] === "string") {
    return Symbol.for(parts[0]);
  }

  const key = compositeKey(symbols, ...parts);

  if (!symbols.has(key)) symbols.set(key, Symbol());

  return symbols.get(key)!;
}

function isEntryHasLifetime(
  entry: [key: number, value: unknown],
): entry is [number, object | Function] {
  return hasLifetime(entry[1]);
}

function lifetimeReducer(
  acc: CompositeNodeWithLifetime,
  [key, value]: [key: number, value: object | Function],
): CompositeNodeWithLifetime {
  return acc.emplaceLifetime(value, key);
}

function primitiveReducer(
  acc: CompositeNode,
  [key, value]: [key: number, value: unknown],
): CompositeNode {
  return acc.emplacePrimitive(value, key);
}
