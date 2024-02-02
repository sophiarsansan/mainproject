// taskService.ts
import { db } from "../firebase";
import { ref, set, onValue } from "firebase/database";

export const readTodoEntries = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const todoEntriesRef = ref(db, 'todo_entries');
    onValue(todoEntriesRef, (snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val() || []);
      } else {
        console.error('No data available');
        resolve([]);
      }
    }, (error) => {
      console.error('Error reading todo entries:', error);
      reject([]);
    });
  });
};

export const writeTodoEntries = (entries: any[]): void => {
  const todoEntriesRef = ref(db, 'todo_entries');
  set(todoEntriesRef, entries);
};
