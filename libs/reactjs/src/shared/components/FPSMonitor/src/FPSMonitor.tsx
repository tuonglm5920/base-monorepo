import { Component, ReactNode, CSSProperties } from 'react';
import { Text } from '../../Text';
import { View } from '../../View';

export interface Props {
  /** Determines if the FPS stats component is active and visible */
  isActive: boolean;

  /** Optional CSS value for the top position of the FPS stats component */
  top?: string;

  /** Optional CSS value for the bottom position of the FPS stats component */
  bottom?: string;

  /** Optional CSS value for the right position of the FPS stats component */
  right?: string;

  /** Optional CSS value for the left position of the FPS stats component */
  left?: string;

  /** RTL mode */
  rtl?: boolean;
}

interface State {
  /** Number of frames rendered since the last update */
  frames: number;

  /** Timestamp (in milliseconds) when the component was mounted or reset */
  startTime: number;

  /** Timestamp (in milliseconds) of the previous update */
  prevTime: number;

  /** Array storing the calculated FPS values */
  fps: number[];
}

const graphHeight = 29;
const graphWidth = 70;

const style: CSSProperties = {
  zIndex: 999999,
  position: 'fixed',
  height: '46px',
  width: `${graphWidth + 6}px`,
  padding: '3px',
  MozBoxSizing: 'border-box',
  WebkitBoxSizing: 'border-box',
  backgroundColor: '#000',
  color: '#00ffff',
  fontSize: '9px',
  lineHeight: '10px',
  fontFamily: 'Helvetica, Arial, sans-serif',
  fontWeight: 'bold',
  boxSizing: 'border-box',
  pointerEvents: 'none',
};

const graphStyle: CSSProperties = {
  position: 'absolute',
  left: '3px',
  right: '3px',
  bottom: '3px',
  height: `${graphHeight}px`,
  backgroundColor: '#282844',
  boxSizing: 'border-box',
};

/**
 * FPSStats is a React component that displays frames per second (FPS) statistics on the screen.
 * @example
 * return (
 *   <FPSStats isActive={true} top="10px" right="10px" />
 * )
 *
 * @prop {boolean} isActive - Determines whether the FPS stats are actively displayed.
 * @prop {string} [top] - Optional CSS value for top position of the component.
 * @prop {string} [bottom] - Optional CSS value for bottom position of the component.
 * @prop {string} [right] - Optional CSS value for right position of the component.
 * @prop {string} [left] - Optional CSS value for left position of the component.
 * @prop {boolean} [rtl] - RTL mode.
 *
 * @state {number} frames - The number of frames rendered since the last update.
 * @state {number} startTime - The timestamp when the component was mounted or reset.
 * @state {number} prevTime - The timestamp of the last update.
 * @state {number[]} fps - An array storing the calculated FPS values.
 */
export class FPSMonitor extends Component<Props, State> {
  public static defaultProps: Props = {
    isActive: true,
    top: 'auto',
    bottom: '5px',
    right: '5px',
    left: 'auto',
    rtl: false,
  };
  private _rafId: number | null = null;

  constructor(props: Props) {
    super(props);
    const currentTime = Date.now();
    this.state = {
      frames: 0,
      startTime: currentTime,
      prevTime: currentTime,
      fps: [],
    };
  }

  public override UNSAFE_componentWillMount = (): void => {
    const { top = '', right = '', bottom = '', left = '', rtl } = this.props;
    style.top = top;
    style.right = rtl ? left : right;
    style.bottom = bottom;
    style.left = rtl ? right : left;
    if (this._rafId) {
      cancelAnimationFrame(this._rafId);
    }
  };

  public override componentDidMount = (): void => {
    const { isActive } = this.props;
    if (!isActive) {
      return;
    }

    const onRequestAnimationFrame = (): void => {
      this._calcFPS();
      if (this._rafId) {
        window.cancelAnimationFrame(this._rafId);
      }
      this._rafId = window.requestAnimationFrame(onRequestAnimationFrame);
    };

    this._rafId = window.requestAnimationFrame(onRequestAnimationFrame);
  };

  public override shouldComponentUpdate = (_nextProps: Props, nextState: State): boolean => {
    const { fps } = this.state;
    return fps !== nextState.fps;
  };

  /**
   * Calculates the current frames per second (FPS) and updates the component state.
   * It computes the FPS based on the number of frames rendered since the last update
   * and the time elapsed. The method then updates the `fps` array in the component's state
   * to store the new FPS value. This method is intended to be called repeatedly
   * to constantly update the FPS measurement.
   */
  private _calcFPS = (): void => {
    const { fps, prevTime, frames } = this.state;
    const currentTime = Date.now();

    this.setState(prevState => ({
      frames: prevState.frames + 1,
    }));

    if (currentTime > prevTime + 1000) {
      this.setState({
        fps: [...fps, Math.round((frames * 1000) / (currentTime - prevTime))].slice(-graphWidth),
        frames: 0,
        prevTime: currentTime,
      });
    }
  };

  private _renderGraphItems = (): ReactNode => {
    const { rtl } = this.props;
    const { fps } = this.state;
    const maxFps = Math.max(...fps, 0);

    return fps.map((fpsRecord, i) => {
      const height = (graphHeight * fpsRecord) / maxFps;

      const graphItemStyle: CSSProperties = {
        position: 'absolute',
        bottom: '0',
        ...(rtl ? { right: `${fps.length - 1 - i}px` } : { left: `${fps.length - 1 - i}px` }),
        height: `${height}px`,
        width: '1px',
        backgroundColor: '#00ffff',
        boxSizing: 'border-box',
      };

      return <View key={`fps-${i}`} style={graphItemStyle} />;
    });
  };

  public override render(): ReactNode {
    const { fps } = this.state;
    const { isActive, rtl } = this.props;
    if (!isActive) {
      return null;
    }

    return (
      <View style={style}>
        <View
          style={{
            textAlign: rtl ? 'right' : 'left',
            direction: rtl ? 'rtl' : 'ltr',
          }}
        >
          <View tagName="span">{fps[fps.length - 1]}</View>
          <Text disableStrict> FPS</Text>
        </View>
        <View style={graphStyle}>
          {this._renderGraphItems()}
          <Text
            disableStrict
            style={{
              position: 'absolute',
              top: 0,
              direction: rtl ? 'rtl' : 'ltr',
              ...(rtl ? { left: 0 } : { right: 0 }),
            }}
          >
            T
          </Text>
        </View>
      </View>
    );
  }
}
