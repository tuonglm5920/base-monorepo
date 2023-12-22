export type FunctionKey = keyof typeof FUNCTION_KEYS;

/**
 * A constant object mapping "event.key" values from a KeyboardEvent to function key actions (F1-F20)
 * and additional software-defined keys (Soft1-Soft4). This mapping provides an easy reference to handle
 * keyboard events for these specific function keys, ensuring consistent behavior regardless of whether
 * the "Shift" key is pressed. It covers the standard function keys as well as additional soft keys
 * which might be used in various applications.
 *
 * @example
 * let command = 'F5'; // This could be from an event.key
 * let action = FUNCTION_KEYS[command];
 * console.log(action); // Output will be 'F5'
 *
 * @type {{ [key in string]: string }}
 */
export const FUNCTION_KEYS = {
  F1: 'F1',
  F2: 'F2',
  F3: 'F3',
  F4: 'F4',
  F5: 'F5',
  F6: 'F6',
  F7: 'F7',
  F8: 'F8',
  F9: 'F9',
  F10: 'F10',
  F11: 'F11',
  F12: 'F12',
  F13: 'F13',
  F14: 'F14',
  F15: 'F15',
  F16: 'F16',
  F17: 'F17',
  F18: 'F18',
  F19: 'F19',
  F20: 'F20',
  Soft1: 'Soft1',
  Soft2: 'Soft2',
  Soft3: 'Soft3',
  Soft4: 'Soft4',
} as const;
