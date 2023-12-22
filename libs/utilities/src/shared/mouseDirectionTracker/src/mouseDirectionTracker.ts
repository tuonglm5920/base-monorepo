import { getPassiveArg } from '../../getPassiveArg';

/**
 * Defines the potential placements of the mouse relative to an element.
 * @type {'top' | 'right' | 'bottom' | 'left'}
 */
type Placement = 'top' | 'right' | 'bottom' | 'left';

/**
 * MouseDirectionTracker class is responsible for tracking the direction of mouse
 * enter and leave events on a given HTML element.
 * FIXME: Should it have "onUpdate" props ?
 */
export class MouseDirectionTracker {
  /** The HTML element to which the mouse events are attached. */
  private _$el: HTMLElement;

  constructor($el: HTMLElement) {
    this._$el = $el;
  }

  /** Handles mouse hover events, calculating and returning the mouse direction. */
  private _handleHover = (event: MouseEvent): void => {
    const { offsetX, offsetY, currentTarget } = event;
    let placement: Placement;
    if (currentTarget) {
      const { clientWidth, clientHeight } = currentTarget as HTMLElement;
      const condX = clientWidth - offsetX > clientWidth / 2 ? offsetX : clientWidth - offsetX;
      const condY = clientHeight - offsetY > clientHeight / 2 ? offsetY : clientHeight - offsetY;
      if (condY < condX) {
        if (offsetY <= clientHeight / 2) {
          placement = 'top';
        } else {
          placement = 'bottom';
        }
      } else {
        if (offsetX <= clientWidth / 2) {
          placement = 'left';
        } else {
          placement = 'right';
        }
      }
      this._$el.setAttribute('data-placement', placement);
    }
  };

  /** Attaches mouseenter and mouseleave event listeners to the HTML element. */
  public on = (): void => {
    this._$el.addEventListener('mouseenter', this._handleHover, getPassiveArg());
    this._$el.addEventListener('mouseleave', this._handleHover, getPassiveArg());
  };

  /** Removes mouseenter and mouseleave event listeners from the HTML element. */
  public off = (): void => {
    this._$el.removeEventListener('mouseenter', this._handleHover);
    this._$el.removeEventListener('mouseleave', this._handleHover);
  };

  //#region For testing
  public getHandleHoverForTesting = (): typeof this._handleHover => {
    return this._handleHover;
  };
  //#endregion
}
