import classNames from 'classnames';
import { HTMLAttributes, PureComponent, ReactNode } from 'react';
import { createResizeObserver } from 'utilities';
import { View } from '../../View';

export interface Props {
  /** #### Height of the canvas */
  height: number;
  /** #### Two colors to create the gradient */
  gradient: [string, string];
  /** #### Animation speed */
  speed: number;
  /** #### Enable or disable animation */
  animation: boolean;
  /** #### Class of the tag initiating the component */
  containerClassName: string;
  /** #### Native properties for the container, excluding 'className', 'ref', 'width', and 'height' */
  containerNativeProps: Omit<HTMLAttributes<HTMLCanvasElement>, 'className' | 'ref' | 'width' | 'height'>;
}

interface State {
  canvasWidth: number;
  canvasHeight: number;
}
export class CanvasWave extends PureComponent<Props, State> {
  public static defaultProps: Partial<Props> = {
    height: 400,
    gradient: ['#f06292', '#f97f5f'],
    speed: 50,
    animation: true,
    containerClassName: '',
    containerNativeProps: {},
  };

  private _opacity = [0.2, 0.4, 1];

  private _canvasAnimationFrame = -Infinity;

  private _ctx: CanvasRenderingContext2D | null = null;

  private _$canvas: HTMLCanvasElement | null = null;

  private _resizeObserver: ReturnType<typeof createResizeObserver> | null = null;

  constructor(props: Props) {
    super(props);
    const { height } = this.props;
    this.state = {
      canvasWidth: window.innerWidth,
      canvasHeight: height,
    };
  }

  public override componentDidMount(): void {
    if (this._$canvas) {
      this._ctx = this._$canvas.getContext('2d');
      if (this._ctx && this._resizeObserver) {
        this._handleAnimation();
        this._resizeObserver.addListener(this._handleResize);
      }
    }
  }

  public override componentWillUnmount(): void {
    window.cancelAnimationFrame(this._canvasAnimationFrame);
    this._resizeObserver?.removeListener(this._handleResize);
  }

  private _handleResize = (): void => {
    this.setState({
      canvasWidth: window.innerWidth,
    });
  };

  private _getCanvasGradient = (): CanvasGradient | undefined => {
    if (this._ctx) {
      const { gradient } = this.props;
      const { canvasWidth } = this.state;
      const grd = this._ctx.createLinearGradient(0, 0, canvasWidth / 1, 0);
      grd.addColorStop(0, gradient[0]);
      grd.addColorStop(1, gradient[1]);
      return grd;
    }
    return;
  };

  private _draw = (offset: number): void => {
    if (this._ctx) {
      const { canvasWidth, canvasHeight } = this.state;
      const randomLeft = ((Math.sin(offset / 100) + 1) / 2) * 300;
      const randomRight = ((Math.sin(offset / 100 + 10) + 1) / 2) * 300;
      const randomLeftConstraint = ((Math.sin(offset / 60 + 2) + 1) / 2) * 300;
      const randomRightConstraint = ((Math.sin(offset / 60 + 1) + 1) / 2) * 300;
      this._ctx.beginPath();
      this._ctx.moveTo(0, randomLeft);
      this._ctx.bezierCurveTo(
        canvasWidth / 3,
        randomLeftConstraint,
        (canvasWidth / 3) * 2,
        randomRightConstraint,
        canvasWidth,
        randomRight + 100,
      );
      this._ctx.lineTo(canvasWidth, canvasHeight);
      this._ctx.lineTo(0, canvasHeight);
      this._ctx.lineTo(0, randomLeft + 100);
      this._ctx.closePath();
      this._ctx.fill();
    }
  };

  private _handleAnimation = (): void => {
    if (this._ctx) {
      const { speed, animation } = this.props;
      const { canvasWidth, canvasHeight } = this.state;
      const date = new Date();
      const timestamp = date.getTime();
      this._ctx.clearRect(0, 0, canvasWidth, canvasHeight);
      for (let i = 0; i < this._opacity.length; i += 1) {
        this._ctx.fillStyle = this._getCanvasGradient() as CanvasGradient;
        this._ctx.globalAlpha = this._opacity[i];
        this._draw((timestamp / speed) * 3 + i * Math.PI * 4);
      }
      if (animation) {
        this._canvasAnimationFrame = window.requestAnimationFrame(() => {
          this._handleAnimation();
        });
      }
    }
  };

  private _setCanvasRef = (node: HTMLCanvasElement | null): void => {
    if (node) {
      this._$canvas = node;
      this._resizeObserver = createResizeObserver();
    }
  };

  public override render(): ReactNode {
    const { canvasWidth, canvasHeight } = this.state;
    const { containerClassName, containerNativeProps } = this.props;
    return (
      <View
        tagName="canvas"
        {...containerNativeProps}
        className={classNames('CanvasWave__container', containerClassName)}
        ref={this._setCanvasRef}
        width={canvasWidth}
        height={canvasHeight}
      />
    );
  }
}
