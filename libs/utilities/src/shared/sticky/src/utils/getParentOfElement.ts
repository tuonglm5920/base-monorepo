/**
 * Retrieves the effective parent of the provided HTMLElement considering elements with 'display: contents'.
 *
 * @param {HTMLElement} $el - The HTMLElement to find the effective parent node for.
 * @returns {HTMLElement | Window} Returns the effective parent element or the window object if not found.
 */
export const getParentOfElement = ($el: HTMLElement): HTMLElement | Window => {
  let currentParent = $el.parentElement;
  while (currentParent) {
    const style = getComputedStyle(currentParent, null);
    if (style.getPropertyValue('display') !== 'contents') {
      break;
    }
    currentParent = currentParent.parentElement;
  }
  return currentParent || window;
};
