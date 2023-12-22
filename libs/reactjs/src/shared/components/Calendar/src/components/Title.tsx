import { FC } from 'react';
import { Text } from '../../../Text';
import { View } from '../../../View';
import { Viewport } from '../types/Viewport';

interface Props {
  /** An object representing the viewport, typically containing month and year information. */
  viewport: Viewport;
}

/**
 * A functional React component that renders a title with month and year information.
 * It takes a `viewport` prop, which should be an object containing month and year properties.
 *
 * @component
 * @example
 * <Title viewport={{ month: 'January', year: 2023 }} />
 *
 * @param {Props} props - The properties passed to the component.
 * @param {Viewport} props.viewport - An object representing the viewport with month and year information.
 *
 * @returns {React.ReactNode} The rendered title component.
 */
export const Title: FC<Props> = ({ viewport }) => {
  return (
    <View>
      <Text>{viewport.month.toString()}</Text>
      <Text>{viewport.year.toString()}</Text>
    </View>
  );
};
