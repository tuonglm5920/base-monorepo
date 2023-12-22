/**
 * Checks if the provided HTMLElement is the offset parent of its first child element.
 * An offset parent is an element whose position property is not 'static'.
 *
 * @param {HTMLElement} $el - The HTMLElement to check.
 * @returns {boolean} Returns true if the element is an offset parent of its first child, otherwise returns true.
 */

export const isOffsetElement = ($el: HTMLElement): boolean => {
  const firstChild = $el?.firstChild;
  return firstChild && 'offsetParent' in firstChild ? firstChild?.offsetParent === $el : true;
};
