import './Button.css';
import dayjs from 'dayjs';
import { FC } from 'react';
import { View } from 'reactjs';
import { isClampDate } from 'utilities';

export const Button: FC = () => {
  return (
    <View
      tagName="button"
      disableStrict
      onClick={(): void => {
        const today = dayjs('06/09/2023'); // 06/09/2023
        const isDayOf2023 = isClampDate({
          date: today,
          minDate: today.startOf('year'),
          maxDate: today.endOf('year'),
        });
        alert(JSON.stringify({ isDayOf2023 }));
      }}
    >
      Click
    </View>
  );
};
