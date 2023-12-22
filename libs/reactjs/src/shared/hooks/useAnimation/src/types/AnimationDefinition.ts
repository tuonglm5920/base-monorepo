import { CSSProperties } from 'react';
import { GetKeyframeFunction, TypedKeyframe } from './TypedKeyframe';

/**
 * Represents the easing functions available for CSS animations, derived from the 'animationTimingFunction' property of CSSProperties.
 * This type excludes the 'all' and 'undefined' values from the possible 'animationTimingFunction' properties, ensuring that only valid easing functions are represented.
 */
type TypedEasing = Exclude<CSSProperties['animationTimingFunction'], CSSProperties['all'] | undefined>;

/**
 * Extended [options of KeyframeEffect](https://developer.mozilla.org/en-US/docs/Web/API/KeyframeEffect/KeyframeEffect)
 */
interface TypedKeyframeEffectOptions extends Omit<KeyframeEffectOptions, 'easing'> {
  easing?: TypedEasing;
}

/**
 * Defines the structure for an animation, including its keyframes and options.
 */
export interface AnimationDefinition<Args> {
  /**
   * Defines the keyframes of the animation.
   * - TypedKeyframe: A single set of style properties at a specific point in the animation.
   * - TypedKeyframe[]: An array of TypedKeyframe, defining multiple style sets for various points in the animation.
   * - GetKeyframeFunction<Args>: Generating keyframes dynamically based on input parameters.
   */
  keyframe: TypedKeyframe | TypedKeyframe[] | GetKeyframeFunction<Args>;

  /**
   * Optional. Specifies additional options for the animation effect.
   * TypedKeyframeEffectOptions may include properties like duration, delay, easing, iterations, direction, and fill mode,
   * providing control over how the animation progresses over time and how it behaves before and after its execution.
   */
  options?: TypedKeyframeEffectOptions;
}
