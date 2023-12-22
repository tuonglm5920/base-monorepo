export type SymbolKey = keyof typeof SYMBOL_KEYS;

/**
 * Provides a mapping for the `event.key` values from a `KeyboardEvent` to their respective base key values,
 * ensuring accurate interpretation of key presses regardless of the "Shift" key state. This mapping is
 * particularly beneficial for handling special characters and symbols on a standard keyboard layout,
 * where a single key can represent multiple characters based on the shift state. For instance, the key
 * that normally outputs '1' will output '!' when the shift key is held down. Both these characters are
 * mapped to their base key value '1' in this constant.
 *
 * @example
 * let keyPressed = '!'; // Assume this is from an event.key
 * let baseKey = SYMBOL_KEYS[keyPressed];
 * console.log(baseKey); // Output will be '1'
 *
 * @type {{ [key in string]: string }}
 */
export const SYMBOL_KEYS = {
  '~': '`',
  '`': '`',
  '!': '1',
  '@': '2',
  '#': '3',
  $: '4',
  '%': '5',
  '^': '6',
  '&': '7',
  '*': '8',
  '(': '9',
  ')': '0',
  '-': '-',
  _: '-',
  '+': '=',
  '=': '=',
  '[': '[',
  ']': ']',
  '{': '[',
  '}': ']',
  '\\': '\\',
  '|': '\\',
  ';': ';',
  ':': ';',
  "'": "'",
  '"': "'",
  ',': ',',
  '<': ',',
  '.': '.',
  '>': '.',
  '/': '/',
  '?': '/',
} as const;
