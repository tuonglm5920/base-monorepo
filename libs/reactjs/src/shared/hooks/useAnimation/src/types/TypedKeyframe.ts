import { CSSProperties } from 'react';

export type AnimatableCSSProperties = Omit<CSSProperties, 'offset' | 'float'> & {
  /**
   * 'cssOffset' is a property representing the 'offset' CSS property.
   * It specifies the position of an element along an animation path.
   */
  cssOffset?: CSSProperties['offset'];

  /**
   * 'cssFloat' is a property representing the 'float' CSS property.
   * It is used to specify the floating direction of an element.
   */
  cssFloat?: CSSProperties['float'];

  /**
   * 'd' is a property for CSS Motion Path, specifically for SVG.
   * It defines a path for an element to follow during an animation.
   */
  d?: string;
};

/**
 * 'TypedKeyframe' is a strictly typed representation of a [Keyframe](https://developer.mozilla.org/en-US/docs/Web/API/Web_Animations_API/Keyframe_Formats).
 * It includes specific properties from the standard Keyframe interface such as 'composite', 'easing', and 'offset'.
 * Additionally, it supports custom properties (CSS Variables) and other animatable CSS properties.
 */
export type TypedKeyframe = Pick<Keyframe, 'composite' | 'easing' | 'offset'> & {
  /**
   * This part allows for the definition of custom properties, typically known as CSS Variables.
   * These custom properties are prefixed with '--' and can be of type string or number.
   */
  [key: `--${string}`]: string | number;
} & AnimatableCSSProperties;

/**
 * A function to define keyframe dynamically
 * - `prev`: current style
 * - `args`: any argument passed from play
 */
export type GetKeyframeFunction<Args = void> = Args extends void
  ? (prev: CSSStyleDeclaration) => TypedKeyframe[]
  : (prev: CSSStyleDeclaration, args: Args) => TypedKeyframe[];
