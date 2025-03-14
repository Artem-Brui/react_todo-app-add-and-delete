/* eslint-disable jsx-a11y/label-has-associated-control */

import React, { useCallback, useEffect, useState } from 'react';
import { Todo } from '../../types/Todo';
import classNames from 'classnames';
import { deleteTodo } from '../../api/todos';
import callError from '../../utils/callError';
import { ErrorType } from '../../types/Error';

type TodoProps = {
  todo: Todo;
  todos: Todo[];
  loadingId: number;
  setError: React.Dispatch<React.SetStateAction<ErrorType>>;
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
};

const TodoItem: React.FC<TodoProps> = ({
  todo,
  todos,
  loadingId,
  setError,
  setTodos,
}) => {
  const { id, title, completed } = todo;

  const [isLoading, setIsloading] = useState(id === loadingId);
  const [todoState, setTodoState] = useState({
    isEdited: false,
    editedValue: title,
    completed: completed,
  });

  if (isLoading) {
    setTimeout(() => setIsloading(false), 500);
  }

  useEffect(() => {
    const cleanInputFocus = (event: MouseEvent) => {
      const element = event.target as HTMLElement;

      if (element.dataset.cy !== 'TodoTitleField') {
        setTodoState({ ...todoState, isEdited: false });
      }
    };

    document.addEventListener('click', cleanInputFocus);

    return () => {
      document.removeEventListener('click', cleanInputFocus);
    };
  }, [todoState]);

  const handleDeleteClick = useCallback(
    (event: React.MouseEvent) => {
      event.preventDefault();

      setIsloading(true);
      deleteTodo(id)
        .then(() => {
          setTimeout(() => {
            setIsloading(false);
            setTodos(todos.filter(task => task.id !== id));
          }, 500);
        })
        .catch(() => callError(setError, 'delete'));
    },
    [id, todos, setTodos, setError],
  );

  return (
    <div
      key={id}
      data-cy="Todo"
      className={`todo ${todoState.completed ? 'completed' : ''}`}
    >
      <label className="todo__status-label">
        <input
          data-cy="TodoStatus"
          type="checkbox"
          className="todo__status"
          defaultChecked={todoState.completed}
          onClick={() =>
            setTodoState({ ...todoState, completed: !todoState.completed })
          }
        />
      </label>

      {todoState.isEdited ? (
        <form>
          <input
            data-cy="TodoTitleField"
            type="text"
            className="todo__title-field"
            placeholder="Empty todo will be deleted"
            value={todoState.editedValue}
            onChange={e =>
              setTodoState({ ...todoState, editedValue: e.target.value })
            }
          />
        </form>
      ) : (
        <span
          data-cy="TodoTitle"
          className="todo__title"
          onDoubleClick={() => setTodoState({ ...todoState, isEdited: true })}
        >
          {todoState.editedValue}
        </span>
      )}

      {/* Remove button appears only on hover */}
      <button
        type="button"
        className="todo__remove"
        data-cy="TodoDelete"
        onClick={handleDeleteClick}
      >
        ×
      </button>

      {/* overlay will cover the todo while it is being deleted or updated */}
      <div
        data-cy="TodoLoader"
        className={classNames('modal overlay', { 'is-active': isLoading })}
      >
        <div className="modal-background has-background-white-ter" />
        <div className="loader" />
      </div>
    </div>
  );
};

export default TodoItem;
