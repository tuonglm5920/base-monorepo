## Overview

The `CalendarController` class is a comprehensive solution for managing calendar data in web applications. It facilitates the creation of dynamic calendar views, handles date selections, and provides utility functions for common calendar-related operations.

## API

The class offers a range of methods for manipulating calendar data and utilities for date comparisons and calculations.

### Methods:

- **`getCalendar(year: number, month: number): Array<Date>`**: Generates a calendar for a given month and year.
- **`isDateSelected(date: Date): boolean`**: Checks if a date is within the selected range.
- **`setSelectedRange(date: Date): void`**: Sets the range date of the selection.
- **`setDate(date: Date): void`**: Sets a single date as the selection.

### Static Functions:

- **`diff(dateLeft: Date, dateRight: Date): number`**: Calculates the difference in days between two dates.
- **`interval(dateLeft: Date, dateRight: Date): number`**: Computes the number of days between two dates.
- **`compare(dateLeft: Date, dateRight: Date): number`**: Compares two dates.
- **`daysInMonth(year: number, month: number): number`**: Returns the number of days in a month.
- **`isLeapYear(year: number): boolean`**: Checks if a year is a leap year.
- **`calculateWeekNumber(date: Date): number`**: Calculates the week number for a given date.

## Examples

### Creating a CalendarController Instance

```typescript
const calendar = new CalendarController({
  weekNumbers: true,
  weekStart: 1,
});
```

### Generating a Calendar View

```typescript
const year = 2023;
const month = 5; // June
const calendarView = calendar.getCalendar(year, month);
```

### Setting a Date Range

```typescript
calendar.setSelectedRange({
  start: { year: 2023, month: 5, day: 10 },
  end: { year: 2023, month: 5, day: 20 },
});
```
