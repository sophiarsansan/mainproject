// TodoList.tsx
import React from 'react';
import './styles.css';
import { Todo } from '../model';
import SingleTodo from './SingleTodo';

interface Props {
  todos: Todo[];
  setTodos: React.Dispatch<React.SetStateAction<Todo[]>>;
  handleEdit: (id: number, editedTodo: string, isDone: boolean) => void; // Add isDone parameter
  handleDelete: (id: number) => void;
}

const TodoList: React.FC<Props> = ({ todos, setTodos, handleEdit, handleDelete }: Props) => {
  return (
    <div className="todos">
      {todos.map((todo) => (
  <SingleTodo
    key={todo.id}
    todo={todo}  
    onEdit={handleEdit} // No changes needed here
    onDelete={handleDelete}
  />
))}
    </div>
  );
};

export default TodoList;
