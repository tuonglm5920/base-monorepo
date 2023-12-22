import { FC } from 'react';

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
    <button className="px-3 py-1" onClick={(): void => setFilter(name)} aria-pressed={isPressed}>
      <span className="sr-only">Show</span>
      <span>{name}</span>
      <span className="sr-only">Tasks</span>
    </button>
  );
};

export default FilterButton;
