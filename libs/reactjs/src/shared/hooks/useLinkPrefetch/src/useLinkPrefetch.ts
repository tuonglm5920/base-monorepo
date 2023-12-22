import { useRef, useState } from 'react';
import { createLinkElement } from './utils/createLinkElement';

interface UseLinkPrefetch {
  /**
   * The URL to be prefetched. This string specifies the location of the HTML content
   * or other resources that should be preloaded to improve loading performance.
   */
  link: string;
}

/**
 * Provides functionality to prefetch a link and cancel the prefetching if needed.
 *
 * This function accepts an object with a 'link' property and returns an object containing
 * two methods: 'fetch' and 'cancel'. The 'fetch' method is used to start prefetching the
 * resource at the specified URL, while the 'cancel' method can be used to cancel this
 * prefetching operation.
 *
 * @param {UseLinkPrefetch} param0 - An object containing the 'link' property with the URL to prefetch.
 * @returns {{ fetch: () => void; cancel: () => void }} An object with 'fetch' and 'cancel' methods
 *          to control the prefetching operation.
 */
export const useLinkPrefetch = ({ link }: UseLinkPrefetch): { fetch: () => void; cancel: () => void } => {
  const linkElRef = useRef<HTMLLinkElement | null>(null);
  const timeoutIdRef = useRef(0);
  const [load, setLoad] = useState(false);

  const fetch = (): void => {
    linkElRef.current = createLinkElement(link);
    timeoutIdRef.current = window.setTimeout(() => {
      setLoad(true);
      clearTimeout(timeoutIdRef.current);
    }, 500);
    if (!!linkElRef.current && !document.querySelector(`link[href="${link}"]`)) {
      document.head.appendChild(linkElRef.current);
    }
  };

  const cancel = (): void => {
    if (!load) {
      clearTimeout(timeoutIdRef.current);
      linkElRef.current?.remove();
    }
  };

  return { fetch, cancel };
};
