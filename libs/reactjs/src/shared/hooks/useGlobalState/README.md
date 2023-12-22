# Overview

`useGlobalState` is a custom React hook designed for managing global state in React applications. It provides a simple and flexible way to share state across components without the need for prop drilling.

# API

### `createGlobalState`

#### Parameters

- `initialState`: The initial state of the global state.

#### Returns

- An object representing the global state with various methods for state management.

### `useGlobalState`

#### Parameters

- `subscriber`: The global state object to subscribe to.
- `pick` (optional): Optional array of keys to pick from the state object.

#### Returns

- An object containing the current state and a method to update the state.

# Examples

```jsx
import React from "react";
import { createGlobalState, useGlobalState } from "your-package-name";

// Create a global state instance with an initial state
const globalState = createGlobalState({ count: 0 });

// Component using the global state
const CounterDisplay = () => {
  const { state } = useGlobalState(globalState);

  return <p>{state.count}</p>;
};

const CounterButtons = () => {
  const { setState } = useGlobalState(globalState);

  const increment = () => {
    setState((prev) => ({ count: prev.count + 1 }));
  };

  const decrement = () => {
    setState((prev) => ({ count: prev.count - 1 }));
  };

  return (
    <div>
      <button onClick={increment}>Increment</button>
      <button onClick={decrement}>Decrement</button>
    </div>
  );
};
```
