export type AlphabetKey = keyof typeof ALPHABET_KEYS;

/**
 * Represents a type for keys in the ALPHABET_KEYS object.
 * @typedef {keyof typeof ALPHABET_KEYS} AlphabetKey
 */

/**
 * A constant object that maps the "event.key" values of a KeyboardEvent to a specific value,
 * irrespective of whether the "Shift" key is held down. This object essentially normalizes
 * uppercase and lowercase alphabetic keys to lowercase.
 *
 * @example
 * let keyPressed = 'A'; // This could be from an event.key
 * let normalizedKey = ALPHABET_KEYS[keyPressed];
 * console.log(normalizedKey); // Output will be 'a'
 *
 * @type {{ [key in string]: string }}
 */
export const ALPHABET_KEYS = {
  a: 'a',
  b: 'b',
  c: 'c',
  d: 'd',
  e: 'e',
  f: 'f',
  g: 'g',
  h: 'h',
  i: 'i',
  j: 'j',
  k: 'k',
  l: 'l',
  m: 'm',
  n: 'n',
  o: 'o',
  p: 'p',
  q: 'q',
  r: 'r',
  s: 's',
  t: 't',
  u: 'u',
  v: 'v',
  w: 'w',
  x: 'x',
  y: 'y',
  z: 'z',
  A: 'a',
  B: 'b',
  C: 'c',
  D: 'd',
  E: 'e',
  F: 'f',
  G: 'g',
  H: 'h',
  I: 'i',
  J: 'j',
  K: 'k',
  L: 'l',
  M: 'm',
  N: 'n',
  O: 'o',
  P: 'p',
  Q: 'q',
  R: 'r',
  S: 's',
  T: 't',
  U: 'u',
  V: 'v',
  W: 'w',
  X: 'x',
  Y: 'y',
  Z: 'z',
} as const;
