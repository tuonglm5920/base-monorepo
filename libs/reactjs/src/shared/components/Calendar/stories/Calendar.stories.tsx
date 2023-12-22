import { Meta, StoryFn } from '@storybook/react';
import dayjs from 'dayjs';
import { isEmpty, range } from 'ramda';
import { Calendar } from '../src/Calendar';

export default {
  title: 'Shared/Components/Calendar',
  component: Calendar,
  argTypes: {},
  parameters: {
    docs: {},
    design: {
      type: 'figma',
      url: 'https://www.figma.com/file/LKQ4FJ4bTnCSjedbRpk931/Sample-File',
    },
  },
  args: {},
} as Meta<typeof Calendar>;

interface EventPost {
  id: number;
  title: string;
  img: string;
  dateStart: { day: number; month: number; year: number; hours: string };
  dateEnd: { day: number; month: number; year: number; hours: string };
}

const today = new Date();

const data: EventPost[] = [
  {
    id: 1,
    title: 'How esports changed the game',
    img: 'https://highspeedblog.com/wp-content/uploads/2020/09/kkxzdtxr1zq-410x231.jpg',
    dateStart: { day: 20, month: today.getUTCMonth(), year: today.getUTCFullYear(), hours: '9:00am' },
    dateEnd: { day: 23, month: today.getUTCMonth(), year: today.getUTCFullYear(), hours: '11:30am' },
  },
  {
    id: 2,
    title: 'The Who’s ‘Tommy’ Returning to Broadway',
    img: 'https://highspeedblog.com/wp-content/uploads/2019/10/P006-1-410x273.jpg',
    dateStart: { day: 23, month: today.getUTCMonth(), year: today.getUTCFullYear(), hours: '2:00pm' },
    dateEnd: { day: 28, month: today.getUTCMonth(), year: today.getUTCFullYear(), hours: '5:00pm' },
  },
  {
    id: 3,
    title: 'My Summer Sephora Haul and VIB Rouge Bonus Event',
    img: 'https://highspeedblog.com/wp-content/uploads/2020/06/photo-1488282396544-0212eea56a21-410x273.jpeg',
    dateStart: { day: 20, month: today.getUTCMonth(), year: today.getUTCFullYear(), hours: '7:00pm' },
    dateEnd: { day: 20, month: today.getUTCMonth(), year: today.getUTCFullYear(), hours: '11:00pm' },
  },
  {
    id: 4,
    title: 'My Summer Sephora Haul and VIB Rouge Bonus Event',
    img: 'https://beauty.highspeedblog.com/wp-content/uploads/sites/5/2019/12/bt0014-1024x769.jpg',
    dateStart: { day: 10, month: today.getUTCMonth(), year: today.getUTCFullYear(), hours: '7:00pm' },
    dateEnd: { day: 11, month: today.getUTCMonth(), year: today.getUTCFullYear(), hours: '11:00pm' },
  },
  {
    id: 5,
    title: 'A Stylish Way to Wear a Denim Skirt',
    img: 'https://beauty.highspeedblog.com/wp-content/uploads/sites/5/2019/11/bt0007-1024x683.jpg',
    dateStart: { day: 20, month: today.getUTCMonth(), year: today.getUTCFullYear(), hours: '7:00pm' },
    dateEnd: { day: 20, month: today.getUTCMonth(), year: today.getUTCFullYear(), hours: '11:00pm' },
  },
];

export const Default: StoryFn<typeof Calendar> = args => {
  return (
    <Calendar
      {...args}
      renderTitle={({ month, year }) => <div>{dayjs().set('month', month).set('year', year).format('MMMM YYYY')}</div>}
      renderCell={({ day, month, year }) => {
        const events = data.filter(item => {
          return (
            range(Number(item.dateStart?.day), Number(item.dateEnd?.day) + 1).includes(day) &&
            Number(item.dateStart?.month) === month &&
            Number(item.dateStart?.year) === year
          );
        });
        return (
          <div
            aria-hidden
            onClick={() => events && alert(JSON.stringify(events))}
            style={{
              aspectRatio: '1 / 1',
              display: 'flex',
              margin: '0.25rem',
              justifyContent: 'center',
              alignItems: 'center',
              background: isEmpty(events) ? '#E5E7EB' : '#374151',
              color: isEmpty(events) ? '#000' : '#fff',
              cursor: isEmpty(events) ? 'default' : 'pointer',
            }}
          >
            {day.toString()}
          </div>
        );
      }}
      renderDayOfWeek={dayOfWeek => {
        return <div>{dayOfWeek.toString()}</div>;
      }}
    />
  );
};
