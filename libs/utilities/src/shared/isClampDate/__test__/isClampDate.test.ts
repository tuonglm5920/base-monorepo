import dayjs from 'dayjs';
import { isClampDate } from '../src/isClampDate';

describe('isClampDate', () => {
  it('should work', () => {
    const today = dayjs('06/09/2023'); // 06/09/2023
    const isDayOf2023 = isClampDate({
      date: today,
      minDate: today.startOf('year'),
      maxDate: today.endOf('year'),
    }); // true
    expect(isDayOf2023).toBeTruthy();
  });
});
