import { useEffect, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../../useIsomorphicLayoutEffect';

type IntervalCallback = () => void;
type IntervalDelay = number | null;

// Adapted from https://overreacted.io/making-setinterval-declarative-with-react-hooks
// Also available at https://github.com/gaearon/overreacted.io/blob/master/src/pages/making-setinterval-declarative-with-react-hooks/index.md
//
// Copyright (c) 2020 Dan Abramov and the contributors.
//

/**
 * A custom React hook that invokes a function at specified time intervals.
 *
 * @param {IntervalCallback} callback - The function that will be called at each interval. This
 * function should not directly update state if it's declared outside of the `useInterval` callback
 * due to the stale closure problem.
 * @param {IntervalDelay} delay - The interval duration in milliseconds. If this parameter is null,
 * the interval will be paused.
 *
 * @example ```typescript
  useInterval(() => {
    // Your repeated logic here
  }, 1000);
 *
  ```
 * @remarks
 * The `useInterval` hook takes care of the setup and teardown of the interval, and it also ensures
 * that the latest version of the `callback` is used, avoiding the common pitfalls of `setInterval`
 * in React such as stale closures.
 */
export const useInterval = (callback: IntervalCallback, delay: IntervalDelay): void => {
  const savedCallback = useRef(callback);

  // Need to use a layout effect to force the saved callback to be synchronously updated during a commit
  useIsomorphicLayoutEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    const tick = (): void => {
      savedCallback.current();
    };
    if (delay !== null) {
      const id = setInterval(tick, delay);
      return (): void => clearInterval(id);
    }

    return undefined;
  }, [delay]);
};
