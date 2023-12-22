import { useEffect, useRef } from 'react';

/**
 * A custom React hook that tracks a given value and invokes a callback function whenever the value changes.
 * The callback function receives both the new value and the old value as arguments.
 *
 * @template T The type of the value being tracked for changes.
 * @param {T} value - The current value to track.
 * @param {(value: T, oldValue: T) => void} onChange - The callback function that is invoked on value change.
 *                                                     It receives the current value and the previous value as parameters.
 * @returns {void} This hook does not return anything.
 *
 * @example
 * const [myValue, setMyValue] = useState(0);
 * useOnValueChange(myValue, (newValue, oldValue) => {
 *   console.log(`Value changed from ${oldValue} to ${newValue}`);
 * });
 */
export const useOnValueChange = <T>(value: T, onChange: (value: T, oldValue: T) => void): void => {
  const tracked = useRef(value);

  useEffect(() => {
    const oldValue = tracked.current;
    if (value !== tracked.current) {
      tracked.current = value;
      onChange(value, oldValue);
    }
  }, [value, onChange]);
};
