import { isBrowser } from 'utilities';

/**
 * Determines whether the current webpage has a vertical scrollbar.
 *
 * @returns {boolean} - Returns `true` if the webpage has a vertical scrollbar, otherwise `false`.
 * @example ```typescript
  const hasScrollbar = detectHasScrollbar();
  ```
 */
export const detectHasScrollbar = (): boolean => {
  if (!isBrowser()) {
    return false;
  }
  return document.body.scrollHeight > document.body.clientHeight;
};
