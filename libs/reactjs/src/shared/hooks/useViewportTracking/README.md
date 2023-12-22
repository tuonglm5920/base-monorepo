# Overview

`useViewportTracking` is a custom React hook that enables you to detect whether a DOM element is within the user's viewport.

# Options

### Parameters

- **offsetTop**: `number`: Optional top offset to consider before the element is considered to have entered the viewport.
- **offsetBottom**: `number`: Optional bottom offset to consider before the element is considered to have entered the viewport.
- **numberOfRuns**: `number`: The maximum number of times the enter and leave callbacks should be invoked.
- **onEnterViewport**: `() => void`: Callback function that is called when the element enters the viewport.
- **onLeaveViewport**: `() => void`: Callback function that is called when the element leaves the viewport.
- **$el**: `Element | null`: The DOM element to be tracked.

### Return Value

- **inViewport**: `boolean`: A state that indicates whether the tracked element is currently in the viewport.

# Examples

```jsx
import React, { useRef } from "react";
import { useViewportTracking } from "your-use-viewport-tracking-package";

const ViewportTrackingComponent = () => {
  const elementRef = useRef(null);

  const { inViewport } = useViewportTracking({
    $el: elementRef.current,
    offsetTop: 100,
    offsetBottom: 100,
    onEnterViewport: () => console.log("Entered viewport"),
    onLeaveViewport: () => console.log("Left viewport"),
  });

  return (
    <div ref={elementRef} style={{ height: "300px", width: "100%" }}>
      {inViewport ? "In viewport" : "Not in viewport"}
    </div>
  );
};

export default ViewportTrackingComponent;
```
