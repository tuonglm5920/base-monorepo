import { isAxiosError } from 'axios';
import { ResponseCode } from '../../@types';

/**
 * Determines the type of error based on the error object received.
 * This helps in categorizing the error into different predefined types.
 *
 * @param {unknown} error - The error object, whose type is not predetermined.
 * @returns {ResponseCode} - The categorized error code. It can be 'Service', 'Network', 'Frontend', or 'Unknown'.
 */
export const getErrorCode = (error: unknown): ResponseCode => {
  if (isAxiosError(error)) {
    // If it's an Axios error, categorize as 'Service' or 'Network' based on the response status.
    return error.response?.status ? 'Service' : 'Network';
  }

  if (error instanceof Error) {
    // If it's a standard Error object, categorize as 'Frontend'.
    return 'Frontend';
  }

  // If the error type is not identified, categorize as 'Unknown'.
  return 'Unknown';
};
