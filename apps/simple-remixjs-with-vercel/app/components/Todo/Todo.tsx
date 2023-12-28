import { editSvg, trashCanSvg } from 'assets';
import classNames from 'classnames';
import { useEffect, useState, useRef, FC, FormEvent, ChangeEvent } from 'react';
import { Text, View } from 'reactjs';
import { Todo as TodoModel } from '~/models/Todo';

interface Props {
  text: string;
  id: string;
  completed: boolean;
  deleteTodo: (id: string) => void;
  toggleTodo: (id: string) => void;
  updateTodo: (todo: string, id: TodoModel['id']) => void;
  isEditing: boolean;
  setCurrentlyEditing: (id: string | undefined) => void;
}

export const Todo: FC<Props> = ({
  text,
  id,
  completed,
  deleteTodo,
  toggleTodo,
  updateTodo,
  isEditing,
  setCurrentlyEditing,
}) => {
  const [newText, setNewText] = useState(text);

  const editingInput = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!isEditing) {
      return;
    }
    editingInput.current?.focus();
  }, [isEditing]);

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    const text = newText.trim();
    if (!text) {
      return;
    }
    updateTodo(text, id);
    setCurrentlyEditing(undefined);
  };

  const handleEditInputChange = (event: ChangeEvent<HTMLInputElement>): void => {
    setNewText(event.target.value);
    updateTodo(event.target.value, id);
  };

  const handleEditButtonClick = (): void => {
    isEditing ? setCurrentlyEditing(undefined) : setCurrentlyEditing(id);
  };

  return (
    <li
      className="relative flex items-center text-white bg-primary-400 mb-3 p-2"
      id={id}
      key={id}
      data-completed={completed}
    >
      <label htmlFor={`input-${id}`} className="group cursor-pointer">
        <input
          checked={completed}
          onChange={(): void => toggleTodo(id)}
          className="appearance-none w-3.5 h-3.5 mr-2 border rounded-full ease-linear duration-400 group-hover:shadow-checkbox group-hover:border-secondary checked:border-secondary checked:bg-secondary"
          id={`input-${id}`}
          type="checkbox"
        />
        <Text tagName="span" disableStrict className={completed ? 'line-through text-light' : ''}>
          {text}
        </Text>
      </label>
      <form
        className={classNames({
          hidden: !isEditing,
        })}
        onSubmit={handleSubmit}
      >
        <input
          ref={editingInput}
          className="absolute left-7.5 top-2 bg-primary-400 outline-none border-0 border-b border-white"
          id={`edit-box-${id}`}
          type="text"
          value={newText}
          onChange={handleEditInputChange}
        />
        <View tagName="button" disableStrict className="hidden" type="submit">
          Update
        </View>
      </form>

      <button className="ml-auto text-white" onClick={handleEditButtonClick}>
        <img src={editSvg} alt="edit" />
      </button>
      <button className="ml-2 text-white" onClick={(): void => deleteTodo(id)}>
        <img src={trashCanSvg} alt="delete" />
      </button>
      <View tagName="button" disableStrict className="hidden" onClick={(): void => toggleTodo(id)}>
        Toggle
      </View>
    </li>
  );
};
