# Overview

The `useOnValueChange` hook is designed to monitor changes to a specific value within a React component. When the value changes, a callback function is executed, which receives both the new and the previous value.

# Options

- **value**: The value to be monitored for changes.
- **onChange**: A callback function that executes when the monitored value changes. It receives the new value as the first argument and the old value as the second argument.

# Examples

```jsx
import React, { useState } from "react";
import { useOnValueChange } from "path-to-useOnValueChange-hook";

export default function MyComponent() {
  const [value, setValue] = useState(0);

  useOnValueChange(value, (newValue, oldValue) => {
    console.log(`Value changed from ${oldValue} to ${newValue}`);
  });

  return (
    <div>
      <p>Current value: {value}</p>
      <button onClick={() => setValue(value + 1)}>Increment</button>
    </div>
  );
}
```
