import { FC } from 'react';
import { Text, View } from 'reactjs';

interface Props {
  /** ### Mô tả */
  name: string;
  /** ### Mô tả */
  isPressed: boolean;
  /** ### Mô tả */
  setFilter: (value: string) => void;
}

const FilterButton: FC<Props> = ({ name, isPressed, setFilter }) => {
  return (
    <View tagName="button" className="px-3 py-1" onClick={(): void => setFilter(name)} aria-pressed={isPressed}>
      <Text tagName="span" disableStrict className="sr-only">
        Show
      </Text>
      <Text tagName="span" disableStrict>
        {name}
      </Text>
      <Text tagName="span" disableStrict className="sr-only">
        Tasks
      </Text>
    </View>
  );
};

export default FilterButton;
