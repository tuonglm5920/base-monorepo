# Overview

This custom React hook is designed to run a callback function when the component mounts.

# Examples

```jsx
import useMount from "./useMount";

const MyComponent = () => {
  useMount(() => {
    console.log("Component has mounted");
  });

  return <div>My Component</div>;
};
```
