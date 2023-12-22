import { Position, PositionsValue } from '../types';

/**
 * Determines the best positions based on the provided values.
 *
 * This function takes an object containing potential positions and their associated values,
 * and returns an array of positions sorted by their values in descending order. It's typically
 * used in context with UI positioning logic, such as determining the best position for a tooltip
 * or a pop-up based on available space or other metrics.
 *
 * The function assumes that higher values are preferable. It first converts the object keys into
 * an array of objects with the position and its value, sorts them based on the value, and then
 * extracts and returns the sorted positions.
 *
 * @param {PositionsValue} positions - An object where keys are position names and values are
 * numerical values indicating the suitability or preference for that position.
 * @returns {Position[]} An array of positions sorted by their values in descending order.
 *
 * @example
 * const positionValues = { top: 80, bottom: 90, left: 70, right: 85 };
 * bestPositionOf(positionValues); // returns ['bottom', 'right', 'top', 'left']
 */
export function bestPositionOf(positions: PositionsValue): Position[] {
  return Object.keys(positions)
    .map(position => {
      const _position = position as keyof PositionsValue;
      return {
        position: _position,
        value: positions[_position],
      };
    })
    .sort((a, b) => b.value - a.value)
    .map(p => p.position);
}
