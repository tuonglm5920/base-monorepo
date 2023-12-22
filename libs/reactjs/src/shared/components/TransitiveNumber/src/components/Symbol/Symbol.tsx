import { Component, ReactNode, createRef } from 'react';
import { Text } from '../../../../Text';
import { View } from '../../../../View';
import { Transition } from '../Transition/Transition';
import { isDecrementing } from './utils/isDecrementing';

interface SymbolProps {
  /** The symbol (character or string) to be displayed by the component. */
  symbol: string;
  /**
   * Determines whether an animation is played when the component is first mounted.
   * If true, the component animates on initial render. Defaults to false.
   */
  enableInitialAnimation?: boolean;
  /**
   * A boolean that determines the animation direction. If true, the animation
   * direction is 'goingUp'. If false, the animation direction is 'goingDown'.
   */
  inverted: boolean;
}

interface SymbolState {
  /**
   * Stores the previous value of the symbol. It is used to determine the transition
   * when the symbol changes. It's null when there is no previous value.
   */
  previous: string | null;

  /**
   * Indicates whether the symbol value is decrementing. This can influence the animation
   * or transition style when the symbol value changes.
   */
  decrementing: boolean;

  /**
   * A flag to track if the component is being rendered for the first time. This can be
   * used to control initial animations or other setup behavior specific to the first render.
   */
  initialRender: boolean;
}

/**
 * A React component that represents a symbol. It handles animations and transitions
 * when the symbol value changes. The component is capable of displaying different
 * animations based on whether the symbol is incrementing or decrementing. It also
 * supports initial animation on first mount.
 */
export class Symbol extends Component<SymbolProps, SymbolState> {
  private _ref = createRef<HTMLSpanElement>();

  constructor(props: SymbolProps) {
    super(props);

    this.state = {
      previous: null,
      decrementing: false,
      initialRender: true,
    };

    this._removePrevious = this._removePrevious.bind(this);
  }

  public override componentDidMount(): void {
    this._ref.current?.addEventListener('transitionend', this._removePrevious);
  }

  // FIXME: Fix deprecated
  public override UNSAFE_componentWillReceiveProps(nextProps: SymbolProps): void {
    if (nextProps.symbol !== this.props.symbol) {
      const decrementing = isDecrementing(this.props.symbol, nextProps.symbol);

      this.setState({
        previous: this.props.symbol,
        decrementing: nextProps.inverted ? !decrementing : decrementing,
        initialRender: false,
      });
    }
  }

  public override shouldComponentUpdate(nextProps: SymbolProps, nextState: SymbolState): boolean {
    return nextProps.symbol !== this.props.symbol || nextState.previous !== this.state.previous;
  }

  public override componentWillUnmount(): void {
    this._ref.current?.removeEventListener('transitionend', this._removePrevious);
  }

  /**
   * Clears the 'previous' state property.
   *
   * This method sets the 'previous' state to null, effectively removing any
   * previously stored value. It is typically used to reset the component's
   * state in preparation for new data or as part of a state transition.
   */
  private _removePrevious(): void {
    this.setState({
      previous: null,
    });
  }

  /**
   * Renders a spacer element.
   *
   * This method returns a visual spacer element, typically used for adding space
   * between elements in the UI. It could return any valid React node that serves
   * as a spacer, such as a div with certain styles applied.
   *
   * @returns {ReactNode} A React node that functions as a spacer in the UI layout.
   */
  private _renderSpacer = (): ReactNode => {
    const { symbol } = this.props;
    return (
      <Text tagName="span" style={{ visibility: 'hidden' }}>
        {symbol}
      </Text>
    );
  };

  /**
   * Renders the transition for the current symbol.
   *
   * This method creates a Transition component for the current symbol. It determines
   * whether to animate the entrance based on the initial render state and the
   * `enableInitialAnimation` prop. It also sets the direction of the animation
   * based on the `decrementing` state.
   */
  private _renderTransitionIn = (): ReactNode => {
    return (
      <Transition
        symbol={this.props.symbol}
        goingUp={this.state.decrementing}
        animateEntrance={this.state.initialRender ? this.props.enableInitialAnimation : true}
        key={this.props.symbol}
      />
    );
  };

  /**
   * Renders the transition for the previous symbol.
   *
   * This method creates a Transition component for the previous symbol, used when
   * the symbol changes. It only renders if there is a previous symbol to transition from.
   * The animation direction is based on the `decrementing` state, and the `out` prop
   * signifies the transition is for an outgoing symbol.
   */
  private _renderTransitionOut = (): ReactNode => {
    if (this.state.previous !== null) {
      return (
        <Transition symbol={this.state.previous} goingUp={this.state.decrementing} out key={this.state.previous} />
      );
    }

    return null;
  };

  public override render(): ReactNode {
    return (
      <View tagName="span" ref={this._ref} style={{ position: 'relative', display: 'inline-block' }}>
        {this._renderSpacer()}
        {this._renderTransitionIn()}
        {this._renderTransitionOut()}
      </View>
    );
  }
}
