import { DateObject } from './DateObject';

/** Represents an output date object with extended properties. */
export interface OutputDateObject extends DateObject {
  /** Indicates whether the date is selected. */
  selected?: boolean;

  /** Indicates if the date belongs to a month adjacent to the current month being viewed. */
  siblingMonth: boolean;

  /** The day of the week (0-6), where 0 represents Sunday. */
  weekDay: number;

  /** The ISO week number of the year. */
  weekNumber: number;
}
