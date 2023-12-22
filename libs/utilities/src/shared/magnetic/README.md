# Overview

The `Magnetic` class provides functionality to create a magnetic effect on an HTML element that responds to mouse movement.

# API

- **Parameters**:
  - `$el`: `HTMLElement`: The HTML element to which the magnetic effect will be applied.

## Methods

### `create`

- **Parameters**: None
- **Returns**: `void`
- **Description**: Initializes the magnetic effect by setting up event listeners and animation handlers.

### `destroy`

- **Parameters**: None
- **Returns**: `void`
- **Description**: Destroys the magnetic effect by removing event listeners and stopping animations.

# Examples

```html
<style>
  /* Style for the element with the magnetic effect */
  #magneticElement {
    width: 100px;
    height: 100px;
    background-color: #3498db;
    position: absolute;
    top: 50%;
    left: 50%;
  }
</style>
<!-- Element to apply the magnetic effect -->
<div id="magneticElement"></div>
<script>
  // Get the HTML element to apply the effect to
  const element = document.getElementById("magneticElement");

  // Create an instance of the Magnetic class
  const magneticEffect = new Magnetic(element as HTMLElement);
</script>
```
