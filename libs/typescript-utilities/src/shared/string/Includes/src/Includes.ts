/**
 * Check if a specific substring exists within a string type.
 * @param {string} sourceString Source string.
 * @param {string} searchString Search string.
 * @example ```typescript
  type Case1 = Includes<"Lorem ipsum dolor sit", 'dolor sit'>; // Result: true
  ```
 */
export type Includes<T extends string, U extends string> = T extends `${any}${U}${any}` ? true : false;
