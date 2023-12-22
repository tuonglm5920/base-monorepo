import { useEffect, useRef } from 'react';

type RequestIdleCallbackHandle = any;

export enum UnsupportedBehavior {
  Immediate,
  AnimationFrame,
}

interface Options {
  unsupportedBehavior?: UnsupportedBehavior;
}

/**
 * A custom React hook that schedules a callback to be called during the browser's idle periods.
 * It leverages the 'requestIdleCallback' API when available, to run low-priority tasks. If the API is not
 * supported, it falls back to a specified behavior.
 *
 * @param {() => void} callback - The callback function that will be executed during the browser's idle periods.
 * @param {{unsupportedBehavior?: UnsupportedBehavior}} [options={}] - Configuration options for the hook.
 * @param {UnsupportedBehavior} [options.unsupportedBehavior=UnsupportedBehavior.AnimationFrame] - Behavior to fallback
 *        to when 'requestIdleCallback' is not supported. The default behavior is 'AnimationFrame', which uses
 *        'requestAnimationFrame'. The 'Immediate' option executes the callback immediately using 'setTimeout' with a 0ms delay.
 * @returns {void} The hook does not return any value.
 *
 * @example
 * useIdleCallback(() => {
 *   // Your idle-time logic here
 * }, { unsupportedBehavior: UnsupportedBehavior.Immediate });
 *
 * @enum {number} UnsupportedBehavior - Enumerates fallback behaviors when 'requestIdleCallback' is unsupported.
 * @remarks
 * This callback is not called with any arguments, unlike direct usage of requestIdleCallback.
 * This makes it more suited for use with discrete operations, rather than ones that will need to schedule themselves for subsequent idle callbacks if the work has not been completed.
 * If the callback ever changes, or the component unmounts, the original callback will not be run.
 */
export const useIdleCallback = (
  callback: () => void,
  { unsupportedBehavior = UnsupportedBehavior.AnimationFrame }: Options,
): void => {
  const handle = useRef<RequestIdleCallbackHandle | null>(null);

  useEffect(() => {
    if ('requestIdleCallback' in window) {
      handle.current = window.requestIdleCallback(() => callback());
    } else if (unsupportedBehavior === UnsupportedBehavior.AnimationFrame) {
      handle.current = (window as Window).requestAnimationFrame(() => {
        callback();
      });
    } else {
      callback();
    }

    return (): void => {
      const { current: currentHandle } = handle;
      handle.current = null;

      if (currentHandle == null) {
        return;
      }

      if ('cancelIdleCallback' in window) {
        window.cancelIdleCallback(currentHandle);
      } else if (unsupportedBehavior === UnsupportedBehavior.AnimationFrame) {
        (window as Window).cancelAnimationFrame(currentHandle);
      }
    };
  }, [callback, unsupportedBehavior]);
};
