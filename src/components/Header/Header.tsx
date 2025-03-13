import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { ErrorType } from '../../types/Error';
import callError from '../../utils/callError';
import { addTodo } from '../../api/todos';

type HeaderProps = {
  todos: Todo[];
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  setLoadingId: React.Dispatch<React.SetStateAction<number>>;
};

const Header: React.FC<HeaderProps> = ({
  todos,
  setError,
  setTodos,
  setLoadingId,
}) => {
  const [isInputFocused, setIsInputFocused] = useState(false);
  const [todoInputValue, setTodoInputValue] = useState('');

  const focusedInput = useRef(null);

  const isAllActive = todos.every(todo => todo.completed);

  useEffect(() => {
    if (focusedInput.current) {
      const input = focusedInput.current as HTMLElement;

      input.focus();
    }
  }, []);

  const sentRequestAdd = useCallback(
    (event: KeyboardEvent) => {
      if (event.key === 'Enter') {
        if (!todoInputValue.trim().length) {
          callError(setError, 'emptyTitle');

          return;
        }

        addTodo(todoInputValue)
          .then(todo => {
            setTodoInputValue('');
            setLoadingId(todo.id);
            setTodos([...todos, todo]);
          })
          .catch(() => callError(setError, 'add'));
      }
    },
    [todoInputValue, setError, setTodos, setLoadingId, todos],
  );

  useEffect(() => {
    if (isInputFocused) {
      document.addEventListener('keydown', sentRequestAdd);
    }

    return () => document.removeEventListener('keydown', sentRequestAdd);
  }, [isInputFocused, sentRequestAdd]);

  return (
    <header className="todoapp__header">
      {/* this button should have `active` class only if all todos are completed */}
      <button
        type="button"
        className={classNames('todoapp__toggle-all', { active: isAllActive })}
        data-cy="ToggleAllButton"
      />

      {/* Add a todo on form submit */}
      <form>
        <input
          data-cy="NewTodoField"
          type="text"
          className="todoapp__new-todo"
          placeholder="What needs to be done?"
          ref={focusedInput}
          value={todoInputValue}
          onChange={event => setTodoInputValue(event?.target.value)}
          onFocus={() => setIsInputFocused(true)}
          onBlur={() => setIsInputFocused(false)}
        />
      </form>
    </header>
  );
};

export default Header;
