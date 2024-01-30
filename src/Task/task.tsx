// Task.tsx
import React, { useState, useEffect } from 'react';
import './Task.css';
import InputField from '../components/InputField';
import { Todo } from '../model';
import TodoList from '../components/TodoList';
import { readTodoEntries, writeTodoEntries } from '../components/taskService'; // Import task service

const Task: React.FC = () => {
  const [todo, setTodo] = useState<string>("");
  const [todos, setTodos] = useState<Todo[]>([]);

  useEffect(() => {
    const storedTasks = readTodoEntries();
    setTodos(storedTasks);
  }, []);

  const handleAdd = (e: React.FormEvent) => {
    e.preventDefault();

    if (todo) {
      const newTask: Todo = { id: Date.now(), todo, isDone: false };
      setTodos([...todos, newTask]);
      writeTodoEntries([...todos, newTask]);
      setTodo('');
    }
  };

  const handleEdit = (id: number, editedTodo: string, isDone: boolean) => { // Add isDone parameter
    const updatedTasks = todos.map((task) =>
      task.id === id ? { ...task, todo: editedTodo, isDone } : task
    );
    setTodos(updatedTasks);
    writeTodoEntries(updatedTasks);
  };

  const handleDelete = (id: number) => {
    const updatedTasks = todos.filter((task) => task.id !== id);
    setTodos(updatedTasks);
    writeTodoEntries(updatedTasks);
  };

  return (
    <div className="App">
      <span className="heading">AWS TASK-PAD</span>
      <InputField todo={todo} setTodo={setTodo} handleAdd={handleAdd} />
      <TodoList todos={todos} setTodos={setTodos} handleEdit={handleEdit} handleDelete={handleDelete} />
    </div>
  );
};

export default Task;
