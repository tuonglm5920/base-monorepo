# MouseDirectionTracker

The `MouseDirectionTracker` class provides a straightforward way to detect and respond to mouse direction relative to an HTML element. It listens for mouse enter and leave events on the specified element and determines the mouse direction (top, right, bottom, left) based on the event's properties.

## API

#### Constructor

- **$el**: `HTMLElement` - The HTML element to which mouse direction tracking will be applied.

#### Methods

- `on()`: Attaches `mouseenter` and `mouseleave` event listeners to the HTML element. These listeners invoke the `handleHover` method, which calculates and sets the mouse direction.
- `off()`: Removes the `mouseenter` and `mouseleave` event listeners from the HTML element.
- `handleHover(event: MouseEvent)`: A handler function for mouse enter and leave events. It calculates the mouse direction based on the event properties and updates the element's `data-placement` attribute to reflect this direction.

# Examples

```html
<!-- index.html -->

<div id="app">
  <div class="hover">
    <img src="https://images.pexels.com/photos/5037913/pexels-photo-5037913.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="" />
    <div class="content"></div>
  </div>

  <div class="hover">
    <img src="https://images.pexels.com/photos/5037913/pexels-photo-5037913.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="" />
    <div class="content"></div>
  </div>

  <div class="hover">
    <img src="https://images.pexels.com/photos/5037913/pexels-photo-5037913.jpeg?auto=compress&cs=tinysrgb&dpr=2&h=750&w=1260" alt="" />
    <div class="content"></div>
  </div>
</div>
```

```css
/* styles.css */
body {
  font-family: sans-serif;
}

#app {
  max-width: 300px;
  margin: 100px auto;
}

img {
  max-width: 100%;
  height: auto;
  border: 0;
  vertical-align: midle;
}

.hover {
  position: relative;
  overflow: hidden;
}

.content {
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background-color: red;
  opacity: 0;
}

[data-placement="left"] .content {
  opacity: 1;
  animation: leftAnim forwards 0.3s;
}

@keyframes leftAnim {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(-100%);
  }
}

[data-placement="left"]:hover .content {
  animation: leftAnimHover forwards 0.3s;
}
@keyframes leftAnimHover {
  0% {
    transform: translateX(-100%);
  }
  100% {
    transform: translateX(0);
  }
}

[data-placement="right"] .content {
  opacity: 1;
  animation: rightAnim forwards 0.3s;
}

@keyframes rightAnim {
  0% {
    transform: translateX(0);
  }
  100% {
    transform: translateX(100%);
  }
}

[data-placement="right"]:hover .content {
  animation: rightAnimHover forwards 0.3s;
}
@keyframes rightAnimHover {
  0% {
    transform: translateX(100%);
  }
  100% {
    transform: translateX(0);
  }
}

[data-placement="top"] .content {
  opacity: 1;
  animation: topAnim forwards 0.3s;
}

@keyframes topAnim {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(-100%);
  }
}

[data-placement="top"]:hover .content {
  animation: topAnimHover forwards 0.3s;
}
@keyframes topAnimHover {
  0% {
    transform: translateY(-100%);
  }
  100% {
    transform: translateY(0);
  }
}

[data-placement="bottom"] .content {
  opacity: 1;
  animation: bottomAnim forwards 0.3s;
}

@keyframes bottomAnim {
  0% {
    transform: translateY(0);
  }
  100% {
    transform: translateY(100%);
  }
}

[data-placement="bottom"]:hover .content {
  animation: bottomAnimHover forwards 0.3s;
}
@keyframes bottomAnimHover {
  0% {
    transform: translateY(100%);
  }
  100% {
    transform: translateY(0);
  }
}
```

```javascript
document.querySelectorAll(".hover").forEach(($el) => new HoverImage($el));
```
