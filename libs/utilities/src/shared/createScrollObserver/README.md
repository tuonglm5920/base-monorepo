# Overview

The `createScrollObserver` utility streamlines the process of utilizing Intersection Observers in web applications. It allows for easy and efficient observation of element visibility changes in the viewport, which is crucial for features like lazy loading, animations, and monitoring element visibility for analytics. The utility provides a simple interface to create Intersection Observers with customizable configurations and manage listener functions.

# API

This utility exports a function that facilitates the creation and management of Intersection Observers. It allows for easy addition and removal of listeners for specific elements.

### Functions:

- **`createScrollObserver(config?: Config)`**: Initializes and returns an observer object with methods to manage listeners.

  - `config`: Optional configuration object, adhering to the `IntersectionObserverInit` specification.

- **`addListener(listener: ScrollObserverListener, target: Element | null)`**: Adds a listener to the observer. The listener is invoked when the visibility of the target element changes. If the target is null, the listener observes changes relative to the viewport.

  - `listener`: A callback function executed when the observed element's visibility changes.
  - `target`: The DOM element to be observed. If null, the viewport is used as the root.

- **`removeListener(listener: ScrollObserverListener)`**: Removes a previously added listener from the observer.

### Types:

- **`ScrollObserverListener`**: A callback function with no parameters, invoked when the observed element's visibility changes in the viewport.

- **`Config`**: An optional configuration object for the IntersectionObserver, following the `IntersectionObserverInit` interface.

# Examples

### 1. Create an Intersection Observer and Add a ScrollObserverListener

```javascript
const observer = createScrollObserver({
  root: null,
  rootMargin: '0px',
  threshold: 1.0,
});

// Define a listener
const visibilityChangeListener = () => {
  console.log('Element visibility changed!');
};

// Add listener to an element
const targetElement = document.getElementById('targetElement');
observer.addListener(visibilityChangeListener, targetElement);
```

### 2. Remove a ScrollObserverListener

```typescript
// Remove the listener when it's no longer needed
observer.removeListener(visibilityChangeListener);
```
