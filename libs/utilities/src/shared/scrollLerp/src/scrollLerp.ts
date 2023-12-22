import { clamp } from 'ramda';
import { FramerData, FramersSchedule } from '../../framersSchedule';
import { getPassiveArg } from '../../getPassiveArg';
import { lerp } from './utils/lerp';

export interface ScrollLerpOptions {
  /** Starting scroll position or a function returning the starting position. */
  from: number | (() => number);
  /** Target scroll position or a function returning the target position. */
  to: number | (() => number);
  /** Optional easing value for the lerp transition, defaults to linear if not provided. */
  lerpEase?: number;
  /** Optional callback function called on each render frame with the current scroll value. */
  onRender?: (value: number) => void;
}

/** Default frames per second for the scroll animation. */
const DEFAULT_FPS = 60;
/** Time delta per frame in milliseconds. */
const DT_FPS = 1000 / DEFAULT_FPS;
/** Minimum scroll position value. */
const MIN = 0;
/** Maximum scroll position value. */
const MAX = 100;

/**
 * Represents a smooth scrolling effect with linear interpolation (lerp) between two points.
 * This class provides an easy way to create a smooth, eased scrolling effect on a webpage.
 * FIXME: Should it have "onScroll" or "onUpdate" props ?
 */
export class ScrollLerp {
  /** The HTML element on which the scroll effect is applied. */
  private _$el: HTMLElement;

  /** Configuration options for the scrolling behavior, such as start/end positions and easing. */
  private _options: ScrollLerpOptions;

  /** The current interpolated value of the scroll position. */
  private _currentValue: number;

  /** The target value towards which the scroll position is interpolating. */
  private _targetValue: number;

  /** Stores the original CSS style of the element to restore it upon destruction of this instance. */
  private _defaultStyle: string;

  /** Manages the scheduling and execution of frame updates for the smooth scrolling animation. */
  private _framersSchedule: FramersSchedule;

  /** The element on which the scrolling will be applied. It can be the browser window or any HTML element. */
  private _$targetElement: Window | HTMLElement;

  /**
   * Creates an instance of ScrollLerp.
   * @param {HTMLElement} $el - The HTML element on which the scroll effect is to be applied.
   * @param {ScrollLerpOptions} options - Configuration options for the scroll effect.
   * @param {Window | HTMLElement} $targetElement - The element on which the scrolling will be applied. It can be the browser window or any HTML element.
   */
  constructor({
    $el,
    $targetElement,
    options,
  }: {
    $el: HTMLElement;
    $targetElement?: Window | HTMLElement;
    options: ScrollLerpOptions;
  }) {
    this._$el = $el;
    this._$targetElement = $targetElement ?? window;
    this._options = options;
    this._currentValue = 0;
    this._targetValue = 0;
    this._defaultStyle = this._$el.style.cssText;
    this._framersSchedule = new FramersSchedule();
    this._framersSchedule.queue(this._handleRender, true);
  }

  /**
   * Retrieves the starting scroll position from the options, either as a value or a function result.
   * @returns {number} The starting scroll position.
   */
  private _getFrom = (): number => {
    const { from } = this._options;
    if (typeof from === 'function') {
      return from();
    }
    return from;
  };

  /**
   * Retrieves the target scroll position from the options, either as a value or a function result.
   * @returns {number} The target scroll position.
   */
  private _getTo = (): number => {
    const { to } = this._options;
    if (typeof to === 'function') {
      return to();
    }
    return to;
  };

  /**
   * Handles the rendering of each frame in the scroll animation.
   * @param {FramerData} frameData - Data about the current frame, including time delta.
   */
  private _handleRender = ({ delta }: FramerData): void => {
    const { lerpEase = 0.08, onRender } = this._options;
    const diff = Math.abs(this._targetValue - this._currentValue);

    // Don't update if difference is too low
    if (diff < 0.001) {
      return;
    }
    let slowDownFactor = delta / DT_FPS;
    const slowDownFactorRounded = Math.round(slowDownFactor);
    if (slowDownFactorRounded >= 1) {
      slowDownFactor = slowDownFactorRounded;
    }
    const value = lerp(this._currentValue, this._targetValue, lerpEase * slowDownFactor);
    onRender?.(value);
    this._currentValue = value;
  };

  /** Computes the current scroll position and updates the target value accordingly. */
  private _handleScroll = (): void => {
    const start = window.scrollY - this._getFrom();
    const end = this._getTo() - this._getFrom();
    const value = clamp(MIN, MAX, (start / end) * 100);
    if (value >= MIN && value <= MAX) {
      this._targetValue = value;
    }
  };

  /** Initializes the scroll lerp effect by setting up the necessary event listeners. */
  public create = (): void => {
    this._handleScroll();
    this._$targetElement.addEventListener('scroll', this._handleScroll, getPassiveArg());
  };

  /** Destroys the scroll lerp instance, removing any applied styles and event listeners. */
  public destroy = (): void => {
    if (this._$el) {
      this._$el.style.cssText = this._defaultStyle;
      this._framersSchedule.remove(this._handleRender);
    }
    this._$targetElement?.removeEventListener('scroll', this._handleScroll);
  };
}
