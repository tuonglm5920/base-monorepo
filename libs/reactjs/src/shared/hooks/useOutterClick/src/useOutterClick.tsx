import { DependencyList, useEffect } from 'react';
import { getDocumentOrShadow } from './utils/getDocumentOrShadow';

export interface UseOutterClick {
  /** The callback function to execute when an outer click is detected. */
  callback: () => void;

  /** The element or elements to monitor for outer clicks. */
  $el: HTMLElement | null | undefined;

  /** Optional array of dependencies for the useEffect hook that monitors clicks. */
  deps?: DependencyList;
}

/**
 * Custom hook to execute a callback function when a click is detected outside of the specified element or elements.
 *
 * @param {UseOutterClick} param0 - Object containing the callback function,
 *        the element to monitor, and an optional array of dependencies.
 */
export const useOutterClick = ({ callback, $el, deps }: UseOutterClick): void => {
  const handleWindowClick = (event: Event): void => {
    if (Array.isArray($el)) {
      const isInner = $el.some(item => item?.contains(event.target as Node));
      if (!isInner) {
        callback();
      }
    } else if ($el instanceof HTMLElement) {
      if (!$el.contains(event.target as HTMLElement)) {
        callback();
      }
    }
  };

  useEffect(() => {
    const documentOrShadow = getDocumentOrShadow($el);
    documentOrShadow.addEventListener('click', handleWindowClick);
    return () => {
      documentOrShadow.removeEventListener('click', handleWindowClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [$el, ...(deps ?? [])]);
};
