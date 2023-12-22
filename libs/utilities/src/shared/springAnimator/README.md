# Overview

The `SpringAnimator` class is a lightweight utility designed for creating spring-like animations and facilitating smooth property transitions. It enables developers to animate properties with a spring effect, allowing for dynamic motion effects across various applications and properties.

# API

### Parameters

- **options**: `Partial<Options>`: An object specifying configuration options for the SpringAnimator, which include:
  - **friction**: `number`: Controls the amount of friction applied to the animation. Recommended value 0-1. Default value is 0.3.
  - **acceleration**: `number`: Determines the rate at which the animation accelerates. Recommended value 0-1. Default value is 0.04.
  - **initialValue**: `number`: Defines the initial value for the animated properties.
  - **names**: `string[]`: Array of names (strings). SpringAnimator creates animated instance for each name. Defaults to single x value in array.
  - **shouldContinueAnimation**: `(instance: SpringAnimatorItem) => boolean`: Function testing whether the animation has finished. Function gets and animated instance as an argument. When `shouldContinueAnimation` function returns false for all animated instances, SpringAnimator stops the animation and sets values to target values.

### Methods

#### `set`

- **Parameters**:
  - `{ name: string; num: number | null }`: Object containing the property name and value to be set.
- **Returns**: `void`
- **Description**: Sets the value of the specified property.

#### `animate`

- **Parameters**:
  - `{ name: string; num: number | null }`: Object containing the property name and target value for animation.
- **Returns**: `number | void`
- **Description**: Animates the specified property towards the provided target value.

#### `on`

- **Parameters**:
  - `{ event: string; handler: Function }`: Object specifying the event name and the handler function to subscribe.
- **Returns**: `void`
- **Description**: Subscribes a handler function to a specified event.

#### `off`

- **Parameters**:
  - `{ event: string | null; handler?: Function }`: Object specifying the event name and optional handler function to unsubscribe.
- **Returns**: `void`
- **Description**: Unsubscribes a handler function from a specified event or clears all event handlers if no event name is provided.

# Examples

```html
<style>
  .circle {
    width: 40px;
    height: 40px;
    background: linear-gradient(to top left, #0062be, #00a2fe);
    border-radius: 50%;
    position: absolute;
    top: 50%;
    left: 50%;
    margin: -20px 0 0 -20px;
    pointer-events: none;
    mix-blend-mode: multiply;
    z-index: 10;
  }
</style>
<div id="circle" class="circle"></div>
<script>

  var springAnimator = new SpringAnimator({
    acceleration: 0.06,
    friction: 0.2,
    names: ["x", "y"],
  });

  // select circle element
  var circle = document.getElementById("circle") as HTMLElement;

  // set handler on springAnimator tick event
  springAnimator.on({
    event: "tick",
    handler: (instances) => {
      circle.style.transform = `translate3d(${instances.x.current}px, ${
        instances.y.current
      }px, 0) rotateX(${instances.x.velocity / 2}deg) rotateY(${
        instances.y.velocity / 2
      }deg)`;
    },
  });

  // call springAnimator animate method on mousemove
  document.addEventListener("mousemove", function (event) {
    springAnimator.animate({ name: "x", num: event.clientX - window.innerWidth / 2 });
    springAnimator.animate({ name: "y", num: event.clientY - window.innerHeight / 2 });
  });

  // log
  springAnimator.on({
    event: "start",
    handler: function () {
      console.log("start");
    },
  });

  springAnimator.on({
    event: "end",
    handler: function () {
      console.log("end");
    },
  });
</script>
```
