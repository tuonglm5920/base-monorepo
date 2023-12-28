import { getPassiveArg } from '../../getPassiveArg';

export interface Options {
  /** Time taken for the animation in milliseconds */
  time: number;
  /** Padding around the image */
  padding: number;
  /** Offset from the top when to close the viewer */
  offset: number;
  /** Enable/disable keyboard interaction */
  keyboard: boolean;
  /** Cubic bezier for animation */
  cubicBezier: string;
  /** Background color for the viewer */
  background: string;
  /** Background filter for the viewer */
  backgroundFilter: string;
  /** Z-index for the viewer */
  zIndex: number;
  /** A function to be executed before showing the image viewer. */
  beforeShow: (() => void) | undefined;
  /** A function to be executed after showing the image viewer. */
  afterShow: (() => void) | undefined;
  /** A function to be executed before hiding the image viewer. */
  beforeHide: (() => void) | undefined;
  /** A function to be executed after hiding the image viewer. */
  afterHide: (() => void) | undefined;
  /** Function to extract source attribute from the target image element */
  getSrcAttribute: (target: HTMLImageElement) => string;
}

/**
 * Simple image zoom library inspired by Medium's Zoom.js.
 * LightenseImage creates an interactive image viewer that allows users to view images
 * with zooming capability and additional interaction functionalities.
 */
export class LightenseImage {
  /** Unique identifier for each instance */
  private static _uid: number = 0;
  /** CSS class name for the target element */
  private static _targetClassName: string = `lightense-target-${LightenseImage._uid}`;
  /** CSS class name for the wrapper element */
  private static _wrapClassName: string = `lightense-wrap-${LightenseImage._uid}`;
  /** CSS class name for the animating open */
  private static _animatingClassName: string = `lightense-transitioning-${LightenseImage._uid}`;
  /** CSS class name for the open viewer */
  private static _isOpenClassName: string = `lightense-open-${LightenseImage._uid}`;
  /** CSS class name for the backdrop element */
  private static _backdropClassName: string = `lightense-backdrop-${LightenseImage._uid}`;
  /** Options for configuring the viewer */
  private _options: Options;
  /** The target image element */
  private _$targetEl: HTMLImageElement;
  /** Container element for the viewer */
  private _$containerEl: HTMLDivElement;
  /** Wrapper element for the image */
  private _$wrapEl: HTMLDivElement;
  /** Image element within the viewer */
  private _$imageEl: HTMLImageElement;
  /** Style element used for dynamic CSS */
  private _$styleEl: HTMLStyleElement;
  /** Reference to the document's head element */
  private _$headEl: HTMLHeadElement = document.head || document.getElementsByTagName('head')[0];
  /** Previous scroll Y position */
  private _previousScrollY: number = window.scrollY;
  /** Scaling factor for the image */
  private _scaleFactor: number = 0;
  /** X-axis translation value */
  private _translateX: number = 0;
  /** Y-axis translation value */
  private _translateY: number = 0;

  constructor({ options, target }: { target: HTMLImageElement; options: Partial<Options> }) {
    this._$targetEl = target;
    this._options = {
      time: options.time ?? 300,
      padding: options.padding ?? 40,
      offset: options.offset ?? 40,
      keyboard: options.keyboard ?? true,
      cubicBezier: options.cubicBezier ?? 'cubic-bezier(.2, 0, .1, 1)',
      background: options.background ?? 'var(--bg-color-80, rgba(255, 255, 255, .98))',
      backgroundFilter: options.backgroundFilter ?? 'blur(30px)',
      zIndex: options.zIndex ?? 1000000,
      getSrcAttribute: options.getSrcAttribute ?? ((target): string => target.src),
      afterHide: options.afterHide ?? ((): void => undefined),
      afterShow: options.afterShow ?? ((): void => undefined),
      beforeHide: options.beforeHide ?? ((): void => undefined),
      beforeShow: options.beforeShow ?? ((): void => undefined),
    };

    // Create $containerEl
    this._$containerEl = document.createElement('div');
    this._$containerEl.className = LightenseImage._backdropClassName;
    document.body.appendChild(this._$containerEl);

    // Create $wrapEl
    this._$wrapEl = document.createElement('div');
    this._$wrapEl.className = LightenseImage._wrapClassName;

    // Create $imgEl
    this._$imageEl = new Image();
    this._$imageEl.onload = (): void => {
      this._calculateTransform();
      this._createViewer();
      this._bindCloseEvents();
    };

    // Create _$styleEl
    LightenseImage._uid++;
    this._$styleEl = document.createElement('style');
    this._$styleEl.setAttribute('id', `lightense-images-${LightenseImage._uid}`);
    this._$styleEl.textContent = `
    :root {
      --lightense-z-index: ${this._options.zIndex - 1};
      --lightense-backdrop: ${this._options.background};
      --lightense-duration: ${this._options.time}ms;
      --lightense-timing-func: ${this._options.cubicBezier};
    }

    .${LightenseImage._backdropClassName} {
      box-sizing: border-box;
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      overflow: hidden;
      z-index: calc(var(--lightense-z-index) - 1);
      padding: 0;
      margin: 0;
      transition: opacity var(--lightense-duration) ease;
      cursor: zoom-out;
      opacity: 0;
      background-color: var(--lightense-backdrop);
      visibility: hidden;
    }

    @supports (-webkit-backdrop-filter: blur(30px)) {
      .${LightenseImage._backdropClassName} {
        background-color: var(--lightense-backdrop);
        -webkit-backdrop-filter: var(--lightense-backdrop-filter);
      }
    }

    @supports (backdrop-filter: blur(30px)) {
      .${LightenseImage._backdropClassName} {
        background-color: var(--lightense-backdrop);
        backdrop-filter: var(--lightense-backdrop-filter);
      }
    }

    .${LightenseImage._wrapClassName} {
      position: relative;
      transition: transform var(--lightense-duration) var(--lightense-timing-func);
      z-index: var(--lightense-z-index);
      pointer-events: none;
    }

    .${LightenseImage._targetClassName} {
      cursor: zoom-in;
      transition: transform var(--lightense-duration) var(--lightense-timing-func);
      pointer-events: auto;
    }

    .${LightenseImage._isOpenClassName} {
      cursor: zoom-out;
    }

    .${LightenseImage._animatingClassName} {
      pointer-events: none;
    }
    `;
  }

  /**
   * Method responsible for creating and displaying the image viewer.
   * It sets up the necessary elements and applies animations to display the image.
   */
  private _createViewer = (): void => {
    this._$targetEl.classList.add(LightenseImage._isOpenClassName);

    // Apply zoom ratio to target image
    setTimeout(() => {
      this._$targetEl.style.transform = 'scale(' + this._scaleFactor + ')';
    }, 20);

    // Apply animation to outer wrapper
    this._$targetEl.parentNode?.insertBefore(this._$wrapEl, this._$targetEl);
    this._$wrapEl.appendChild(this._$targetEl);
    setTimeout(() => {
      this._$wrapEl.style.transform = 'translate3d(' + this._translateX + 'px, ' + this._translateY + 'px, 0)';
    }, 20);

    this._$containerEl.style.visibility = 'visible';
    setTimeout(() => {
      this._$containerEl.style.opacity = '1';
    }, 20);
  };

  /**
   * Calculates the transformation parameters required to display the image properly within the viewer.
   * Computes scaling factor, translation values, and positioning based on viewport and image dimensions.
   */
  private _calculateTransform = (): void => {
    /**
     * Logic
      - Get original DOMRect of target element
      - Get center coordinates & scale factor when open viewer
      - "Transition" will take responsibily of animation
     */
    // Get original image size
    const naturalWidth = this._$imageEl.width;
    const naturalHeight = this._$imageEl.height;

    // Calc zoom ratio
    const scrollTop = window.scrollY || document.documentElement.scrollTop || 0;
    const scrollLeft = window.scrollX || document.documentElement.scrollLeft || 0;
    const targetImage = this._$targetEl.getBoundingClientRect();
    const maxScaleFactor = naturalWidth / targetImage.width;
    const viewportWidth = window.innerWidth || document.documentElement.clientWidth || 0;
    const viewportHeight = window.innerHeight || document.documentElement.clientHeight || 0;
    const viewportPadding = this._options.padding;
    const viewportWidthOffset =
      viewportWidth > viewportPadding ? viewportWidth - viewportPadding : viewportWidth - this._options.padding;
    const viewportHeightOffset =
      viewportHeight > viewportPadding ? viewportHeight - viewportPadding : viewportHeight - this._options.padding;
    const imageRatio = naturalWidth / naturalHeight;
    const viewportRatio = viewportWidthOffset / viewportHeightOffset;

    if (naturalWidth < viewportWidthOffset && naturalHeight < viewportHeightOffset) {
      this._scaleFactor = maxScaleFactor;
    } else if (imageRatio < viewportRatio) {
      this._scaleFactor = (viewportHeightOffset / naturalHeight) * maxScaleFactor;
    } else {
      this._scaleFactor = (viewportWidthOffset / naturalWidth) * maxScaleFactor;
    }

    // Calc animation
    const viewportX = viewportWidth / 2;
    const viewportY = scrollTop + viewportHeight / 2;
    const imageCenterX = targetImage.left + scrollLeft + targetImage.width / 2;
    const imageCenterY = targetImage.top + scrollTop + targetImage.height / 2;

    this._translateX = Math.round(viewportX - imageCenterX);
    this._translateY = Math.round(viewportY - imageCenterY);
  };

  /**
   * Invokes custom hook methods based on the provided method name.
   * Executes corresponding before/after actions based on the method name passed.
   */
  private _invokeCustomHook = (methodName: keyof typeof this._options): void => {
    const method = this._options[methodName];

    if (typeof method !== 'function') {
      return;
    }

    Reflect.apply(method, this._options, [this._options]);
  };

  /** Exit on excape (esc) key pressed */
  private _onKeyUp = (event: KeyboardEvent): void => {
    event.preventDefault();
    if (event.keyCode === 27) {
      this._removeViewer();
    }
  };

  /**
   * Checks the state of the viewer and performs necessary actions if certain conditions are met.
   * This method verifies and manages the status of the viewer based on scroll offset or other criteria.
   */
  private _checkViewer = (): void => {
    const scrollOffset = Math.abs(this._previousScrollY - window.scrollY);
    if (scrollOffset >= this._options.offset) {
      this._removeViewer();
    }
  };

  /**
   * Removes the image viewer and its associated elements from the DOM.
   * Handles the process of removing the viewer after it's been displayed.
   */
  private _removeViewer = (): void => {
    if (!this._$wrapEl || !this._$containerEl) {
      return;
    }

    this._invokeCustomHook('beforeHide');
    this._unbindCloseEvents();

    this._$targetEl.classList.remove(LightenseImage._isOpenClassName);

    // Remove transform styles
    this._$wrapEl.style.transform = '';
    this._$targetEl.style.transform = '';
    this._$targetEl.classList.add(LightenseImage._animatingClassName);

    // Fadeout backdrop
    this._$containerEl.style.opacity = '';

    // Hide backdrop and remove target element wrapper
    setTimeout(() => {
      this._invokeCustomHook('afterHide');
      this._$containerEl.style.visibility = '';
      this._$containerEl.style.backgroundColor = '';
      this._$wrapEl.parentNode?.replaceChild(this._$targetEl, this._$wrapEl);
      this._$targetEl.classList.remove(LightenseImage._animatingClassName);
    }, this._options.time);
  };

  /**
   * Binds event listeners for closing or hiding the image viewer.
   * Manages the setup of event handlers to respond to user actions for viewer dismissal.
   */
  private _bindCloseEvents = (): void => {
    window.addEventListener('keyup', this._onKeyUp, false);
    window.addEventListener('scroll', this._checkViewer, false);
    this._$containerEl.addEventListener('click', this._removeViewer, false);
  };

  /**
   * Unbinds event listeners associated with closing or hiding the image viewer.
   * Manages the removal of event handlers set up to respond to user actions for viewer dismissal.
   */

  private _unbindCloseEvents = (): void => {
    window.removeEventListener('keyup', this._onKeyUp);
    window.removeEventListener('scroll', this._checkViewer);
    this._$containerEl?.removeEventListener('click', this._removeViewer);
  };

  /**
   * Toggles the visibility of the image viewer based on user interaction.
   * Handles showing or hiding the viewer in response to specific user actions.
   */
  private _toggle = (event: MouseEvent): void => {
    if (this._options.keyboard) {
      // If Command (macOS) or Ctrl (Windows) key pressed, stop processing
      // and open the image in a new tab
      if (event.metaKey || event.ctrlKey) {
        window.open(this._options.getSrcAttribute(this._$targetEl), '_blank');
        return;
      }
    }

    // If element already openned, close it
    if (this._$targetEl.classList.contains(LightenseImage._isOpenClassName)) {
      return this._removeViewer();
    }

    // Setup animation
    const onTransitionend = (): void => {
      this._invokeCustomHook('afterShow');
      this._$targetEl.removeEventListener('transitionend', onTransitionend);
    };
    this._invokeCustomHook('beforeShow');
    this._$targetEl.addEventListener('transitionend', onTransitionend, getPassiveArg());
    // Load image
    this._$imageEl.src = this._options.getSrcAttribute(this._$targetEl);
  };

  /**
   * Handles actions when the window is resized.
   * Checks if the image viewer is open and performs necessary actions upon window resize.
   */
  private _handleResizeWindow = (): void => {
    if (this._$targetEl.classList.contains(LightenseImage._isOpenClassName)) {
      this._removeViewer();
    }
  };

  /**
   * Initializes the image viewer by setting up required event listeners and styles.
   * Handles the setup necessary for displaying and interacting with the image viewer.
   */
  public create = (): void => {
    this._bindCloseEvents();
    this._$headEl.appendChild(this._$styleEl);
    this._$targetEl.classList.add(LightenseImage._targetClassName);
    this._$targetEl.addEventListener('click', this._toggle, getPassiveArg());
    window.addEventListener('resize', this._handleResizeWindow, getPassiveArg());
  };

  /**
   * Destroys the image viewer and cleans up associated event listeners and DOM elements.
   * Handles the removal and cleanup of the image viewer from the Document Object Model (DOM).
   */
  public destroy = (): void => {
    this._removeViewer();
    this._unbindCloseEvents();
    this._$headEl.removeChild(this._$styleEl);
    this._$targetEl.classList.remove(LightenseImage._targetClassName);
    this._$targetEl.removeEventListener('click', this._toggle);
    window.removeEventListener('resize', this._handleResizeWindow);
  };
}
