# Overview

The `useOutterClick` hook is a React custom hook that allows you to execute a callback function when a click event occurs outside of a specified element or set of elements.

# Options

This hook takes an object with the following properties:

- **callback**: A function to be executed when an outer click is detected.
- **$el**: The element or an array of elements to monitor for outer clicks. The callback will not be executed if the click event target is inside this element(s).
- **deps** (optional): An array of dependencies for the hook. If any dependency changes, the effect will re-run to update the event listener.

# Examples

```jsx
import React, { useRef } from "react";
import { useOutterClick } from "path-to-useOutterClick-hook";

export default function MyComponent() {
  const ref = useRef();

  useOutterClick({
    callback: () => {
      console.log("Clicked outside the element");
    },
    $el: ref.current,
  });

  return (
    <div ref={ref}>
      <p>Click outside of this element to trigger the callback.</p>
    </div>
  );
}
```
