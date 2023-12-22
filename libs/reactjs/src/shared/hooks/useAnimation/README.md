# Overview

The `useAnimation` hook is a custom React hook designed to facilitate the use of the Web Animations API. It provides a straightforward way to define and control animations within React components. By taking an `AnimationDefinition`, this hook returns an `AnimationController` object, offering various methods to manage the animation lifecycle.

# Options

### Parameters

##### Generic Type

- **Args**: `AnyRecord | void` (default: `void`) - A type for arguments passed to the animation's keyframe function, allowing for dynamic keyframe generation.

##### Hook Parameters

- **props**: `AnimationDefinition<Args>` - The definition of the animation, including keyframes and options.

### Return Value

- `AnimationController<Args>`: An instance of AnimationController, providing methods and properties to control the animation.

# Examples

### Simple

```jsx
const App = () => {
  // 1. Define your animation in WAAPI way
  const animate = useAnimation({
    keyframe: [{ transform: "rotate(0deg)" }, { transform: "rotate(720deg)" }],
    options: {
      duration: 1000,
      easing: "ease-in-out",
    },
  });

  return (
    <button
      // 2. You have to pass animate to element you want to control
      ref={animate}
      onClick={() => {
        // 3. And play it!
        animate.play();
      }}
    >
      Click Me!
    </button>
  );
};
```

### Dynamic keyframe

```jsx
const Index: FC = () => {
  // Define argument type
  const animate = useAnimation<{ x: number; y: number }>({
    keyframe: (prev, args) => [
      // You can get current style from 1st argument
      { transform: prev.transform },
      // Get passed position from 2nd argument
      { transform: `translate(${args.x}px, ${args.y}px)` },
    ],
    options: {
      duration: 400,
      easing: 'ease-in-out',
    },
  });

  useEffect(() => {
    // If you click somewhere, the circle follows you!

    const onClick = (event: MouseEvent) => {
      // Pass mouse position when animate
      animate.play({
        args: { x: event.clientX, y: event.clientY },
      });
    };
    window.addEventListener('click', onClick);
    return () => {
      window.removeEventListener('click', onClick);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div
      ref={animate}
      style={{
        position: 'fixed',
        border: 'solid 0.1rem #135569',
        borderRadius: '50%',
        height: '6rem',
        width: '6rem',
        top: '-3rem',
        left: '-3rem',
      }}
    />
  );
};

```

### Progress tracking

````jsx
const App = () => {
  const [value, setValue] = useState(0);
  const animate = useAnimationFunction<number>(
    ({ progress }, arg) => {
      // Do anything here!
      setValue(progress * arg);
    },
    {
      duration: 600,
      easing: "ease-in-out",
    }
  );
  useEffect(() => {
    animate.play({ args: 100 });
  }, []);

  return <progress value={value} max={100} style={{ width: 600 }} />;
};
```

# Warning

### <u>Partial keyframes are not supported</u> error was thrown

```typescript
// valid
const animate = useAnimation([{ transform: "translate3d(0px, 0, 0)" }, { transform: "translate3d(400px, 0, 0)" }], { duration: 800, easing: "ease-in-out" });
// invalid
const animate = useAnimation({ transform: "translate3d(400px, 0, 0)" }, { duration: 800, easing: "ease-in-out" });

// valid
const animate = useAnimation(
  [
    { transform: "translateX(0px)", fill: "blue" },
    { transform: "translateX(100px)", fill: "red" },
    { transform: "translateX(0px)", fill: "blue" },
  ],
  { duration: 800, easing: "ease-in-out" },
);
// invalid
const animate = useAnimation([{ transform: "translateX(0px)" }, { transform: "translateX(100px)", fill: "red" }, { fill: "blue" }], { duration: 800, easing: "ease-in-out" });
````
