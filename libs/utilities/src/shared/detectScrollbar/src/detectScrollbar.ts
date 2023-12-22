import { isBrowser } from '../../isBrowser';

/**
 * Detects if a vertical scrollbar is present in the browser window.
 * This function checks if the total height of the document is greater than the visible height of the viewport.
 * It is designed to be compatible with Server-Side Rendering (SSR).
 * In SSR, since there's no access to the `document` object, the function returns `false` by default.
 *
 * @returns {boolean} Returns `true` if a vertical scrollbar is present, otherwise `false`.
 * In the context of SSR, it always returns `false` as the window and document objects are not available.
 */
export const detectScrollbar = (): boolean => {
  return isBrowser() && document.documentElement.scrollHeight > document.documentElement.clientHeight;
};
