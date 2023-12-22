# Overview
The `CanvasWave` component creates animated wave patterns using HTML canvas. It can add a visually appealing dynamic background or element to any web application, with customizable colors, speed, and other properties.

# Props

| Prop                  | Type                                        | Optional | Description                                                  |
|-----------------------|---------------------------------------------|----------|--------------------------------------------------------------|
| `height`              | `number`                                    | Yes       | Specifies the height of the canvas displaying the waves.     |
| `gradient`            | `[string, string]`                          | Yes       | Defines two colors to create a gradient effect in the waves. |
| `speed`               | `number`                                    | Yes       | Determines the speed of the wave animation.                  |
| `animation`           | `boolean`                                   | Yes       | Enables or disables the wave animation.                      |
| `containerClassName`  | `string`                                    | Yes       | Applies a class to the container initiating the component.  |
| `containerNativeProps`| `Omit<HTMLAttributes<HTMLCanvasElement>, 'className' \| 'ref' \| 'width' \| 'height'>` | Yes | Allows additional native props to be passed to the container, excluding 'className', 'ref', 'width', and 'height'. |
