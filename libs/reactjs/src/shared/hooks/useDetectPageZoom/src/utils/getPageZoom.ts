import { detectHasScrollbar } from './detectHasScrollbar';

/**
 * Calculates and returns the current page zoom level as a ratio.
 *
 * @returns {number} - The current page zoom level. If a scrollbar is present, it adjusts the calculation by subtracting 8 pixels from the outer width.
 * @example ```typescript
  const zoomLevel = getPageZoom();
  ```
 */
export const getPageZoom = (): number => {
  if (detectHasScrollbar()) {
    return (window.outerWidth - 8) / window.innerWidth;
  }
  return window.outerWidth / window.innerWidth;
};
