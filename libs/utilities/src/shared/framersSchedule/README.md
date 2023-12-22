# Overview

The `FramersSchedule` class is a TypeScript utility designed for managing frame updates in animation loops or similar scenarios. It provides a structured way to handle frame functions, allowing for efficient scheduling and management of frame-based tasks.

# API

#### Methods

- **constructor**: Initializes a new instance of `FramersSchedule`.
- **queue(frame: Frame, keepAlive = false)**: Schedules a frame for execution. If `keepAlive` is true, the frame is continuously executed.
  - **Parameters**:
    - `frame: Frame`: The frame function to be scheduled.
    - `keepAlive: boolean`: Whether the frame should keep alive (default: false).
  - **Return value**: The `FramersSchedule` instance for chaining.
- **remove(frame: Frame)**: Removes a scheduled frame.
  - **Parameters**:
    - `frame: Frame`: The frame function to be removed.
  - **Return value**: The `FramersSchedule` instance for chaining.
- **clear()**: Clears all scheduled frames.
  - **Return value**: The `FramersSchedule` instance for chaining.
- **getFrames()**: Retrieves the currently scheduled frames.
  - **Return value**: An array of `Frame` functions.

# Examples

1. **Scheduling a Frame Function**

```typescript
import { FramersSchedule, Frame } from "./FramersSchedule";

const scheduler = new FramersSchedule();
const myFrameFunction: Frame = (data) => {
  console.log(`Frame Data - Timestamp: ${data.timestamp}, Delta: ${data.delta}`);
};

scheduler.queue(myFrameFunction);
```

2. **Removing a Frame Function**

````typescript
scheduler.remove(myFrameFunction);```
````

3. **Clearing All Scheduled Frames**

```typescript
scheduler.clear();
```
