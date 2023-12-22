export type WhiteSpaceKey = keyof typeof WHITE_SPACE_KEYS;

/**
 * Provides a mapping for whitespace-related keys from a KeyboardEvent to their respective string representations.
 * This mapping includes keys that are often used in web applications for various functionalities like form submission,
 * field navigation, and spacebar actions. The constant ensures accurate identification and handling of these key presses,
 * including scenarios where the 'Shift' key is held down simultaneously, which typically does not alter the behavior
 * of whitespace keys.
 *
 * @example
 * let keyPressed = ' '; // Assume this is from an event.key for a spacebar press
 * let actionKey = WHITE_SPACE_KEYS[keyPressed];
 * console.log(actionKey); // Output will be ' '
 *
 * @type {{ [key in string]: string }}
 */
export const WHITE_SPACE_KEYS = {
  Enter: 'Enter',
  Tab: 'Tab',
  ' ': ' ',
} as const;
