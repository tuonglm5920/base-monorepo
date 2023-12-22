import { act, fireEvent, renderHook } from '@testing-library/react';
import { usePopper } from '../src/usePopper';

describe('usePopper', () => {
  const $popperContainerEl = document.createElement('div');
  const $domAttachedEl = document.createElement('button');
  const initialScreenWidth = 1024;
  const initialScreenHeight = 768;

  const buttonWidth = 80;
  let buttonX = 100;
  const buttonHeight = 55;
  const buttonY = 100; // Arbitrary Y position

  beforeEach(() => {
    // Reset screen size
    act(() => {
      buttonX = initialScreenWidth - buttonWidth; // Positioned at right edge
      window.innerWidth = initialScreenWidth;
      window.innerHeight = initialScreenHeight;
      Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', { configurable: true, value: initialScreenWidth });
      Object.defineProperty(HTMLDivElement.prototype, 'clientHeight', {
        configurable: true,
        value: initialScreenHeight,
      });
      fireEvent(window, new Event('resize'));
    });

    // Mock the button (DOM attached element) positioned at the right edge
    Object.defineProperty($domAttachedEl, 'clientWidth', { configurable: true, value: 80 });
    Object.defineProperty($domAttachedEl, 'clientHeight', { configurable: true, value: 55 });
    Object.defineProperty($domAttachedEl, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: buttonWidth,
        height: buttonHeight,
        top: buttonY,
        left: buttonX,
        right: buttonX + buttonWidth,
        bottom: buttonY + buttonHeight,
      }),
    });

    Object.defineProperty($popperContainerEl, 'clientWidth', { configurable: true, value: 200 });
    Object.defineProperty($popperContainerEl, 'clientHeight', { configurable: true, value: 100 });
    Object.defineProperty($popperContainerEl, 'getBoundingClientRect', {
      configurable: true,
      value: () => ({
        width: 200,
        height: 100,
        top: 0,
        left: 0,
        right: 200,
        bottom: 100,
      }),
    });
  });

  it('updates on explicitly listed props change', () => {
    const initialProps = {
      padding: 10,
      popperDeps: ['initialDep1', 'initialDep2'],
      domAttachedDeps: ['initialDomDep1', 'initialDomDep2'],
      $popperContainerEl,
      $domAttachedEl,
      onChange: jest.fn(),
    };

    const { result, rerender } = renderHook(({ config }) => usePopper(config), {
      initialProps: { config: initialProps },
    });

    // Assuming your hook sets an initial state
    expect(result.current.coordinate).toBeDefined(); // Or any other initial expectation

    // Update one of the dependencies
    const newPopperDeps = ['newDep1', 'initialDep2'];
    rerender({ config: { ...initialProps, popperDeps: newPopperDeps } });

    // Verify the hook reacted to the change
    // This depends on what `coordinate` does in your hook. You might need to check if `onChange` was called, etc.
    // For example:
    expect(result.current.coordinate).toBeDefined(); // Update this assertion based on the expected behavior
    expect(initialProps.onChange).toHaveBeenCalled(); // If the onChange should be called
  });

  it('updates coordinate when viewport change', () => {
    // Mock the initial configuration
    const initialProps = {
      padding: 10,
      popperDeps: [],
      domAttachedDeps: [],
      $popperContainerEl,
      $domAttachedEl,
      onChange: jest.fn(),
    };

    // Render the hook
    const { result } = renderHook(() => usePopper(initialProps));
    expect(result.current.coordinate?.position).toBe('left');

    // Simulate scroll event and change button's left position
    act(() => {
      buttonX = 100;
      Object.defineProperty($domAttachedEl, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({
          width: buttonWidth,
          height: buttonHeight,
          top: buttonY,
          left: buttonX,
          right: buttonX + buttonWidth,
          bottom: buttonY + buttonHeight,
        }),
      });
      fireEvent(window, new Event('scroll'));
    });
    expect(result.current.coordinate?.position).toBe('right');

    // Resize to small screen: The button is on the left side of the screen ==> the popper will appear at the bottom.
    act(() => {
      window.innerWidth = 300;
      Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', { configurable: true, value: 300 });
      fireEvent(window, new Event('resize'));
    });
    expect(result.current.coordinate?.position).toBe('bottom');

    // Resize to large screen: The button is on the left side of the screen ==> the popper will appear at the bottom.
    act(() => {
      window.innerWidth = 1400;
      Object.defineProperty(HTMLDivElement.prototype, 'clientWidth', { configurable: true, value: 1400 });
      fireEvent(window, new Event('resize'));
    });
    expect(result.current.coordinate?.position).toBe('right');
  });
});
