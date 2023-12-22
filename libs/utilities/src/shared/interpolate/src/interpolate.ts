import { Easing, easings } from './constant/easings';

export interface InterpolateOptions {
  /**
   * An array of input values that the interpolation maps from. These values should
   * be arranged in ascending order and correspond to the `outputRange`.
   */
  inputRange: number[];

  /**
   * An array of output values that the interpolation maps to. Each value in the
   * `outputRange` corresponds to a respective value in the `inputRange`.
   */
  outputRange: number[];

  /**
   * The current value to interpolate. This value is mapped from the `inputRange`
   * to the `outputRange` based on the provided `easing` function.
   */
  value: number;

  /**
   * An optional easing function that defines the interpolation curve. This function
   * determines how the `value` is translated between the `inputRange` and `outputRange`.
   */
  easing?: Easing;

  /**
   * A boolean flag that, when true, reverses the direction of the easing function,
   * effectively inverting the interpolation curve.
   */
  reverseEasing?: boolean;
}

/**
 * Interpolates a given value based on input and output ranges, with an optional easing function.
 *
 * @param {InterpolateOptions} options - The options for interpolation.
 * @param {number[]} options.inputRange - An array of input values that the interpolation maps from.
 *                                        These values should be in ascending order.
 * @param {number[]} options.outputRange - An array of output values that the interpolation maps to.
 *                                         Each value corresponds to a respective value in the `inputRange`.
 * @param {number} options.value - The current value to interpolate.
 * @param {Easing} [options.easing=easings.linear] - Optional easing function to define the interpolation curve.
 * @param {boolean} [options.reverseEasing=false] - Optional flag to reverse the direction of the easing function.
 * @returns {number} The interpolated value based on the provided input range, output range, and easing function.
 */
export const interpolate = ({
  inputRange,
  outputRange,
  value,
  easing = easings.linear,
  reverseEasing = false,
}: InterpolateOptions): number => {
  const sortedRanges = inputRange
    .map((_, i) => ({ input: inputRange[i], output: outputRange[i] }))
    .sort((a, b) => a.input - b.input);
  const sortedInputRange = sortedRanges.map(({ input }) => input);
  const sortedOutputRange = sortedRanges.map(({ output }) => output);

  if (value <= sortedInputRange[0]) {
    return sortedOutputRange[0];
  }

  if (value >= sortedInputRange[sortedInputRange.length - 1]) {
    return sortedOutputRange[sortedOutputRange.length - 1];
  }

  let i = 0;
  for (const inputValue of sortedInputRange) {
    if (inputValue < value) {
      i++;
    }
  }

  const j = i - 1;

  let ratio = (value - sortedInputRange[j]) / (sortedInputRange[i] - sortedInputRange[j]);
  if (typeof easing === 'function') {
    if (reverseEasing) {
      ratio = 1 - easing(1 - ratio);
    } else {
      ratio = easing(ratio);
    }
  }
  return sortedOutputRange[j] * (1 - ratio) + sortedOutputRange[i] * ratio;
};

interpolate.easings = easings;

export type { Easing };
