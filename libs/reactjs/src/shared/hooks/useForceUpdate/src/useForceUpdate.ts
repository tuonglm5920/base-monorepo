import { useCallback, useState } from 'react';

/**
 * A custom React hook that forces a component to re-render.
 * It provides a `forceUpdate` function which, when called, will cause the component to re-render.
 *
 * @returns {() => void} A function that, when invoked, will cause the React component to re-render.
 *
 * @example
 * const forceUpdate = useForceUpdate();
 *
 * // Later in your component...
 * forceUpdate(); // This will trigger a re-render of the component.
 */
export const useForceUpdate = (): ReturnType<typeof useCallback> => {
  const [, setState] = useState({});
  return useCallback(() => setState({}), []);
};
