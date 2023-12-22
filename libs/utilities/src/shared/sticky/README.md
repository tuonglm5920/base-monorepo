# Overview

The `Sticky` class provides functionality to create sticky behavior for HTML elements within a scrollable container. This class allows elements to remain fixed at a specific position while scrolling, enhancing user experiences by enabling persistent UI elements within a scrollable area.

# API

### Methods

- **create()**: Initializes the sticky behavior for the element within the scrollable container.
- **destroy()**: Disables the sticky behavior and cleans up related event listeners and applied styles.
- **constructor({ $el, options })**: Creates a new instance of the Sticky class for a specified HTML element with customizable options.

### Options

- **offsetTop**: Optional offset from the top of the container where the sticky element should stick.
- **offsetBottom**: Optional offset from the bottom of the container where the sticky element should stick.
- **bottom**: Optional boolean flag to indicate whether the sticky element should stick to the bottom instead of the top.

# Examples

1. **_With react_**

```jsx
const useStickyBox = ({
  offsetTop = 0,
  offsetBottom = 0,
  bottom = false,
}: StickyBoxConfig = {}) => {
  const [el, setEl] = useState<HTMLElement | null>(null);
  useEffect(() => {
    if (!el || !stickyProp) return;
    const stickyInstance = new Sticky({
      $el: el,
      options: { offsetBottom, offsetTop, bottom }
    })
    stickyInstance.create();
    return () => {
      stickyInstance.destroy()
    };
  }, [el, offsetBottom, offsetTop, bottom]);

  return setEl;
};
```
