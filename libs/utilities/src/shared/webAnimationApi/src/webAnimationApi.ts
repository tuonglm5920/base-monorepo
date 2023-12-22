export interface PlayOptions {
  /** If true, plays from the start. It's similar to GSAP's `restart()`. */
  restart?: boolean;
}

/**
 * A utility class to simplify the usage of the Web Animations API. It provides methods
 * to create, control, and monitor the state of animations on DOM elements.
 *
 * The class encapsulates functionality for creating animations with keyframes and options,
 * and offers methods to control the playback of these animations, such as play, pause, reverse,
 * and finish. It also includes advanced control features like setting the playback rate
 * and current time of the animation. Additionally, it provides a method to wait for specific
 * animation events like finish or reverseFinish.
 */
export class WebAnimationApi {
  /**
   * The current animation instance. It is null if no animation is associated with the instance.
   * @type {Animation | null}
   */
  private _animation: Animation | null;

  constructor(
    el: Element | null,
    keyframes: Keyframe[] | null,
    options: KeyframeEffectOptions | undefined,
    timeline?: AnimationTimeline,
  ) {
    const modifiedOptions: KeyframeEffectOptions = {
      fill: 'both',
      ...options,
    };
    try {
      this._animation = new Animation(new KeyframeEffect(el, keyframes, modifiedOptions), timeline);
    } catch (e) {
      // Fallback to Element.animate()
      this._animation = el?.animate(keyframes, modifiedOptions) ?? null;
    }
  }

  /**
   * Sets the current time of the animation.
   * @param {number | ((endTime: number) => number)} arg - The new time to set, or a function that returns the new time.
   */
  public setTime(arg: number | ((endTime: number) => number)): void {
    if (!this._animation) {
      return;
    }
    const endTime = this._animation.effect?.getComputedTiming().endTime;
    if (endTime) {
      this._animation.currentTime = typeof arg === 'function' ? arg(Number(endTime)) : arg;
    }
  }

  /**
   * Updates the playback rate of the animation.
   * @param {number | ((prevRate: number) => number)} arg - The new rate to set, or a function that returns the new rate.
   */
  public setRate(arg: number | ((prevRate: number) => number)): void {
    if (!this._animation) {
      return;
    }
    this._animation.updatePlaybackRate(typeof arg === 'function' ? arg(this._animation.playbackRate) : arg);
  }

  /**
   * Returns a promise that resolves when the specified animation event occurs.
   * @param {'finish' | 'reverseFinish'} name - The name of the event to wait for.
   * @returns {Promise<void>} A promise that resolves when the event occurs.
   */
  public waitFor(name: 'finish' | 'reverseFinish'): Promise<void> {
    if (!this._animation) {
      return Promise.resolve();
    }

    return new Promise<void>(resolve => {
      if (this._animation) {
        const animation = this._animation;
        const handleFinish = (): void => {
          if (
            (name === 'finish' && animation.playbackRate > 0) ||
            (name === 'reverseFinish' && animation.playbackRate < 0)
          ) {
            animation?.removeEventListener('finish', handleFinish);
            resolve();
          }
        };
        this._animation.addEventListener('finish', handleFinish);
      }
    });
  }

  /** Reverses the playback direction of the animation. */
  public reverse(): void {
    this._animation?.reverse();
  }

  /** Cancels the animation, resetting it to its initial state. */
  public cancel(): void {
    this._animation?.cancel();
  }

  /** Forces the animation to jump to its end state and finish. */
  public finish(): void {
    this._animation?.finish();
  }

  /** Pauses the animation. */
  public pause(): void {
    this._animation?.pause();
  }

  /**
   * Starts or resumes the animation.
   * @param {PlayOptions} opts - Options for playing the animation.
   */
  public play(opts: PlayOptions): void {
    if (!this._animation) {
      return;
    }

    // Reset reversed playback direction if completed
    if (this._animation.playbackRate < 0 && this._animation.playState === 'finished') {
      this.setRate(p => -p);
    }
    if (opts.restart) {
      this.setTime(0);
    }
    this._animation.play();
  }

  //#region For testing
  public getAnimationForTesting = (): typeof this._animation => {
    return this._animation;
  };
  //#endregion
}
