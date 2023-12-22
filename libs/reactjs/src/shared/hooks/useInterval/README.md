# Overview

`useInterval` is a custom React hook that allows you to execute a callback function at regular intervals. This hook is designed to provide a simple and clean API to use `setInterval` within your React components, handling setup and cleanup automatically while ensuring that the callback function has access to the latest component state and props.

# Options

- `callback: IntervalCallback` - A function to be executed after `delay` milliseconds. The function will continue to be invoked at the specified interval until the component is unmounted or the interval is cleared.
- `delay: IntervalDelay` - A number representing the delay in milliseconds for the interval. If `delay` is `null`, the interval will be paused.

# Examples

```jsx
import React, { useState } from "react";
import { useInterval } from "path-to-useInterval-hook";

function Counter() {
  const [count, setCount] = useState(0);

  useInterval(() => {
    // Increment the count by 1
    setCount((currentCount) => currentCount + 1);
  }, 1000); // Runs every 1000 milliseconds (1 second)

  return (
    <div>
      <p>Count: {count}</p>
    </div>
  );
}

export default Counter;
```
