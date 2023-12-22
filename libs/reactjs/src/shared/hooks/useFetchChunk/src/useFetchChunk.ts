import { ComponentType } from 'react';

export interface UseFetchChunk {
  /**
   * An array of functions that return a promise resolving to a module with a default export of a React component.
   * Each function in the array dynamically imports a React component, which is then used for lazy loading.
   */
  chunks: (() => Promise<{ default: ComponentType<any> }>)[];
}

/**
 * Provides a mechanism to fetch and load components lazily.
 * This function takes an object containing an array of chunk functions, each of which returns a promise
 * resolving to a module with a default export of a React component.
 *
 * @param {UseFetchChunk} param - An object containing the chunks property.
 * @param {(() => Promise<{ default: ComponentType<any> }>)} param.chunks - An array of functions,
 * each dynamically importing a React component for lazy loading.
 *
 * @returns {{ fetch: () => void }} - Returns an object with a 'fetch' function that,
 * when called, initiates the loading of the specified components.
 */
export const useFetchChunk = ({ chunks }: UseFetchChunk): { fetch: () => void } => {
  const fetch = (): void => {
    chunks.forEach(fn => {
      fn();
    });
  };
  return { fetch };
};
