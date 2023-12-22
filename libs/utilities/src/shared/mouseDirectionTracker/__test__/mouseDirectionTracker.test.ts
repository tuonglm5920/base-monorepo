import { MouseDirectionTracker } from '../src/mouseDirectionTracker';

describe('MouseDirectionTracker', () => {
  let element: HTMLElement;
  let tracker: MouseDirectionTracker;

  beforeEach(() => {
    element = document.createElement('div');
    element.style.width = '200px';
    element.style.height = '200px';
    Object.defineProperty(element, 'clientWidth', { value: 200 });
    Object.defineProperty(element, 'clientHeight', { value: 200 });
    document.body.appendChild(element);
    tracker = new MouseDirectionTracker(element);
    tracker.on();
  });

  afterEach(() => {
    tracker.off();
    document.body.removeChild(element);
  });

  it('should attach event listeners on "on"', () => {
    const addEventListenerSpy = jest.spyOn(element, 'addEventListener');
    tracker.on();
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseenter', tracker.getHandleHoverForTesting());
    expect(addEventListenerSpy).toHaveBeenCalledWith('mouseleave', tracker.getHandleHoverForTesting());
  });

  it('should remove event listeners on "off"', () => {
    const removeEventListenerSpy = jest.spyOn(element, 'removeEventListener');
    tracker.off();
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseenter', tracker.getHandleHoverForTesting());
    expect(removeEventListenerSpy).toHaveBeenCalledWith('mouseleave', tracker.getHandleHoverForTesting());
  });

  const testMouseEnter = (placement: 'top' | 'left' | 'bottom' | 'right', offsetX: number, offsetY: number): void => {
    it(`should set data-placement to "${placement}" for ${placement} hover on mouseenter`, () => {
      const event = new MouseEvent('mouseenter');
      Object.defineProperty(event, 'offsetX', { get: () => offsetX });
      Object.defineProperty(event, 'offsetY', { get: () => offsetY });
      element.dispatchEvent(event);
      expect(element.getAttribute('data-placement')).toBe(placement);
    });
  };

  const testMouseLeave = (placement: 'top' | 'left' | 'bottom' | 'right', offsetX: number, offsetY: number): void => {
    it(`should set data-placement to "${placement}" on mouse leave from ${placement}`, () => {
      const event = new MouseEvent('mouseleave');
      Object.defineProperty(event, 'offsetX', { get: () => offsetX });
      Object.defineProperty(event, 'offsetY', { get: () => offsetY });
      element.dispatchEvent(event);
      expect(element.getAttribute('data-placement')).toBe(placement);
    });
  };

  // Mouse enter tests
  testMouseEnter('left', 0, 100);
  testMouseEnter('top', 100, 0);
  testMouseEnter('right', 200, 100);
  testMouseEnter('bottom', 100, 200);

  // Mouse leave tests
  testMouseLeave('left', 0, 100);
  testMouseLeave('top', 100, 0);
  testMouseLeave('right', 200, 100);
  testMouseLeave('bottom', 100, 200);
});
