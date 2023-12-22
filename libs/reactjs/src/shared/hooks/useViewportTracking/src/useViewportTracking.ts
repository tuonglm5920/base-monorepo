import { useCallback, useEffect, useState } from 'react';
import { createResizeObserver, createScrollObserver } from 'utilities';
import { useLatestPropsRef } from '../../useLatestPropsRef';
import { checkElementIntersectingViewport } from './utils/checkElementIntersectingViewport';

export interface UseViewportTracking {
  /** The top offset to consider for viewport tracking */
  offsetTop?: number;
  /** The bottom offset to consider for viewport tracking */
  offsetBottom?: number;
  /** The maximum number of times the viewport tracking callbacks should run */
  numberOfRuns?: number;
  /** Callback function to execute when the element enters the viewport */
  onEnterViewport?: () => void;
  /** Callback function to execute when the element leaves the viewport */
  onLeaveViewport?: () => void;
  /** The DOM element to track within the viewport */
  $el: Element | null;
}

/**
 * A React hook that tracks whether a specified DOM element is within the viewport, considering given offsets.
 * It can trigger callback functions when the element enters or leaves the viewport.
 * The hook also limits the number of times these callbacks can be executed.
 *
 * @param {UseViewportTracking} params - The parameters for viewport tracking.
 * @param {number} [params.offsetTop=100] - The top offset to consider for determining if the element is in the viewport.
 * @param {number} [params.offsetBottom=0] - The bottom offset to consider for determining if the element is in the viewport.
 * @param {number} [params.numberOfRuns=Infinity] - The maximum number of times the onEnterViewport and onLeaveViewport callbacks should be executed.
 * @param {() => void} [params.onEnterViewport] - Callback function that is called when the element enters the viewport.
 * @param {() => void} [params.onLeaveViewport] - Callback function that is called when the element leaves the viewport.
 * @param {Element|null} params.$el - The DOM element to track within the viewport.
 *
 * @returns {{ inViewport: boolean }} An object containing a boolean indicating if the element is currently in the viewport.
 *
 * @example
 * const { inViewport } = useViewportTracking({
 *   $el: document.getElementById('myElement'),
 *   offsetTop: 100,
 *   offsetBottom: 50,
 *   onEnterViewport: () => console.log('Entered viewport'),
 *   onLeaveViewport: () => console.log('Left viewport')
 * });
 */
export const useViewportTracking = ({
  numberOfRuns = Infinity,
  offsetBottom = 0,
  offsetTop = 100,
  onEnterViewport,
  onLeaveViewport,
  $el,
}: UseViewportTracking): { inViewport: boolean } => {
  /** State to track if the element is in the viewport */
  const [inViewport, setInViewport] = useState(false);
  /** State to initiate enter viewport tracking */
  const [enterStart, setEnterStart] = useState(false);
  /** State to initiate leave viewport tracking */
  const [leaveStart, setLeaveStart] = useState(false);
  /** Count of times the element has entered the viewport */
  const [enterCount, setEnterCount] = useState(0);
  /** Count of times the element has left the viewport */
  const [leaveCount, setLeaveCount] = useState(0);

  const onEnterViewportLatest = useLatestPropsRef(onEnterViewport);
  const onLeaveViewportLatest = useLatestPropsRef(onLeaveViewport);

  useEffect(() => {
    if (enterStart && enterCount < numberOfRuns) {
      onEnterViewportLatest.current?.();
      setInViewport(true);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [enterStart, enterCount, numberOfRuns]);

  useEffect(() => {
    if (leaveStart && leaveCount < numberOfRuns) {
      onLeaveViewportLatest.current?.();
      setInViewport(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [leaveStart, leaveCount, numberOfRuns]);

  const handleCalculate = useCallback(() => {
    if ($el) {
      if (checkElementIntersectingViewport({ $el, offsetBottom, offsetTop })) {
        setEnterStart(true);
        setEnterCount(enterCount => enterCount + 1);
      } else {
        setLeaveStart(true);
        setLeaveCount(leaveCount => leaveCount + 1);
      }
    }
  }, [$el, offsetBottom, offsetTop]);

  useEffect(() => {
    const intersectionObserver = createScrollObserver();
    const resizeObserser = createResizeObserver();
    intersectionObserver.addListener(handleCalculate, $el);
    resizeObserser.addListener(handleCalculate, $el);
    return (): void => {
      intersectionObserver.removeListener(handleCalculate);
      resizeObserser.removeListener(handleCalculate);
    };
  }, [$el, handleCalculate]);

  return { inViewport };
};
