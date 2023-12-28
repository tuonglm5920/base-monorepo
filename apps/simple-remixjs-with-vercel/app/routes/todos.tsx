import { MetaFunction } from '@remix-run/node';
import classNames from 'classnames';
import { FC, useState } from 'react';
import { Text, View } from 'reactjs';
import FilterButton from '../components/FilterButton/FilterButton';
import { Form } from '../components/Form/Form';
import { Todo } from '../components/Todo/Todo';
import { Todo as TodoModel } from '../models/Todo';

export const meta: MetaFunction = () => {
  return [{ title: 'New Remix App' }, { name: 'description', content: 'Welcome to Remix!' }];
};

const FILTER_MAP = {
  All: (): boolean => true,
  Active: (task: TodoModel): boolean => !task.completed,
  Completed: (task: TodoModel): boolean => task.completed,
};

const FILTER_NAMES = Object.keys(FILTER_MAP);

const ListingTodos: FC = () => {
  const [todos, setTodos] = useState<TodoModel[]>([]);
  const [completedAll, setCompletedAll] = useState(false);
  const [filter, setFilter] = useState<keyof typeof FILTER_MAP>('All');
  const [currentlyEditing, setCurrentlyEditing] = useState<string | undefined>(undefined);

  const addTodo = (todo: TodoModel): void => {
    setTodos([...todos, todo]);
  };

  const deleteTodo = (id: TodoModel['id']): void => {
    setTodos(todos.filter(todo => todo.id !== id));
  };

  const deleteAll = (): void => {
    setTodos([]);
  };

  const toggleTodo = (id: TodoModel['id']): void => {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              completed: !todo.completed,
            }
          : todo,
      ),
    );
  };

  const toggleAll = (): void => {
    setTodos(
      todos.map(todo => ({
        ...todo,
        completed: !todo.completed,
      })),
    );
  };

  const updateTodo = (text: TodoModel['text'], id: TodoModel['id']): void => {
    setTodos(
      todos.map(todo =>
        todo.id === id
          ? {
              ...todo,
              text: text,
            }
          : todo,
      ),
    );
  };

  const completeAll = (): void => {
    setTodos(
      todos.map(todo => ({
        ...todo,
        completed: !completedAll,
      })),
    );
    setCompletedAll(!completedAll);
  };

  const filterList = FILTER_NAMES.map(name => (
    <FilterButton
      name={name}
      key={name}
      isPressed={name === filter}
      setFilter={(value): void => setFilter(value as keyof typeof FILTER_MAP)}
    />
  ));

  return (
    <div className="app-container bg-gradient-to-r from-green-400 to-blue-500 flex h-screen">
      <div className="m-auto bg-primary-600 white p-6 rounded-lg text-white max-w-md w-full">
        <Text tagName="h2" disableStrict className="text-white text-xl font-semibold mb-4">
          TO DO LIST
        </Text>
        <Form addTodo={addTodo} />
        <ul className="todos">
          {todos.filter(FILTER_MAP[filter]).map(({ text, id, completed }) => (
            <Todo
              key={id}
              text={text}
              id={id}
              completed={completed}
              deleteTodo={deleteTodo}
              toggleTodo={toggleTodo}
              updateTodo={updateTodo}
              isEditing={id === currentlyEditing}
              setCurrentlyEditing={setCurrentlyEditing}
            />
          ))}
        </ul>

        <div className="hidden">
          <View tagName="button" disableStrict onClick={deleteAll}>
            Delete All
          </View>
          <View tagName="button" disableStrict onClick={toggleAll}>
            Toggle All
          </View>
          <View tagName="button" disableStrict onClick={completeAll}>
            Complete All
          </View>
        </div>
        <View
          disableStrict
          className={classNames({
            hidden: !todos.length,
          })}
        >
          {filterList}
        </View>
      </div>
    </div>
  );
};

export default ListingTodos;
