/**
 * Creates a link element for prefetching HTML content.
 *
 * This function dynamically generates a <link> element with specified attributes
 * to prefetch HTML content.
 *
 * @param {string} link - The URL to be set in the href attribute of the link element.
 * @returns {HTMLLinkElement} A link element with prefetch attributes.
 */
export const createLinkElement = (link: string): HTMLLinkElement => {
  const linkEl = document.createElement('link');
  linkEl.setAttribute('rel', 'prefetch');
  linkEl.setAttribute('as', 'html');
  linkEl.setAttribute('href', link);
  return linkEl;
};
