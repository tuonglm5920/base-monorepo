interface CheckElementIntersectingViewport {
  /** Element to check for intersection with the viewport */
  $el: Element;
  /** Offset from the top of the viewport */
  offsetTop: number;
  /** Offset from the bottom of the viewport */
  offsetBottom: number;
}

/**
 * Checks if an element is intersecting the viewport considering specified top and bottom offsets.
 *
 * @param {CheckElementIntersectingViewport} params - The parameters including the element and offsets.
 * @returns {boolean} True if the element is intersecting the viewport, false otherwise.
 */
export const checkElementIntersectingViewport = ({
  $el,
  offsetTop,
  offsetBottom,
}: CheckElementIntersectingViewport): boolean => {
  const rect = $el.getBoundingClientRect();

  // Adjusted view top and bottom considering offsets
  const adjustedViewTop = 0 + offsetTop;
  const adjustedViewBottom = (window.innerHeight || document.documentElement.clientHeight) - offsetBottom;

  // Element's top is above the adjusted bottom and bottom is below the adjusted top
  return rect.top < adjustedViewBottom && rect.bottom > adjustedViewTop;
};
