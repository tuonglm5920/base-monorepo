# Overview

`SimpleWorker` is a JavaScript library designed for efficient management of web worker threads. It facilitates the execution of scripts in a background thread, optimizing performance and efficiency in web applications. The library provides a simple and straightforward API for running tasks asynchronously without blocking the main thread.

# API

`SimpleWorker` offers a concise API to handle background tasks in web applications. Key methods include:

- **constructor()**: Initializes the worker thread.
- **run(task: Task)**: Executes a given task in the web worker. Returns a promise that resolves with the worker event.
- **destroy()**: Terminates the worker and frees up resources.

# Examples

1. **Initializing SimpleWorker**

   ```javascript
   import { SimpleWorker, Task } from 'simple-worker';

   const worker = new SimpleWorker();
