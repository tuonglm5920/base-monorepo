# Overview

The `useSticky` hook enables the creation of sticky elements in React components based on provided configurations. It helps in making elements stick to a position while scrolling, utilizing the Sticky utility.

# Options

The hook accepts a configuration object that allows customization of the sticky behavior. The provided options include `offsetTop`, `offsetBottom`, and `bottom`, influencing the positioning and behavior of the sticky element.

### Parameters

- **options**: An object containing configurations for the sticky behavior.
  - `offsetTop` (number): Offset from the top of the viewport (default: 0).
  - `offsetBottom` (number): Offset from the bottom of the viewport (default: 0).
  - `bottom` (boolean): Determines if the sticky element should stick to the bottom (default: false).

### Return

- A function to set the node element to be made sticky.

# Examples

```javascript
import React from "react";
import { useSticky } from "path-to-useSticky-hook";

function MyComponent() {
  const setStickyNode = useSticky({
    offsetTop: 20,
    offsetBottom: 10,
    bottom: true,
  });

  return (
    <div>
      <div ref={setStickyNode}>{/* Your content here */}</div>
    </div>
  );
}
```
