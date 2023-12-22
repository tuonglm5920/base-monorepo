import { scrollIntoView } from '../src/scrollIntoView';

describe('scrollIntoView', () => {
  beforeEach(() => {
    // Set up our document body
    document.body.innerHTML = `
      <div id="testElement"></div>
    `;

    // Mock scrollIntoView function
    Element.prototype.scrollIntoView = jest.fn();
  });

  it('should call scrollIntoView on the element with default options', () => {
    const element = document.getElementById('testElement');
    const spy = jest.spyOn(element as Element, 'scrollIntoView');

    scrollIntoView(element);

    expect(spy).toHaveBeenCalledWith({
      behavior: 'smooth',
      block: 'start',
      inline: 'nearest',
    });
  });

  it('should handle custom scroll options', () => {
    const element = document.getElementById('testElement');
    const spy = jest.spyOn(element as Element, 'scrollIntoView');

    scrollIntoView(element, 'auto', 'end', 'center');

    expect(spy).toHaveBeenCalledWith({
      behavior: 'auto',
      block: 'end',
      inline: 'center',
    });
  });
});
