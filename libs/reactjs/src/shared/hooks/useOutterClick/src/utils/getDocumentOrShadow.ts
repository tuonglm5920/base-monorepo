/**
 * Retrieves the Document or ShadowRoot to which the given element belongs.
 *
 * @param {$el} [HTMLElement|null|undefined] - The element for which to find the root.
 *      If null or undefined, or if the `getRootNode` method is not available, the global document is returned.
 * @returns {Document|Node} - The Document or ShadowRoot to which the element belongs.
 */
export const getDocumentOrShadow = ($el: undefined | null | HTMLElement): Document | Node => {
  if (!$el || !document.getRootNode) {
    return document;
  }

  if ($el?.getRootNode() instanceof ShadowRoot) {
    return $el.getRootNode();
  }

  return document;
};
