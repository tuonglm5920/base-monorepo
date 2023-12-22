import { SIMPLE_WROKER_SCRIPT, SimpleWorkerState } from './constants';
import { SimpleWorkerEvent } from './types';

/**
 * Interface for the request to run the SIMPLE_WORKER_SCRIPT in a worker context.
 * @interface
 * @property {string} type - A discriminator property that indicates the action type for the worker, always set to '@Run' when intending to execute a script.
 * @property {Object} payload - Contains the details of the script to be executed by the worker.
 * @property {number} payload.id - A unique identifier for the script execution, which can be used to track or reference the script run.
 * @property {any} payload.args - Arguments to be passed to the function within the SIMPLE_WORKER_SCRIPT.
 * @property {string} payload.doFunction - The name of the function as a string, expected to be a function defined in SIMPLE_WORKER_SCRIPT, to be executed by the worker.
 */
interface WorkerScriptRequest {
  /** A discriminator property that indicates the action type for the worker, always set to '@Run' when intending to execute a script. */
  type: '@Run';
  payload: {
    /** A unique identifier for the script execution, which can be used to track or reference the script run. */
    id: number;
    /** Arguments to be passed to the function within the SIMPLE_WORKER_SCRIPT. */
    args: any;
    /** The name of the function as a string, expected to be a function defined in SIMPLE_WORKER_SCRIPT, to be executed by the worker. */
    doFunction: string;
  };
}

/**
 * Interface for the response returned by executing the SIMPLE_WORKER_SCRIPT in a worker context.
 * @interface
 * @template Result - The generic type parameter for the result data, defaulting to `any`. This can be specified to match the expected type of result from the SIMPLE_WORKER_SCRIPT.
 * @property {boolean} hasError - Indicates if the worker script execution resulted in an error. This is `true` if there was an error, `false` otherwise.
 * @property {Result} [result] - The result of the script execution. This is only present if `hasError` is `false`, indicating a successful execution.
 * @property {string} [message] - A message describing the error if `hasError` is `true`. Provides additional information about the error that occurred during the execution of SIMPLE_WORKER_SCRIPT.
 */
interface WorkerScriptResponse<Result = any> {
  /** Indicates if the worker script execution resulted in an error. This is `true` if there was an error, `false` otherwise. */
  hasError: boolean;
  /** The result of the script execution. This is only present if `hasError` is `false`, indicating a successful execution. */
  result?: Result;
  /** A message describing the error if `hasError` is `true`. Provides additional information about the error that occurred during the execution of SIMPLE_WORKER_SCRIPT. */
  message?: string;
}

/**
 * Represents a generic task that can execute a function with given arguments.
 * @template Fn - A function type that takes any number of arguments and returns a Promise.
 */
export class Task<Fn extends (...args: any[]) => Promise<any> = (...args: any[]) => Promise<any>> {
  /** Counter to generate a unique ID for each task. */
  private static _taskIdCounter = 0;

  /** Unique identifier for the task. */
  public id: number;

  /** Arguments that will be passed to the "doFunction". */
  public args: Parameters<Fn>;

  /** The function that will be executed by the task. */
  public doFunction: Fn;

  /**
   * Creates a new task instance with a function to execute and its arguments.
   * @param {Fn} doFunction - The function to be executed by the task.
   * @param {...Parameters<Fn>} args - The arguments to be passed to the "doFunction".
   */
  constructor(doFunction: Fn, ...args: Parameters<Fn>) {
    this.id = ++Task._taskIdCounter; // Increment the static counter to generate a unique ID
    this.doFunction = doFunction; // Assign the function to the instance
    this.args = args; // Assign the passed arguments to the instance
  }
}

/**
 * Manages a single web worker thread for running scripts in a background thread.
 */
export class SimpleWorker {
  /** URL created from a blob to load the worker script. */
  private _blobURL: string;

  /** The web worker instance. */
  private _worker: Worker;

  /** Initializes a new WorkerThread instance by creating a blob URL for the worker script and a new worker. */
  constructor() {
    this._blobURL = URL.createObjectURL(new Blob([SIMPLE_WROKER_SCRIPT], { type: 'application/javascript' }));
    this._worker = new Worker(this._blobURL, { credentials: 'same-origin' });
  }

  /**
   * Runs a given task in the web worker and returns a promise that resolves with the worker event.
   * @template T - The task type extending from Task.
   * @template JobReturnType - The awaited return type of the task's function.
   * @param {Task} task - The task to be run by the worker.
   * @returns {Promise<SimpleWorkerEvent<JobReturnType>>} A promise that resolves with the worker event result.
   */
  public run = <T extends Task, JobReturnType = Awaited<ReturnType<T['doFunction']>>>(
    task: Task,
  ): Promise<SimpleWorkerEvent<JobReturnType>> => {
    return new Promise<SimpleWorkerEvent<JobReturnType>>((resolve, reject) => {
      // On worker completion
      this._worker.onmessage = (event: MessageEvent): void => {
        const data: WorkerScriptResponse<JobReturnType> = event.data;
        if (data.hasError) {
          resolve({
            status: SimpleWorkerState.ERROR,
            message: data.message as string,
          });
        } else {
          resolve({
            status: SimpleWorkerState.SUCCESS,
            result: data.result as JobReturnType,
          });
        }
      };

      // On worker error
      this._worker.onerror = (err): void => {
        reject({
          status: SimpleWorkerState.ERROR,
          message: err,
        });
      };

      // Dispatch the event to the worker
      this._worker.postMessage(this._createWorkerAction(task));
    });
  };

  /** Cleans up the blob URL and terminates the worker. */
  public destroy(): void {
    URL.revokeObjectURL(this._blobURL);
    this._worker.terminate();
  }

  /** Utils */

  /**
   * Creates a worker action message from the given task.
   * @param {Task} task - The task to be sent to the worker.
   * @returns {WorkerScriptRequest} The worker script request object.
   */
  private _createWorkerAction = (task: Task): WorkerScriptRequest => {
    return {
      type: '@Run',
      payload: {
        id: task.id,
        args: task.args,
        doFunction: task.doFunction.toString(),
      },
    };
  };

  /** ---------------------------------------- */

  //#region For testing
  public getBlobUrlForTesting = (): typeof this._blobURL => {
    return this._blobURL;
  };
  public getWorkerForTesting = (): typeof this._worker => {
    return this._worker;
  };
  //#endregion
}
