/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { render } from '@testing-library/react';
import { FC } from 'react';
import { useSticky } from '../src/useSticky';

describe('useSticky', () => {
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
  });

  it('Render short sidebar', async () => {
    // Mock viewport
    global.window.innerWidth = 614;
    global.window.innerHeight = 918;

    // Render component
    const App: FC = () => {
      const setStickyNode = useSticky({
        offsetTop: 20,
        offsetBottom: 20,
      });

      return (
        <div>
          <div className="header" style={{ padding: 0, height: 64 }}>
            Header
          </div>
          <div
            className="content"
            style={{
              padding: 0,
              height: 3000,
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <div ref={setStickyNode} className="sidebar" style={{ padding: 0, height: 300 }}>
              Sidebar
            </div>
            <div className="main-content" style={{ padding: 0, height: 3000 }}>
              Main Content
            </div>
          </div>
        </div>
      );
    };
    const { findByText } = render(<App />);
    const $sidebarEl = await findByText('Sidebar');

    // Simulate scrolling
    window.scrollY = 600;
    window.dispatchEvent(new Event('scroll'));

    // Sidebar should be stickied
    expect(getComputedStyle($sidebarEl).position).toBe('sticky');
    expect(getComputedStyle($sidebarEl).top).toBe('20px');
  });

  it('Render long sidebar', async () => {
    // Mock viewport
    global.window.innerWidth = 614;
    global.window.innerHeight = 184;

    // Render component
    const App: FC = () => {
      const setStickyNode = useSticky({
        offsetTop: 20,
        offsetBottom: 20,
      });

      return (
        <div>
          <div className="header" style={{ padding: 0, height: 64 }}>
            Header
          </div>
          <div
            className="content"
            style={{
              padding: 0,
              height: 3000,
              display: 'flex',
              alignItems: 'flex-start',
            }}
          >
            <div ref={setStickyNode} className="sidebar" style={{ padding: 0, height: 300 }}>
              Sidebar
            </div>
            <div className="main-content" style={{ padding: 0, height: 3000 }}>
              Main Content
            </div>
          </div>
        </div>
      );
    };
    const { findByText } = render(<App />);
    const $sidebarEl = await findByText('Sidebar');

    // Simulate scrolling
    window.scrollY = 100;
    window.dispatchEvent(new Event('scroll'));
    window.scrollY = 200;
    window.dispatchEvent(new Event('scroll'));
    window.scrollY = 1200;
    window.dispatchEvent(new Event('scroll'));

    // Sidebar should be stickied bottom
    // expect(getComputedStyle($sidebarEl).position).toBe('sticky');
    // expect(getComputedStyle($sidebarEl).top).toBe('-136px');

    window.scrollY = 1100;
    window.dispatchEvent(new Event('scroll'));
    window.scrollY = 800;
    window.dispatchEvent(new Event('scroll'));

    // Sidebar should be stickied top
    expect(getComputedStyle($sidebarEl).position).toBe('sticky');
    expect(getComputedStyle($sidebarEl).top).toBe('20px');
  });
  it('TODO: Render long sidebar & resize window', () => {
    expect(true).toEqual(true);
  });
  it('TODO: Render long sidebar & click anchor element', () => {
    expect(true).toEqual(true);
  });
});
