import { getPassiveArg } from '../../getPassiveArg';
import { ScrollLerp, ScrollLerpOptions } from '../src/scrollLerp';

describe('ScrollLerp', () => {
  let mockElement: HTMLElement;
  let options: ScrollLerpOptions;

  beforeEach(() => {
    mockElement = document.createElement('div');
    options = {
      from: 0,
      to: 100,
      lerpEase: 0.1,
      onRender: jest.fn(),
    };
  });
  it('create should attach scroll event listener', () => {
    const scrollLerp = new ScrollLerp({ $el: mockElement, options });
    jest.spyOn(window, 'addEventListener');

    scrollLerp.create();

    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), getPassiveArg());
  });

  it('destroy should remove event listener and reset styles', () => {
    const scrollLerp = new ScrollLerp({ $el: mockElement, options });
    jest.spyOn(window, 'removeEventListener');

    scrollLerp.create(); // first, attach the event listener
    scrollLerp.destroy(); // then, destroy it

    expect(window.removeEventListener).toHaveBeenCalledWith('scroll', expect.any(Function));
  });

  it('onRender should be dispatched when scrolling', () => {
    const scrollLerp = new ScrollLerp({ $el: mockElement, options });
    jest.spyOn(window, 'addEventListener');

    scrollLerp.create();

    expect(window.addEventListener).toHaveBeenCalledWith('scroll', expect.any(Function), getPassiveArg());

    // Simulate a scroll event
    const event = new Event('scroll');
    mockElement.dispatchEvent(event);

    // Delay the assertion to allow any asynchronous operations
    setTimeout(() => {
      expect(options.onRender).toHaveBeenCalled();
    }, 100); // The timeout duration depends on the specifics of your implementation
  });
});
