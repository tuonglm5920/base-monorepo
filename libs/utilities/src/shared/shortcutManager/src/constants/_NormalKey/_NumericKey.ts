export type NumericKey = keyof typeof NUMBERIC_KEYS;

/**
 * This constant provides a mapping for the numeric keys ("0" to "9") as recognized in a KeyboardEvent.
 * It's designed to ensure that the numeric key values are correctly identified and processed, regardless
 * of whether the "Shift" key is being held down or not.
 *
 * @example
 * let keyPressed = '3'; // Assume this is from an event.key
 * let numericValue = NUMBERIC_KEYS[keyPressed];
 * console.log(numericValue); // Output will be '3'
 *
 * @type {{ [key in string]: string }}
 */
export const NUMBERIC_KEYS = {
  '0': '0',
  '1': '1',
  '2': '2',
  '3': '3',
  '4': '4',
  '5': '5',
  '6': '6',
  '7': '7',
  '8': '8',
  '9': '9',
} as const;
