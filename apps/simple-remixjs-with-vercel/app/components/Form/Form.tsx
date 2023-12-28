import { plusSvg } from 'assets';
import { FC, FormEvent, useState } from 'react';
import { Text } from 'reactjs';
import { v4 } from 'uuid';
import { Todo } from '~/models/Todo';

interface Props {
  addTodo: (todo: Todo) => void;
}

export const Form: FC<Props> = ({ addTodo }) => {
  const [text, setText] = useState('');

  const clearForm = (): void => {
    setText('');
  };

  const handleSubmit = (event: FormEvent): void => {
    event.preventDefault();
    const todoText = text.trim();
    if (!todoText) {
      return;
    }
    addTodo({
      text: todoText,
      id: `todo-${v4()}`,
      completed: false,
    });
    clearForm();
  };

  return (
    <form className="text-white flex gap-1 w-full mb-4" onSubmit={handleSubmit}>
      <label htmlFor="todo" className="flex-1 mr-1">
        <Text tagName="span" disableStrict className="hidden">
          Todo
        </Text>
        <input
          className="w-full text-inherit px-1 py-2 border-0 border-b border-white bg-transparent outline-0"
          type="text"
          name="todo"
          placeholder="Add New Todo"
          value={text}
          onChange={(event): void => setText(event.target.value)}
        />
      </label>
      <button
        className="text-inherit bg-secondary w-9 h-9 flex justify-center items-center rounded-full shadow-button"
        type="submit"
      >
        <img src={plusSvg} alt="plus" />
        <Text tagName="span" disableStrict className="sr-only">
          Add Todo
        </Text>
      </button>
    </form>
  );
};
