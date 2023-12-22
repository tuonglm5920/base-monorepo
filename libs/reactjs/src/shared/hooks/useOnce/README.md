# Overview

The `useOnce` hook is designed to initialize a value once and maintain its state across re-renders in a React component.

# Options

The hook takes an initializer function as its argument, which is called only once during the component's first render. The returned value from this function is then memoized and persisted across re-renders.

### Parameters

- **init**: A function that returns the initial value. This function is called only once when the component mounts.

### Return

- Returns the memoized value.

# Examples

```jsx
import React from "react";
import { useOnce } from "path-to-useOnce-hook";

export default function MyComponent() {
  const staticValue = useOnce(() => {
    // Perform initialization logic here
    return "Initialized Value";
  });

  return (
    <div>
      <p>The static value is: {staticValue}</p>
    </div>
  );
}
```
