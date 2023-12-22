import { DateObject } from './types/DateObject';
import { Options } from './types/Options';
import { OutputDateObject } from './types/OutputDateObject';

/** Manages the creation and manipulation of calendar dates, including calculation of specific calendar views and date selections. */
export class CalendarController {
  /** The start date of the selected period. Can be null if no start date is set. */
  private _startDate: DateObject | null;

  /** The end date of the selected period. Can be null if no end date is set. */
  private _endDate: DateObject | null;

  /** The index of the first day of the week (0 for Sunday, 1 for Monday, etc.). */
  private _weekStart: number;

  constructor({ startDate = null, endDate = null, weekStart = 0 }: Options) {
    this._startDate = startDate;
    this._endDate = endDate;
    this._weekStart = weekStart;
  }

  /**
   * Calculate a calendar month
   *
   * @param   year   Year
   * @param   month  Month [0-11]
   * @return         Calendar days
   */
  public getCalendar = (year: number, month: number): OutputDateObject[] => {
    const date = new Date(Date.UTC(year, month, 1, 0, 0, 0, 0));

    year = date.getUTCFullYear();
    month = date.getUTCMonth();

    const calendar: OutputDateObject[] = [];
    const firstDay = date.getUTCDay();
    const firstDate = -((7 - this._weekStart + firstDay) % 7);
    const lastDate = CalendarController.daysInMonth(year, month);
    const lastDay = (lastDate - firstDate) % 7;
    const lastDatePreviousMonth = CalendarController.daysInMonth(year, month - 1);

    let i = firstDate;
    let currentDay;
    let currentDate;
    let currentDateObject: OutputDateObject | undefined = undefined;
    let currentWeekNumber = null;
    let otherMonth;
    let otherYear;

    const max = lastDate - i + (lastDay !== 0 ? 7 - lastDay : 0) + firstDate;

    while (i < max) {
      currentDate = i + 1;
      currentDay = ((i < 1 ? 7 + i : i) + firstDay) % 7;
      if (currentDate < 1 || currentDate > lastDate) {
        if (currentDate < 1) {
          otherMonth = month - 1;
          otherYear = year;
          if (otherMonth < 0) {
            otherMonth = 11;
            otherYear--;
          }
          currentDate = lastDatePreviousMonth + currentDate;
        } else if (currentDate > lastDate) {
          otherMonth = month + 1;
          otherYear = year;
          if (otherMonth > 11) {
            otherMonth = 0;
            otherYear++;
          }
          currentDate = i - lastDate + 1;
        }

        if (otherMonth !== undefined && otherYear !== undefined) {
          currentDateObject = {
            day: currentDate,
            weekDay: currentDay,
            month: otherMonth,
            year: otherYear,
            siblingMonth: true,
          } as OutputDateObject;
        }
      } else {
        currentDateObject = {
          day: currentDate,
          weekDay: currentDay,
          month: month,
          year: year,
        } as OutputDateObject;
      }

      if (currentDateObject) {
        if (currentWeekNumber === null) {
          currentWeekNumber = CalendarController.calculateWeekNumber(currentDateObject);
        } else if (currentDay === 1 && currentWeekNumber === 52) {
          currentWeekNumber = 1;
        } else if (currentDay === 1) {
          currentWeekNumber++;
        }
        currentDateObject.weekNumber = currentWeekNumber;
      }

      if (this._startDate && currentDateObject) {
        currentDateObject.selected = this.isDateSelected(currentDateObject);
      }

      if (currentDateObject) {
        calendar.push(currentDateObject);
      }
      i++;
    }

    return calendar;
  };

  /**
   * Checks if a date is selected
   *
   * @param   date  Date object
   * @return        Selected status of the date
   */
  public isDateSelected = (date: DateObject): boolean => {
    if (!this._startDate) {
      return false;
    }

    if (
      date.year === this._startDate.year &&
      date.month === this._startDate.month &&
      date.day === this._startDate.day
    ) {
      return true;
    }

    if (!this._endDate) {
      return false;
    }

    if (date.year === this._startDate.year && date.month === this._startDate.month && date.day < this._startDate.day) {
      return false;
    }

    if (date.year === this._endDate.year && date.month === this._endDate.month && date.day > this._endDate.day) {
      return false;
    }

    if (date.year === this._startDate.year && date.month < this._startDate.month) {
      return false;
    }

    if (date.year === this._endDate.year && date.month > this._endDate.month) {
      return false;
    }

    if (date.year < this._startDate.year) {
      return false;
    }

    if (date.year > this._endDate.year) {
      return false;
    }

    return true;
  };

  /**
   * Sets the selected range
   *
   * @param  date  Date object
   */
  public setSelectedRange = ({ start, end }: { start: DateObject; end: DateObject }): void => {
    this._startDate = start;
    this._endDate = end;
  };

  /**
  /**
   * Calculates the difference between two dates (date1 - date2), in days
   *
   * @param   dateLeft   Date object
   * @param   dateRight  Date object
   * @return             Days between the dates
   */
  public static diff = (dateLeft: DateObject, dateRight: DateObject): number => {
    const dateLeftDate = new Date(Date.UTC(dateLeft.year, dateLeft.month, dateLeft.day, 0, 0, 0, 0));
    const dateRightDate = new Date(Date.UTC(dateRight.year, dateRight.month, dateRight.day, 0, 0, 0, 0));
    return Math.ceil((dateLeftDate.getTime() - dateRightDate.getTime()) / 86400000);
  };

  /**
   * Calculates the interval between two dates
   *
   * @param   dateLeft   Date object
   * @param   dateRight  Date object
   * @return             Number of days between dates
   */
  public static interval = (dateLeft: DateObject, dateRight: DateObject): number => {
    return Math.abs(CalendarController.diff(dateLeft, dateRight)) + 1;
  };

  /**
   * Quickly compare two dates
   *
   * @param   dateLeft   Left `Date` object
   * @param   dateRight  Right `Date` object
   * @return             Comparison result: -1 (left < right), 0 (equal) or 1 (left > right)
   */
  public static compare = (dateLeft: DateObject, dateRight: DateObject): number => {
    if (typeof dateLeft !== 'object' || typeof dateRight !== 'object' || dateLeft === null || dateRight === null) {
      throw new TypeError('dates must be objects');
    }

    if (dateLeft.year < dateRight.year) {
      return -1;
    }

    if (dateLeft.year > dateRight.year) {
      return 1;
    }

    if (dateLeft.month < dateRight.month) {
      return -1;
    }

    if (dateLeft.month > dateRight.month) {
      return 1;
    }

    if (dateLeft.day < dateRight.day) {
      return -1;
    }

    if (dateLeft.day > dateRight.day) {
      return 1;
    }

    return 0;
  };

  /**
   * Calculates the number of days in a month
   *
   * @param   year  Year
   * @param   month Month [0-11]
   * @return        Length of the month
   */
  public static daysInMonth = (year: number, month: number): number => {
    return new Date(year, month + 1, 0).getDate();
  };

  /**
   * Calculates if a given year is a leap year
   *
   * @param   year  Year
   * @return        Leap year or not
   */
  public static isLeapYear = (year: number): boolean => {
    return (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0;
  };

  /**
   * Calculates the week number for a given date
   *
   * @param   date  Date object
   * @return        Week number
   */
  public static calculateWeekNumber = (date: OutputDateObject): number => {
    // Creates the requested date
    const current = new Date(Date.UTC(date.year, date.month, date.day, 0, 0, 0, 0));

    // Create a copy of the object
    const target = new Date(current.valueOf());

    // ISO week date weeks start on monday so correct the day number
    const dayNr = (current.getUTCDay() + 6) % 7;

    // ISO 8601 states that week 1 is the week with the first thursday of that
    // year. Set the target date to the thursday in the target week.
    target.setUTCDate(target.getUTCDate() - dayNr + 3);

    // Store the millisecond value of the target date
    const firstThursday = target.valueOf();

    // Set the target to the first thursday of the year

    // First set the target to january first
    target.setUTCMonth(0, 1);

    // Not a thursday? Correct the date to the next thursday
    if (target.getUTCDay() !== 4) {
      target.setUTCMonth(0, 1 + ((4 - target.getUTCDay() + 7) % 7));
    }

    // The week number is the number of weeks between the  first thursday of the
    // year and the thursday in the target week.
    // 604800000 = 7 * 24 * 3600 * 1000
    return 1 + Math.ceil((firstThursday - target.getTime()) / 604800000);
  };

  //#region For testing
  public getStartDateForTesting = (): typeof this._startDate => {
    return this._startDate;
  };
  public getEndDateForTesting = (): typeof this._endDate => {
    return this._endDate;
  };
  //#endregion
}
