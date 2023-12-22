import { useState } from 'react';
import { useMount } from '../../useMount';
import { getPageZoom } from './utils/getPageZoom';

/**
 * Hook that detects and tracks the current zoom level of the page.
 *
 * @returns {object} Object containing the zoom level of the page.
 * @property {number} pageZoom - A number representing the zoom level of the page.
 *
 * @example ```typescript
  const { pageZoom } = useDetectPageZoom();
  console.log(`Current page zoom level: ${pageZoom}`);
  ```
 */
export const useDetectPageZoom = (): { pageZoom: number } => {
  const [pageZoom, setPageZoom] = useState(getPageZoom());

  const handleDetectPageZoom = (): void => {
    setPageZoom(getPageZoom());
  };

  useMount(() => {
    window.addEventListener('resize', handleDetectPageZoom);
    return (): void => {
      window.removeEventListener('resize', handleDetectPageZoom);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  });

  return { pageZoom };
};
