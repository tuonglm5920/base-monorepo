# Overview

The `QRScanner` component is a React-based QR code scanner that integrates seamlessly into web applications. It utilizes the user's camera to scan QR codes and offers customizable callbacks for handling the scan results. The component also provides a responsive UI with loading and error handling states.

## Props

The `QRScanner` component accepts the following props:

| Prop                   | Type                                     | Optional | Default | Description                                                                                  |
| ---------------------- | ---------------------------------------- | -------- | ------- | -------------------------------------------------------------------------------------------- |
| `maxScansPerSecond`    | `number`                                 | Yes      | `1`     | Maximum number of scans per second.                                                          |
| `disabledWindowScroll` | `boolean`                                | Yes      | `true`  | Optional boolean to control whether scrolling on the window is disabled when open QRScanner. |
| `open`                 | `boolean`                                | No       | -       | Controls the visibility of the QR scanner.                                                   |
| `onClose`              | `() => void`                             | Yes      | -       | An optional callback that is executed when the scanner finishes its closing animation.       |
| `onLoad`               | `(statusRequest: StatusRequest) => void` | Yes      | -       | Callback when the QR Scanner status changes.                                                 |
| `onScan`               | `(data: string) => void`                 | Yes      | -       | Callback when a QR code is successfully scanned.                                             |
| `Loading`              | `ReactNode` \| `(() => ReactNode)`       | Yes      | -       | Component or function to render while loading.                                               |
| `Reconnect`            | `ReactNode` \| `(() => ReactNode)`       | Yes      | -       | Component or function to render for reconnection.                                            |
