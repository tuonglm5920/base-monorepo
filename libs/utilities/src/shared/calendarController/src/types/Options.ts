import { DateObject } from './DateObject';

export interface Options {
  /** Date object indicating the selected start date */
  startDate?: DateObject | null;

  /** Date object indicating the selected end date */
  endDate?: DateObject | null;

  /** Day of the week to start the calendar, respects `Date.prototype.getDay` (defaults to `0`, Sunday) */
  weekStart?: number;
}
