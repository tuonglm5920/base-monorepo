import { CSSProperties, Component, ReactNode } from 'react';
import { Text } from '../../../../Text';
import { caf } from './utils/caf';
import { raf } from './utils/raf';
import { translateY } from './utils/translateY';

interface TransitionProps {
  /** The symbol or character to be used in the transition. */
  symbol: string;
  /** Indicates if the transition direction is upwards. True for upward motion, false for downward. */
  goingUp: boolean;
  /** Optional flag to indicate if the transition is for exiting. Defaults to false. */
  out?: boolean;
  /** Optional flag to enable entrance animation. Defaults to false. */
  animateEntrance?: boolean;
}

interface TransitionState {
  /**
   * Controls the visibility and animation state of the component.
   * When `true`, the component is fully visible and not in a transition state.
   * When `false`, the component is either not visible or in an animated transition state.
   */
  in: boolean;
}

/**
 * Represents a component that manages transitions for symbols with animation effects.
 */
export class Transition extends Component<TransitionProps, TransitionState> {
  private _timeout: number | null;

  constructor(props: TransitionProps) {
    super(props);

    this.state = {
      in: props.out ? true : !props.animateEntrance,
    };

    this._timeout = null;
    this._tada = this._tada.bind(this);
  }

  public override componentDidMount(): void {
    this._timeout = raf(this._tada);
  }

  public override componentWillUnmount(): void {
    caf(this._timeout);
  }

  /** A method that updates the component's state to trigger an animation. */
  private _tada = (): void => {
    this.setState({ in: true });
  };

  /**
   * Generates the CSS styles for the appearance of the symbol based on its current state and props.
   *
   * @returns A React.CSSProperties object representing the style for the component.
   */
  private _getAppearance = (): CSSProperties => {
    const transform = this._getTransform();

    return {
      display: 'inline-block',

      // Can't dynamically change `position` from `absolute` to `static` -
      // it will break transition animation in Safari.
      position: 'absolute',
      left: 0,

      WebkitTransition: '-webkit-transform 0.2s, opacity 0.2s',
      transition: 'transform 0.2s, opacity 0.2s',

      WebkitTransform: transform,
      transform: transform,

      opacity: this._isHidden() ? 0 : 1,

      pointerEvents: 'none',
    };
  };

  /**
   * Determines the appropriate transform value for the current state and props.
   *
   * @returns A string representing the CSS transform value.
   */
  private _getTransform = (): string => {
    if (this.props.out) {
      return translateY(this.props.goingUp);
    }

    if (!this.state.in) {
      return translateY(!this.props.goingUp);
    }

    // This has better text rendering in FF than simply `none`.
    return 'translateY(0) translateZ(0)';
  };

  /**
   * Determines whether the component should be hidden.
   *
   * @returns A boolean indicating whether the component is hidden.
   */
  private _isHidden = (): boolean => {
    return this.props.out || !this.state.in;
  };

  public override render(): ReactNode {
    const { symbol } = this.props;
    return (
      <Text tagName="span" style={this._getAppearance()}>
        {symbol}
      </Text>
    );
  }
}
