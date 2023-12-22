import { WebAnimationApi } from '../src/webAnimationApi';

const mockTime = 500;
const mockDuration = 1000;

class MockAnimation {
  public effect: MockKeyframeEffect;
  public options: number | KeyframeAnimationOptions | undefined;
  public playState: AnimationPlayState;
  public playbackRate: number;
  public eventTarget: EventTarget;
  constructor(effect: MockKeyframeEffect, options: number | KeyframeAnimationOptions | undefined) {
    this.effect = effect;
    this.options = options;
    this.playState = 'idle';
    this.playbackRate = Number.MAX_SAFE_INTEGER;
    this.eventTarget = new EventTarget();
  }

  public play = (): void => {
    this.playState = 'running';
  };

  public pause = (): void => {
    this.playState = 'paused';
  };

  public reverse = (): void => {
    this.playbackRate = -this.playbackRate;
  };

  public cancel = (): void => {
    this.playState = 'idle';
  };

  public updatePlaybackRate(newRate: number): void {
    this.playbackRate = newRate;
  }

  public finish = (): void => {
    this.playState = 'finished';
    this.dispatchEvent(new Event('finish'));
  };

  // Delegate event listener methods to the internal EventTarget instance
  public addEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | AddEventListenerOptions,
  ): void {
    this.eventTarget.addEventListener(type, listener, options);
  }

  public removeEventListener(
    type: string,
    listener: EventListenerOrEventListenerObject,
    options?: boolean | EventListenerOptions,
  ): void {
    this.eventTarget.removeEventListener(type, listener, options);
  }

  public dispatchEvent(event: Event): boolean {
    return this.eventTarget.dispatchEvent(event);
  }
}

class MockKeyframeEffect {
  public element: HTMLElement;
  public keyframes: PropertyIndexedKeyframes | Keyframe[] | null;
  public options: number | KeyframeAnimationOptions | undefined;

  public getComputedTiming(): ComputedEffectTiming {
    return {
      endTime: mockDuration,
      activeDuration: mockDuration,
      localTime: mockTime,
      progress: 0.5,
    };
  }
  constructor(
    element: HTMLElement,
    keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
    options: number | KeyframeAnimationOptions | undefined,
  ) {
    this.element = element;
    this.keyframes = keyframes;
    this.options = options;
  }
}

HTMLElement.prototype.animate = function (
  keyframes: Keyframe[] | PropertyIndexedKeyframes | null,
  options?: number | KeyframeAnimationOptions,
): any {
  const effect = new MockKeyframeEffect(this, keyframes, options);
  return new MockAnimation(effect, options);
};

describe('webAnimationApi', () => {
  let animationController: WebAnimationApi;
  let mockElement;
  let mockKeyframes;
  let mockOptions;

  beforeEach(() => {
    mockElement = document.createElement('div');
    mockKeyframes = [{ opacity: 0 }, { opacity: 1 }];
    mockOptions = { duration: mockDuration };
    animationController = new WebAnimationApi(mockElement, mockKeyframes, mockOptions);
  });

  it('setTime should update the current time of the animation', () => {
    animationController.setTime(mockTime);
    expect(animationController.getAnimationForTesting()?.currentTime).toBe(mockTime);
  });

  it('setRate should update the playback rate of the animation', () => {
    const mockRate = 1.5;
    animationController.setRate(mockRate);
    expect(animationController.getAnimationForTesting()?.playbackRate).toBe(mockRate);
  });

  it('waitFor should resolve when the animation finishes', async () => {
    const promise = animationController.waitFor('finish');
    animationController.getAnimationForTesting()?.finish();
    await expect(promise).resolves.toBeUndefined();
  });

  it('reverse should reverse the direction of the animation', () => {
    const initialRate = Number(animationController.getAnimationForTesting()?.playbackRate);
    animationController.reverse();
    expect(animationController.getAnimationForTesting()?.playbackRate).toBe(-initialRate);
  });

  it('cancel should cancel the animation', () => {
    animationController.cancel();
    expect(animationController.getAnimationForTesting()?.playState).toBe('idle');
  });

  it('finish should finish the animation', () => {
    animationController.finish();
    expect(animationController.getAnimationForTesting()?.playState).toBe('finished');
  });

  it('pause should pause the animation', () => {
    animationController.pause();
    expect(animationController.getAnimationForTesting()?.playState).toBe('paused');
  });

  it('play should start or resume the animation', () => {
    animationController.play({});
    expect(animationController.getAnimationForTesting()?.playState).toBe('running');
  });
});
