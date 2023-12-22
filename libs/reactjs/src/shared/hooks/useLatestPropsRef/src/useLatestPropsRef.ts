import { MutableRefObject, useRef } from 'react';
import { useIsomorphicLayoutEffect } from '../../useIsomorphicLayoutEffect';

/**
 * Custom hook that maintains a mutable reference to the latest value of a prop in a React component.
 * The returned ref object will always have its `current` property updated to the most recent value of the
 * specified prop, ensuring that the latest prop value is accessible even after component re-renders.
 *
 * @template T The type of the prop value to be referenced.
 * @param {T} value The prop value to keep an updated reference to.
 * @returns {MutableRefObject<T>} A ref object with the `current` property set to the latest value of the specified prop.
 *
 * @example
 * // Usage example in a component
 * const MyComponent = ({ someProp }) => {
 *   const latestProp = useLatestPropsRef(someProp);
 *
 *   useEffect(() => {
 *     // Use `latestProp.current` to access the most recent value of `someProp`
 *     console.log(latestProp.current);
 *   }, []);
 *
 *   // Render logic here
 * };
 */

export const useLatestPropsRef = <T>(value: T): MutableRefObject<T> => {
  const ref = useRef<T>(value);

  useIsomorphicLayoutEffect(() => {
    ref.current = value;
  }, [value]);

  return ref;
};
