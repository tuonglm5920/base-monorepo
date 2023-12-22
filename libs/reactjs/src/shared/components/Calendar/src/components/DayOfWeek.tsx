import { ReactNode } from 'react';
import { Text } from '../../../Text';
import { DaysOfWeek } from '../types/DaysOfWeek';

interface Props {
  /** The day of the week to be displayed. */
  dayOfWeek: DaysOfWeek[number];
}

/**
 * A functional React component that renders the specified day of the week.
 * It takes a `dayOfWeek` prop, which should be one of the valid days of the week.
 *
 * @component
 * @example
 * <DayOfWeek dayOfWeek="Monday" />
 *
 * @param {Props} props - The properties passed to the component.
 * @param {DaysOfWeek[number]} props.dayOfWeek - The day of the week to be displayed.
 *
 * @returns {React.ReactNode} The rendered day of the week component.
 */
export const DayOfWeek = ({ dayOfWeek }: Props): ReactNode => {
  return <Text>{dayOfWeek}</Text>;
};
