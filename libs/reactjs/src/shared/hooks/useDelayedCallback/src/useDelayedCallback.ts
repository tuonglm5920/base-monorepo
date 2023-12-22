import { useRef } from 'react';
import { useMount } from '../../useMount';

/**
 * Provides a delayed callback function that can be invoked after a specified delay.
 *
 * @param {Function} callback - The callback function to be executed after the delay.
 * @param {number} delay - The time to wait before the callback is executed, in milliseconds.
 * @returns {() => void} A function that, when called, will set up the delayed execution of the callback.
 *                        Calling this function multiple times will reset the timer.
 *
 * @example
 * const handleDelayedLog = useDelayedCallback(() => console.log('Delayed Log'), 1000);
 *
 * // When `handleDelayedLog` is called, it will log 'Delayed Log' to the console after 1 second.
 * handleDelayedLog();
 */
export const useDelayedCallback = (callback: Function, delay: number): (() => void) => {
  const timeoutRef = useRef<NodeJS.Timeout | undefined>();

  useMount(() => {
    return (): void => {
      if (timeoutRef.current != null) {
        clearTimeout(timeoutRef.current);
      }
    };
  });

  const callbackWithDelay = (): void => {
    const timeoutId = setTimeout(() => {
      callback();
      timeoutRef.current = undefined;
    }, delay);

    timeoutRef.current = timeoutId;
  };

  return callbackWithDelay;
};
