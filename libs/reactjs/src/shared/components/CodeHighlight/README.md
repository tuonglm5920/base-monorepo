# Overview

The `CodeHighlight` component effortlessly showcases code snippets with syntax highlighting, enhancing readability and aesthetic appeal. By specifying the programming language, users can ensure accurate highlighting of code syntax.

# Props

| Prop          | Type                                                                                                               | Optional | Description                                                             |
| ------------- | ------------------------------------------------------------------------------------------------------------------ | -------- | ----------------------------------------------------------------------- |
| `language`    | `'css' \| 'scss' \| 'js' \| 'jsx' \| 'tsx' \| 'php' \| 'go' \| 'java' \| 'python' \| 'typescript' \| 'c' \| 'cpp'` | Yes      | Determines the programming language for syntax highlighting.            |
| `code`    | `string`                                                                                                           | No       | Represents the code snippet to be displayed.                            |
| `nativeProps` | `HTMLAttributes<HTMLPreElement>`                                                                                   | Yes      | Additional native properties that can be passed to the `<pre>` element. |
