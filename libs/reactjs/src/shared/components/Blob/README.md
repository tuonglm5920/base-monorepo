# Overview
The `Blob` component is a versatile and customizable animated shape generator. It allows you to create dynamic, morphing blobs with various properties and background styles.

# Props

| Prop                  | Type                                                         | Optional | Description                                                  |
|-----------------------|--------------------------------------------------------------|----------|--------------------------------------------------------------|
| `numberOfFrames`      | `number`                                                     | Yes      | The number of frames in the animation sequence.             |
| `background`          | `{ src: string }` \| `string` \| `Array<{ offset: Exclude<SVGProps<SVGStopElement>['offset'], undefined>; color: string; }>` | Yes      | The background of the blob. Can be an image, color, or linear-gradient. |
| `size`                | `number`                                                     | Yes      | The size of the blob.                                        |
| `edges`               | `number`                                                     | Yes      | The number of edges or sides of the blob.                   |
| `growth`              | `number`                                                     | Yes      | The distortion level of the blob's shape.                   |
| `duration`            | `number`                                                     | Yes      | The duration of the animation in milliseconds.              |
| `repeatCount`         | `number` \| `'indefinite'`                                   | Yes      | The number of times the animation should repeat.             |
| `containerClassName`  | `string`                                                     | Yes      | The class name to be applied to the blob container.         |
| `containerNativeProps`| `HTMLAttributes<HTMLOrSVGElement>`                           | Yes      | Additional native props to be passed to the blob container.  |
