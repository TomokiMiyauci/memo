// Copyright 2023-latest Tomoki Miyauchi. All rights reserved. MIT license.
// This module is browser compatible.
// deno-lint-ignore-file ban-types

/**
 * @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-setfunctionlength
 */
export function setFunctionLength(fn: Function, length: number): void {
  Object.defineProperty(fn, "length", {
    writable: false,
    enumerable: false,
    configurable: true,
    value: length,
  });
}

/**
 * @see https://tc39.es/ecma262/multipage/ordinary-and-exotic-objects-behaviours.html#sec-setfunctionname
 */
export function setFunctionName(
  fn: Function,
  name: string,
  prefix: string,
): void {
  /**
   * 1. Assert: F is an extensible object that does not have a "name" own property.
   * 2. If name is a Symbol, then
   * a. Let description be name's [[Description]] value.
   * b. If description is undefined, set name to the empty String.
   * c. Else, set name to the string-concatenation of "[", description, and "]".
   * 3. Else if name is a Private Name, then
   * a. Set name to name.[[Description]].
   * 4. If F has an [[InitialName]] internal slot, then
   * a. Set F.[[InitialName]] to name.
   * 5. If prefix is present, then
   * a. Set name to the string-concatenation of prefix, the code unit 0x0020 (SPACE), and name.
   * b. If F has an [[InitialName]] internal slot, then
   * i. Optionally, set F.[[InitialName]] to name.
   * 6. Perform ! DefinePropertyOrThrow(F, "name", PropertyDescriptor { [[Value]]: name, [[Writable]]: false, [[Enumerable]]: false, [[Configurable]]: true }).
   * 7. Return unused.
   */

  const value = prefix + " " + name;

  Object.defineProperty(fn, "name", {
    writable: false,
    enumerable: false,
    configurable: true,
    value,
  });
}
