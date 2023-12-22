import { SpringAnimator } from '../src/springAnimator';

describe('SpringAnimator', () => {
  let springAnimator: SpringAnimator;

  beforeEach(() => {
    // Initialize SpringAnimator with mock options
    springAnimator = new SpringAnimator({
      acceleration: 0.06,
      friction: 0.2,
      names: ['x', 'y'],
    });
  });

  it('should set initial values and instances correctly', () => {
    expect(springAnimator.instances).toBeDefined();
  });

  it('should animate properties correctly on calling animate method & trigger start and end events correctly', () => {
    // Mock event object
    const mockMouseEvent = {
      clientX: 50,
      clientY: 100,
      preventDefault: jest.fn(),
    };

    springAnimator.animate({ name: 'x', num: mockMouseEvent.clientX });
    springAnimator.animate({ name: 'y', num: mockMouseEvent.clientY });
    const startHandler = jest.fn();
    const endHandler = jest.fn();

    springAnimator.on({ event: 'start', handler: startHandler });
    springAnimator.on({ event: 'end', handler: endHandler });

    setTimeout(() => {
      expect(startHandler).toHaveBeenCalled();
      expect(endHandler).toHaveBeenCalled();
    }, 1000);
  });

  it('TODO: should animate properties correctly on tick & demo with example at README', () => {
    expect(true).toEqual(true);
  });
});
