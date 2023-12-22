/**
 * Generates a CSS transform string for vertical translation.
 *
 * This function creates a CSS `transform` property value that translates an element
 * vertically. The direction of the translation (upwards or downwards) is determined
 * by the `isUp` argument.
 *
 * @param {boolean} isUp - Determines the direction of the translation. If `true`,
 *                         the translation is upwards, otherwise it's downwards.
 * @returns {string} A CSS transform string for vertical translation.
 */
export const translateY = (isUp: boolean): string => {
  return `translateY(${isUp ? '-' : ''}60%) translateZ(0)`;
};
