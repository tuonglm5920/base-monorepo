import { dequal } from 'dequal';
import { WebAnimationApi } from 'utilities';

export interface ConfigOfWebAnimationApiInstance {
  readonly _keyframes: Keyframe[];
  readonly _options: KeyframeEffectOptions | undefined;
}

/**
 * Manages instances of WebAnimationApi. It provides functionality to create, retrieve,
 * and delete instances associated with animation objects.
 */
export class WebAnimationApiInstancesManager {
  /** A WeakMap holding instances of WebAnimationApi associated with ConfigOfWebAnimationApiInstance. */
  private _instances = new WeakMap<ConfigOfWebAnimationApiInstance, WebAnimationApi>();

  /**
   * Retrieves the WebAnimationApi instance associated with the given ConfigOfWebAnimationApiInstance.
   *
   * @param {ConfigOfWebAnimationApiInstance} [target] - The ConfigOfWebAnimationApiInstance whose instance is to be retrieved.
   * @returns {WebAnimationApi | undefined} The WebAnimationApi instance if found, otherwise undefined.
   */
  public getInstanceByConfig = (target?: ConfigOfWebAnimationApiInstance): WebAnimationApi | undefined => {
    return target ? this._instances.get(target) : undefined;
  };

  /**
   * Deletes the WebAnimationApi instance associated with the given ConfigOfWebAnimationApiInstance.
   * It also cancels the animation if it is currently running.
   *
   * @param {ConfigOfWebAnimationApiInstance} target - The ConfigOfWebAnimationApiInstance whose instance is to be deleted.
   */
  public deleteInstanceByConfig = (target: ConfigOfWebAnimationApiInstance): void => {
    this.getInstanceByConfig(target)?.cancel();
    this._instances.delete(target);
  };

  /**
   * Creates a new instance of WebAnimationApi for the given Element and ConfigOfWebAnimationApiInstance.
   * If a previous instance exists and the target objects are equal, the previous instance is reused.
   * Otherwise, the previous instance is cancelled and a new instance is created and stored.
   *
   * @param {Element} el - The DOM element to which the animation will be applied.
   * @param {ConfigOfWebAnimationApiInstance} target - The new ConfigOfWebAnimationApiInstance for which the instance is to be created.
   * @param {ConfigOfWebAnimationApiInstance} [prevTarget] - The previous ConfigOfWebAnimationApiInstance. Used to check for reusable instances.
   * @returns {WebAnimationApi} The created or reused WebAnimationApi instance.
   */
  public createInstance = (
    el: Element,
    target: ConfigOfWebAnimationApiInstance,
    prevTarget: ConfigOfWebAnimationApiInstance | undefined,
  ): WebAnimationApi => {
    const prevWebAnimationApiInstance = prevTarget && this.getInstanceByConfig(prevTarget);

    if (prevWebAnimationApiInstance) {
      this._instances.delete(prevTarget);

      // Reuse animation if possible
      if (dequal(target, prevTarget)) {
        this._instances.set(target, prevWebAnimationApiInstance);
        return prevWebAnimationApiInstance;
      }
      prevWebAnimationApiInstance.cancel();
    }

    const webAnimationApiInstance = new WebAnimationApi(el, target._keyframes, target._options);
    this._instances.set(target, webAnimationApiInstance);
    return webAnimationApiInstance;
  };
}
