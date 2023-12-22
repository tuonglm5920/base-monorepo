import { DependencyList, useCallback, useMemo } from 'react';
import { useDeepCompareEffect } from '../../useDeepCompareEffect';
import { useLatestPropsRef } from '../../useLatestPropsRef';
import { useRect } from '../../useRect';
import { useWindowSize } from '../../useWindowSize';
import { Position, PositionsValue } from './types';
import { bestPositionOf } from './utils/bestPositionOf';
import { getPadding } from './utils/getPadding';
import { isHorizontal } from './utils/isHorizontal';
import { isOutsideX, isOutsideY } from './utils/isOutside';

/**
 * Interface for coordinates with x and y values.
 */
interface Coordinate {
  x: number;
  y: number;
  position: Position;
}
type CoordsValue = Record<Position | 'center', Omit<Coordinate, 'position'>>;
/**
 * Interface for the `UsePopper` hook configuration.
 *
 * This interface defines the configuration structure for positioning a popper element in a UI.
 * It includes options for padding, dependencies for re-rendering, and references to the popper container
 * and the target DOM element to which the popper is attached.
 */
export interface UsePopper {
  /**
   * Padding for the popper element. Can be specified as a single number for uniform padding
   * or as a tuple of two numbers for independent vertical and horizontal padding.
   */
  padding?: number | [number, number];

  /**
   * Dependencies array for updating the popper's position. A change in these dependencies
   * will trigger a re-computation of the popper's position.
   * Specify a more precise type if known.
   */
  popperDeps?: DependencyList;

  /**
   * Dependencies array for reattaching the popper to the DOM. A change in these dependencies
   * will trigger the popper's reattachment to the DOM.
   * Specify a more precise type if known.
   */
  domAttachedDeps?: DependencyList;

  /**
   * A reference to the popper container element in the DOM.
   * Consider making it optional if the initialization doesn't always provide this element.
   */
  $popperContainerEl: Element | null;

  /**
   * A reference to the DOM element to which the popper is attached.
   * Consider making it optional if the initialization doesn't always provide this element.
   */
  $domAttachedEl: Element | null;

  /**
   * Callback function that gets called when the position of the popper changes.
   * `Coordinate` should be a predefined type representing the position.
   */
  onChange?: (coordinate: Coordinate | undefined) => void;
}

/**
 * A custom React hook for dynamically positioning a popper element (like a tooltip or dropdown menu)
 * relative to a target element in the DOM.
 *
 * This hook calculates the optimal position for a popper element based on the provided configuration
 * and dependencies. It utilizes DOM element references for both the popper container and the target element,
 * and supports optional padding and dependency arrays for dynamic re-rendering.
 *
 * @param {UsePopper} config - The configuration object for the hook.
 * @param {number | [number, number]} [config.padding=10] - Padding for the popper, either as a single
 * value (applied uniformly) or a tuple for vertical and horizontal padding.
 * @param {DependencyList} [config.domAttachedDeps] - Dependencies array for reattaching the popper. The hook
 * reattaches the popper when these dependencies change. Use more specific types if possible.
 * @param {DependencyList} [config.popperDeps] - Dependencies array for updating the popper's position. The hook
 * recomputes the position when these dependencies change. Use more specific types if possible.
 * @param {Element} config.$popperContainerEl - Reference to the popper container element in the DOM.
 * @param {Element} config.$domAttachedEl - Reference to the DOM element to which the popper is attached.
 * @param {Function} [config.onChange] - Optional callback that triggers when the popper's position changes.
 * @returns {{ coordinate: Coordinate | undefined }} - An object containing the calculated coordinates for
 * positioning the popper. The `coordinate` is `undefined` if no position can be calculated.
 */
export const usePopper = ({
  padding = 10,
  domAttachedDeps,
  popperDeps,
  $popperContainerEl,
  $domAttachedEl,
  onChange,
}: UsePopper): {
  coordinate: Coordinate | undefined;
} => {
  /** Hook to get the current window size */
  const windowSize = useWindowSize();
  /** Hook to get the bounding client rect of the popper container element, re-computed when domAttachedDeps change */
  const popperContainerRect = useRect($popperContainerEl, domAttachedDeps);
  /** Hook to get the bounding client rect of the attached DOM element, re-computed when popperDeps change */
  const domAttactedRect = useRect($domAttachedEl, popperDeps);
  /** Compute padding values (horizontal and vertical) based on the provided padding configuration */
  const [paddingX, paddingY] = useMemo(() => getPadding(padding), [padding]);

  const onChangeLatest = useLatestPropsRef(onChange);

  /** Calculate the available space around the attached DOM element within the viewport */
  const available = useMemo(
    () => ({
      left: domAttactedRect.left,
      right: windowSize.width - domAttactedRect.right,
      top: domAttactedRect.top,
      bottom: windowSize.height - domAttactedRect.bottom,
    }),
    [domAttactedRect, windowSize],
  );

  /** Function to check if the popper can be positioned at the given position considering available space and padding */
  const couldPositionAt = useCallback(
    (position: keyof PositionsValue) => {
      if (isHorizontal(position)) {
        return available[position] > popperContainerRect.width + paddingX * 2;
      }
      return available[position] > popperContainerRect.height + paddingY * 2;
    },
    [available, popperContainerRect, paddingX, paddingY],
  );

  /** Function to automatically determine the best position for the popper based on available space */
  const autoPosition = useCallback(
    (coords: CoordsValue): Coordinate | undefined => {
      const positionsOrder = bestPositionOf(available);
      for (let j = 0; j < positionsOrder.length; j++) {
        if (couldPositionAt(positionsOrder[j])) {
          return {
            ...coords[positionsOrder[j]],
            position: positionsOrder[j],
          };
        }
      }
      return;
    },
    [available, couldPositionAt],
  );

  /** Function to compute the actual coordinates where the popper should be positioned */
  const getCoordinates = useCallback(() => {
    const hX = isOutsideX(domAttactedRect.left + popperContainerRect.width, windowSize.width)
      ? domAttactedRect.right - popperContainerRect.width + paddingX
      : domAttactedRect.left - paddingX;
    const x = hX > paddingX ? hX : paddingX;

    const hY = isOutsideY(domAttactedRect.top + popperContainerRect.height, windowSize.height)
      ? domAttactedRect.bottom - popperContainerRect.height + paddingY
      : domAttactedRect.top - paddingY;
    const y = hY > paddingY ? hY : paddingY;

    const coords: CoordsValue = {
      top: {
        x,
        y: domAttactedRect.top - popperContainerRect.height - paddingY * 2,
      },
      bottom: { x, y: domAttactedRect.bottom + paddingY * 2 },
      right: { x: domAttactedRect.right + paddingX * 2, y },
      left: {
        x: domAttactedRect.left - popperContainerRect.width - paddingX * 2,
        y,
      },
      center: {
        x: windowSize.width / 2 - popperContainerRect.width / 2,
        y: windowSize.height / 2 - popperContainerRect.height / 2,
      },
    };
    return autoPosition(coords);
  }, [autoPosition, domAttactedRect, popperContainerRect, windowSize, paddingX, paddingY]);

  const coordinate = useMemo(() => getCoordinates(), [getCoordinates]);

  useDeepCompareEffect(() => {
    onChangeLatest.current?.(coordinate);
  }, [coordinate]);

  return { coordinate };
};
