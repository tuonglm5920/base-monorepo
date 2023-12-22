# Overview

The `WebAnimationApi` class simplifies the use of the Web Animations API in web development. It provides an easy interface for creating, controlling, and monitoring animations on DOM elements. This class abstracts away the complexities of the native Web Animations API, making it more accessible and easier to use.

# API

#### Constructor

- **el**: `Element | null` - The DOM element to which the animation will be applied.
- **keyframes**: `Keyframe[] | null` - An array of keyframes that define the animation.
- **options**: `KeyframeEffectOptions | undefined` - Options to control the keyframe effects.
- **timeline**: `AnimationTimeline | undefined` - An optional timeline for the animation.

#### Methods

- `setTime(arg: number | ((endTime: number) => number))`: Sets the current time of the animation.
- `setRate(arg: number | ((prevRate: number) => number))`: Updates the playback rate of the animation.
- `waitFor(name: 'finish' | 'reverseFinish')`: Returns a promise that resolves when the specified animation event occurs.
- `reverse()`: Reverses the playback direction of the animation.
- `cancel()`: Cancels the animation, resetting it to its initial state.
- `finish()`: Forces the animation to jump to its end state and finish.
- `pause()`: Pauses the animation.
- `play(opts: { restart?: boolean })`: Starts or resumes the animation.

# Examples

```javascript
// Creating and controlling an animation
const element = document.getElementById("element");
const keyframes = [{ opacity: 0 }, { opacity: 1 }];
const options = { duration: 1000 };

const animationApi = new WebAnimationApi(element, keyframes, options);
animationApi.play();

// Assuming animationApi is already created and playing
animationApi.reverse();

// Pausing the animation
animationApi.pause();

// Resuming the animation
animationApi.play();
```

# Compatibility and Polyfills

The `WebAnimationApi` relies on the Web Animations API, which is a modern web standard. However, some legacy browsers may not fully support this API. In such cases, it is recommended to use a polyfill to ensure compatibility.

#### Using Polyfills

In environments or browsers that do not support the Web Animations API, you can use the `'web-animations-js'` polyfill:
