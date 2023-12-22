# Overview

A custom React hook that monitors and tracks the zoom level of the user's browser window. It provides real-time updates on the current zoom level, responding dynamically to changes in window size that are indicative of zooming actions.

# Options

No options are required to use this hook.

# Examples

```jsx
import React from "react";
import { useDetectPageZoom } from "...";

export default function App() {
  const { pageZoom } = useDetectPageZoom();

  return (
    <div>
      <p>Current Page Zoom: {pageZoom * 100}%</p>
    </div>
  );
}
```
