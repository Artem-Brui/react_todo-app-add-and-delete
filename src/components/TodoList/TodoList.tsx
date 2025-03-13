import React from 'react';
import { Todo } from '../../types/Todo';
import TodoItem from '../TodoItem/TodoItem';
import { ErrorType } from '../../types/Error';

type TodoListProps = {
  todos: Todo[];
  loadingId: number;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoList: React.FC<TodoListProps> = ({
  todos,
  loadingId,
  setError,
  setTodos,
}) => {
  return (
    <section className="todoapp__main" data-cy="TodoList">
      {todos.map(todo => (
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
