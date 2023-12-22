import { CalendarController } from '../src/calendarController';

describe('calendarController', () => {
  it('should return a valid calendar', () => {
    const calendar = new CalendarController({});
    const calendarDays = calendar.getCalendar(1986, 9);
    expect(calendarDays).toEqual([
      { day: 28, weekDay: 0, month: 8, year: 1986, siblingMonth: true, weekNumber: 39 },
      { day: 29, weekDay: 1, month: 8, year: 1986, siblingMonth: true, weekNumber: 40 },
      { day: 30, weekDay: 2, month: 8, year: 1986, siblingMonth: true, weekNumber: 40 },
      { day: 1, weekDay: 3, month: 9, year: 1986, weekNumber: 40 },
      { day: 2, weekDay: 4, month: 9, year: 1986, weekNumber: 40 },
      { day: 3, weekDay: 5, month: 9, year: 1986, weekNumber: 40 },
      { day: 4, weekDay: 6, month: 9, year: 1986, weekNumber: 40 },
      { day: 5, weekDay: 0, month: 9, year: 1986, weekNumber: 40 },
      { day: 6, weekDay: 1, month: 9, year: 1986, weekNumber: 41 },
      { day: 7, weekDay: 2, month: 9, year: 1986, weekNumber: 41 },
      { day: 8, weekDay: 3, month: 9, year: 1986, weekNumber: 41 },
      { day: 9, weekDay: 4, month: 9, year: 1986, weekNumber: 41 },
      { day: 10, weekDay: 5, month: 9, year: 1986, weekNumber: 41 },
      { day: 11, weekDay: 6, month: 9, year: 1986, weekNumber: 41 },
      { day: 12, weekDay: 0, month: 9, year: 1986, weekNumber: 41 },
      { day: 13, weekDay: 1, month: 9, year: 1986, weekNumber: 42 },
      { day: 14, weekDay: 2, month: 9, year: 1986, weekNumber: 42 },
      { day: 15, weekDay: 3, month: 9, year: 1986, weekNumber: 42 },
      { day: 16, weekDay: 4, month: 9, year: 1986, weekNumber: 42 },
      { day: 17, weekDay: 5, month: 9, year: 1986, weekNumber: 42 },
      { day: 18, weekDay: 6, month: 9, year: 1986, weekNumber: 42 },
      { day: 19, weekDay: 0, month: 9, year: 1986, weekNumber: 42 },
      { day: 20, weekDay: 1, month: 9, year: 1986, weekNumber: 43 },
      { day: 21, weekDay: 2, month: 9, year: 1986, weekNumber: 43 },
      { day: 22, weekDay: 3, month: 9, year: 1986, weekNumber: 43 },
      { day: 23, weekDay: 4, month: 9, year: 1986, weekNumber: 43 },
      { day: 24, weekDay: 5, month: 9, year: 1986, weekNumber: 43 },
      { day: 25, weekDay: 6, month: 9, year: 1986, weekNumber: 43 },
      { day: 26, weekDay: 0, month: 9, year: 1986, weekNumber: 43 },
      { day: 27, weekDay: 1, month: 9, year: 1986, weekNumber: 44 },
      { day: 28, weekDay: 2, month: 9, year: 1986, weekNumber: 44 },
      { day: 29, weekDay: 3, month: 9, year: 1986, weekNumber: 44 },
      { day: 30, weekDay: 4, month: 9, year: 1986, weekNumber: 44 },
      { day: 31, weekDay: 5, month: 9, year: 1986, weekNumber: 44 },
      { day: 1, weekDay: 6, month: 10, year: 1986, siblingMonth: true, weekNumber: 44 },
    ]);
  });

  it('should return a valid calendar with sibling months and week starting on a different day', () => {
    const calendar = new CalendarController({ weekStart: 1 });
    const calendarDays = calendar.getCalendar(1986, 9);
    expect(calendarDays).toEqual([
      { day: 29, weekDay: 1, month: 8, year: 1986, siblingMonth: true, weekNumber: 40 },
      { day: 30, weekDay: 2, month: 8, year: 1986, siblingMonth: true, weekNumber: 40 },
      { day: 1, weekDay: 3, month: 9, year: 1986, weekNumber: 40 },
      { day: 2, weekDay: 4, month: 9, year: 1986, weekNumber: 40 },
      { day: 3, weekDay: 5, month: 9, year: 1986, weekNumber: 40 },
      { day: 4, weekDay: 6, month: 9, year: 1986, weekNumber: 40 },
      { day: 5, weekDay: 0, month: 9, year: 1986, weekNumber: 40 },
      { day: 6, weekDay: 1, month: 9, year: 1986, weekNumber: 41 },
      { day: 7, weekDay: 2, month: 9, year: 1986, weekNumber: 41 },
      { day: 8, weekDay: 3, month: 9, year: 1986, weekNumber: 41 },
      { day: 9, weekDay: 4, month: 9, year: 1986, weekNumber: 41 },
      { day: 10, weekDay: 5, month: 9, year: 1986, weekNumber: 41 },
      { day: 11, weekDay: 6, month: 9, year: 1986, weekNumber: 41 },
      { day: 12, weekDay: 0, month: 9, year: 1986, weekNumber: 41 },
      { day: 13, weekDay: 1, month: 9, year: 1986, weekNumber: 42 },
      { day: 14, weekDay: 2, month: 9, year: 1986, weekNumber: 42 },
      { day: 15, weekDay: 3, month: 9, year: 1986, weekNumber: 42 },
      { day: 16, weekDay: 4, month: 9, year: 1986, weekNumber: 42 },
      { day: 17, weekDay: 5, month: 9, year: 1986, weekNumber: 42 },
      { day: 18, weekDay: 6, month: 9, year: 1986, weekNumber: 42 },
      { day: 19, weekDay: 0, month: 9, year: 1986, weekNumber: 42 },
      { day: 20, weekDay: 1, month: 9, year: 1986, weekNumber: 43 },
      { day: 21, weekDay: 2, month: 9, year: 1986, weekNumber: 43 },
      { day: 22, weekDay: 3, month: 9, year: 1986, weekNumber: 43 },
      { day: 23, weekDay: 4, month: 9, year: 1986, weekNumber: 43 },
      { day: 24, weekDay: 5, month: 9, year: 1986, weekNumber: 43 },
      { day: 25, weekDay: 6, month: 9, year: 1986, weekNumber: 43 },
      { day: 26, weekDay: 0, month: 9, year: 1986, weekNumber: 43 },
      { day: 27, weekDay: 1, month: 9, year: 1986, weekNumber: 44 },
      { day: 28, weekDay: 2, month: 9, year: 1986, weekNumber: 44 },
      { day: 29, weekDay: 3, month: 9, year: 1986, weekNumber: 44 },
      { day: 30, weekDay: 4, month: 9, year: 1986, weekNumber: 44 },
      { day: 31, weekDay: 5, month: 9, year: 1986, weekNumber: 44 },
      { day: 1, weekDay: 6, month: 10, year: 1986, siblingMonth: true, weekNumber: 44 },
      { day: 2, weekDay: 0, month: 10, year: 1986, siblingMonth: true, weekNumber: 44 },
    ]);
  });

  it('should return a valid calendar with sibling months and selected dates', () => {
    const calendar = new CalendarController({
      startDate: { day: 5, month: 10, year: 2010 },
      endDate: { day: 20, month: 10, year: 2010 },
    });
    const calendarDays = calendar.getCalendar(2010, 10);
    expect(calendarDays).toEqual([
      { day: 31, weekDay: 0, month: 9, year: 2010, siblingMonth: true, weekNumber: 43, selected: false },
      { day: 1, weekDay: 1, month: 10, year: 2010, weekNumber: 44, selected: false },
      { day: 2, weekDay: 2, month: 10, year: 2010, weekNumber: 44, selected: false },
      { day: 3, weekDay: 3, month: 10, year: 2010, weekNumber: 44, selected: false },
      { day: 4, weekDay: 4, month: 10, year: 2010, weekNumber: 44, selected: false },
      { day: 5, weekDay: 5, month: 10, year: 2010, weekNumber: 44, selected: true },
      { day: 6, weekDay: 6, month: 10, year: 2010, weekNumber: 44, selected: true },
      { day: 7, weekDay: 0, month: 10, year: 2010, weekNumber: 44, selected: true },
      { day: 8, weekDay: 1, month: 10, year: 2010, weekNumber: 45, selected: true },
      { day: 9, weekDay: 2, month: 10, year: 2010, weekNumber: 45, selected: true },
      { day: 10, weekDay: 3, month: 10, year: 2010, weekNumber: 45, selected: true },
      { day: 11, weekDay: 4, month: 10, year: 2010, weekNumber: 45, selected: true },
      { day: 12, weekDay: 5, month: 10, year: 2010, weekNumber: 45, selected: true },
      { day: 13, weekDay: 6, month: 10, year: 2010, weekNumber: 45, selected: true },
      { day: 14, weekDay: 0, month: 10, year: 2010, weekNumber: 45, selected: true },
      { day: 15, weekDay: 1, month: 10, year: 2010, weekNumber: 46, selected: true },
      { day: 16, weekDay: 2, month: 10, year: 2010, weekNumber: 46, selected: true },
      { day: 17, weekDay: 3, month: 10, year: 2010, weekNumber: 46, selected: true },
      { day: 18, weekDay: 4, month: 10, year: 2010, weekNumber: 46, selected: true },
      { day: 19, weekDay: 5, month: 10, year: 2010, weekNumber: 46, selected: true },
      { day: 20, weekDay: 6, month: 10, year: 2010, weekNumber: 46, selected: true },
      { day: 21, weekDay: 0, month: 10, year: 2010, weekNumber: 46, selected: false },
      { day: 22, weekDay: 1, month: 10, year: 2010, weekNumber: 47, selected: false },
      { day: 23, weekDay: 2, month: 10, year: 2010, weekNumber: 47, selected: false },
      { day: 24, weekDay: 3, month: 10, year: 2010, weekNumber: 47, selected: false },
      { day: 25, weekDay: 4, month: 10, year: 2010, weekNumber: 47, selected: false },
      { day: 26, weekDay: 5, month: 10, year: 2010, weekNumber: 47, selected: false },
      { day: 27, weekDay: 6, month: 10, year: 2010, weekNumber: 47, selected: false },
      { day: 28, weekDay: 0, month: 10, year: 2010, weekNumber: 47, selected: false },
      { day: 29, weekDay: 1, month: 10, year: 2010, weekNumber: 48, selected: false },
      { day: 30, weekDay: 2, month: 10, year: 2010, weekNumber: 48, selected: false },
      { day: 1, weekDay: 3, month: 11, year: 2010, siblingMonth: true, weekNumber: 48, selected: false },
      { day: 2, weekDay: 4, month: 11, year: 2010, siblingMonth: true, weekNumber: 48, selected: false },
      { day: 3, weekDay: 5, month: 11, year: 2010, siblingMonth: true, weekNumber: 48, selected: false },
      { day: 4, weekDay: 6, month: 11, year: 2010, siblingMonth: true, weekNumber: 48, selected: false },
    ]);
  });

  it('should return a valid calendar for Jan 2012', () => {
    const calendar = new CalendarController({});
    const calendarDays = calendar.getCalendar(2012, 0);
    expect(calendarDays).toEqual([
      { day: 1, weekDay: 0, month: 0, year: 2012, weekNumber: 52 },
      { day: 2, weekDay: 1, month: 0, year: 2012, weekNumber: 1 },
      { day: 3, weekDay: 2, month: 0, year: 2012, weekNumber: 1 },
      { day: 4, weekDay: 3, month: 0, year: 2012, weekNumber: 1 },
      { day: 5, weekDay: 4, month: 0, year: 2012, weekNumber: 1 },
      { day: 6, weekDay: 5, month: 0, year: 2012, weekNumber: 1 },
      { day: 7, weekDay: 6, month: 0, year: 2012, weekNumber: 1 },
      { day: 8, weekDay: 0, month: 0, year: 2012, weekNumber: 1 },
      { day: 9, weekDay: 1, month: 0, year: 2012, weekNumber: 2 },
      { day: 10, weekDay: 2, month: 0, year: 2012, weekNumber: 2 },
      { day: 11, weekDay: 3, month: 0, year: 2012, weekNumber: 2 },
      { day: 12, weekDay: 4, month: 0, year: 2012, weekNumber: 2 },
      { day: 13, weekDay: 5, month: 0, year: 2012, weekNumber: 2 },
      { day: 14, weekDay: 6, month: 0, year: 2012, weekNumber: 2 },
      { day: 15, weekDay: 0, month: 0, year: 2012, weekNumber: 2 },
      { day: 16, weekDay: 1, month: 0, year: 2012, weekNumber: 3 },
      { day: 17, weekDay: 2, month: 0, year: 2012, weekNumber: 3 },
      { day: 18, weekDay: 3, month: 0, year: 2012, weekNumber: 3 },
      { day: 19, weekDay: 4, month: 0, year: 2012, weekNumber: 3 },
      { day: 20, weekDay: 5, month: 0, year: 2012, weekNumber: 3 },
      { day: 21, weekDay: 6, month: 0, year: 2012, weekNumber: 3 },
      { day: 22, weekDay: 0, month: 0, year: 2012, weekNumber: 3 },
      { day: 23, weekDay: 1, month: 0, year: 2012, weekNumber: 4 },
      { day: 24, weekDay: 2, month: 0, year: 2012, weekNumber: 4 },
      { day: 25, weekDay: 3, month: 0, year: 2012, weekNumber: 4 },
      { day: 26, weekDay: 4, month: 0, year: 2012, weekNumber: 4 },
      { day: 27, weekDay: 5, month: 0, year: 2012, weekNumber: 4 },
      { day: 28, weekDay: 6, month: 0, year: 2012, weekNumber: 4 },
      { day: 29, weekDay: 0, month: 0, year: 2012, weekNumber: 4 },
      { day: 30, weekDay: 1, month: 0, year: 2012, weekNumber: 5 },
      { day: 31, weekDay: 2, month: 0, year: 2012, weekNumber: 5 },
      { day: 1, weekDay: 3, month: 1, year: 2012, siblingMonth: true, weekNumber: 5 },
      { day: 2, weekDay: 4, month: 1, year: 2012, siblingMonth: true, weekNumber: 5 },
      { day: 3, weekDay: 5, month: 1, year: 2012, siblingMonth: true, weekNumber: 5 },
      { day: 4, weekDay: 6, month: 1, year: 2012, siblingMonth: true, weekNumber: 5 },
    ]);
  });

  it('should return a valid calendar for Dec 2019', () => {
    const calendar = new CalendarController({});
    const calendarDays = calendar.getCalendar(2019, 11);
    expect(calendarDays).toEqual([
      { day: 1, weekDay: 0, month: 11, year: 2019, weekNumber: 48 },
      { day: 2, weekDay: 1, month: 11, year: 2019, weekNumber: 49 },
      { day: 3, weekDay: 2, month: 11, year: 2019, weekNumber: 49 },
      { day: 4, weekDay: 3, month: 11, year: 2019, weekNumber: 49 },
      { day: 5, weekDay: 4, month: 11, year: 2019, weekNumber: 49 },
      { day: 6, weekDay: 5, month: 11, year: 2019, weekNumber: 49 },
      { day: 7, weekDay: 6, month: 11, year: 2019, weekNumber: 49 },
      { day: 8, weekDay: 0, month: 11, year: 2019, weekNumber: 49 },
      { day: 9, weekDay: 1, month: 11, year: 2019, weekNumber: 50 },
      { day: 10, weekDay: 2, month: 11, year: 2019, weekNumber: 50 },
      { day: 11, weekDay: 3, month: 11, year: 2019, weekNumber: 50 },
      { day: 12, weekDay: 4, month: 11, year: 2019, weekNumber: 50 },
      { day: 13, weekDay: 5, month: 11, year: 2019, weekNumber: 50 },
      { day: 14, weekDay: 6, month: 11, year: 2019, weekNumber: 50 },
      { day: 15, weekDay: 0, month: 11, year: 2019, weekNumber: 50 },
      { day: 16, weekDay: 1, month: 11, year: 2019, weekNumber: 51 },
      { day: 17, weekDay: 2, month: 11, year: 2019, weekNumber: 51 },
      { day: 18, weekDay: 3, month: 11, year: 2019, weekNumber: 51 },
      { day: 19, weekDay: 4, month: 11, year: 2019, weekNumber: 51 },
      { day: 20, weekDay: 5, month: 11, year: 2019, weekNumber: 51 },
      { day: 21, weekDay: 6, month: 11, year: 2019, weekNumber: 51 },
      { day: 22, weekDay: 0, month: 11, year: 2019, weekNumber: 51 },
      { day: 23, weekDay: 1, month: 11, year: 2019, weekNumber: 52 },
      { day: 24, weekDay: 2, month: 11, year: 2019, weekNumber: 52 },
      { day: 25, weekDay: 3, month: 11, year: 2019, weekNumber: 52 },
      { day: 26, weekDay: 4, month: 11, year: 2019, weekNumber: 52 },
      { day: 27, weekDay: 5, month: 11, year: 2019, weekNumber: 52 },
      { day: 28, weekDay: 6, month: 11, year: 2019, weekNumber: 52 },
      { day: 29, weekDay: 0, month: 11, year: 2019, weekNumber: 52 },
      { day: 30, weekDay: 1, month: 11, year: 2019, weekNumber: 1 },
      { day: 31, weekDay: 2, month: 11, year: 2019, weekNumber: 1 },
      { day: 1, weekDay: 3, month: 0, year: 2020, siblingMonth: true, weekNumber: 1 },
      { day: 2, weekDay: 4, month: 0, year: 2020, siblingMonth: true, weekNumber: 1 },
      { day: 3, weekDay: 5, month: 0, year: 2020, siblingMonth: true, weekNumber: 1 },
      { day: 4, weekDay: 6, month: 0, year: 2020, siblingMonth: true, weekNumber: 1 },
    ]);
  });

  it('should return a valid Feb 1996', () => {
    const calendar = new CalendarController({});
    const calendarDays = calendar.getCalendar(1996, 1);
    expect(calendarDays[32]).toEqual({ day: 29, weekDay: 4, month: 1, year: 1996, weekNumber: 9 });
  });

  it('should return a valid Feb 2000', () => {
    const calendar = new CalendarController({});
    const calendarDays = calendar.getCalendar(2000, 1);
    expect(calendarDays[30]).toEqual({ day: 29, weekDay: 2, month: 1, year: 2000, weekNumber: 9 });
  });

  it('should adjust the month number', () => {
    const calendar = new CalendarController({});
    const calendarDays = calendar.getCalendar(2010, 12);
    const fifteenthDate = calendarDays[15];
    expect(fifteenthDate && fifteenthDate.month).toEqual(0);
    expect(fifteenthDate && fifteenthDate.year).toEqual(2011);
  });

  it('should return valid date selection states for same month', () => {
    const calendar = new CalendarController({});
    calendar.setSelectedRange({
      start: { year: 2010, month: 0, day: 15 },
      end: { year: 2010, month: 0, day: 17 },
    });
    expect(calendar.isDateSelected({ year: 2010, month: 0, day: 14 })).toEqual(false);
    expect(calendar.isDateSelected({ year: 2010, month: 0, day: 15 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2010, month: 0, day: 16 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2010, month: 0, day: 17 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2010, month: 0, day: 18 })).toEqual(false);
  });

  it('should return valid date selection states for same year', () => {
    const calendar = new CalendarController({});
    calendar.setSelectedRange({
      start: { year: 2010, month: 1, day: 15 },
      end: { year: 2010, month: 3, day: 15 },
    });
    expect(calendar.isDateSelected({ year: 2010, month: 0, day: 15 })).toEqual(false);
    expect(calendar.isDateSelected({ year: 2010, month: 1, day: 14 })).toEqual(false);
    expect(calendar.isDateSelected({ year: 2010, month: 1, day: 15 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2010, month: 1, day: 16 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2010, month: 2, day: 15 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2010, month: 3, day: 15 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2010, month: 3, day: 16 })).toEqual(false);
    expect(calendar.isDateSelected({ year: 2010, month: 4, day: 15 })).toEqual(false);
  });

  it('should return valid date selection states for multiple years', () => {
    const calendar = new CalendarController({});
    calendar.setSelectedRange({
      start: { year: 2010, month: 1, day: 15 },
      end: { year: 2012, month: 1, day: 15 },
    });
    expect(calendar.isDateSelected({ year: 2010, month: 0, day: 15 })).toEqual(false);
    expect(calendar.isDateSelected({ year: 2010, month: 1, day: 14 })).toEqual(false);
    expect(calendar.isDateSelected({ year: 2010, month: 1, day: 15 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2010, month: 11, day: 31 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2011, month: 0, day: 1 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2011, month: 1, day: 15 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2011, month: 11, day: 31 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2012, month: 1, day: 15 })).toEqual(true);
    expect(calendar.isDateSelected({ year: 2012, month: 1, day: 16 })).toEqual(false);
  });

  it('should return valid date diffs', () => {
    expect(CalendarController.diff({ year: 2016, month: 2, day: 1 }, { year: 2016, month: 1, day: 1 })).toEqual(29);
    expect(CalendarController.diff({ year: 2010, month: 0, day: 1 }, { year: 2011, month: 0, day: 1 })).toEqual(-365);
  });

  it('should return valid date intervals', () => {
    expect(CalendarController.interval({ year: 1986, month: 1, day: 16 }, { year: 1986, month: 1, day: 16 })).toEqual(
      1,
    );
    expect(CalendarController.interval({ year: 1986, month: 1, day: 10 }, { year: 1986, month: 2, day: 10 })).toEqual(
      29,
    );
    expect(CalendarController.interval({ year: 1986, month: 0, day: 1 }, { year: 1986, month: 11, day: 31 })).toEqual(
      365,
    );
    expect(CalendarController.interval({ year: 1990, month: 0, day: 1 }, { year: 1990, month: 11, day: 31 })).toEqual(
      365,
    );
    expect(CalendarController.interval({ year: 1996, month: 0, day: 1 }, { year: 1996, month: 11, day: 31 })).toEqual(
      366,
    );
    expect(CalendarController.interval({ year: 2000, month: 0, day: 1 }, { year: 2000, month: 11, day: 31 })).toEqual(
      366,
    );
    expect(CalendarController.interval({ year: 2100, month: 0, day: 1 }, { year: 2100, month: 11, day: 31 })).toEqual(
      365,
    );
  });

  it('should return valid date comparisons', () => {
    expect(CalendarController.compare({ year: 2000, month: 0, day: 1 }, { year: 2000, month: 0, day: 1 })).toEqual(0);
    expect(CalendarController.compare({ year: 2000, month: 0, day: 1 }, { year: 2000, month: 0, day: 2 })).toEqual(-1);
    expect(CalendarController.compare({ year: 2000, month: 0, day: 2 }, { year: 2000, month: 0, day: 1 })).toEqual(1);
    expect(CalendarController.compare({ year: 2000, month: 0, day: 1 }, { year: 2000, month: 1, day: 1 })).toEqual(-1);
    expect(CalendarController.compare({ year: 2000, month: 1, day: 1 }, { year: 2000, month: 0, day: 1 })).toEqual(1);
    expect(CalendarController.compare({ year: 2001, month: 0, day: 1 }, { year: 2000, month: 0, day: 1 })).toEqual(1);
    expect(CalendarController.compare({ year: 2000, month: 0, day: 1 }, { year: 2001, month: 0, day: 1 })).toEqual(-1);
  });

  it('should set range date', () => {
    const calendar = new CalendarController({});
    calendar.setSelectedRange({
      start: { year: 2010, month: 1, day: 15 },
      end: { year: 2011, month: 1, day: 15 },
    });
    expect(calendar.getStartDateForTesting()).toEqual({ year: 2010, month: 1, day: 15 });
    expect(calendar.getEndDateForTesting()).toEqual({ year: 2011, month: 1, day: 15 });
  });

  it('should return valid days in month', () => {
    expect(CalendarController.daysInMonth(1988, 1)).toEqual(29);
    expect(CalendarController.daysInMonth(1988, 7)).toEqual(31);
    expect(CalendarController.daysInMonth(2015, 10)).toEqual(30);
  });
});
