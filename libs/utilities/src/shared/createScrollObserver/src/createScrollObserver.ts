import { getPassiveArg } from '../../getPassiveArg';
import { isBrowser } from '../../isBrowser';

export interface ScrollObserverListener {
  (): void;
}

export type Config = IntersectionObserverInit;

/**
 * Represents a listener function that will be invoked when an observed element
 * enters or exits the viewport.
 * @callback ScrollObserverListener
 */

/**
 * Configuration object for the IntersectionObserver.
 * @typedef {IntersectionObserverInit} Config
 */

/**
 * Creates a customized IntersectionObserver with the given configuration.
 * This observer can have listeners added or removed to observe changes in
 * the intersection of a target element with an ancestor element or with a top-level document's viewport.
 *
 * @param {Config} [config={ root: null, rootMargin: '0px' }] - The configuration for the IntersectionObserver.
 * @returns {{
 *   addListener: (listener: Listener, target: Element | null) => void,
 *   removeListener: (listener: Listener) => void
 * }} An object containing methods to add or remove listeners.
 */
export const createScrollObserver = (
  config: Config = {
    root: null,
    rootMargin: '0px',
  },
): {
  addListener: (listener: ScrollObserverListener, target: Element | null) => void;
  removeListener: (listener: ScrollObserverListener) => void;
} => {
  let intersectionObserver: IntersectionObserver | undefined = undefined;

  const addListener = (listener: ScrollObserverListener, target: Element | null): void => {
    if (!isBrowser()) {
      return;
    }
    if (window.IntersectionObserver) {
      if (target) {
        intersectionObserver = new IntersectionObserver(listener, config);
        intersectionObserver.observe(target);
      }
    } else {
      listener();
      window.addEventListener('scroll', listener, getPassiveArg());
    }
  };

  const removeListener = (listener: ScrollObserverListener): void => {
    if (window.IntersectionObserver) {
      intersectionObserver?.disconnect();
    } else {
      window.removeEventListener('scroll', listener);
    }
  };

  return {
    addListener,
    removeListener,
  };
};
