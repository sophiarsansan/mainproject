// taskService.ts
import { Todo } from '../model';

export const readTodoEntries = (): Todo[] => {
  try {
    const data = localStorage.getItem('todo_entries');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error reading todo entries:', error);
    return [];
  }
};

export const writeTodoEntries = (entries: Todo[]): void => {
  localStorage.setItem('todo_entries', JSON.stringify(entries));
};
