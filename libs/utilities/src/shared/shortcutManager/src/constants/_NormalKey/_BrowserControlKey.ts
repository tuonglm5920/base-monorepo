export type BrowserControlKey = keyof typeof BROWSER_CONTROL_KEYS;

/**
 * A constant object mapping "event.key" values from a KeyboardEvent to browser control commands.
 * This mapping provides standardized handling of keyboard events for browser-specific actions
 * like navigation and search. The values are mapped to their respective actions and are
 * designed to remain consistent regardless of whether the "Shift" key is held down.
 *
 * @example
 * let command = 'BrowserRefresh'; // This could be from an event.key
 * let action = BROWSER_CONTROL_KEYS[command];
 * console.log(action); // Output will be 'BrowserRefresh'
 *
 * @type {{ [key in string]: string }}
 */
export const BROWSER_CONTROL_KEYS = {
  BrowserBack: 'BrowserBack',
  BrowserFavorites: 'BrowserFavorites',
  BrowserForward: 'BrowserForward',
  BrowserHome: 'BrowserHome',
  BrowserRefresh: 'BrowserRefresh',
  BrowserSearch: 'BrowserSearch',
  BrowserStop: 'BrowserStop',
} as const;
