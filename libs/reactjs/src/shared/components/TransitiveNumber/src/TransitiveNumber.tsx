import { Component, ReactNode } from 'react';
import { View } from '../../View';
import { Symbol } from './components/Symbol/Symbol';

export interface Props {
  /** The class name to be applied to the component */
  className?: string;
  /**
   * Determines whether an animation is played when the component is first mounted.
   * If true, the component animates on initial render. Defaults to false.
   */
  enableInitialAnimation?: boolean;
  /** Text value that should be converted. */
  children: number | string;
}

/**
 * This component displays a number or text that can animate between state changes. It's designed
 * to visually represent transitions of values, making these changes more noticeable and engaging.
 *
 * Props:
 * - **className**: (optional) A string to apply custom CSS classes for styling the component.
 * - **enableInitialAnimation**: (optional) A boolean to enable an animation when the component mounts.
 *    Defaults to false. If true, the component animates on the initial render, adding a dynamic
 *    effect to the appearance of the initial value.
 * - **children**: The content to be displayed and animated within the component. This can be a number
 *    or a string, which the component will animate when it changes.
 *
 * Examples:
 * ```jsx
 * <TransitiveNumber className="my-custom-class" enableInitialAnimation={true}>
 *   {value}
 * </TransitiveNumber>
 * ```
 *
 * Where `value` is the numeric or text state that changes over time, causing the animation.
 */
export class TransitiveNumber extends Component<Props> {
  public static defaultProps: Partial<Props> = {
    className: undefined,
    enableInitialAnimation: false,
  };

  public override render(): ReactNode {
    const value = this.props.children.toString();
    const inverted = value[0] === '-';

    return (
      <View tagName="span" className={this.props.className} style={{ whiteSpace: 'pre' }}>
        {value.split('').map((s, index) => (
          <Symbol
            symbol={s}
            inverted={inverted}
            enableInitialAnimation={this.props.enableInitialAnimation}
            key={index}
          />
        ))}
      </View>
    );
  }
}
