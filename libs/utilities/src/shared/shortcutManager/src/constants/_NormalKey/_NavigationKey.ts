export type NavigationKey = keyof typeof NAVIGATION_KEYS;

/**
 * This constant maps "event.key" values from a KeyboardEvent to a set of navigation key identifiers.
 * It's an essential tool for handling keyboard navigation events in web applications, ensuring a consistent
 * response to these keys. The mapped keys include directional arrows, as well as keys for page navigation like Home, End,
 * Page Up, and Page Down. This standardization is crucial for creating accessible and user-friendly interfaces,
 * especially in scenarios where keyboard-based navigation is predominant.
 * The mapping remains effective even when the "Shift" key is held down, which can be a common occurrence during
 * extended navigation tasks.
 *
 * @example
 * let keyPressed = 'ArrowRight'; // Assume this is from an event.key
 * let navigationAction = NAVIGATION_KEYS[keyPressed];
 * console.log(navigationAction); // Output will be 'ArrowRight'
 *
 * @type {{ [key in string]: string }}
 */
export const NAVIGATION_KEYS = {
  ArrowDown: 'ArrowDown',
  ArrowLeft: 'ArrowLeft',
  ArrowRight: 'ArrowRight',
  ArrowUp: 'ArrowUp',
  End: 'End',
  Home: 'Home',
  PageUp: 'PageUp',
  PageDown: 'PageDown',
} as const;
