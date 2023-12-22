import { AnyRecord } from 'typescript-utilities';
import { WebAnimationApi } from 'utilities';
import { useLatestPropsRef } from '../../useLatestPropsRef';
import { useMount } from '../../useMount';
import { useOnce } from '../../useOnce';
import { AnimationController, BaseAnimationController } from './types/AnimationController';
import { AnimationDefinition } from './types/AnimationDefinition';
import { normalizeKeyframe } from './utils/normalizeKeyframe';
import {
  ConfigOfWebAnimationApiInstance,
  WebAnimationApiInstancesManager,
} from './utils/WebAnimationApiInstancesManager';

const webAnimationApiInstancesManager = new WebAnimationApiInstancesManager();

/**
 * A basic hook to use the Web Animations API within a React component. It simplifies the process of creating
 * and controlling animations based on the provided animation definition.
 *
 * @template Args - A type that extends AnyRecord or void. This type is used for the arguments passed to the animation's keyframe function,
 *                   allowing for dynamic generation of keyframes based on the provided arguments.
 *
 * @param {AnimationDefinition<Args>} props - The definition of the animation, including keyframes and options.
 * @returns {AnimationController<Args>} An instance of AnimationController, providing methods and properties to control the animation.
 *
 * @see {@link AnimationController} for details on the returned controller object.
 */
export const useAnimation = <Args extends AnyRecord | void = void>(
  props: AnimationDefinition<Args>,
): AnimationController<Args> => {
  const argsRef = useLatestPropsRef(props);

  const [handle, mount] = useOnce((): [AnimationController<Args>, () => () => void] => {
    let $el: Element | null = null;
    let configOfWebAnimationApiInstance: ConfigOfWebAnimationApiInstance | undefined;

    const createWebAnimationApiInstance = (args: Args): WebAnimationApi | undefined => {
      if (!$el) {
        return;
      }
      const { keyframe = [], options = {} } = argsRef.current ?? [];

      const prevActive = configOfWebAnimationApiInstance;
      configOfWebAnimationApiInstance = {
        _keyframes: normalizeKeyframe($el, keyframe, args),
        _options: options,
      };

      return webAnimationApiInstancesManager.createInstance($el, configOfWebAnimationApiInstance, prevActive);
    };
    const cleanWebAnimationInstance = (): void => {
      if (configOfWebAnimationApiInstance) {
        webAnimationApiInstancesManager.deleteInstanceByConfig(configOfWebAnimationApiInstance);
      }
    };

    const controller: AnimationController<Args> = Object.assign(
      (ref: Element | null) => {
        $el = ref;
        if (!$el) {
          cleanWebAnimationInstance();
        }
      },
      {
        reverse: () => webAnimationApiInstancesManager.getInstanceByConfig(configOfWebAnimationApiInstance)?.reverse(),
        cancel: () => webAnimationApiInstancesManager.getInstanceByConfig(configOfWebAnimationApiInstance)?.cancel(),
        finish: () => webAnimationApiInstancesManager.getInstanceByConfig(configOfWebAnimationApiInstance)?.finish(),
        pause: () => webAnimationApiInstancesManager.getInstanceByConfig(configOfWebAnimationApiInstance)?.pause(),
        setPlaybackRate: rate => {
          webAnimationApiInstancesManager.getInstanceByConfig(configOfWebAnimationApiInstance)?.setRate(rate);
        },
        waitFor: event => {
          webAnimationApiInstancesManager.getInstanceByConfig(configOfWebAnimationApiInstance)?.waitFor(event);
        },
        play: options => {
          const webAnimationApiInstance = createWebAnimationApiInstance('args' in options ? options.args : {});
          webAnimationApiInstance?.play({});
        },
        setTime: time => {
          let webAnimationApiInstance =
            configOfWebAnimationApiInstance &&
            webAnimationApiInstancesManager.getInstanceByConfig(configOfWebAnimationApiInstance);
          if (!webAnimationApiInstance) {
            const { keyframe } = argsRef.current;
            if (typeof keyframe === 'function') {
              return;
            }
            // Init animation in setTime to start animation without calling play
            webAnimationApiInstance = createWebAnimationApiInstance(undefined!);
          }
          webAnimationApiInstance?.setTime(time);
        },
      } as BaseAnimationController<Args>,
    );

    return [controller, (): (() => void) => cleanWebAnimationInstance];
  });

  // eslint-disable-next-line react-hooks/exhaustive-deps
  useMount(mount);

  return handle;
};
