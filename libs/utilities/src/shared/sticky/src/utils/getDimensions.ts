import { createResizeObserver } from '../../../createResizeObserver';
import { getPassiveArg } from '../../../getPassiveArg';
import { isWindow } from './isWindow';

interface Rect {
  /** The vertical position from the top edge. */
  top: number;
  /** The horizontal position from the left edge. */
  left: number;
  /** The vertical size of the rectangle. */
  height: number;
  /** The horizontal size of the rectangle. */
  width: number;
}

/**
 * Retrieves the dimensions and position of the window.
 * @returns {Rect} The object containing window dimensions and position.
 */
const getWindowRect = (): Rect => ({
  top: 0,
  left: 0,
  height: window.innerHeight,
  width: window.innerWidth,
});

interface GetDimensions<T extends object> {
  /** The element (HTMLElement or Window) for which dimensions are measured. */
  $el: HTMLElement | Window;
  /** A callback function triggered when dimensions change. */
  onChange: () => void;
  /** An array of unsubscribe functions. */
  unsubs: (() => void)[];
  /** A function that measures dimensions based on a given rectangle and returns a generic type. */
  measure: (rect: Rect) => T;
}
const resizeObserver = createResizeObserver();

/**
 * Calculates the dimensions of an element or the window and invokes a callback on resize.
 *
 * @template T - Generic type extending object.
 * @param {object} param - An object containing parameters for dimension retrieval.
 * @param {HTMLElement | Window} param.$el - The element or window for which dimensions are to be measured.
 * @param {Function} param.onChange - Callback function to be invoked on dimension change.
 * @param {Array<Function>} param.unsubs - List of unsubscribe functions.
 * @param {Function} param.measure - Function to measure the dimensions.
 * @returns {T} Returns an object of type T representing the dimensions.
 */
export const getDimensions = <T extends object>({ $el, onChange, unsubs, measure }: GetDimensions<T>): T => {
  if (isWindow($el)) {
    const mResult = measure(getWindowRect());
    const handleResize = (): void => {
      Object.assign(mResult, measure(getWindowRect()));
      onChange();
    };
    window.addEventListener('resize', handleResize, getPassiveArg());
    unsubs.push(() => window.removeEventListener('resize', handleResize));
    return mResult;
  } else {
    const mResult = measure($el.getBoundingClientRect());
    const handleResize = (): void => {
      // note the e[0].contentRect is different from `getBoundingClientRect`
      Object.assign(mResult, measure($el.getBoundingClientRect()));
      onChange();
    };
    resizeObserver.addListener(handleResize, $el);
    unsubs.push(() => resizeObserver.removeListener(handleResize));
    return mResult;
  }
};
