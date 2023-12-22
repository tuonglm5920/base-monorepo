# Overview

The `TransitiveNumber` component is a React-based UI element designed for animating the transition of numbers and text. It's ideal for displaying dynamic data like counters, timers, or any changing numbers in a visually appealing way.

# Props

| Prop                     | Type                  | Optional | Description                                                  |
|--------------------------|-----------------------|----------|--------------------------------------------------------------|
| `className`              | `string`              | Yes      | Optional CSS class for additional styling.                   |
| `enableInitialAnimation` | `boolean`             | Yes      | If true, the component animates on initial render. Defaults to false. |
| `children`               | `number` \| `string`  | No       | The content that will be animated. Can be a number or a string. |
