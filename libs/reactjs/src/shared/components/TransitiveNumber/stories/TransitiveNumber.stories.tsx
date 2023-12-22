/* eslint-disable @nx/workspace/no-strings-outside-text-component */
import { Meta, StoryFn } from '@storybook/react';
import dayjs from 'dayjs';
import { useEffect, useState } from 'react';
import { TransitiveNumber } from '../src/TransitiveNumber';
import './styles.css';

export default {
  title: 'Shared/Components/TransitiveNumber',
  component: TransitiveNumber,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
} as Meta<typeof TransitiveNumber>;

export const Default: StoryFn<typeof TransitiveNumber> = () => {
  const [time, setTime] = useState(0);

  useEffect(() => {
    const intervalId = window.setInterval(() => {
      setTime(state => state + 1);
    }, 1000);
    return () => {
      clearInterval(intervalId);
    };
  }, []);

  return (
    <div className="comparison">
      <div className="comparison__cell comparison__cell_head">Plain HTML</div>
      <div className="comparison__cell comparison__cell_head">
        With <code>TransitiveNumber</code>
      </div>
      <div className="comparison__cell comparison__cell_first">
        <div className="timer">
          <span className="timer__dot" />
          <span>{dayjs(time * 1000).format('HH:mm:ss')}</span>
        </div>
      </div>
      <div className="comparison__cell">
        <div className="timer">
          <span className="timer__dot" />
          <TransitiveNumber>{dayjs(time * 1000).format('HH:mm:ss')}</TransitiveNumber>
        </div>
      </div>
    </div>
  );
};
