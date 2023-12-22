# Overview

`ScrollLerp` is a TypeScript class designed to enhance web applications with smooth, linear interpolated scrolling effects. This tool allows for easy implementation of smooth scrolling animations with customizable options, creating a more polished and engaging user experience.

# Features

- **Seamless Integration**: Easily add to your project with minimal setup requirements.
- **Customizable Scroll Animations**: Define start and end points, easing, and other scroll behavior.
- **Dynamic Scrolling Control**: Adjust scrolling behavior on-the-fly during runtime.
- **Performance Optimized**: Built to ensure smooth performance even on complex web pages.
- **Callback Support**: Utilize callback functions to hook into the scroll lifecycle for extended functionality.

# API

##### Methods

- **create()**: Sets up the scroll lerp effect and attaches necessary event listeners.
- **destroy()**: Removes the scroll lerp effect, event listeners, and resets the element's style.
- **constructor({ $el, $targetElement, options })**: Initializes a new ScrollLerp instance with the specified options.

##### Options

- **from**: Starting scroll position or a function returning it.
- **to**: Target scroll position or a function returning it.
- **lerpEase**: Optional easing value for the lerp transition.
- **onRender**: Optional callback function for each render frame.

# Examples

1. **Simple animation on scroll**

```typescript
// index.ts
import { ScrollLerp } from "scroll-lerp";

export interface InterpolateOptions {
  inputRange: number[];
  outputRange: number[];
  value: number;
  easing?: any;
  reverseEasing?: boolean;
}

export function _interpolate({ inputRange, outputRange, value, easing = (value: number) => value, reverseEasing = false }: InterpolateOptions) {
  const sortedRanges = inputRange.map((_, i) => ({ input: inputRange[i], output: outputRange[i] })).sort((a, b) => a.input - b.input);
  const sortedInputRange = sortedRanges.map(({ input }) => input);
  const sortedOutputRange = sortedRanges.map(({ output }) => output);

  if (value <= sortedInputRange[0]) {
    return sortedOutputRange[0];
  }

  if (value >= sortedInputRange[sortedInputRange.length - 1]) {
    return sortedOutputRange[sortedOutputRange.length - 1];
  }

  let i = 0;
  for (const inputValue of sortedInputRange) {
    if (inputValue < value) {
      i++;
    }
  }

  const j = i - 1;

  let ratio = (value - sortedInputRange[j]) / (sortedInputRange[i] - sortedInputRange[j]);
  if (typeof easing === "function") {
    if (reverseEasing) {
      ratio = 1 - easing(1 - ratio);
    } else {
      ratio = easing(ratio);
    }
  }
  return sortedOutputRange[j] * (1 - ratio) + sortedOutputRange[i] * ratio;
}
const objectKeys = <T extends Record<string, any>>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

function each<T extends any>(array: T[], callback: (value: T, index: number, array: T[]) => void) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}
function filter<T extends any>(array: T[], callback: (value: T, index: number, array: T[]) => boolean): T[] {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

function reduce<T extends any, R extends any>(array: T[], callback: (previousValue: R, currentValue: T, currentIndex: number, array: T[]) => R, initialValue: R): R {
  let accumulator = initialValue;
  for (let i = 0; i < array.length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }
  return accumulator;
}
function getWindow(el: Document): Window {
  return (el.nodeType === 9 && el.defaultView) as Window;
}

export function offset(el: HTMLElement) {
  const doc = el?.ownerDocument as Document;
  const docElem: Element = doc.documentElement;
  const win = getWindow(doc);
  let box = { top: 0, left: 0 };

  if (!doc) {
    return {
      top: 0,
      left: 0,
    };
  }

  if (typeof el.getBoundingClientRect !== typeof undefined) {
    box = el.getBoundingClientRect();
  }

  return {
    top: box.top + win.scrollY - docElem.clientTop,
    left: box.left + win.scrollX - docElem.clientLeft,
  };
}

const UNIT_PATTERN = /(px|%|vh|vw|em|rem|pt|cm|mm|in|pc|ex|ch|vmin|vmax|lh|rlh|vb|vi|svw|svh|lvw|lvh|dvw|dvh)/g;
const EMPTY = "===empty===";
const isMobile = {
  iOS: false,
};
const getDefaultUnit = (prop: any) => {
  switch (prop) {
    case "x":
    case "y":
    case "width":
    case "height":
    case "backgroundPositionY":
      return "px";
    case "rotate":
    case "rotateX":
    case "rotateY":
    case "skew":
    case "skewX":
    case "skewY":
      return "deg";
    case "scale":
    case "scaleX":
    case "scaleY":
    case "opacity":
    case "videoTime":
    default:
      return "";
  }
};

const getKeyframesByProp = (inputRange: any, keyframes: any, prop: any) => {
  if (Math.max(...inputRange) > 100) {
    throw new Error("Max value of input range must be less than 100%");
  }
  let prevVal = null;
  return reduce(
    inputRange,
    (arr, item) => {
      const key = `${item}%`;
      const val = keyframes[key][prop];
      if (val != null) {
        arr.push(String(val));
      }
      prevVal = arr[arr.length - 1];
      if (val == null && prevVal != null) {
        arr.push(prevVal);
      }
      return arr;
    },
    [] as string[],
  );
};

const interpolate = (inputRange: any, keyframes: any, value: number, prop: any) => {
  const outputRange = getKeyframesByProp(inputRange, keyframes, prop);
  const unit = String(outputRange[0]).replace(/[0-9.,-]/g, "");
  const outputRangeNumber = outputRange.map((item) => Number(String(item).replace(UNIT_PATTERN, "")));

  if (outputRange.length === 0) {
    return EMPTY;
  }
  const result = _interpolate({
    value,
    inputRange,
    outputRange: outputRangeNumber,
  });
  return `${result}${unit || getDefaultUnit(prop)}`;
};

const setStyles = (inputRange: any, keyframes: any, el: HTMLElement, value: number) => {
  const x = interpolate(inputRange, keyframes, value, "x");
  const y = interpolate(inputRange, keyframes, value, "y");
  const rotate = interpolate(inputRange, keyframes, value, "rotate");
  const rotateX = interpolate(inputRange, keyframes, value, "rotateX");
  const rotateY = interpolate(inputRange, keyframes, value, "rotateY");
  const scale = interpolate(inputRange, keyframes, value, "scale");
  const scaleX = interpolate(inputRange, keyframes, value, "scaleX");
  const scaleY = interpolate(inputRange, keyframes, value, "scaleY");
  const skew = interpolate(inputRange, keyframes, value, "skew");
  const skewX = interpolate(inputRange, keyframes, value, "skewX");
  const skewY = interpolate(inputRange, keyframes, value, "skewY");
  const opacity = interpolate(inputRange, keyframes, value, "opacity");
  const width = interpolate(inputRange, keyframes, value, "width");
  const height = interpolate(inputRange, keyframes, value, "height");
  const backgroundPositionY = interpolate(inputRange, keyframes, value, "backgroundPositionY");
  const videoTime = interpolate(inputRange, keyframes, value, "videoTime");
  const groupImg = interpolate(inputRange, keyframes, value, "groupImg");
  el.style.transform = filter([x === EMPTY ? "" : `translateX(${x})`, y === EMPTY ? "" : `translateY(${y})`, rotate === EMPTY ? "" : `rotate(${rotate})`, rotateX === EMPTY ? "" : `rotateX(${rotateX})`, rotateY === EMPTY ? "" : `rotateY(${rotateY})`, scale === EMPTY ? "" : `scale(${scale})`, scaleX === EMPTY ? "" : `scaleX(${scaleX})`, scaleY === EMPTY ? "" : `scaleY(${scaleY})`, skew === EMPTY ? "" : `skew(${skew})`, skewX === EMPTY ? "" : `skewX(${skewX})`, skewY === EMPTY ? "" : `skewY(${skewY})`], (item) => !!item && !item.includes(EMPTY)).join(" ");
  if (width !== EMPTY) {
    el.style.width = `${width}`;
  }
  if (height !== EMPTY) {
    el.style.height = `${height}`;
  }
  if (opacity !== EMPTY) {
    el.style.opacity = `${opacity}`;
  }
  if (backgroundPositionY !== EMPTY) {
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    if (isMobile.iOS) {
      el.style.backgroundPosition = `50% calc(${backgroundPositionY} * -1)`;
    } else {
      el.style.backgroundAttachment = "fixed";
      el.style.backgroundPosition = `50% ${backgroundPositionY}`;
    }
  }
  if (videoTime !== EMPTY) {
    const videoEl = el.querySelector("video");
    if (videoEl && videoEl.duration) {
      const currentTime = _interpolate({
        value: Number(videoTime.replace(UNIT_PATTERN, "")),
        inputRange: [0, 100],
        outputRange: [0, videoEl.duration],
      });
      videoEl.currentTime = currentTime;
    }
  }
  if (groupImg !== EMPTY) {
    if (window.getComputedStyle(el).position === "static") {
      el.style.position = "relative";
    }
    const imageEls = Array.from(el.querySelectorAll("img"));
    const currentIndex = Math.floor(
      _interpolate({
        value: Number(groupImg.replace(UNIT_PATTERN, "")),
        inputRange: [0, 100],
        outputRange: [0, imageEls.length - 1],
      }),
    );
    each(imageEls, (imageEl, index) => {
      imageEl.style.visibility = index === currentIndex ? "visible" : "hidden";
    });
  }
};

const getInputRange = (keyframes: any) => {
  return reduce(
    objectKeys(keyframes),
    (arr, item) => {
      const val = Number(typeof item === "string" ? item.replace("%", "") : item);
      if (isNaN(val)) {
        return arr;
      }
      return [...arr, val];
    },
    [] as number[],
  ).sort((a, b) => a - b);
};

const parallax1El = document.querySelector(".parallax1") as HTMLDivElement;
const parallax2El = document.querySelector(".parallax2") as HTMLDivElement;

const keyframes1 = {
  "0%": {
    y: 100,
    rotate: -180,
  },
  "50%": {
    y: 0,
    rotate: 0,
  },
  "100%": {
    y: -100,
    rotate: 180,
  },
};

const keyframes2 = {
  "0%": {
    x: 0,
    y: 100,
  },
  "50%": {
    x: 100,
    y: 0,
  },
  "100%": {
    x: 200,
    y: -100,
  },
};

const parallax1 = new ScrollLerp({
  $el: parallax1El,
  options: {
    setStyles: (value) => {
      setStyles(getInputRange(keyframes1), keyframes1, parallax1El, value);
    },
    from() {
      return offset(parallax1El).top - window.innerHeight;
    },
    to() {
      return offset(parallax1El).top;
    },
  },
});
parallax1.create();

const parallax2 = new ScrollLerp({
  $el: parallax2El,
  options: {
    setStyles: (value) => {
      setStyles(getInputRange(keyframes2), keyframes2, parallax2El, value);
    },
    from() {
      return offset(parallax2El).top - window.innerHeight;
    },
    to() {
      return offset(parallax2El).top;
    },
  },
});
parallax2.create();
```

```html
<html>
  <head>
    <style>
      :root {
        --color-primary: #fa5654;
        --rgb-color-primary: 250, 86, 84;
        --color-secondary: #3540df;
        --rgb-color-secondary: 53, 64, 223;
        --color-tertiary: #2ab885;
        --rgb-color-tertiary: 42, 184, 133;
        --color-quaternary: #fbc473;
        --rgb-color-quaternary: 251, 196, 115;
        --color-dark: #000000;
        --rgb-color-dark: 0, 0, 0;
        --color-gray9: #000000;
        --rgb-color-gray9: 0, 0, 0;
        --color-gray8: #484848;
        --rgb-color-gray8: 72, 72, 72;
        --color-gray7: #5a5a5a;
        --rgb-color-gray7: 90, 90, 90;
        --color-gray6: #6f6f6f;
        --rgb-color-gray6: 111, 111, 111;
        --color-gray5: #828282;
        --rgb-color-gray5: 130, 130, 130;
        --color-gray4: #969696;
        --rgb-color-gray4: 150, 150, 150;
        --color-gray3: #bdbdbd;
        --rgb-color-gray3: 189, 189, 189;
        --color-gray2: #e0e0e0;
        --rgb-color-gray2: 224, 224, 224;
        --color-gray1: #e8e8e8;
        --rgb-color-gray1: 232, 232, 232;
        --color-light: #ffffff;
        --rgb-color-light: 255, 255, 255;
        --color-primary-freeze: #fa5654;
        --rgb-color-primary-freeze: 250, 86, 84;
        --color-secondary-freeze: #3540df;
        --rgb-color-secondary-freeze: 53, 64, 223;
        --color-tertiary-freeze: #2ab885;
        --rgb-color-tertiary-freeze: 42, 184, 133;
        --color-quaternary-freeze: #fbc473;
        --rgb-color-quaternary-freeze: 251, 196, 115;
        --color-dark-freeze: #000000;
        --rgb-color-dark-freeze: 0, 0, 0;
        --color-gray9-freeze: #000000;
        --rgb-color-gray9-freeze: 0, 0, 0;
        --color-gray8-freeze: #484848;
        --rgb-color-gray8-freeze: 72, 72, 72;
        --color-gray7-freeze: #5a5a5a;
        --rgb-color-gray7-freeze: 90, 90, 90;
        --color-gray6-freeze: #6f6f6f;
        --rgb-color-gray6-freeze: 111, 111, 111;
        --color-gray5-freeze: #828282;
        --rgb-color-gray5-freeze: 130, 130, 130;
        --color-gray4-freeze: #969696;
        --rgb-color-gray4-freeze: 150, 150, 150;
        --color-gray3-freeze: #bdbdbd;
        --rgb-color-gray3-freeze: 189, 189, 189;
        --color-gray2-freeze: #e0e0e0;
        --rgb-color-gray2-freeze: 224, 224, 224;
        --color-gray1-freeze: #e8e8e8;
        --rgb-color-gray1-freeze: 232, 232, 232;
        --color-light-freeze: #ffffff;
        --rgb-color-light-freeze: 255, 255, 255;
        --font-primary: Jost;
        --font-secondary: Roboto;
        --font-tertiary: Mali;
        --font-quaternary: Poppins;
        --font-quinary: Spartan;
      }
      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      img {
        max-width: 100%;
        vertical-align: middle;
      }
      .veda-slider {
        margin-bottom: 30px;
      }
      .box {
        width: 100px;
        height: 100px;
        background-color: #f49595;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-top: 50px;
        margin-bottom: 50px;
        user-select: none;
        will-change: width, height;
      }

      .parallax-wrap {
        border: 1px solid #4e4cee;
        padding: 100px 30px;
      }

      .parallax {
        width: 100px;
        height: 100px;
        background-color: #4e4cee;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        will-change: transform;
      }
    </style>
  </head>
  <body>
    <h2>Scroll Down</h2>
    <div style="height: 1000px;"></div>
    <div class="container">
      <div style="height: 1000px;"></div>
      <h2>Parallax Scroll</h2>
      <div class="parallax-wrap">
        <div class="parallax parallax1">Scroll 1</div>
        <div class="parallax parallax2">Scroll 2</div>
      </div>
      <div style="height: 2000px;"></div>
    </div>
  </body>
</html>
```

2. **Parallax effect**

```typescript
// index.ts
import { ScrollLerp } from "scroll-lerp";

export function random(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export interface InterpolateOptions {
  inputRange: number[];
  outputRange: number[];
  value: number;
  easing?: any;
  reverseEasing?: boolean;
}

export function _interpolate({ inputRange, outputRange, value, easing = (value: number) => value, reverseEasing = false }: InterpolateOptions) {
  const sortedRanges = inputRange.map((_, i) => ({ input: inputRange[i], output: outputRange[i] })).sort((a, b) => a.input - b.input);
  const sortedInputRange = sortedRanges.map(({ input }) => input);
  const sortedOutputRange = sortedRanges.map(({ output }) => output);

  if (value <= sortedInputRange[0]) {
    return sortedOutputRange[0];
  }

  if (value >= sortedInputRange[sortedInputRange.length - 1]) {
    return sortedOutputRange[sortedOutputRange.length - 1];
  }

  let i = 0;
  for (const inputValue of sortedInputRange) {
    if (inputValue < value) {
      i++;
    }
  }

  const j = i - 1;

  let ratio = (value - sortedInputRange[j]) / (sortedInputRange[i] - sortedInputRange[j]);
  if (typeof easing === "function") {
    if (reverseEasing) {
      ratio = 1 - easing(1 - ratio);
    } else {
      ratio = easing(ratio);
    }
  }
  return sortedOutputRange[j] * (1 - ratio) + sortedOutputRange[i] * ratio;
}
const objectKeys = <T extends Record<string, any>>(obj: T): (keyof T)[] => {
  return Object.keys(obj) as (keyof T)[];
};

function each<T extends any>(array: T[], callback: (value: T, index: number, array: T[]) => void) {
  for (let i = 0; i < array.length; i++) {
    callback(array[i], i, array);
  }
}
function filter<T extends any>(array: T[], callback: (value: T, index: number, array: T[]) => boolean): T[] {
  const result = [];
  for (let i = 0; i < array.length; i++) {
    if (callback(array[i], i, array)) {
      result.push(array[i]);
    }
  }
  return result;
}

function reduce<T extends any, R extends any>(array: T[], callback: (previousValue: R, currentValue: T, currentIndex: number, array: T[]) => R, initialValue: R): R {
  let accumulator = initialValue;
  for (let i = 0; i < array.length; i++) {
    accumulator = callback(accumulator, array[i], i, array);
  }
  return accumulator;
}
function getWindow(el: Document): Window {
  return (el.nodeType === 9 && el.defaultView) as Window;
}

export function offset(el: HTMLElement) {
  const doc = el?.ownerDocument as Document;
  const docElem: Element = doc.documentElement;
  const win = getWindow(doc);
  let box = { top: 0, left: 0 };

  if (!doc) {
    return {
      top: 0,
      left: 0,
    };
  }

  if (typeof el.getBoundingClientRect !== typeof undefined) {
    box = el.getBoundingClientRect();
  }

  return {
    top: box.top + win.scrollY - docElem.clientTop,
    left: box.left + win.scrollX - docElem.clientLeft,
  };
}

const UNIT_PATTERN = /(px|%|vh|vw|em|rem|pt|cm|mm|in|pc|ex|ch|vmin|vmax|lh|rlh|vb|vi|svw|svh|lvw|lvh|dvw|dvh)/g;
const EMPTY = "===empty===";
const isMobile = {
  iOS: false,
};
const getDefaultUnit = (prop: any) => {
  switch (prop) {
    case "x":
    case "y":
    case "width":
    case "height":
    case "backgroundPositionY":
      return "px";
    case "rotate":
    case "rotateX":
    case "rotateY":
    case "skew":
    case "skewX":
    case "skewY":
      return "deg";
    case "scale":
    case "scaleX":
    case "scaleY":
    case "opacity":
    case "videoTime":
    default:
      return "";
  }
};

const getKeyframesByProp = (inputRange: any, keyframes: any, prop: any) => {
  if (Math.max(...inputRange) > 100) {
    throw new Error("Max value of input range must be less than 100%");
  }
  let prevVal = null;
  return reduce(
    inputRange,
    (arr, item) => {
      const key = `${item}%`;
      const val = keyframes[key][prop];
      if (val != null) {
        arr.push(String(val));
      }
      prevVal = arr[arr.length - 1];
      if (val == null && prevVal != null) {
        arr.push(prevVal);
      }
      return arr;
    },
    [] as string[],
  );
};

const interpolate = (inputRange: any, keyframes: any, value: number, prop: any) => {
  const outputRange = getKeyframesByProp(inputRange, keyframes, prop);
  const unit = String(outputRange[0]).replace(/[0-9.,-]/g, "");
  const outputRangeNumber = outputRange.map((item) => Number(String(item).replace(UNIT_PATTERN, "")));

  if (outputRange.length === 0) {
    return EMPTY;
  }
  const result = _interpolate({
    value,
    inputRange,
    outputRange: outputRangeNumber,
  });
  return `${result}${unit || getDefaultUnit(prop)}`;
};

const setStyles = (inputRange: any, keyframes: any, el: HTMLElement, value: number) => {
  const x = interpolate(inputRange, keyframes, value, "x");
  const y = interpolate(inputRange, keyframes, value, "y");
  const rotate = interpolate(inputRange, keyframes, value, "rotate");
  const rotateX = interpolate(inputRange, keyframes, value, "rotateX");
  const rotateY = interpolate(inputRange, keyframes, value, "rotateY");
  const scale = interpolate(inputRange, keyframes, value, "scale");
  const scaleX = interpolate(inputRange, keyframes, value, "scaleX");
  const scaleY = interpolate(inputRange, keyframes, value, "scaleY");
  const skew = interpolate(inputRange, keyframes, value, "skew");
  const skewX = interpolate(inputRange, keyframes, value, "skewX");
  const skewY = interpolate(inputRange, keyframes, value, "skewY");
  const opacity = interpolate(inputRange, keyframes, value, "opacity");
  const width = interpolate(inputRange, keyframes, value, "width");
  const height = interpolate(inputRange, keyframes, value, "height");
  const backgroundPositionY = interpolate(inputRange, keyframes, value, "backgroundPositionY");
  const videoTime = interpolate(inputRange, keyframes, value, "videoTime");
  const groupImg = interpolate(inputRange, keyframes, value, "groupImg");
  el.style.transform = filter([x === EMPTY ? "" : `translateX(${x})`, y === EMPTY ? "" : `translateY(${y})`, rotate === EMPTY ? "" : `rotate(${rotate})`, rotateX === EMPTY ? "" : `rotateX(${rotateX})`, rotateY === EMPTY ? "" : `rotateY(${rotateY})`, scale === EMPTY ? "" : `scale(${scale})`, scaleX === EMPTY ? "" : `scaleX(${scaleX})`, scaleY === EMPTY ? "" : `scaleY(${scaleY})`, skew === EMPTY ? "" : `skew(${skew})`, skewX === EMPTY ? "" : `skewX(${skewX})`, skewY === EMPTY ? "" : `skewY(${skewY})`], (item) => !!item && !item.includes(EMPTY)).join(" ");
  if (width !== EMPTY) {
    el.style.width = `${width}`;
  }
  if (height !== EMPTY) {
    el.style.height = `${height}`;
  }
  if (opacity !== EMPTY) {
    el.style.opacity = `${opacity}`;
  }
  if (backgroundPositionY !== EMPTY) {
    el.style.backgroundSize = "cover";
    el.style.backgroundPosition = "center";
    if (isMobile.iOS) {
      el.style.backgroundPosition = `50% calc(${backgroundPositionY} * -1)`;
    } else {
      el.style.backgroundAttachment = "fixed";
      el.style.backgroundPosition = `50% ${backgroundPositionY}`;
    }
  }
  if (videoTime !== EMPTY) {
    const videoEl = el.querySelector("video");
    if (videoEl && videoEl.duration) {
      const currentTime = _interpolate({
        value: Number(videoTime.replace(UNIT_PATTERN, "")),
        inputRange: [0, 100],
        outputRange: [0, videoEl.duration],
      });
      videoEl.currentTime = currentTime;
    }
  }
  if (groupImg !== EMPTY) {
    if (window.getComputedStyle(el).position === "static") {
      el.style.position = "relative";
    }
    const imageEls = Array.from(el.querySelectorAll("img"));
    const currentIndex = Math.floor(
      _interpolate({
        value: Number(groupImg.replace(UNIT_PATTERN, "")),
        inputRange: [0, 100],
        outputRange: [0, imageEls.length - 1],
      }),
    );
    each(imageEls, (imageEl, index) => {
      imageEl.style.visibility = index === currentIndex ? "visible" : "hidden";
    });
  }
};

const getInputRange = (keyframes: any) => {
  return reduce(
    objectKeys(keyframes),
    (arr, item) => {
      const val = Number(typeof item === "string" ? item.replace("%", "") : item);
      if (isNaN(val)) {
        return arr;
      }
      return [...arr, val];
    },
    [] as number[],
  ).sort((a, b) => a - b);
};

const prItemEls = Array.from(document.querySelectorAll(".pr-item") ?? []) as HTMLElement[];
const prSectionEl = document.querySelector(".pr-section") as HTMLElement;

prItemEls.forEach((prItemEl, index) => {
  const left = random(5, 40);
  const right = random(60, 95);
  const randomLeft = index < prItemEls.length / 2 ? left : right;
  const scale = random(10, 25) / 10;

  prItemEl.style.top = `${random(5, 95)}%`;
  prItemEl.style.left = `${randomLeft}%`;
  prItemEl.style.zIndex = `${scale * 10}`;
  prItemEl.children[0].style.transform = `scale(${scale})`;

  const keyframes = {
    "0%": {
      y: 100 * scale,
    },
    "100%": {
      y: -100 * scale,
    },
  };
  const parallax = new ScrollLerp({
    $el: prItemEl,
    options: {
      from() {
        return offset(prSectionEl).top - window.innerHeight;
      },
      to() {
        return offset(prSectionEl).top + prSectionEl.offsetHeight;
      },
      setStyles: (value) => {
        setStyles(getInputRange(keyframes), keyframes, prItemEl, value);
      },
    },
  });
  parallax.create();
});
```

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <style id="veda-mota-css">
      body .fa,
      body .fal,
      body .far,
      body .fas,
      body .fa:before,
      body .fal:before,
      body .far:before,
      body .fas:before {
        font-family: "Font Awesome 5 Pro" !important;
      }

      [dir="rtl"] body .bdl\:none\! {
        border-left: initial;
      }
      [dir="rtl"] body .bdl\:0px\! {
        border-left: initial;
      }
      [dir="rtl"] body .bdl\:0\! {
        border-left: initial;
      }
      [dir="rtl"] body .l\:0 {
        left: initial;
      }
      [dir="rtl"] body .l\:50\% {
        left: initial;
      }
      [dir="rtl"] body .l\:40px {
        left: initial;
      }
      [dir="rtl"] body .l\:5px {
        left: initial;
      }
      [dir="rtl"] body .l\:10px {
        left: initial;
      }
      [dir="rtl"] body .l\:20px\! {
        left: initial;
      }
      [dir="rtl"] body .l\:-6px {
        left: initial;
      }
      [dir="rtl"] body .mr\:10px {
        margin-right: initial;
      }
      [dir="rtl"] body .mr\:4px {
        margin-right: initial;
      }
      [dir="rtl"] body .mr\:-3px {
        margin-right: initial;
      }
      [dir="rtl"] body .mr\:15px {
        margin-right: initial;
      }
      [dir="rtl"] body .mr\:5px {
        margin-right: initial;
      }
      [dir="rtl"] body .ml\:15px {
        margin-left: initial;
      }
      [dir="rtl"] body .ml\:10px {
        margin-left: initial;
      }
      [dir="rtl"] body .ml\:20px {
        margin-left: initial;
      }
      [dir="rtl"] body .ml\:-3px {
        margin-left: initial;
      }
      [dir="rtl"] body .ml\:-10px {
        margin-left: initial;
      }
      [dir="rtl"] body .pr\:2px {
        padding-right: initial;
      }
      [dir="rtl"] body .pr\:10px {
        padding-right: initial;
      }
      [dir="rtl"] body .pr\:15px {
        padding-right: initial;
      }
      [dir="rtl"] body .pl\:2px {
        padding-left: initial;
      }
      [dir="rtl"] body .pl\:10px {
        padding-left: initial;
      }
      [dir="rtl"] body .pl\:15px {
        padding-left: initial;
      }
      [dir="rtl"] body .pl\:15px\! {
        padding-left: initial;
      }
      [dir="rtl"] body .pl\:30px {
        padding-left: initial;
      }
      [dir="rtl"] body .r\:-12px {
        right: initial;
      }
      [dir="rtl"] body .r\:0 {
        right: initial;
      }
      [dir="rtl"] body .r\:10px {
        right: initial;
      }
      [dir="rtl"] body .r\:5px {
        right: initial;
      }
      [dir="rtl"] body .r\:20px\! {
        right: initial;
      }
      [dir="rtl"] body .r\:-6px {
        right: initial;
      }
      [dir="rtl"] body .l\:auto\@sm {
        left: initial;
      }
      [dir="rtl"] body .l\:-60px\@sm {
        left: initial;
      }
      [dir="rtl"] body .l\:0\@sm {
        left: initial;
      }
      [dir="rtl"] body .pr\:30px\@sm {
        padding-right: initial;
      }
      [dir="rtl"] body .pl\:30px\@sm {
        padding-left: initial;
      }
      [dir="rtl"] body .r\:0\@sm {
        right: initial;
      }
      [class*="lines-"] {
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-box-orient: vertical;
      }
      .lines-2 {
        -webkit-line-clamp: 2;
      }
      .lines- {
        -webkit-line-clamp: 0;
      }
      [class*="table-responsive-"] {
        table-layout: fixed;
        width: 100%;
        border-collapse: collapse;
      }
      body .ins\:0 {
        top: 0;
        right: 0;
        bottom: 0;
        left: 0;
      }
      body .anim\:fill_0\.4s_ease-in-out_0\.4s_forwards\,scale_0\.3s_ease-in-out_0\.9s_both {
        animation:
          fill 0.4s ease-in-out 0.4s forwards,
          scale 0.3s ease-in-out 0.9s both;
      }
      body .anim\:stroke_0\.6s_cubic-bezier\(0\.65\,0\,0\.45\,1\)_forwards {
        animation: stroke 0.6s cubic-bezier(0.65, 0, 0.45, 1) forwards;
      }
      body .anim\:stroke_0\.3s_cubic-bezier\(0\.65\,0\,0\.45\,1\)_0\.8s_forwards {
        animation: stroke 0.3s cubic-bezier(0.65, 0, 0.45, 1) 0.8s forwards;
      }
      body .ap\:none {
        appearance: none;
      }
      body .bd\:1px_solid {
        border: 1px solid;
      }
      body .bd\:1px_solid_color-gray3 {
        border: 1px solid var(--color-gray3);
      }
      body .bd\:none\! {
        border: none !important;
      }
      body .bd\:none {
        border: none;
      }
      body .bd\:1px_solid_color-gray2 {
        border: 1px solid var(--color-gray2);
      }
      html.desktop body .bd\:1px_solid_color-gray9\|h:hover {
        border: 1px solid var(--color-gray9);
      }
      body .bd\:1px_solid_color-gray9 {
        border: 1px solid var(--color-gray9);
      }
      body .bd\:1px_solid_color-primary {
        border: 1px solid var(--color-primary);
      }
      body .bd\:1px_solid_color-gray8 {
        border: 1px solid var(--color-gray8);
      }
      html.desktop body .group\*:hover .bd\:1px_solid_color-gray8\*group-hover {
        border: 1px solid var(--color-gray8);
      }
      html.desktop body .bd\:1px_solid_color-gray9\|h\!:hover {
        border: 1px solid var(--color-gray9) !important;
      }
      body .bd\:1px_solid_color-gray1 {
        border: 1px solid var(--color-gray1);
      }
      body .bdl\:none\! {
        border-left: none !important;
      }
      [dir="rtl"] body .bdl\:none\! {
        border-right: none !important;
      }
      body .bdl\:0px\! {
        border-left: 0px !important;
      }
      [dir="rtl"] body .bdl\:0px\! {
        border-right: 0px !important;
      }
      body .bdl\:0\! {
        border-left: 0 !important;
      }
      [dir="rtl"] body .bdl\:0\! {
        border-right: 0 !important;
      }
      body .bdt\:1px_solid_color-gray2 {
        border-top: 1px solid var(--color-gray2);
      }
      body .bdt\:0px\! {
        border-top: 0px !important;
      }
      body .bdb\:1px_solid_color-gray3 {
        border-bottom: 1px solid var(--color-gray3);
      }
      body .bdb\:1px_solid_color-gray2\|lc:last-child {
        border-bottom: 1px solid var(--color-gray2);
      }
      body .bdb\:1px_solid_color-gray2 {
        border-bottom: 1px solid var(--color-gray2);
      }
      body .bdw\:0 {
        border-width: 0;
      }
      body .bdrs\:5px {
        border-radius: 5px;
      }
      body .bdrs\:11px {
        border-radius: 11px;
      }
      body .bdrs\:15px {
        border-radius: 15px;
      }
      body .bdrs\:4px {
        border-radius: 4px;
      }
      body .bdrs\:50\% {
        border-radius: 50%;
      }
      body .bdrs\:2px {
        border-radius: 2px;
      }
      body .bdrs\:6px {
        border-radius: 6px;
      }
      body .bgc\:color-dark-freeze {
        background-color: var(--color-dark-freeze);
      }
      body .bgc\:color-light {
        background-color: var(--color-light);
      }
      body .bgc\:\#eb4747 {
        background-color: #eb4747;
      }
      body .bgc\:color-gray9\.4 {
        background-color: rgba(var(--rgb-color-gray9), 0.4);
      }
      body .bgc\:transparent {
        background-color: transparent;
      }
      html.desktop body .bgc\:transparent\!\|h:hover {
        background-color: transparent !important;
      }
      body .bgc\:color-gray1 {
        background-color: var(--color-gray1);
      }
      body .bgc\:color-dark-freeze\.4 {
        background-color: rgba(var(--rgb-color-dark-freeze), 0.4);
      }
      body .bgc\:color-primary {
        background-color: var(--color-primary);
      }
      html.desktop body .bgc\:color-gray9\|h\!:hover {
        background-color: var(--color-gray9) !important;
      }
      html.desktop body .bgc\:color-light\|h\!:hover {
        background-color: var(--color-light) !important;
      }
      body .bgc\:color-dark-freeze\.6 {
        background-color: rgba(var(--rgb-color-dark-freeze), 0.6);
      }
      body .bgc\:color-gray9 {
        background-color: var(--color-gray9);
      }
      body .bgc\:color-gray2 {
        background-color: var(--color-gray2);
      }
      body .bgc\:center {
        background-color: center;
      }
      body .bgc\:color-light\! {
        background-color: var(--color-light) !important;
      }
      html.desktop body .bgc\:transparent\|h\!:hover {
        background-color: transparent !important;
      }
      body .bgc\:color-dark {
        background-color: var(--color-dark);
      }
      html.desktop body .bgc\:color-dark\!\|h:hover {
        background-color: var(--color-dark) !important;
      }
      body .bgc\:\#219653 {
        background-color: #219653;
      }
      body .bgc\:\#AF0707 {
        background-color: #af0707;
      }
      html.desktop body .bgc\:color-dark-freeze\|h\!:hover {
        background-color: var(--color-dark-freeze) !important;
      }
      html.desktop body .bgc\:color-dark\|h\!:hover {
        background-color: var(--color-dark) !important;
      }
      body .bgc\:rgba\(0\,0\,0\,0\.5\) {
        background-color: rgba(0, 0, 0, 0.5);
      }
      body .bgc\:\#fff {
        background-color: #fff;
      }
      body .bgc\:\#2C36DC {
        background-color: #2c36dc;
      }
      body .bgc\:\#f2f2f7 {
        background-color: #f2f2f7;
      }
      html.desktop body .bgc\:color-gray1\|h:hover {
        background-color: var(--color-gray1);
      }
      html.desktop body .bgc\:color-gray2\|h:hover {
        background-color: var(--color-gray2);
      }
      body .bgc\:var\(--ui-color-primary\) {
        background-color: var(--ui-color-primary);
      }
      body .bgz\:cover {
        background-size: cover;
      }
      body .bga\:fixed {
        background-attachment: fixed;
      }
      body .bgp\:50\%_50\% {
        background-position: 50% 50%;
      }
      body .bgp\:center {
        background-position: center;
      }
      body .bxsh\:0_3px_5px_color-gray9\.2 {
        box-shadow: 0 3px 5px rgba(var(--rgb-color-gray9), 0.2);
      }
      [dir="rtl"] body .bxsh\:0_3px_5px_color-gray9\.2 {
        box-shadow: 0 3px 5px rgba(var(--rgb-color-gray9), -0.2);
      }
      body .bxsh\:0_0_5px_color-gray9\.2 {
        box-shadow: 0 0 5px rgba(var(--rgb-color-gray9), 0.2);
      }
      [dir="rtl"] body .bxsh\:0_0_5px_color-gray9\.2 {
        box-shadow: 0 0 5px rgba(var(--rgb-color-gray9), -0.2);
      }
      body .bxsh\:0_5px_10px_color-gray9\.1 {
        box-shadow: 0 5px 10px rgba(var(--rgb-color-gray9), 0.1);
      }
      [dir="rtl"] body .bxsh\:0_5px_10px_color-gray9\.1 {
        box-shadow: 0 5px 10px rgba(var(--rgb-color-gray9), -0.1);
      }
      body .bxsh\:inset_0px_0px_0px_\#7ac142 {
        box-shadow: inset 0px 0px 0px #7ac142;
      }
      body .bxsh\:none {
        box-shadow: none;
      }
      body .bxsh\:0px_5px_15px_rgba\(33\,34\,35\,0\.12\) {
        box-shadow: 0px 5px 15px rgba(33, 34, 35, 0.12);
      }
      body .c\:color-light-freeze {
        color: var(--color-light-freeze);
      }
      body .c\:color-gray9 {
        color: var(--color-gray9);
      }
      html.desktop body .c\:color-gray9-freeze\.7\|h:hover {
        color: rgba(var(--rgb-color-gray9-freeze), 0.7);
      }
      body .c\:color-primary {
        color: var(--color-primary);
      }
      body .c\:color-dark {
        color: var(--color-dark);
      }
      body .c\:color-gray4 {
        color: var(--color-gray4);
      }
      html.desktop body .c\:color-dark\!\|h:hover {
        color: var(--color-dark) !important;
      }
      body .c\:color-gray5 {
        color: var(--color-gray5);
      }
      html.desktop body .c\:color-gray9\|h\!:hover {
        color: var(--color-gray9) !important;
      }
      body .c\:color-light {
        color: var(--color-light);
      }
      html.desktop body .c\:color-light\|h\!:hover {
        color: var(--color-light) !important;
      }
      body .c\:\#18a1ff {
        color: #18a1ff;
      }
      body .c\:\#ff4d4f {
        color: #ff4d4f;
      }
      body .c\:\#52c41a {
        color: #52c41a;
      }
      body .c\:\#faad14 {
        color: #faad14;
      }
      body .c\:color-gray8 {
        color: var(--color-gray8);
      }
      body .c\:color-gray6 {
        color: var(--color-gray6);
      }
      body .c\:color-gray7 {
        color: var(--color-gray7);
      }
      body .c\:color-gray9\! {
        color: var(--color-gray9) !important;
      }
      html.desktop body .c\:color-primary\|h:hover {
        color: var(--color-primary);
      }
      html.desktop body .c\:color-light\!\|h:hover {
        color: var(--color-light) !important;
      }
      html.desktop body .group\*:hover .c\:color-primary\*group-hover {
        color: var(--color-primary);
      }
      html.desktop body .c\:color-light-freeze\|h\!:hover {
        color: var(--color-light-freeze) !important;
      }
      html.desktop body .c\:color-dark\|h\!:hover {
        color: var(--color-dark) !important;
      }
      body .c\:\#9E9E9E {
        color: #9e9e9e;
      }
      body .c\:\#2C36DC\! {
        color: #2c36dc !important;
      }
      body .c\:\#fff\! {
        color: #fff !important;
      }
      body .c\:\#26256C\! {
        color: #26256c !important;
      }
      body .cur\:pointer {
        cursor: pointer;
      }
      body .cur\:nwse-resize {
        cursor: nwse-resize;
      }
      body .cur\:col-resize {
        cursor: col-resize;
      }
      body .cur\:nesw-resize {
        cursor: nesw-resize;
      }
      body .cur\:row-resize {
        cursor: row-resize;
      }
      body .d\:flex {
        display: flex;
      }
      body .d\:inline-block {
        display: inline-block;
      }
      body .d\:none\! {
        display: none !important;
      }
      body .d\:block {
        display: block;
      }
      body .d\:inline-block\! {
        display: inline-block !important;
      }
      body .d\:flex\! {
        display: flex !important;
      }
      body .d\:block\! {
        display: block !important;
      }
      body .d\:none {
        display: none;
      }
      html.desktop body .group\*:hover .d\:flex\*group-hover {
        display: flex;
      }
      body .flxs\:0 {
        flex-shrink: 0;
      }
      body .fld\:column {
        flex-direction: column;
      }
      body .fld\:row {
        flex-direction: row;
      }
      body .ai\:center {
        align-items: center;
      }
      body .ai\:flex-start {
        align-items: flex-start;
      }
      body .jc\:center {
        justify-content: center;
      }
      body .jc\:space-between {
        justify-content: space-between;
      }
      body .jc\:flex-start {
        justify-content: flex-start;
      }
      body .jc\:flex-end {
        justify-content: flex-end;
      }
      body .flw\:wrap {
        flex-wrap: wrap;
      }
      body .fxw\:wrap {
        flex-wrap: wrap;
      }
      body .ff\:font-secondary {
        font-family: var(--font-secondary);
      }
      body .fw\:400 {
        font-weight: 400;
      }
      body .fw\:500 {
        font-weight: 500;
      }
      body .fw\:600 {
        font-weight: 600;
      }
      body .fw\:300 {
        font-weight: 300;
      }
      body .fz\:50px {
        font-size: 50px;
      }
      body .fz\:11px {
        font-size: 11px;
      }
      body .fz\:20px {
        font-size: 20px;
      }
      body .fz\:15px {
        font-size: 15px;
      }
      body .fz\:13px {
        font-size: 13px;
      }
      body .fz\:30px {
        font-size: 30px;
      }
      body .fz\:26px {
        font-size: 26px;
      }
      body .fz\:14px {
        font-size: 14px;
      }
      body .fz\:18px {
        font-size: 18px;
      }
      body .fz\:13px\|\|be::before {
        font-size: 13px;
      }
      body .fz\:24px {
        font-size: 24px;
      }
      body .fz\:inherit {
        font-size: inherit;
      }
      body .fz\:pfs\(18px\,30px\) {
        font-size: clamp(18px, 1.5vw + 12px, 30px);
      }
      body .fz\:pfs\(16px\,21px\) {
        font-size: clamp(16px, 0.625vw + 13.5px, 21px);
      }
      body .fz\:pfs\(13px\,15px\) {
        font-size: clamp(13px, 0.25vw + 12px, 15px);
      }
      body .fz\:17px {
        font-size: 17px;
      }
      body .fz\:14px\|\|be::before {
        font-size: 14px;
      }
      body .fz\:16px {
        font-size: 16px;
      }
      body .fz\:28px {
        font-size: 28px;
      }
      body .fz\:10px {
        font-size: 10px;
      }
      body .h\:150vh {
        height: 150vh;
      }
      body .h\:50px {
        height: 50px;
      }
      body .h\:18px {
        height: 18px;
      }
      body .h\:100\% {
        height: 100%;
      }
      body .h\:95\% {
        height: 95%;
      }
      body .h\:105px {
        height: 105px;
      }
      body .h\:30px {
        height: 30px;
      }
      body .h\:40px {
        height: 40px;
      }
      body .h\:20px {
        height: 20px;
      }
      body .h\:36px {
        height: 36px;
      }
      body .h\:14px {
        height: 14px;
      }
      body .h\:100\%\! {
        height: 100% !important;
      }
      body .h\:52px {
        height: 52px;
      }
      body .h\:550px {
        height: 550px;
      }
      body .h\:calc\(100\%_-_48px\) {
        height: calc(100% - 48px);
      }
      body .h\:127px {
        height: 127px;
      }
      body .h\:fit-content {
        height: fit-content;
      }
      body .h\:12px {
        height: 12px;
      }
      body .h\:8px {
        height: 8px;
      }
      body .h\:4px {
        height: 4px;
      }
      body .h\:2px {
        height: 2px;
      }
      body .l\:0 {
        left: 0;
      }
      [dir="rtl"] body .l\:0 {
        right: 0;
      }
      body .l\:50\% {
        left: 50%;
      }
      [dir="rtl"] body .l\:50\% {
        right: 50%;
      }
      body .l\:40px {
        left: 40px;
      }
      [dir="rtl"] body .l\:40px {
        right: 40px;
      }
      body .l\:5px {
        left: 5px;
      }
      [dir="rtl"] body .l\:5px {
        right: 5px;
      }
      body .l\:10px {
        left: 10px;
      }
      [dir="rtl"] body .l\:10px {
        right: 10px;
      }
      body .l\:20px\! {
        left: 20px !important;
      }
      [dir="rtl"] body .l\:20px\! {
        right: 20px !important;
      }
      body .l\:-6px {
        left: -6px;
      }
      [dir="rtl"] body .l\:-6px {
        right: -6px;
      }
      body .lts\:0\.15px {
        letter-spacing: 0.15px;
      }
      body .lh\:30px {
        line-height: 30px;
      }
      body .lh\:52px {
        line-height: 52px;
      }
      body .lh\:50px {
        line-height: 50px;
      }
      body .lh\:1\.5 {
        line-height: 1.5;
      }
      body .m\:2px {
        margin: 2px;
      }
      body .m\:0px_2px_0px_2px {
        margin: 0px 2px 0px 2px;
      }
      body .m\:6px {
        margin: 6px;
      }
      body .m\:0 {
        margin: 0;
      }
      body .mt\:10px {
        margin-top: 10px;
      }
      body .mt\:5px {
        margin-top: 5px;
      }
      body .mt\:17px {
        margin-top: 17px;
      }
      body .mt\:26px {
        margin-top: 26px;
      }
      body .mt\:18px {
        margin-top: 18px;
      }
      body .mt\:20px {
        margin-top: 20px;
      }
      body .mt\:0\|e:empty {
        margin-top: 0;
      }
      body .mt\:15px {
        margin-top: 15px;
      }
      body .mt\:11px {
        margin-top: 11px;
      }
      body .mt\:14px {
        margin-top: 14px;
      }
      body .mt\:25px {
        margin-top: 25px;
      }
      body .mr\:10px {
        margin-right: 10px;
      }
      [dir="rtl"] body .mr\:10px {
        margin-left: 10px;
      }
      body .mr\:4px {
        margin-right: 4px;
      }
      [dir="rtl"] body .mr\:4px {
        margin-left: 4px;
      }
      body .mr\:-3px {
        margin-right: -3px;
      }
      [dir="rtl"] body .mr\:-3px {
        margin-left: -3px;
      }
      body .mr\:15px {
        margin-right: 15px;
      }
      [dir="rtl"] body .mr\:15px {
        margin-left: 15px;
      }
      body .mr\:5px {
        margin-right: 5px;
      }
      [dir="rtl"] body .mr\:5px {
        margin-left: 5px;
      }
      body .mb\:105px {
        margin-bottom: 105px;
      }
      body .mb\:10px {
        margin-bottom: 10px;
      }
      body .mb\:15px {
        margin-bottom: 15px;
      }
      body .ml\:15px {
        margin-left: 15px;
      }
      [dir="rtl"] body .ml\:15px {
        margin-right: 15px;
      }
      body .ml\:10px {
        margin-left: 10px;
      }
      [dir="rtl"] body .ml\:10px {
        margin-right: 10px;
      }
      body .ml\:20px {
        margin-left: 20px;
      }
      [dir="rtl"] body .ml\:20px {
        margin-right: 20px;
      }
      body .ml\:-3px {
        margin-left: -3px;
      }
      [dir="rtl"] body .ml\:-3px {
        margin-right: -3px;
      }
      body .ml\:-10px {
        margin-left: -10px;
      }
      [dir="rtl"] body .ml\:-10px {
        margin-right: -10px;
      }
      body .mah\:550px {
        max-height: 550px;
      }
      body .mah\:458px {
        max-height: 458px;
      }
      body .mah\:390px {
        max-height: 390px;
      }
      body .maw\:500px {
        max-width: 500px;
      }
      body .maw\:1200px {
        max-width: 1200px;
      }
      body .maw\:600px {
        max-width: 600px;
      }
      body .mih\:105px {
        min-height: 105px;
      }
      body .mih\:36px {
        min-height: 36px;
      }
      body .miw\:18px {
        min-width: 18px;
      }
      body .miw\:84px {
        min-width: 84px;
      }
      body .miw\:100px {
        min-width: 100px;
      }
      body .miw\:36px {
        min-width: 36px;
      }
      body .o\:none\! {
        outline: none !important;
      }
      body .o\:none {
        outline: none;
      }
      body .obf\:cover {
        object-fit: cover;
      }
      body .t\:calc\(30\%_\+_52px\) {
        top: calc(30% + 52px);
      }
      body .t\:-10px {
        top: -10px;
      }
      body .t\:30\% {
        top: 30%;
      }
      body .t\:0 {
        top: 0;
      }
      body .t\:5px {
        top: 5px;
      }
      body .t\:50\% {
        top: 50%;
      }
      body .t\:10px {
        top: 10px;
      }
      body .t\:-30px {
        top: -30px;
      }
      body .t\:-6px {
        top: -6px;
      }
      body .b\:0 {
        bottom: 0;
      }
      body .b\:10px {
        bottom: 10px;
      }
      body .b\:-6px {
        bottom: -6px;
      }
      body .op\:0\.2 {
        opacity: 0.2;
      }
      body .op\:0 {
        opacity: 0;
      }
      html.desktop body .group\*:hover .op\:1\*group-hover {
        opacity: 1;
      }
      body .op\:0\.5 {
        opacity: 0.5;
      }
      body .ov\:hidden {
        overflow: hidden;
      }
      body .ov\:auto {
        overflow: auto;
      }
      body .ovx\:auto {
        overflow-x: auto;
      }
      body .ovx\:hidden {
        overflow-x: hidden;
      }
      body .ovy\:auto {
        overflow-y: auto;
      }
      body .p\:15px {
        padding: 15px;
      }
      body .p\:0\! {
        padding: 0 !important;
      }
      body .p\:8px_15px {
        padding: 8px 15px;
      }
      body .p\:0px\! {
        padding: 0px !important;
      }
      body .p\:20px {
        padding: 20px;
      }
      body .p\:35px_10px_35px_10px {
        padding: 35px 10px 35px 10px;
      }
      body .p\:10px {
        padding: 10px;
      }
      body .p\:5px_16px {
        padding: 5px 16px;
      }
      body .p\:20px_0 {
        padding: 20px 0;
      }
      body .p\:0px_15px {
        padding: 0px 15px;
      }
      body .p\:5px_70px_5px_70px {
        padding: 5px 70px 5px 70px;
      }
      body .p\:0_15px_15px_15px {
        padding: 0 15px 15px 15px;
      }
      body .p\:30px {
        padding: 30px;
      }
      body .p\:13px_25px {
        padding: 13px 25px;
      }
      body .pt\:10px {
        padding-top: 10px;
      }
      body .pt\:20px {
        padding-top: 20px;
      }
      body .pt\:75\% {
        padding-top: 75%;
      }
      body .pt\:40px {
        padding-top: 40px;
      }
      body .pt\:5\% {
        padding-top: 5%;
      }
      body .pt\:pfs\(15px\,40px\) {
        padding-top: clamp(15px, 3.125vw + 2.5px, 40px);
      }
      body .pr\:2px {
        padding-right: 2px;
      }
      [dir="rtl"] body .pr\:2px {
        padding-left: 2px;
      }
      body .pr\:10px {
        padding-right: 10px;
      }
      [dir="rtl"] body .pr\:10px {
        padding-left: 10px;
      }
      body .pr\:15px {
        padding-right: 15px;
      }
      [dir="rtl"] body .pr\:15px {
        padding-left: 15px;
      }
      body .pb\:10px {
        padding-bottom: 10px;
      }
      body .pb\:20px {
        padding-bottom: 20px;
      }
      body .pb\:5\% {
        padding-bottom: 5%;
      }
      body .pb\:15px {
        padding-bottom: 15px;
      }
      body .pb\:pfs\(15px\,40px\) {
        padding-bottom: clamp(15px, 3.125vw + 2.5px, 40px);
      }
      body .pl\:2px {
        padding-left: 2px;
      }
      [dir="rtl"] body .pl\:2px {
        padding-right: 2px;
      }
      body .pl\:10px {
        padding-left: 10px;
      }
      [dir="rtl"] body .pl\:10px {
        padding-right: 10px;
      }
      body .pl\:15px {
        padding-left: 15px;
      }
      [dir="rtl"] body .pl\:15px {
        padding-right: 15px;
      }
      body .pl\:15px\! {
        padding-left: 15px !important;
      }
      [dir="rtl"] body .pl\:15px\! {
        padding-right: 15px !important;
      }
      body .pl\:30px {
        padding-left: 30px;
      }
      [dir="rtl"] body .pl\:30px {
        padding-right: 30px;
      }
      body .pe\:none {
        pointer-events: none;
      }
      body .pe\:auto {
        pointer-events: auto;
      }
      body .pos\:relative {
        position: relative;
      }
      body .pos\:absolute {
        position: absolute;
      }
      body .pos\:fixed\! {
        position: fixed !important;
      }
      body .pos\:fixed {
        position: fixed;
      }
      body .ta\:center {
        text-align: center;
      }
      body .td\:none\! {
        text-decoration: none !important;
      }
      body .td\:line-through {
        text-decoration: line-through;
      }
      body .td\:underline {
        text-decoration: underline;
      }
      body .td\:none {
        text-decoration: none;
      }
      html.desktop body .tt\:uppercase\|be\|h:before:hover {
        text-transform: uppercase;
      }
      body .trf\:translateX\(100\%\) {
        transform: translateX(100%);
      }
      [dir="rtl"] body .trf\:translateX\(100\%\) {
        transform: translateX(-100%);
      }
      body .trf\:translate\(-50\%\,-50\%\) {
        transform: translate(-50%, -50%);
      }
      [dir="rtl"] body .trf\:translate\(-50\%\,-50\%\) {
        transform: translate(50%, -50%);
      }
      body .trf\:translateX\(-50\%\) {
        transform: translateX(-50%);
      }
      [dir="rtl"] body .trf\:translateX\(-50\%\) {
        transform: translateX(50%);
      }
      body .trf\:scale\(0\.7\) {
        transform: scale(0.7);
      }
      body .trf\:scale\(1\) {
        transform: scale(1);
      }
      body .trf\:translateY\(-50\%\) {
        transform: translateY(-50%);
      }
      body .trf\:translate\(-50\%\,50\%\) {
        transform: translate(-50%, 50%);
      }
      [dir="rtl"] body .trf\:translate\(-50\%\,50\%\) {
        transform: translate(50%, 50%);
      }
      body .trf\:translate\(50\%\,-50\%\) {
        transform: translate(50%, -50%);
      }
      [dir="rtl"] body .trf\:translate\(50\%\,-50\%\) {
        transform: translate(-50%, -50%);
      }
      body .trfo\:center {
        transform-origin: center;
      }
      body .trfo\:50\%_50\% {
        transform-origin: 50% 50%;
      }
      body .trs\:0\.3s {
        transition: 0.3s;
      }
      body .trs\:all_0\.3s {
        transition: all 0.3s;
      }
      body .trs\:0\.2s {
        transition: 0.2s;
      }
      body .trs\:all_0\.2s {
        transition: all 0.2s;
      }
      body .us\:none {
        user-select: none;
      }
      body .va\:middle {
        vertical-align: middle;
      }
      body .va\:top {
        vertical-align: top;
      }
      html.desktop body .group\*:hover .v\:visible\*group-hover {
        visibility: visible;
      }
      body .whs\:nowrap {
        white-space: nowrap;
      }
      body .w\:50px {
        width: 50px;
      }
      body .w\:100\% {
        width: 100%;
      }
      body .w\:100px {
        width: 100px;
      }
      body .w\:20px {
        width: 20px;
      }
      body .w\:65px {
        width: 65px;
      }
      body .w\:105px {
        width: 105px;
      }
      body .w\:430px {
        width: 430px;
      }
      body .w\:140px\! {
        width: 140px !important;
      }
      body .w\:170px {
        width: 170px;
      }
      body .w\:30px {
        width: 30px;
      }
      body .w\:48px\! {
        width: 48px !important;
      }
      body .w\:108px {
        width: 108px;
      }
      body .w\:200px {
        width: 200px;
      }
      body .w\:40px {
        width: 40px;
      }
      body .w\:0 {
        width: 0;
      }
      body .w\:max-content {
        width: max-content;
      }
      body .w\:158px {
        width: 158px;
      }
      body .w\:36px {
        width: 36px;
      }
      body .w\:14px {
        width: 14px;
      }
      body .w\:30\% {
        width: 30%;
      }
      body .w\:66\% {
        width: 66%;
      }
      body .w\:90\% {
        width: 90%;
      }
      body .w\:400px {
        width: 400px;
      }
      body .w\:530px {
        width: 530px;
      }
      body .w\:70px {
        width: 70px;
      }
      body .w\:250px {
        width: 250px;
      }
      body .w\:fit-content {
        width: fit-content;
      }
      body .w\:35px {
        width: 35px;
      }
      body .w\:500px {
        width: 500px;
      }
      body .w\:244px {
        width: 244px;
      }
      body .w\:12px {
        width: 12px;
      }
      body .w\:8px {
        width: 8px;
      }
      body .w\:4px {
        width: 4px;
      }
      body .w\:2px {
        width: 2px;
      }
      body .z\:9999 {
        z-index: 9999;
      }
      body .z\:999 {
        z-index: 999;
      }
      body .z\:-1 {
        z-index: -1;
      }
      body .z\:99 {
        z-index: 99;
      }
      body .z\:10 {
        z-index: 10;
      }
      body .z\:9999999999 {
        z-index: 9999999999;
      }
      body .z\:9 {
        z-index: 9;
      }
      body .z\:999999 {
        z-index: 999999;
      }
      body .z\:2 {
        z-index: 2;
      }
      body .z\:1 {
        z-index: 1;
      }
      body .z\:99999999999999999 {
        z-index: 99999999999999999;
      }
      body .z\:99999 {
        z-index: 99999;
      }
      body .fill\:none {
        fill: none;
      }
      body .r\:-12px {
        right: -12px;
      }
      [dir="rtl"] body .r\:-12px {
        left: -12px;
      }
      body .r\:0 {
        right: 0;
      }
      [dir="rtl"] body .r\:0 {
        left: 0;
      }
      body .r\:10px {
        right: 10px;
      }
      [dir="rtl"] body .r\:10px {
        left: 10px;
      }
      body .r\:5px {
        right: 5px;
      }
      [dir="rtl"] body .r\:5px {
        left: 5px;
      }
      body .r\:20px\! {
        right: 20px !important;
      }
      [dir="rtl"] body .r\:20px\! {
        left: 20px !important;
      }
      body .r\:-6px {
        right: -6px;
      }
      [dir="rtl"] body .r\:-6px {
        left: -6px;
      }
      body .stk\:\#fff {
        stroke: #fff;
      }
      body .stk\:\#7ac142 {
        stroke: #7ac142;
      }
      body .stk\:color-gray3 {
        stroke: var(--color-gray3);
      }
      body .stkw\:2 {
        stroke-width: 2;
      }
      body .ar\:5\/3 {
        aspect-ratio: 5/3;
      }
      body .ar\:4\/3 {
        aspect-ratio: 4/3;
      }
      body .sd\:166 {
        stroke-dashoffset: 166;
      }
      body .ws\:\/\/ {
        word-spacing: //;;
      }
      @media (min-width: 768px) {
        body .d\:none\!\@sm {
          display: none !important;
        }
        body .fz\:28px\@sm {
          font-size: 28px;
        }
        body .fz\:18px\@sm {
          font-size: 18px;
        }
        body .h\:50px\@sm {
          height: 50px;
        }
        body .h\:100\%\@sm {
          height: 100%;
        }
        body .l\:auto\@sm {
          left: auto;
        }
        [dir="rtl"] body .l\:auto\@sm {
          right: auto;
        }
        body .l\:-60px\@sm {
          left: -60px;
        }
        [dir="rtl"] body .l\:-60px\@sm {
          right: -60px;
        }
        body .l\:0\@sm {
          left: 0;
        }
        [dir="rtl"] body .l\:0\@sm {
          right: 0;
        }
        body .miw\:100px\@sm {
          min-width: 100px;
        }
        body .obf\:cover\@sm {
          object-fit: cover;
        }
        body .t\:50\%\@sm {
          top: 50%;
        }
        body .t\:0\@sm {
          top: 0;
        }
        body .pr\:30px\@sm {
          padding-right: 30px;
        }
        [dir="rtl"] body .pr\:30px\@sm {
          padding-left: 30px;
        }
        body .pb\:30px\@sm {
          padding-bottom: 30px;
        }
        body .pl\:30px\@sm {
          padding-left: 30px;
        }
        [dir="rtl"] body .pl\:30px\@sm {
          padding-right: 30px;
        }
        body .pos\:absolute\@sm {
          position: absolute;
        }
        body .trf\:translateX\(60px\)\@sm {
          transform: translateX(60px);
        }
        [dir="rtl"] body .trf\:translateX\(60px\)\@sm {
          transform: translateX(-60px);
        }
        body .w\:50px\@sm {
          width: 50px;
        }
        body .w\:270px\@sm {
          width: 270px;
        }
        body .w\:100\%\@sm {
          width: 100%;
        }
        body .r\:0\@sm {
          right: 0;
        }
        [dir="rtl"] body .r\:0\@sm {
          left: 0;
        }
      }
      @media (max-width: 767px) {
        body .fld\:column\@\+sm {
          flex-direction: column;
        }
        body .h\:auto\@\+sm {
          height: auto;
        }
        body .p\:15px\@\+sm {
          padding: 15px;
        }
        body .w\:150px\@\+sm {
          width: 150px;
        }
        body .w\:100\%\@\+sm {
          width: 100%;
        }
        body .w\:100\%\@\+sm\! {
          width: 100% !important;
        }
      }
      @media (min-width: 350px) {
        body .w\:350px\@350px {
          width: 350px;
        }
      }
      @media (min-width: 992px) {
        body .w\:905px\@md {
          width: 905px;
        }
        body .w\:350px\!\@md {
          width: 350px !important;
        }
      }
    </style>
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no" />
    <meta name="theme-color" content="#000000" />
    <!--
      manifest.json provides metadata used when your web app is added to the
      homescreen on Android. See https://developers.google.com/web/fundamentals/engage-and-retain/web-app-manifest/
    -->
    <link rel="manifest" href="%PUBLIC_URL%/manifest.json" />
    <link rel="shortcut icon" href="%PUBLIC_URL%/favicon.ico" />
    <!--
      Notice the use of %PUBLIC_URL% in the tags above.
      It will be replaced with the URL of the `public` folder during the build.
      Only files inside the `public` folder can be referenced from the HTML.

      Unlike "/favicon.ico" or "favicon.ico", "%PUBLIC_URL%/favicon.ico" will
      work correctly both with client-side routing and a non-root public URL.
      Learn how to configure a non-root public URL by running `npm run build`.
    -->
    <title>React App</title>
    <style>
      :root {
        --color-primary: #fa5654;
        --rgb-color-primary: 250, 86, 84;
        --color-secondary: #3540df;
        --rgb-color-secondary: 53, 64, 223;
        --color-tertiary: #2ab885;
        --rgb-color-tertiary: 42, 184, 133;
        --color-quaternary: #fbc473;
        --rgb-color-quaternary: 251, 196, 115;
        --color-dark: #000000;
        --rgb-color-dark: 0, 0, 0;
        --color-gray9: #000000;
        --rgb-color-gray9: 0, 0, 0;
        --color-gray8: #484848;
        --rgb-color-gray8: 72, 72, 72;
        --color-gray7: #5a5a5a;
        --rgb-color-gray7: 90, 90, 90;
        --color-gray6: #6f6f6f;
        --rgb-color-gray6: 111, 111, 111;
        --color-gray5: #828282;
        --rgb-color-gray5: 130, 130, 130;
        --color-gray4: #969696;
        --rgb-color-gray4: 150, 150, 150;
        --color-gray3: #bdbdbd;
        --rgb-color-gray3: 189, 189, 189;
        --color-gray2: #e0e0e0;
        --rgb-color-gray2: 224, 224, 224;
        --color-gray1: #e8e8e8;
        --rgb-color-gray1: 232, 232, 232;
        --color-light: #ffffff;
        --rgb-color-light: 255, 255, 255;
        --color-primary-freeze: #fa5654;
        --rgb-color-primary-freeze: 250, 86, 84;
        --color-secondary-freeze: #3540df;
        --rgb-color-secondary-freeze: 53, 64, 223;
        --color-tertiary-freeze: #2ab885;
        --rgb-color-tertiary-freeze: 42, 184, 133;
        --color-quaternary-freeze: #fbc473;
        --rgb-color-quaternary-freeze: 251, 196, 115;
        --color-dark-freeze: #000000;
        --rgb-color-dark-freeze: 0, 0, 0;
        --color-gray9-freeze: #000000;
        --rgb-color-gray9-freeze: 0, 0, 0;
        --color-gray8-freeze: #484848;
        --rgb-color-gray8-freeze: 72, 72, 72;
        --color-gray7-freeze: #5a5a5a;
        --rgb-color-gray7-freeze: 90, 90, 90;
        --color-gray6-freeze: #6f6f6f;
        --rgb-color-gray6-freeze: 111, 111, 111;
        --color-gray5-freeze: #828282;
        --rgb-color-gray5-freeze: 130, 130, 130;
        --color-gray4-freeze: #969696;
        --rgb-color-gray4-freeze: 150, 150, 150;
        --color-gray3-freeze: #bdbdbd;
        --rgb-color-gray3-freeze: 189, 189, 189;
        --color-gray2-freeze: #e0e0e0;
        --rgb-color-gray2-freeze: 224, 224, 224;
        --color-gray1-freeze: #e8e8e8;
        --rgb-color-gray1-freeze: 232, 232, 232;
        --color-light-freeze: #ffffff;
        --rgb-color-light-freeze: 255, 255, 255;
        --font-primary: Jost;
        --font-secondary: Roboto;
        --font-tertiary: Mali;
        --font-quaternary: Poppins;
        --font-quinary: Spartan;
      }
      *,
      *:before,
      *:after {
        box-sizing: border-box;
      }
      .container {
        max-width: 1200px;
        margin: 0 auto;
      }
      img {
        max-width: 100%;
        vertical-align: middle;
      }
      .veda-slider {
        margin-bottom: 30px;
      }
      .box {
        width: 100px;
        height: 100px;
        background-color: #f49595;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        cursor: pointer;
        margin-top: 50px;
        margin-bottom: 50px;
        user-select: none;
        will-change: width, height;
      }

      .parallax-wrap {
        border: 1px solid #4e4cee;
        padding: 100px 30px;
      }

      .parallax {
        width: 100px;
        height: 100px;
        background-color: #4e4cee;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        user-select: none;
        will-change: transform;
      }
    </style>
  </head>

  <body>
    <noscript> You need to enable JavaScript to run this app. </noscript>
    <div id="root"></div>
    <div style="height: 1000px;"></div>
    <section
      class="pr-section pos:relative bd:1px_solid bgc:color-dark-freeze bgz:cover bga:fixed"
      style="
        background-image: url(https://img.freepik.com/free-vector/modern-geometric-black-business-background_53876-113970.jpg?w=1380&t=st=1679626340~exp=1679626940~hmac=482b11b42c6a3da3c107be3c1d865c004f9c4a1547f71736707706d58d30bf21);
      "
    >
      <div class="ta:center h:150vh d:flex ai:center jc:center">
        <h2 class="pr-text c:color-light-freeze fw:400 fz:50px">Parallax Scroll Third Party</h2>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/ca1f1238d808935b77771b399df6e9ab/icon/COnP2Kv0lu8CEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/f542dc5a007dc8f705239e569608c654/icon/CNiy-eaHmvICEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/8cada0f5da411a64e756606bb036f1ed/icon/CJmAj_a-5fQCEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/532861601aa89a5e70f5d56d075e82ac/icon/CLq7q92-4_0CEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/9c2f67b482aeae04937fd544c0bfe6a8/icon/CMjv-JmUpv0CEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/56bc38aef928b8ff2bfbd112c6fd2784/icon/CIvIg6v3p_cCEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/b1fafe67369104644289836a54b36dbb/icon/CI63jcP0lu8CEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/64dbf028e50bc736072a16e7d0f8a382/icon/CMnt2vG6oPsCEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/1252d9d2612d6b071896af7336148d30/icon/CO7yusi49fkCEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/d047a670d0122d1b57b3421cf7149114/icon/CMmw58_3lPsCEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/5076396ac61bba417a451577630ddc08/icon/CJKNxc70lu8CEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/252ae7c55fa0e8a35df7f6ff3c8c1596/icon/CPLp1Kb0lu8CEAE=.jpg" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/c2fde25432c44d6aeefb31ba06bbb974/icon/CKaMotDR7v0CEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/00f756e9e94e8c3cfb14266ae483d0f0/icon/CMG-tMyK9_kCEAE=.png" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/66d9956edf807b697e7f539e5e9bbaf3/icon/CIuoqfrDj_sCEAE=.jpeg" alt="" />
        </div>
      </div>
      <div class="pr-item pos:absolute">
        <div class="w:50px h:50px bdrs:5px ov:hidden">
          <img src="https://cdn.shopify.com/app-store/listing_images/a27f1e8ca39288fda15f98bb00d59bdd/icon/CICBgPTW5O8CEAE=.png" alt="" />
        </div>
      </div>
    </section>
    <div style="height: 1000px;"></div>
    <!--
      This HTML file is a template.
      If you open it directly in the browser, you will see an empty page.

      You can add webfonts, meta tags, or analytics to this file.
      The build step will place the bundled scripts into the <body> tag.

      To begin the development, run `npm start` or `yarn start`.
      To create a production bundle, use `npm run build` or `yarn build`.
    -->
  </body>
</html>
```
