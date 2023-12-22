import { toArray } from 'utilities';
import { GetKeyframeFunction, TypedKeyframe } from '../types/TypedKeyframe';

/**
 * Retrieves the computed style of the specified DOM element.
 *
 * @param {Element} $el - The DOM element whose computed style is to be retrieved.
 * @returns {CSSStyleDeclaration} The computed style of the specified element.
 */
const getStyle = ($el: Element): CSSStyleDeclaration => getComputedStyle($el);

/**
 * Normalizes the input keyframe or keyframe generator function into an array of TypedKeyframes.
 * If the keyframe is a function, it is executed with the computed style of the element and the provided arguments.
 * Otherwise, the keyframe or array of keyframes is returned as an array.
 *
 * @template Args - The type of arguments that the keyframe generator function accepts.
 * @param {Element} el - The DOM element to which the keyframe(s) will be applied.
 * @param {TypedKeyframe | TypedKeyframe[] | GetKeyframeFunction<Args>} keyframe - The keyframe(s)
 *        or a function that generates keyframe(s) based on the element's style and provided arguments.
 * @param {Args} args - Arguments to pass to the keyframe generator function, if applicable.
 * @returns {TypedKeyframe[]} An array of TypedKeyframes.
 */
export const normalizeKeyframe = <Args>(
  el: Element,
  keyframe: TypedKeyframe | TypedKeyframe[] | GetKeyframeFunction<Args>,
  args: Args,
): TypedKeyframe[] => {
  if (typeof keyframe === 'function') {
    return keyframe(getStyle(el), args);
  }
  return toArray(keyframe);
};
