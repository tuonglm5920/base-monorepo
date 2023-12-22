# Overview

The `Calendar` component is a versatile and customizable calendar component for React applications. It allows for custom rendering of various parts of the calendar, such as individual days, days of the week, and the calendar title. This component is designed to be flexible and adaptable to different use cases, providing a rich user experience.

# Props

| Prop               | Type                                                          | Optional | Description                                                            |
| ------------------ | ------------------------------------------------------------- | -------- | ---------------------------------------------------------------------- |
| `daysOfWeek`       | `[string,string,string,string,string,string,string]`          | Yes      | Customizable days of the week.                                         |
| `weekStart`        | `number`                                                      | Yes      | Indicates the start day of the week (0 = Sunday, 1 = Monday, etc.).    |
| `viewport`         | `{ month: number, year: number }`                             | Yes      | Object representing the current month and year viewed in the calendar. |
| `onViewportChange` | `(viewport: { month: number, year: number }) => void`         | Yes      | Function called when the month or year is changed.                     |
| `renderCell`       | `(date: DateObject) => ReactElement`                          | Yes      | Function to render each date cell in the calendar.                     |
| `renderDayOfWeek`  | `(dayOfWeek: string) => ReactElement`                         | Yes      | Function to render each day of the week.                               |
| `renderTitle`      | `(viewport: { month: number, year: number }) => ReactElement` | Yes      | Function to render the title of the calendar.                          |
| `rtl`              | `boolean`                                                     | Yes      | RTL mode.                                                              |
