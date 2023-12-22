# Overview

`usePopper` is a custom React hook designed for dynamic positioning of elements (like popups, tooltips, or dropdown menus) relative to a target element in the DOM. This hook computes the optimal position based on a configuration object, accounting for padding, dependencies for re-rendering, and DOM element references.

## Options

### Parameters

- **padding**: `number | [number, number]`: Padding for the popper element. Can be a single number for uniform padding or a tuple for vertical and horizontal padding.
- **popperDeps**: `DependencyList[]`: Dependency array for updating the popper's position. Changes in these dependencies trigger a re-computation of the position.
- **domAttachedDeps**: `DependencyList[]`: Dependency array for reattaching the popper to the DOM. Changes here trigger a reattachment.
- **$popperContainerEl**: `Element`: Reference to the popper container element in the DOM.
- **$domAttachedEl**: `Element`: Reference to the DOM element to which the popper is attached.
- **onChange**: `Function`: Optional callback that is triggered when the position of the popper changes.

### Return Value

- **coordinate**: `Coordinate | undefined`: Object containing the calculated coordinates for positioning the popper. `undefined` if no position can be calculated.

## Examples

```jsx
import React, { useRef } from 'react';
import { usePopper } from 'your-use-popper-hook-package';

interface Props {
  children: (domAttachedRef: RefObject<HTMLElement>) => ReactNode;
  content: (popperContainerRef: RefObject<HTMLElement>, coordinates: ReturnType<typeof usePopper>['coordinates']) => ReactNode;
  padding?: number | [number, number];
  popperDeps?: any;
  domAttachedDeps?: any;
}

const Popper: FC<Props> = ({ children, content, domAttachedDeps, padding, popperDeps }) => {
  const popperContainerRef = useRef(null);
  const domAttactedRef = useRef(null);

  const { coordinates } = usePopper<HTMLElement, HTMLElement>({
    domAttachedDeps,
    padding,
    popperDeps,
  });

  return (
    <>
      {children(domAttactedRef)}
      {content(popperContainerRef, coordinates)}
    </>
  );
};


export default function App() {
  return (
    <Popper
      children={(ref) => {
        return (
          <div
            style={{
              width: 230,
              height: 230,
              border: '2px solid #5ae',
              background: 'white',
              padding: 10,
              borderRadius: 10,
              textAlign: 'center',
              fontSize: '.7em',
              transform: `translateX(200px)`,
            }}
            ref={ref}
            className="DOMAttached"
          >
            Element followed by a Popover
          </div>
        );
      }}
      content={(ref, coordinates) => {
        return (
          <div
            ref={ref}
            className="popover"
            style={{
              position: 'fixed',
              padding: '24px 30px',
              boxShadow: '0 0.5em 3em rgba(0, 0, 0, 0.3)',
              color: 'inherit',
              zIndex: 100000,
              transition: 'transform 0.3s',
              top: 0,
              left: 0,
              transform: `translate(${coordinates?.x}px, ${coordinates?.y}px)`,
            }}
          >
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vivamus volutpat quam eu mauris euismod imperdiet.</p>
          </div>
        );
      }}
    />
  )
}
```
