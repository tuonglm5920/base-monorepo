import { createScrollObserver } from '../src/createScrollObserver';

describe('createScrollObserver with IntersectionObserver support', () => {
  let scrollObserver: ReturnType<typeof createScrollObserver>;
  let mockElement: HTMLDivElement;
  let listener: () => void;

  beforeEach(() => {
    global.IntersectionObserver = class MockIntersectionObserver implements IntersectionObserver {
      private _callback: IntersectionObserverCallback;
      private _elements: Set<Element>;
      public root: Element | Document | null = null;
      public rootMargin = '0px';
      public thresholds: readonly number[] = [];

      constructor(callback: IntersectionObserverCallback) {
        this._callback = callback;
        this._elements = new Set();

        // Bind the onScroll method to ensure it has the correct 'this' context
        this._onScroll = this._onScroll.bind(this);
        window.addEventListener('scroll', this._onScroll);
      }

      public observe(element: Element): void {
        this._elements.add(element);
      }

      public unobserve(element: Element): void {
        this._elements.delete(element);
      }

      public disconnect(): void {
        this._elements.clear();
        window.removeEventListener('scroll', this._onScroll);
      }

      public takeRecords(): IntersectionObserverEntry[] {
        throw new Error('Method not implemented.');
      }

      // Handle scroll event
      private _onScroll(): void {
        const entries = Array.from(this._elements).map(element => {
          // Customize this object to match the actual IntersectionObserverEntry structure
          return {
            target: element,
            isIntersecting: true,
          };
        });

        this._callback(entries as IntersectionObserverEntry[], this);
      }
    };

    // Other initializations
    scrollObserver = createScrollObserver();
    mockElement = document.createElement('div');
    listener = jest.fn();
  });

  it('should add a scroll listener using IntersectionObserver', () => {
    scrollObserver.addListener(listener, mockElement);
    expect(listener).not.toHaveBeenCalled();
    global.dispatchEvent(new Event('scroll'));
    expect(listener).toHaveBeenCalled();
  });
  it('should remove a scroll listener using IntersectionObserver', () => {
    scrollObserver.addListener(listener, mockElement);
    global.dispatchEvent(new Event('scroll'));
    expect(listener).toHaveBeenCalled();

    scrollObserver.removeListener(listener);
    global.dispatchEvent(new Event('scroll'));
    expect(listener).toHaveBeenCalledTimes(1);
  });
});

describe('createScrollObserver without IntersectionObserver support', () => {
  let scrollObserver: ReturnType<typeof createScrollObserver>;
  let mockElement: HTMLDivElement;
  let listener: () => void;

  beforeEach(() => {
    global.IntersectionObserver = class MockIntersectionObserver implements IntersectionObserver {
      private _callback: IntersectionObserverCallback;
      private _elements: Set<Element>;
      public root: Element | Document | null = null;
      public rootMargin = '0px';
      public thresholds: readonly number[] = [];

      constructor(callback: IntersectionObserverCallback) {
        this._callback = callback;
        this._elements = new Set();

        // Bind the onScroll method to ensure it has the correct 'this' context
        this._onScroll = this._onScroll.bind(this);
        window.addEventListener('scroll', this._onScroll);
      }

      public observe(element: Element): void {
        this._elements.add(element);
      }

      public unobserve(element: Element): void {
        this._elements.delete(element);
      }

      public disconnect(): void {
        this._elements.clear();
        window.removeEventListener('scroll', this._onScroll);
      }

      public takeRecords(): IntersectionObserverEntry[] {
        throw new Error('Method not implemented.');
      }

      // Handle scroll event
      private _onScroll(): void {
        const entries = Array.from(this._elements).map(element => {
          // Customize this object to match the actual IntersectionObserverEntry structure
          return {
            target: element,
            isIntersecting: true,
          };
        });

        this._callback(entries as IntersectionObserverEntry[], this);
      }
    };

    // Other initializations
    scrollObserver = createScrollObserver();
    mockElement = document.createElement('div');
    listener = jest.fn();
  });

  it('should add a scroll listener using IntersectionObserver', () => {
    scrollObserver.addListener(listener, mockElement);
    expect(listener).not.toHaveBeenCalled();
    global.dispatchEvent(new Event('scroll'));
    expect(listener).toHaveBeenCalled();
  });
  it('should remove a scroll listener using IntersectionObserver', () => {
    scrollObserver.addListener(listener, mockElement);
    global.dispatchEvent(new Event('scroll'));
    expect(listener).toHaveBeenCalled();

    scrollObserver.removeListener(listener);
    global.dispatchEvent(new Event('scroll'));
    expect(listener).toHaveBeenCalledTimes(1);
  });
});
