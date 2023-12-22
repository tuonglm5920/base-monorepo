/**
 * Retrieves the vertical padding of the provided HTMLElement's computed style.
 *
 * @param {HTMLElement} node - The HTMLElement whose padding is to be retrieved.
 * @returns {{ top: number, bottom: number }} Returns an object containing the top and bottom padding values as numbers.
 */
export const getVerticalPadding = (node: HTMLElement): { top: number; bottom: number } => {
  const computedParentStyle = getComputedStyle(node, null);
  const parentPaddingTop = parseInt(computedParentStyle.getPropertyValue('padding-top'), 10);
  const parentPaddingBottom = parseInt(computedParentStyle.getPropertyValue('padding-bottom'), 10);
  return { top: parentPaddingTop, bottom: parentPaddingBottom };
};
