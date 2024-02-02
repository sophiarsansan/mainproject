import { db } from "../firebase";
import { ref, set, onValue } from "firebase/database";

export const readDiaryEntries = async (): Promise<any[]> => {
  return new Promise((resolve, reject) => {
    const diaryEntriesRef = ref(db, 'diary_entries');
    onValue(diaryEntriesRef, (snapshot) => {
      if (snapshot.exists()) {
        resolve(snapshot.val() || []);
      } else {
        console.error('No data available');
        resolve([]);
      }
    }, (error) => {
      console.error('Error reading diary entries:', error);
      reject([]);
    });
  });
};

export const writeDiaryEntries = (entries: any[]): void => {
  const diaryEntriesRef = ref(db, 'diary_entries');
  set(diaryEntriesRef, entries);
};

