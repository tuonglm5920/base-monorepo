# Overview

A custom React hook that combines multiple refs into a single ref callback.

# Options

### Parameters

- **...refs**: `React.Ref<T>[]`: An array of refs to be merged.

### Return Value

- `React.Ref<T> | undefined`: A single ref callback that sets all input refs.

# Examples

```jsx
import React, { useRef } from "react";
import { useMergeRef } from "...";

const MyComponent = React.forwardRef((props, parentRef) => {
  const internalRef = useRef();
  const mergedRef = useMergeRef(internalRef, parentRef);

  return <div ref={mergedRef}>Hello World</div>;
});

export default MyComponent;
```
