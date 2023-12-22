# Overview

`useDelayedCallback` is a custom React hook that provides functionality to delay the invocation of a callback function.

# Options

- **delay**: The number of milliseconds to delay the callback invocation.

# Examples

```jsx
import React from "react";
import { useDelayedCallback } from "path-to-useDelayedCallback-hook";

export default function DelayedActionComponent() {
  const delayedLog = useDelayedCallback(() => console.log("This will log after a delay"), 2000);

  return (
    <button type="button" onClick={delayedLog}>
      Log After Delay
    </button>
  );
}
```
