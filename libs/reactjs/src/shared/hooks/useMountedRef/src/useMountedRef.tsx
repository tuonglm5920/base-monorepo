import { MutableRefObject, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../../useIsomorphicLayoutEffect';

/**
 * useMountedRef hook
 *
 * A hook that keeps track of a component's mount status. This hook returns a boolean value
 * indicating whether the component is currently mounted.
 *
 * Note: In React's StrictMode, this hook will always return `false` due to the double-invocation
 * behavior of effects.
 *
 * @returns {MutableRefObject<boolean>} A boolean value that is `true` if the component is currently mounted, and `false` otherwise.
 *
 * @example
 * const isMounted = useMountedRef();
 *
 * useEffect(() => {
 *   if (isMounted.current) {
 *     // Perform actions only when the component is mounted
 *   }
 * }, [isMounted]);
 */
export const useMountedRef = (): MutableRefObject<boolean> => {
  const mounted = useRef<boolean>(false);

  useIsomorphicLayoutEffect(() => {
    // FIXME: in StrictMode it always return "false"
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  return mounted;
};
