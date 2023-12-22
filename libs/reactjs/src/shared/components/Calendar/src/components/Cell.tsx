import { FC } from 'react';
import { DateObject } from 'utilities';
import { Text } from '../../../Text';

interface Props {
  /** An object representing the date to be displayed in the cell. */
  date: DateObject;
}

/**
 * A functional React component that renders a cell in a date-related display.
 * It takes a `date` prop, which should be an object containing date information.
 * The component renders the day of the month from the provided `date` object.
 *
 * @component
 * @example
 * <Cell date={{ year: 2023, month: 12, day: 14 }} />
 *
 * @param {Props} props - The properties passed to the component.
 * @param {DateObject} props.date - An object representing the date to be displayed in the cell.
 *
 * @returns {React.ReactElement} The rendered cell component.
 */
export const Cell: FC<Props> = ({ date }) => {
  return <Text>{date.day.toString()}</Text>;
};
