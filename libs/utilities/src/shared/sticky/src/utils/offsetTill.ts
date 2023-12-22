import { isOffsetElement } from './isOffsetElement';
import { isWindow } from './isWindow';

interface OffsetTill {
  /** The starting node from which the offset calculation begins. */
  $el: HTMLElement;
  /** The target element till which the offset is calculated. */
  target: HTMLElement | Window;
}

/**
 * Calculates the cumulative offset between the provided node and the target element.
 *
 * @param {OffsetTill} param - An object containing 'node' and 'target' HTMLElements.
 * @returns {number} Returns the cumulative offset from the 'node' to the 'target'.
 */
export const offsetTill = ({ $el, target }: OffsetTill): number => {
  let current = $el;
  let offset = 0;
  // If target is not an offsetParent itself, subtract its offsetTop and set correct target
  if (!isWindow(target) && !isOffsetElement(target)) {
    offset += $el.offsetTop - target.offsetTop;
    target = $el.offsetParent as HTMLElement;
    offset += -$el.offsetTop;
  }
  do {
    offset += current.offsetTop;
    current = current.offsetParent as HTMLElement;
  } while (current && current !== target);
  return offset;
};
