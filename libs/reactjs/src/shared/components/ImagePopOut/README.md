# Overview

The `ImagePopOut` component is a specialized React component designed to display images with a visually striking pop-out effect.

# Props

The `ImagePopOut` component accepts the following props:

| Prop         | Type     | Optional | Description                                                                          |
| ------------ | -------- | -------- | ------------------------------------------------------------------------------------ |
| `background` | `string` | No       | The background color or image URL for the component.                                 |
| `foreground` | `string` | No       | The foreground color, typically for text or other elements over the background.      |
| `fallback`   | `string` | Yes      | An optional fallback URL or color if the background fails to load or is unavailable. |
| `alt`        | `string` | Yes      | Alternative text for the component, used for accessibility purposes.                 |

# Examples

```jsx
<div
  style={{
    padding: "2em",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    maxWidth: "300px",
    margin: "0 auto",
    minHeight: "calc(100vh - 100px)",
  }}
>
  <ImagePopOut
    style={{
      flexBasis: "100%",
      margin: "0",
    }}
    background="https://res.cloudinary.com/dazdt97d3/image/upload/v1615813805/background.png"
    foreground="https://res.cloudinary.com/dazdt97d3/image/upload/v1615813805/foreground.png"
  />
</div>
```
