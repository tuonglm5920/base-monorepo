import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Sticky, StickyBoxConfig } from 'utilities';

export type UseSticky = StickyBoxConfig;

/**
 * Hook for creating a sticky element based on provided configurations.
 * @param {UseSticky} options - Configuration options for the sticky behavior.
 * @param {number} options.offsetTop - Offset from the top of the viewport (default: 0).
 * @param {number} options.offsetBottom - Offset from the bottom of the viewport (default: 0).
 * @param {boolean} options.bottom - Whether the sticky element should stick to the bottom (default: false).
 * @returns {Dispatch<SetStateAction<HTMLElement | null>>} - A function to set the node element to be made sticky.
 */
export const useSticky = ({ offsetTop = 0, offsetBottom = 0, bottom = false }: UseSticky = {}): Dispatch<
  SetStateAction<HTMLElement | null>
> => {
  const [node, setNode] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!node) {
      return;
    }
    const stickyInstance = new Sticky({
      $el: node,
      options: { offsetBottom, offsetTop, bottom },
    });
    stickyInstance.create();
    return (): void => {
      stickyInstance.destroy();
    };
  }, [node, offsetBottom, offsetTop, bottom]);

  return setNode;
};
