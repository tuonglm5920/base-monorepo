import { SimpleWorkerState } from './constants';

/**
 * Represents a success event for a SimpleWorker.
 * @interface
 * @template Result - The generic type parameter for the result data.
 * @property {SimpleWorkerState.SUCCESS} status - The status of the worker event, which is always 'SUCCESS' for this interface.
 * @property {Result} result - The resulting data of the worker operation. The type of this is generic and can be specified when implementing the interface.
 */
export interface SimpleWorkerEventSuccess<Result = any> {
  /** The status of the worker event, which is always 'SUCCESS' for this interface. */
  status: SimpleWorkerState.SUCCESS;
  /** The resulting data of the worker operation. The type of this is generic and can be specified when implementing the interface. */
  result: Result;
}

/**
 * Represents an error event for a SimpleWorker.
 * @interface
 * @property {SimpleWorkerState.ERROR} status - The status of the worker event, which is always 'ERROR' for this interface.
 * @property {string} message - Descriptive error message providing details about the error that occurred.
 */
export interface SimpleWorkerEventError {
  /** The status of the worker event, which is always 'ERROR' for this interface. */
  status: SimpleWorkerState.ERROR;
  /** Descriptive error message providing details about the error that occurred. */
  message: string;
}

/**
 * Type representing an event from a SimpleWorker which could either be a success or an error event.
 * @template Result - The generic type parameter for the result data, defaulting to `any`.
 * @property {SimpleWorkerEventSuccess<Result>} SimpleWorkerEventSuccess - An object representing a successful worker event.
 * @property {SimpleWorkerEventError} SimpleWorkerEventError - An object representing an error that occurred in the worker process.
 */
export type SimpleWorkerEvent<Result = any> = SimpleWorkerEventSuccess<Result> | SimpleWorkerEventError;
