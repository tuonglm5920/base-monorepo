/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { act } from '@testing-library/react';
import { createElement } from 'react';
import { Root, createRoot } from 'react-dom/client';
import { Outlet, RouteObject, RouterProvider, createMemoryRouter } from 'react-router';
import { NavLink } from 'react-router-dom';
import { useCallbackPrompt } from '../src/useCallbackPrompt';

type Router = ReturnType<typeof createMemoryRouter>;

const LOADER_LATENCY_MS = 100;

const sleep = (n = 500): Promise<void> => {
  return new Promise<void>(r => setTimeout(r, n));
};

const click = (target: EventTarget | null | undefined): void => {
  target?.dispatchEvent(
    new MouseEvent('click', {
      view: window,
      bubbles: true,
      cancelable: true,
    }),
  );
};

describe('useCallbackPrompt', () => {
  let node: HTMLDivElement | undefined;
  let router: Router;
  let root: Root | undefined;
  let hookResult: ReturnType<typeof useCallbackPrompt>;

  //#region Setup root element for React
  beforeEach(() => {
    node = document.createElement('div');
    document.body.appendChild(node);
  });

  afterEach(() => {
    if (node) {
      document.body.removeChild(node);
    }
    node = undefined;
  });
  //#endregion

  describe('on <Link> navigation', () => {
    //#region Setup react router context
    beforeEach(() => {
      const initialEntries = ['/'];
      const initialIndex = 0;
      const routes: RouteObject[] = [
        {
          path: '/',
          element: createElement(() => {
            const b = useCallbackPrompt({ when: true });
            hookResult = b;
            return (
              <div>
                <NavLink to="/">Home</NavLink>
                <NavLink to="/about">About</NavLink>
                <Outlet />
              </div>
            );
          }),
        },
      ];
      router = createMemoryRouter(routes, { initialEntries, initialIndex });
      act(() => {
        if (node) {
          root = createRoot(node);
          root.render(<RouterProvider router={router} />);
        }
      });
    });

    afterEach(() => {
      act(() => root?.unmount());
    });
    //#endregion

    it('should register beforeunload and trigger showPrompt', async () => {
      await act(async () => {
        click(node?.querySelector("a[href='/about']"));
        await sleep(LOADER_LATENCY_MS);
      });
      expect(hookResult.showPrompt).toBe(true);
    });
  });
});
