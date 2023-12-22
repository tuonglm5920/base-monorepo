import { Sticky } from '../src/sticky';

describe('Sticky', () => {
  let sidebar: HTMLElement;
  let stickyInstance: Sticky | null;

  const sidebarHeight = 300;

  beforeEach(() => {
    Element.prototype.getBoundingClientRect = function (): DOMRect {
      const style = getComputedStyle(this);
      return {
        height: Number(style.height.replace('px', '')),
        bottom: 0,
        left: 0,
        right: 0,
        top: 0,
        width: 0,
        x: 0,
        y: 0,
        toJSON(): void {
          return;
        },
      };
    };

    // Mock css support postion sticky
    global.CSS.supports = jest.fn().mockImplementation(() => true);

    document.body.innerHTML = `
      <div class="header" style="padding: 0px; height: 64px;">Header</div>
      <div class="content" style="padding: 0px; height: 3000px; display: flex; align-items: flex-start">
        <div class="sidebar" style="padding: 0px; height: ${sidebarHeight}px;">Sidebar</div>
        <div class="main-content" style="padding: 0px; height: 3000px;">Main Content</div>
      </div>
    `;
    sidebar = document.querySelector('.sidebar') as HTMLElement;
  });

  afterEach(() => {
    document.body.innerHTML = '';
  });

  it('Short sidebar becomes sticky after scrolling', () => {
    // Mock viewport
    global.window.innerWidth = 614;
    global.window.innerHeight = 918;

    // Create instance
    stickyInstance = new Sticky({
      $el: sidebar,
      options: {
        offsetTop: 20,
        offsetBottom: 20,
      },
    });
    stickyInstance.create();

    // Simulate scrolling
    window.scrollY = 600;
    window.dispatchEvent(new Event('scroll'));

    // Sidebar should be stickied
    expect(getComputedStyle(sidebar).position).toBe('sticky');
    expect(getComputedStyle(sidebar).top).toBe('20px');

    // Destroy
    stickyInstance.destroy();
    stickyInstance = null;
  });

  it('Long sidebar becomes sticky after scrolling', () => {
    // Mock viewport
    global.window.innerWidth = 614;
    global.window.innerHeight = 184;

    // Create instance
    stickyInstance = new Sticky({
      $el: sidebar,
      options: {
        offsetTop: 20,
        offsetBottom: 20,
      },
    });
    stickyInstance.create();

    // Simulate scrolling
    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));
    window.scrollY = 200;
    window.dispatchEvent(new Event('scroll'));
    window.scrollY = 1200;
    window.dispatchEvent(new Event('scroll'));

    // Sidebar should be stickied bottom
    expect(getComputedStyle(sidebar).position).toBe('sticky');
    expect(getComputedStyle(sidebar).top).toBe('-136px');

    window.scrollY = 1100;
    window.dispatchEvent(new Event('scroll'));
    window.scrollY = 800;
    window.dispatchEvent(new Event('scroll'));

    // Sidebar should be stickied top
    expect(getComputedStyle(sidebar).position).toBe('sticky');
    expect(getComputedStyle(sidebar).top).toBe('20px');

    // Destroy
    stickyInstance.destroy();
    stickyInstance = null;
  });
  it('TODO: Long sidebar when resize window', () => {
    expect(true).toEqual(true);
  });
  it('TODO: Long sidebar click anchor element', () => {
    expect(true).toEqual(true);
  });
});
