# Overview

`LightenseImage` is a TypeScript class designed to create an interactive image viewer. It enables zooming capabilities and additional interaction functionalities for an improved image viewing experience.

# Features

- **Image Viewer**: Zoom capability and interactive viewing experience.
- **Customizable Configuration**: Configure animation time, padding, keyboard interaction, and more.
- **Responsive**: Handles different image and viewport sizes for optimal display.
- **Event Hooks**: Utilize callback functions for before/after show and hide actions.

# API

## Methods

- **create()**: Initializes the image viewer by setting up necessary event listeners and styles.
- **destroy()**: Removes the image viewer, associated event listeners, and DOM elements.
- **constructor({ options, target })**: Initializes a new instance with the specified target image element and options.

## Options

- **time**: Animation duration in milliseconds.
- **padding**: Padding around the image.
- **offset**: Offset from the top to close the viewer.
- **keyboard**: Enable/disable keyboard interaction.
- **cubicBezier**: Cubic bezier for animation.
- **background**: Background color for the viewer.
- **backgroundFilter**: Background filter for the viewer.
- **zIndex**: Z-index for the viewer.
- **getSrcAttribute**: Function to extract source attribute from the target image element.

# Examples

```typescript
// Create LightenseImage instance
const imageViewer = new LightenseImage({
  time: 300,
  padding: 40,
  offset: 40,
  keyboard: true,
  cubicBezier: "cubic-bezier(.2, 0, .1, 1)",
  background: "var(--bg-color-80, rgba(255, 255, 255, .98))",
  backgroundFilter: "blur(30px)",
  zIndex: 1000000,
  getSrcAttribute: (target) => target.src,
});

// Initialize the image viewer
imageViewer.create();

// Destroy the image viewer
imageViewer.destroy();
```
