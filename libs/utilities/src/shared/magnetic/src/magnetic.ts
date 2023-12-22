import { throttle } from 'lodash';
import { getPassiveArg } from '../../getPassiveArg';
import { SpringAnimator } from '../../springAnimator';

/** Represents a magnetic effect on an HTML element that responds to mouse movement. */
export class Magnetic {
  /** Holds the SpringAnimator instance for managing animations. */
  private _springAnimatorInstance: SpringAnimator;
  /** Represents the throttled mouse movement function. */
  private _throttledMouseMove: ((event: MouseEvent) => void) | undefined;
  /** Represents the HTML element associated with the magnetic effect. */
  private _$el: HTMLElement;
  /** Represents the dimensions and position of the HTML element. */
  private _rect: DOMRect;
  /** Represents the center coordinates of the HTML element. */
  private _center: { x: number; y: number };
  /** Represents the maximum distance in the X-axis from the center. */
  private _maxDistanceX: number;
  /** Represents the maximum distance in the Y-axis from the center. */
  private _maxDistanceY: number;
  /** Indicates whether the instance is being destroyed. */
  private _destroying: boolean = false;
  /** Callback function triggered on each animation tick. */
  private _onTick: (() => void) | null = null;

  constructor($el: HTMLElement) {
    this._springAnimatorInstance = new SpringAnimator({
      names: ['x', 'y'],
      acceleration: 0.1,
      friction: 0.4,
    });

    this._$el = $el;
    this._rect = this._$el.getBoundingClientRect();

    this._center = {
      x: this._rect.x + window.scrollX + this._$el.offsetWidth / 2,
      y: this._rect.y + window.scrollY + this._$el.offsetHeight / 2,
    };

    this._maxDistanceX = this._$el.offsetWidth / 2;
    this._maxDistanceY = this._$el.offsetWidth / 2;
  }

  /**
   * Handles the mouse movement event to calculate distance and update the rendering accordingly.
   * @param event - The MouseEvent object containing mouse coordinates.
   */
  private _mouseMove = (event: MouseEvent): void => {
    const distance = this._getDistance(event.clientX + window.scrollX, event.clientY + window.scrollY);
    this._render(
      distance,
      -1 * (this._center.x - event.clientX - window.scrollX),
      -1 * (this._center.y - event.clientY - window.scrollY),
    );
  };

  /**
   * Calculates the distance between two points using the Euclidean formula.
   * @param x - The x-coordinate of the target point.
   * @param y - The y-coordinate of the target point.
   * @returns The distance between the target point and the center point of the element.
   */
  private _getDistance = (x: number, y: number): number => {
    return Math.round(Math.sqrt(Math.pow(this._center.x - x, 2) + Math.pow(this._center.y - y, 2)));
  };

  /**
   * Renders the element's movement based on mouse coordinates within defined maximum distances.
   * @param _distance - The calculated distance from the center of the element.
   * @param x - The horizontal distance between the cursor and the element's center.
   * @param y - The vertical distance between the cursor and the element's center.
   */
  private _render = (_distance: number, x: number, y: number): void => {
    if (Math.abs(x) < this._maxDistanceX && Math.abs(y) < this._maxDistanceY) {
      const percentX = x / this._maxDistanceX;
      const percentY = y / this._maxDistanceY;

      this._springAnimatorInstance.animate({
        name: 'x',
        num: Math.round(20 * percentX),
      });
      this._springAnimatorInstance.animate({
        name: 'y',
        num: Math.round(20 * percentY),
      });
    } else {
      this._springAnimatorInstance.animate({ name: 'x', num: 0 });
      this._springAnimatorInstance.animate({ name: 'y', num: 0 });
    }
  };

  /** Initializes the Magnetic effect by setting up event listeners and animation handlers. */
  public create = (): void => {
    this._throttledMouseMove = throttle(this._mouseMove);
    window.addEventListener('mousemove', this._throttledMouseMove, getPassiveArg());

    this._springAnimatorInstance.on({
      event: 'tick',
      handler: instances => {
        const translate = `translate3d(${instances['x'].current}px, ${instances['y'].current}px, 0)`;
        const rotateY = `rotateY(${instances['x'].current / 2}deg)`;
        const rotateX = `rotateX(${instances['y'].current / 2}deg)`;
        this._$el.style.transform = `${translate} ${rotateY} ${rotateX}`;
        this._onTick && this._onTick();
      },
    });

    this._springAnimatorInstance.on({
      event: 'end',
      handler: () => {
        if (this._destroying) {
          this._$el.style.transform = '';
        }
      },
    });
  };

  /** Destroys the Magnetic effect by removing event listeners and stopping animations. */
  public destroy = (): void => {
    if (this._throttledMouseMove) {
      window.removeEventListener('mousemove', this._throttledMouseMove);
      this._destroying = true;
      this._springAnimatorInstance.animate({ name: 'x', num: 0 });
      this._springAnimatorInstance.animate({ name: 'y', num: 0 });
    }
  };
}
