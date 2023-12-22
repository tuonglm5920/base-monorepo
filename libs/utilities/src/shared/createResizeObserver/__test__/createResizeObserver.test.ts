import { createResizeObserver } from '../src/createResizeObserver';

describe('createResizeObserver with ResizeObserver support', () => {
  let resizeObserver: ReturnType<typeof createResizeObserver>;
  let mockElement: HTMLDivElement;
  let listener: () => void;

  beforeEach(() => {
    // Mock ResizeObserver
    global.ResizeObserver = class ResizeObserver {
      constructor(ls: ResizeObserverCallback) {
        listener = ls as () => void;
      }
      public disconnect(): void {
        window.removeEventListener('resize', listener);
        return;
      }
      public observe(_target: Element, _options?: ResizeObserverOptions | undefined): void {
        window.addEventListener('resize', listener);
        return;
      }
      public unobserve(_target: Element): void {
        window.removeEventListener('resize', listener);
        return;
      }
    };

    // Other initializations
    resizeObserver = createResizeObserver();
    mockElement = document.createElement('div');
    listener = jest.fn();
  });

  afterEach(() => {
    // @ts-ignore
    global.ResizeObserver = undefined;
  });

  it('should add a resize listener using ResizeObserver', () => {
    resizeObserver.addListener(listener, mockElement);
    expect(listener).not.toHaveBeenCalled();
    global.dispatchEvent(new Event('resize'));
    expect(listener).toHaveBeenCalled();
  });

  it('should remove a resize listener using ResizeObserver', () => {
    resizeObserver.addListener(listener, mockElement);
    global.dispatchEvent(new Event('resize'));
    expect(listener).toHaveBeenCalled();

    resizeObserver.removeListener(listener);
    global.dispatchEvent(new Event('resize'));
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('createResizeObserver without ResizeObserver support', () => {
  let resizeObserver: ReturnType<typeof createResizeObserver>;
  let mockElement: HTMLDivElement;
  let listener: () => void;

  beforeEach(() => {
    resizeObserver = createResizeObserver();
    mockElement = document.createElement('div');
    listener = jest.fn();
  });

  it('should add a resize listener using window event listener', () => {
    resizeObserver.addListener(listener, mockElement);
    expect(listener).toHaveBeenCalled();
    global.dispatchEvent(new Event('resize'));
    expect(listener).toHaveBeenCalledTimes(2);
  });

  it('should remove a resize listener using window event listener', () => {
    resizeObserver.addListener(listener, mockElement);
    global.dispatchEvent(new Event('resize'));
    expect(listener).toHaveBeenCalledTimes(2);

    resizeObserver.removeListener(listener);
    global.dispatchEvent(new Event('resize'));
    expect(listener).toHaveBeenCalledTimes(2);
  });
});
