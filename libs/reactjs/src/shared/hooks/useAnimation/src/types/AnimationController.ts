import { AnyRecord } from 'typescript-utilities';
import { PlayOptionsWithArgs } from './PlayOptionsWithArgs';
import { WaitingAnimationEventName } from './WaitingAnimationEventName';

/**
 * Base actions of controller
 */
export interface BaseAnimationController<Args extends AnyRecord | void> {
  /** A wrapper of Web Animations API's [play](https://developer.mozilla.org/en-US/docs/Web/API/Animation/play). It's similar to GSAP's `play()`. */
  play(option: PlayOptionsWithArgs<Args>): void;
  /** A wrapper of Web Animations API's [reverse](https://developer.mozilla.org/en-US/docs/Web/API/Animation/reverse). It's similar to GSAP's `reverse()`. */
  reverse(): void;
  /** A wrapper of Web Animations API's [cancel](https://developer.mozilla.org/en-US/docs/Web/API/Animation/cancel). It's similar to GSAP's `kill()`. */
  cancel(): void;
  /** A wrapper of Web Animations API's [finish](https://developer.mozilla.org/en-US/docs/Web/API/Animation/finish). */
  finish(): void;
  /** A wrapper of Web Animations API's [pause](https://developer.mozilla.org/en-US/docs/Web/API/Animation/pause). It's similar to GSAP's `pause()`. */
  pause(): void;
  /**
   * A setter of Web Animations API's [currentTime](https://developer.mozilla.org/en-US/docs/Web/API/Animation/currentTime). It's similar to GSAP's `seek()`.
   *
   * If you pass function, you can get [endTime](https://developer.mozilla.org/en-US/docs/Web/API/AnimationEffect/getComputedTiming#return_value) from its argument.
   */
  setTime(time: number | ((endTime: number) => number)): void;
  /**
   * A wrapper of Web Animations API's [updatePlaybackRate](https://developer.mozilla.org/en-US/docs/Web/API/Animation/updatePlaybackRate). It's similar to GSAP's `timeScale()`.
   *
   * If you pass function, you can get current [playbackRate](https://developer.mozilla.org/en-US/docs/Web/API/Animation/playbackRate) from its argument.
   */
  setPlaybackRate(rate: number | ((prevRate: number) => number)): void;
  /**
   * A getter of Promise that will be resolved in specified timing.
   *
   * - `finished`: resolved when animation is finished and its playback direction is normal.
   * - `reverseFinished`: resolved when animation is finished and its playback direction is reversed.
   */
  waitFor(event: WaitingAnimationEventName): Promise<void> | void;
}

/** Controller of useAnimation. */
export interface AnimationController<Args extends AnyRecord | void> extends BaseAnimationController<Args> {
  /** You have to pass this callback to ref of element you want to control. */
  (ref: Element | null): void;
}
