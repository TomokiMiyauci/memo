// From [proposal-richer-keys, compositeKey, polyfill](https://github.com/tc39/proposal-richer-keys/blob/master/compositeKey/polyfill.js)
// deno-lint-ignore-file ban-types

export type Ref = Readonly<{ __proto__: null }>;

function hasLifetime(value: unknown): value is object | Function {
  return value !== null &&
    (typeof value === "object" || typeof value === "function");
}
class CompositeNode {
  primitiveNodes = new Map();
  value: Ref | null = null;

  get(): Ref {
    if (this.value === null) {
      return this.value = Object.freeze({ __proto__: null });
    }
    return this.value;
  }

  emplacePrimitive(value: unknown, position: number) {
    if (!this.primitiveNodes.has(value)) {
      this.primitiveNodes.set(value, new Map());
    }
    const positions = this.primitiveNodes.get(value);
    if (!positions.has(position)) {
      positions.set(position, new CompositeNode());
    }
    return positions.get(position);
  }
}
class CompositeNodeWithLifetime extends CompositeNode {
  lifetimeNodes = new WeakMap();

  emplaceLifetime(value: object, position: number) {
    if (!this.lifetimeNodes.has(value)) {
      this.lifetimeNodes.set(value, new Map());
    }
    const positions = this.lifetimeNodes.get(value);
    if (!positions.has(position)) {
      positions.set(position, new CompositeNodeWithLifetime());
    }
    return positions.get(position);
  }
}
const compoundStore = /* @__PURE__ */ new CompositeNodeWithLifetime();
// accepts multiple objects as a key and does identity on the parts of the iterable

export function compositeKey(...parts: readonly unknown[]): Ref {
  let node = compoundStore;
  for (let i = 0; i < parts.length; i++) {
    const value = parts[i];
    if (hasLifetime(value)) {
      node = node.emplaceLifetime(value, i);
    }
  }
  // does not leak WeakMap paths since there are none added
  if (node === compoundStore) {
    throw new TypeError(
      "Composite keys must contain a non-primitive component",
    );
  }
  for (let i = 0; i < parts.length; i++) {
    const value = parts[i];
    if (!hasLifetime(value)) {
      node = node.emplacePrimitive(value, i);
    }
  }
  return node.get();
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
