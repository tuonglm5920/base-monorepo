import { detectScrollbar } from '../src/detectScrollbar';

describe('detectScrollbar', () => {
  it('should return true when the document height is greater than the viewport height', () => {
    // Mocking document and window properties for the test
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 1000, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true });

    expect(detectScrollbar()).toBe(true);
  });

  it('should return false when the document height is less than or equal to the viewport height', () => {
    Object.defineProperty(document.documentElement, 'scrollHeight', { value: 800, configurable: true });
    Object.defineProperty(document.documentElement, 'clientHeight', { value: 800, configurable: true });

    expect(detectScrollbar()).toBe(false);
  });

  it('should return false in a server-side environment', () => {
    // Simulate server-side environment
    const originalWindow = global.window;
    // @ts-ignore
    delete global.window;

    expect(detectScrollbar()).toBe(false);

    // Restore the original window object after the test
    global.window = originalWindow;
  });
});
