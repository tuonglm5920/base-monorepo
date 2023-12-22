/**
 * Escapes any special characters in a string that could be used in a regular expression.
 *
 * @param {string} str - The string to escape.
 * @returns {string} - The escaped string, safe to use in a regular expression.
 *
 * @example ```typescript
  const pattern = new RegExp(escapeRegExp("Hello (world)!"));
  // creates a regex equivalent to /Hello \(world\)\!/
  ```
 */
export const escapeRegExp = (str: string): string => {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // $& means the whole matched string
};
