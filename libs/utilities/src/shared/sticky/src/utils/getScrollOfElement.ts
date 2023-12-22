/**
 * Finds the scroll parent of the provided HTMLElement by traversing the DOM hierarchy.
 *
 * @param {HTMLElement} $el - The HTMLElement to find the scroll parent for.
 * @returns {HTMLElement | Window} Returns the scroll parent element or the window object.
 */
export const getScrollOfElement = ($el: HTMLElement): HTMLElement | (Window & typeof globalThis) => {
  let parent: HTMLElement | null = $el;
  while ((parent = parent.parentElement)) {
    const overflowYVal = getComputedStyle(parent, null).getPropertyValue('overflow-y');
    if (parent === document.body) {
      return window;
    }
    if (overflowYVal === 'auto' || overflowYVal === 'scroll' || overflowYVal === 'overlay') {
      return parent;
    }
  }
  return window;
};
