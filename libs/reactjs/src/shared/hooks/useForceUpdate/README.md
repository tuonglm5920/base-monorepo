# Overview

`useForceUpdate` is a custom React hook that provides a function to forcibly re-render a component.

# Options

This hook does not require any options. It simply returns a function that you can call to force a re-render of the component.

# Examples

```jsx
import React from "react";
import { useForceUpdate } from "path-to-useForceUpdate-hook";

export default function MyComponent() {
  const forceUpdate = useForceUpdate();

  const handleClick = () => {
    // When this function is called, it will force MyComponent to re-render
    forceUpdate();
  };

  return <button onClick={handleClick}>Force Re-render</button>;
}
```
