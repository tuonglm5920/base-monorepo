import { map, nth, reverse, splitEvery } from 'ramda';
import { FC, ReactElement, ReactNode, useEffect, useMemo, useRef, useState } from 'react';
import { CalendarController, DateObject, OutputDateObject } from 'utilities';
import { useLatestPropsRef } from '../../../hooks';
import { View } from '../../View';
import { Cell } from './components/Cell';
import { DayOfWeek } from './components/DayOfWeek';
import { Title } from './components/Title';
import './styles.css';
import { DaysOfWeek } from './types/DaysOfWeek';
import { Viewport } from './types/Viewport';

export interface Props {
  /** RTL mode */
  rtl?: boolean;

  /** An array representing days of the week, used to customize the display of days. */
  daysOfWeek?: DaysOfWeek;

  /** The starting day of the week (0 = Sunday, 1 = Monday, etc.), used to customize the week layout. */
  weekStart?: number;

  /** An object representing the current view of the calendar, typically consisting of the month and year. */
  viewport?: Viewport;

  /** A callback function that is called when the viewport changes, usually due to navigation or selection in the calendar. */
  onViewportChange?: (viewport: Viewport) => void;

  /** A function used to render each calendar cell, typically representing a day, taking a `DateObject` and returning a `ReactElement`. */
  renderCell?: (date: DateObject) => ReactElement;

  /** A function used to render the display of each day of the week, taking a day from `DaysOfWeek` and returning a `ReactElement`. */
  renderDayOfWeek?: (dayOfWeek: DaysOfWeek[number]) => ReactElement;

  /** A function used to render the calendar title, typically displaying the current month and year, taking a `Viewport` and returning a `ReactElement`. */
  renderTitle?: (viewport: Viewport) => ReactElement;
}

const today = new Date();

/**
 * Calendar Functional Component.
 *
 * This component renders a customizable calendar. It allows for custom rendering of various parts
 * of the calendar, such as individual days, days of the week, and the title. It is built to be flexible
 * and adaptable to different use cases.
 *
 * @param {Props} props - The properties passed to the component.
 * @param {boolean} [props.rtl] - RTL mode.
 * @param {DaysOfWeek} [props.daysOfWeek=['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']] - Customizable days of the week.
 * @param {Viewport} [props.viewport] - Object representing the current month and year viewed in the calendar.
 * @param {(viewport: Viewport) => void} [props.onViewportChange] - Function called when the month or year is changed.
 * @param {number} [props.weekStart=1] - Indicates the start day of the week (0 = Sunday, 1 = Monday, etc.).
 * @param {(date: DateObject) => ReactElement} [props.renderCell] - Function to render each date cell in the calendar.
 * @param {(dayOfWeek: DaysOfWeek[number]) => ReactElement} [props.renderDayOfWeek] - Function to render each day of the week.
 * @param {(viewport: Viewport) => ReactElement} [props.renderTitle] - Function to render the title of the calendar.
 * @returns {ReactElement} - The rendered calendar component.
 */
export const Calendar: FC<Props> = ({
  rtl = false,
  daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
  viewport = { month: today.getUTCMonth(), year: today.getUTCFullYear() },
  onViewportChange,
  weekStart = 1,
  renderTitle = (viewport): ReactNode => <Title viewport={viewport} />,
  renderCell = (date): ReactNode => <Cell date={date} />,
  renderDayOfWeek = (daysOfWeek): ReactNode => <DayOfWeek dayOfWeek={daysOfWeek} />,
}) => {
  /**
   * Memoized array representing the days of the week after considering "rtl" (right-to-left) and "weekStart".
   * If "rtl" is true, the days are reversed after arranging based on "weekStart".
   */
  const daysOfWeek_ = useMemo(() => {
    const daysOfWeekAfterWeekStart = [...daysOfWeek.slice(weekStart), ...daysOfWeek.slice(0, weekStart)];
    if (rtl) {
      return reverse(daysOfWeekAfterWeekStart);
    }
    return daysOfWeekAfterWeekStart;
  }, [daysOfWeek, rtl, weekStart]);

  /** State for the year is being viewed. */
  const [year, setYear] = useState(viewport.year);
  /** State for the month is being viewed */
  const [month, setMonth] = useState(viewport.month);

  /** Ref to track the previous month. */
  const prevMonth = useRef<number | null>(null);

  /** Ref to the latest onViewportChange prop to avoid stale closures. */
  const onViewportChangeLastest = useLatestPropsRef(onViewportChange);

  /** Memoized instance of the CalendarController. */
  const calendar = useMemo(() => {
    return new CalendarController({
      weekStart,
    });
  }, [weekStart]);

  /** Memoized calendar data based on the current month and year. */
  const calendarData = useMemo(() => {
    const data = splitEvery(7, calendar.getCalendar(year, month));
    return rtl ? map(week => week.slice().reverse(), data) : data;
  }, [calendar, year, month, rtl]);

  useEffect(() => {
    setYear(viewport.year);
    setMonth(viewport.month);
  }, [viewport]);

  useEffect(() => {
    if (month === 1 && prevMonth.current === 12) {
      setYear(year => year + 1);
    } else if (month === 12 && prevMonth.current === 1) {
      setYear(year => year - 1);
    }
    prevMonth.current = month;
  }, [month]);

  useEffect(() => {
    onViewportChangeLastest.current?.({ month, year });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [month, year]);

  const renderDaysOfWeek = (): ReactNode => {
    return (
      <ul className="Calendar__daysOfWeek">
        {daysOfWeek_.map(dayOfWeek => (
          <View disableStrict className="Calendar__dayOfWeek" tagName="li" key={dayOfWeek}>
            {renderDayOfWeek?.(dayOfWeek)}
          </View>
        ))}
      </ul>
    );
  };

  const renderRowDaysOfMonth = (dates: OutputDateObject[]): ReactNode => {
    const weekNumber = nth(0, dates)?.weekNumber;
    return (
      <ul className="Calendar__rowDays" key={weekNumber}>
        {dates.map(item => {
          if (!item) {
            return null;
          }
          return (
            <View
              disableStrict
              className="Calendar__cellDay"
              tagName="li"
              key={`${item.day}_${item.month}_${item.year}`}
            >
              {renderCell?.(item)}
            </View>
          );
        })}
      </ul>
    );
  };

  const renderDaysOfMonth = (): ReactNode => {
    return calendarData.map(renderRowDaysOfMonth);
  };

  return (
    <div className="Calendar__container">
      {renderTitle({ month, year })}
      {renderDaysOfWeek()}
      {renderDaysOfMonth()}
    </div>
  );
};
