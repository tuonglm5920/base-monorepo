# Overview

The `CopyButton` component is a React component designed for copying text to the clipboard with a single click. Ideal for applications where users need to copy content such as code snippets, links, or text efficiently.

# Props

| Prop         | Type      | Optional | Description                                                                       |
| ------------ | --------- | -------- | --------------------------------------------------------------------------------- |
| `content`    | `string`  | Yes      | The text content to be copied to the clipboard.                                   |
| `copiedText` | `string`  | Yes      | Text to display after the content has been successfully copied (e.g., "Copied!"). |
| `copyText`   | `string`  | Yes      | Text to be displayed on the copy button, like "Copy" or "Copy to Clipboard".      |
| `rtl`        | `boolean` | Yes      | RTL mode                                                                          |
