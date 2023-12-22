/**
 * Takes a string and returns a new string where the first letter is capitalized
 * and the rest are converted to lowercase.
 *
 * @param {string} str - The string to capitalize.
 * @returns {string} A new string with the first letter capitalized and the rest in lowercase.
 * @example ```typescript
 toCapitalize("hello"); // returns "Hello"
 toCapitalize("heLLo"); // returns "Hello"
 toCapitalize("A"); // returns "A"
 toCapitalize(""); // returns ""
 ```
 */
export const toCapitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};
