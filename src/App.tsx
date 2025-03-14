import React, { useEffect, useState } from 'react';
import { UserWarning } from './UserWarning';
import { getTodos, USER_ID } from './api/todos';
import { Todo } from './types/Todo';
import TodoList from './components/TodoList/TodoList';
import Footer from './components/Footer/Footer';
import ErrorMessage from './components/ErrorMessage';
import { Filter } from './components/Footer/types';
import Header from './components/Header';
import { ErrorType } from './types/Error';
import callError from './utils/callError';

export const App: React.FC = () => {
  const [filter, setFilter] = useState<Filter>('FilterLinkAll');
  const [loadingId, setLoadingId] = useState(0);

  const [todos, setTodos] = useState<Todo[]>([]);
  const [tempTodo, setTempTodo] = useState<Todo | null>(null);

  const [error, setError] = useState<ErrorType>({
    isVisible: false,
    type: 'emptyTitle',
  });

  useEffect(() => {
    getTodos()
      .then(setTodos)
      .catch(() => callError(setError, 'load'));
  }, []);

  if (!USER_ID) {
    return <UserWarning />;
  }

  if (error.isVisible) {
    setTimeout(() => {
      setError({
        isVisible: false,
        type: '',
      });
    }, 3000);
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>

      <div className="todoapp__content">
        <Header
          todos={todos}
          setError={setError}
          setLoadingId={setLoadingId}
          setTempTodo={setTempTodo}
          setTodos={setTodos}
        />

        <TodoList
          todos={todos}
          filter={filter}
          tempTodo={tempTodo}
          loadingId={loadingId}
          setError={setError}
          setTodos={setTodos}
        />

        {!!todos.length && (
          <Footer todos={todos} filter={filter} updateFilter={setFilter} />
        )}
      </div>

      <ErrorMessage error={error} />
    </div>
  );
};
