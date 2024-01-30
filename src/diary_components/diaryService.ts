// diaryService.ts
export const readDiaryEntries = (): any[] => {
    try {
      const data = localStorage.getItem('diary_entries');
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Error reading diary entries:', error);
      return [];
    }
  };
  
  
 // diaryService.ts
export const writeDiaryEntries = (entries: any[]): void => {
  // Replace newlines with <br/> before storing
  const entriesWithBr = entries.map(entry => ({
    ...entry,
    content: entry.content.replace(/\n/g, '<br/>'),
  }));
  localStorage.setItem('diary_entries', JSON.stringify(entriesWithBr));
};