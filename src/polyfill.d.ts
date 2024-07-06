// deno-lint-ignore-file no-explicit-any

interface Function {
  /** Returns the proxy function whose call is monitored. It calls at most once for each given arguments. */
  memo<T extends (...args: any) => any>(
    this: T,
    cache?: MapLike<object, ReturnType<T>>,
    keying?: (args: Parameters<T>) => unknown[],
  ): T;
}

/** {@link Map} like API. */
interface MapLike<K, V> {
  /** Returns a specified element. If the value that is associated to the provided key is an object, then you will get a reference to that object and any change made to that object will effectively modify it. */
  get(key: K): V | undefined;

  /** Whether an element with the specified key exists or not. */
  has(key: K): boolean;

  /** Adds a new element with a specified key and value. */
  set(key: K, value: V): void;
}
