# Overview

The `interpolate` function is a versatile tool for creating smooth transitions in JavaScript applications. It allows for mapping a range of input values to a corresponding range of output values, using various easing functions to create realistic and fluid motion. This function is essential for animations, dynamic styling, and interactive UI elements where the rate of change needs to vary over time.

# API

##### Parameters

- **options**: An object containing the following properties:
  - **inputRange**: An array of input values that the interpolation maps from.
  - **outputRange**: An array of output values that the interpolation maps to.
  - **value**: The current value to interpolate.
  - **easing** (optional): An easing function that defines the interpolation curve.
  - **reverseEasing** (optional): A boolean to reverse the easing direction.

##### Return value

- A number representing the interpolated value based on the provided input range, output range, and easing function.

# Examples

1. Interpolating a value with a linear easing function

```typescript
import { interpolate } from 'your-interpolate-package';

const interpolatedValue = interpolate({
  inputRange: [0, 1],
  outputRange: [0, 100],
  value: 0.5,
  easing: easings.linear,
});
console.log(interpolatedValue); // Outputs: 50
```

2. Using a custom easing function

```typescript
import { interpolate } from 'your-interpolate-package';

const customEasingFunction = (t) => t * t; // Example of a custom easing function
const interpolatedValue = interpolate({
  inputRange: [0, 1],
  outputRange: [0, 100],
  value: 0.5,
  easing: customEasingFunction,
});
console.log(interpolatedValue); // Outputs based on custom easing function
```
