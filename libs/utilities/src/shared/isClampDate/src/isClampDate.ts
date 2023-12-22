import type { Dayjs } from 'dayjs';

interface IsClampDate {
  /** #### The date to be checked */
  date: Dayjs;
  /** #### The minimum allowed date */
  minDate: Dayjs;
  /** #### The maximum allowed date */
  maxDate: Dayjs;
}

/**
 * Checks if a date is within a specified range.
 * @param {Dayjs} parameters.date The date to be checked
 * @param {Dayjs} parameters.minDate The minimum allowed date
 * @param {Dayjs} parameters.maxDate The maximum allowed date
 * @returns {boolean} True if the date is within the range, false otherwise.
 * @example ```typescript
  const today = dayjs() // 06/09/2023
  const isDayOf2023 = isClampDate({ date: today, minDate: today.startOf('year'), maxDate: today.endOf('year') }) // true
  const nextYear = dayjs().add(1, 'year') // 06/09/2024
  const isDayOf2023 = isClampDate({ date: nextYear, minDate: today.startOf('year'), maxDate: today.endOf('year') }) // false
  ```
 */
export const isClampDate = ({ date, maxDate, minDate }: IsClampDate): boolean => {
  return date.isSame(minDate) || date.isSame(maxDate) || (date.isAfter(minDate) && date.isBefore(maxDate));
};
