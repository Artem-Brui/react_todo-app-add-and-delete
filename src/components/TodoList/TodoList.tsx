import React from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';
import { ErrorType } from '../../types/Error';
import { getFiltredTodoList } from '../Footer/service';
import { Filter } from '../Footer/types';

type TodoListProps = {
  todos: Todo[];
  filter: Filter;
  tempTodo: Todo | null;
  loadingId: number;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoList: React.FC<TodoListProps> = ({
  todos,
  filter,
  tempTodo,
  loadingId,
  setError,
  setTodos,
}) => {
  const filtredTodoList = tempTodo
    ? [...getFiltredTodoList(filter, todos), tempTodo]
    : getFiltredTodoList(filter, todos);

  return (
    <section className="todoapp__main" data-cy="TodoList">
      {filtredTodoList.map(todo => (
        <TodoItem
          key={todo.id}
          todo={todo}
          todos={todos}
          loadingId={loadingId}
          setError={setError}
          setTodos={setTodos}
        />
      ))}
    </section>
  );
};

export default TodoList;
