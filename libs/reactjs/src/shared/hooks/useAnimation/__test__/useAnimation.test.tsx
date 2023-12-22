/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { expect } from '@jest/globals';
import { fireEvent, render } from '@testing-library/react';
import { FC, useEffect } from 'react';
import { renderToStaticMarkup, renderToString } from 'react-dom/server';
import { useAnimation } from '../src/useAnimation';

describe('useAnimation', () => {
  const Comp: FC = () => {
    const animate = useAnimation({
      keyframe: { width: 100 },
      options: { duration: 600, easing: 'ease-in-out' },
    });
    useEffect(() => {
      animate.play({});
      // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
      <div ref={animate} style={{ width: 50 }}>
        test
      </div>
    );
  };

  it('should succeed with renderToString', () => {
    expect(renderToString(<Comp />)).toMatchSnapshot();
  });

  it('should succeed with renderToStaticMarkup', () => {
    expect(renderToStaticMarkup(<Comp />)).toMatchSnapshot();
  });
});

describe('CircleComponent with useAnimation hook', () => {
  const CircleComponent: FC = () => {
    const animate = useAnimation<{ x: number; y: number }>({
      keyframe: (prev, args) => [{ transform: prev.transform }, { transform: `translate(${args.x}px, ${args.y}px)` }],
      options: {
        duration: 400,
        easing: 'ease-in-out',
      },
    });

    useEffect(() => {
      const onClick = (event: MouseEvent): void => {
        animate.play({ args: { x: event.clientX, y: event.clientY } });
      };
      window.addEventListener('click', onClick);
      return () => {
        window.removeEventListener('click', onClick);
      };
    }, [animate]);

    return (
      <div
        ref={animate}
        style={{
          position: 'fixed',
          border: 'solid 0.1rem #135569',
          borderRadius: '50%',
          height: '6rem',
          width: '6rem',
          top: '-3rem',
          left: '-3rem',
        }}
      />
    );
  };
  const mockTime = 500;
  const mockDuration = 1000;
  const mockAnimations = new Map();

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
      // Simulate the end state of the animation
      if (this.effect.keyframes && Array.isArray(this.effect.keyframes) && this.effect.keyframes.length > 0) {
        const lastKeyframe = this.effect.keyframes[this.effect.keyframes.length - 1];
        if (typeof lastKeyframe['transform'] === 'string') {
          this.effect.element.style.transform = lastKeyframe['transform'];
        }
      }
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
    const animation = new MockAnimation(effect, options);
    mockAnimations.set(this, animation); // Store the animation instance
    return animation;
  };

  it('moves to click position when clicked', async () => {
    const { container } = render(<CircleComponent />);
    const circle = container.firstChild as HTMLElement;

    // Simulate a click
    fireEvent.click(document, { clientX: 100, clientY: 150 });

    // Manually call finish on the mock animation
    const animation = mockAnimations.get(circle);
    animation.finish();

    // Assert the final state
    expect(circle.style.transform).toBe('translate(100px, 150px)');
  });
});
