type SubKeys<T, K extends string> = K extends keyof T ? `${K}.${PathKeyOfObject<T[K]>}` : never;

/**
 * Extract the full path of keys from a nested object type as a union of string literal types.
 * @param {object} sourceObject Source object.
 * @example ```typescript
  const user = {
    projects: [
      { name: 'Cool project!', contributors: 10 },
      { name: 'Amazing project!', contributors: 12 },
    ],
  } as const;
  type _Case1 = PathKeyOfObject<typeof user>; // "projects" | "projects.0" | "projects.1" | "projects.0.name" | "projects.0.contributors" | "projects.1.name" | "projects.1.contributors"
  ```
 */
export type PathKeyOfObject<T> = object extends T
  ? string
  : T extends readonly any[]
    ? Extract<keyof T, `${number}`> | SubKeys<T, Extract<keyof T, `${number}`>>
    : T extends object
      ? Extract<keyof T, string> | SubKeys<T, Extract<keyof T, string>>
      : never;
