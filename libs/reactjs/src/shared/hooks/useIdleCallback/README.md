# Overview

The `useIdleCallback` hook is designed to manage idle callbacks within a React application efficiently. This hook uses the browser's `requestIdleCallback` to schedule low-priority work in the background, such as pre-fetching non-critical data or handling end-of-task cleanups. If `requestIdleCallback` is not supported by the user's browser, the hook can fallback to `requestAnimationFrame` or execute immediately, based on the specified behavior.

# Options

- **unsupportedBehavior**: Specifies the behavior when `requestIdleCallback` is not available. The options are:
  - `UnsupportedBehavior.Immediate`: Executes the callback immediately using `setTimeout` with a 0ms delay.
  - `UnsupportedBehavior.AnimationFrame`: Uses `requestAnimationFrame` to schedule the callback.

# Examples

```jsx
import React from "react";
import { useIdleCallback, UnsupportedBehavior } from "path-to-useIdleCallback-hook";

export default function MyComponent() {
  useIdleCallback(
    () => {
      // Tasks to execute during idle time
    },
    { unsupportedBehavior: UnsupportedBehavior.AnimationFrame },
  );

  return <div>Idle tasks will be scheduled according to the specified behavior.</div>;
}
```
