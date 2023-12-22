# Overview

`useMountedRef` is a custom React hook that tracks the mounted state of a component. It provides a straightforward way to determine if a component is currently mounted, which helps prevent executing logic on an unmounted component.

# Options

There are no configurable options for `useMountedRef`. It provides a ref object with a current property that reflects the mounted state.

# Examples

```jsx
import React from "react";
import { useMountedRef } from "path-to-useMountedRef-hook";

export default function App() {
  const mounted = useMountedRef();

  const handleClick = () => {
    if (mounted.current) {
      console.log("Mounted");
    } else {
      console.log("Not Mounted");
    }
  };

  return (
    <button type="button" onClick={handleClick}>
      Check if Mounted
    </button>
  );
}
```
