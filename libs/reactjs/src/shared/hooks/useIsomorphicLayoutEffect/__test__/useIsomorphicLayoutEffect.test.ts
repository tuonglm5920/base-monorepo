import { useEffect, useLayoutEffect } from 'react';

const canUseDOM = (): boolean =>
  typeof window !== 'undefined' &&
  typeof window.document !== 'undefined' &&
  typeof window.document.createElement !== 'undefined';

describe('useIsomorphicLayoutEffect', () => {
  let originalWindow: Window & typeof globalThis;

  it('is equal to useLayoutEffect when canUseDOM is true', () => {
    // Ensure the window is defined
    global.window = originalWindow;
    const useIsomorphicLayoutEffect = canUseDOM() ? useLayoutEffect : useEffect;
    expect(useIsomorphicLayoutEffect).toBe(useLayoutEffect);
  });

  it('uses useEffect when window is undefined', () => {
    // Delete the window object to simulate a server environment
    Object.defineProperty(global, 'window', {
      configurable: true,
      value: undefined,
    });

    const useIsomorphicLayoutEffect = canUseDOM() ? useLayoutEffect : useEffect;
    expect(useIsomorphicLayoutEffect).toBe(useEffect);

    // Restore the original window object after the test
    Object.defineProperty(global, 'window', {
      configurable: true,
      value: originalWindow,
    });
  });
});
