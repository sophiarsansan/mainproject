// SingleTodo.tsx
import React, { useEffect, useRef, useState } from 'react';
import { Todo } from '../model';
import { AiFillDelete, AiFillEdit } from 'react-icons/ai';
import { MdDone } from 'react-icons/md';
import './styles.css';

type Props = {
    todo: Todo;
    onEdit: (id: number, editedTodo: string, isDone: boolean) => void; // Add isDone parameter
    onDelete: (id: number) => void;
  };

const SingleTodo: React.FC<Props> = ({ todo, onEdit, onDelete }) => {
  const [edit, setEdit] = useState<boolean>(false);
  const [editTodo, setEditTodo] = useState<string>(todo.todo);
  const [strikethrough, setStrikethrough] = useState<boolean>(todo.isDone);

  const handleDone = () => {
    setStrikethrough(!strikethrough);
    onEdit(todo.id, editTodo, !strikethrough); // Pass the new isDone value
  };

  const handleEdit = (e: React.FormEvent) => {
    e.preventDefault();
    onEdit(todo.id, editTodo, strikethrough); // Pass the current isDone value
    setEdit(false);
  };
  const handleDelete = () => {
    onDelete(todo.id);
  };

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [edit]);

  return (
    <form className={`todos_single ${strikethrough ? 'strikethrough' : ''}`} onSubmit={handleEdit}>
      {edit ? (
        <input
          ref={inputRef}
          value={editTodo}
          onChange={(e) => setEditTodo(e.target.value)}
          className="todos_single--text"
        />
      ) : strikethrough ? (
        <s className="todos_single--text">{todo.todo}</s>
      ) : (
        <span className="todos_single--text">{todo.todo}</span>
      )}
      <div>
        <span
          className="icon"
          onClick={() => {
            if (!edit && !strikethrough) {
              setEdit(!edit);
            }
          }}
        >
          <AiFillEdit />
        </span>
        <span className="icon" onClick={handleDelete}>
          <AiFillDelete />
        </span>
        <span className="icon" onClick={handleDone}>
          <MdDone />
        </span>
      </div>
    </form>
  );
};

export default SingleTodo;
