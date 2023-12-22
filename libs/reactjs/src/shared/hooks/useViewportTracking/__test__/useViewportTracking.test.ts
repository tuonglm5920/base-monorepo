import { fireEvent } from '@testing-library/dom';
import { renderHook, act } from '@testing-library/react';
import { useViewportTracking } from '../src/useViewportTracking';

describe('useViewportTracking', () => {
  let $element: HTMLElement;
  const initialScreenWidth = 1024;
  const initialScreenHeight = 200;

  const elementWidth = 100;
  const elementX = 100; // Initial X position
  const elementHeight = 100;
  let elementY = 400; // Initial Y position, outside of the viewport

  beforeEach(() => {
    $element = document.createElement('div');
    document.body.appendChild($element);

    // Reset screen size
    act(() => {
      window.innerWidth = initialScreenWidth;
      window.innerHeight = initialScreenHeight;
      fireEvent(window, new Event('resize'));
    });

    Object.defineProperty($element, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: elementWidth,
        height: elementHeight,
        top: elementY,
        left: elementX,
        right: elementX + elementWidth,
        bottom: elementY + elementHeight,
      }),
    });
  });

  afterEach(() => {
    document.body.removeChild($element);
  });

  it('initializes with the element not in the viewport', () => {
    const { result } = renderHook(() => useViewportTracking({ $el: $element }));
    expect(result.current.inViewport).toBe(false);
  });

  it('updates inViewport state when element enters viewport', () => {
    const { result } = renderHook(() => useViewportTracking({ $el: $element }));

    act(() => {
      // Simulate element entering the viewport
      elementY = 50; // Adjust Y position to bring it into the viewport
      Object.defineProperty($element, 'getBoundingClientRect', {
        value: () => ({
          width: elementWidth,
          height: elementHeight,
          top: elementY,
          left: elementX,
          right: elementX + elementWidth,
          bottom: elementY + elementHeight,
        }),
      });

      fireEvent(window, new Event('scroll'));
    });

    expect(result.current.inViewport).toBe(true);
  });

  it('updates inViewport state when element leaves viewport', () => {
    const { result } = renderHook(() => useViewportTracking({ $el: $element }));

    act(() => {
      // Simulate element leaving the viewport
      elementY = -150; // Adjust Y position to move it out of the viewport
      Object.defineProperty($element, 'getBoundingClientRect', {
        value: () => ({
          width: elementWidth,
          height: elementHeight,
          top: elementY,
          left: elementX,
          right: elementX + elementWidth,
          bottom: elementY + elementHeight,
        }),
      });

      fireEvent(window, new Event('scroll'));
    });

    expect(result.current.inViewport).toBe(false);
  });
});
