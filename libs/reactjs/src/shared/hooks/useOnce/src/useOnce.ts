import { useRef } from 'react';

/**
 * Custom hook that initializes and returns a static, memoized value.
 * The value is only initialized once during the component's lifecycle using the `init` function provided.
 * Subsequent re-renders of the component will return the same initialized value.
 *
 * @template T The type of the value to be memoized.
 * @param {() => T} init A function that returns the initial value of type T. This function is only called once.
 * @returns {T} The memoized value. It's the same across all re-renders of the component.
 *
 * @example
 * // Usage example in a component
 * const staticValue = useOnce(() => computeExpensiveValue());
 */
export const useOnce = <T>(init: () => T): T => {
  const ref = useRef<T>();
  return ref.current || (ref.current = init());
};
