# Overview

The `Text` component is designed for React applications to enforce strict content structure, specifically for rendering text content. It only allows text (string) as its children, ensuring that non-textual elements are not passed inadvertently. This component mirrors the strict text handling typically seen in mobile development frameworks like React Native.

# Props

| Prop            | Type                                                        | Optional | Description                                                                                    |
| --------------- | ----------------------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------- |
| `tagName`       | `keyof JSX.IntrinsicElements \| JSXElementConstructor<any>` | Yes      | The tag name of the HTML element to be rendered. Defaults to 'div' if not specified.           |
| `disableStrict` | `boolean`                                                   | Yes      | Whether to disable the strict check for children.                                              |
| `...other`      | `AllHTMLAttributes<HTMLElement>`                            | Yes      | All other standard HTML attributes applicable to the element determined by the `tagName` prop. |

Note: The `Text` component will throw an error if a non-text child (such as a JSX element) is passed to it. This enforces the usage of this component strictly for textual content.

## Examples

Here's a simple example of how to use the `Text` component:

```jsx
import React from "react";
import Text from "./path-to-Text";

const MyComponent = () => {
  return <Text style={{ color: "blue" }}>Hello World</Text>;
};

export default MyComponent;
```
