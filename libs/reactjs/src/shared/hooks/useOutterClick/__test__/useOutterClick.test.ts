import { renderHook } from '@testing-library/react';
import { useOutterClick } from '../src/useOutterClick';

describe('useOutterClick', () => {
  let container: HTMLDivElement;
  let container1: HTMLDivElement;

  beforeEach(() => {
    container = document.createElement('div');
    container1 = document.createElement('div');
    container1.setAttribute('id', 'ele');
    document.body.appendChild(container);
    document.body.appendChild(container1);
  });

  afterEach(() => {
    document.body.removeChild(container);
    document.body.removeChild(container1);
  });

  it('test on dom optional', async () => {
    let state: number = 0;
    const { rerender, unmount } = renderHook((dom: any) =>
      useOutterClick({
        callback: () => {
          state++;
        },
        $el: dom,
      }),
    );

    rerender(container);
    container.click();
    expect(state).toBe(0);
    document.body.click();
    expect(state).toBe(1);

    rerender(container1);
    container1.click();
    expect(state).toBe(1);
    document.body.click();
    expect(state).toBe(2);

    unmount();
    document.body.click();
    expect(state).toBe(2);
  });
});
