// DiaryApp.tsx
import React, { useState, useEffect } from 'react';
import { readDiaryEntries, writeDiaryEntries } from './diary_components/diaryService';
import './Diary.css'; // Import the CSS file
import DiaryEntryDisplay from './diary_components/DiaryEntryDisplay';
import { BsPinAngle, BsPinAngleFill } from "react-icons/bs";

interface DiaryEntry {
  id: string;
  title: string;
  content: string;
  date: string;
  pinned: boolean;
}

const DiaryApp: React.FC = () => {
  const [diaryTitle, setDiaryTitle] = useState<string>('');
  const [diaryContent, setDiaryContent] = useState<string>('');
  const [diaryEntries, setDiaryEntries] = useState<DiaryEntry[]>([]);
  const [selectedEntryId, setSelectedEntryId] = useState<string | null>(null);

  const handleEditEntry = (editedEntry: { title: string; content: string }) => {
    const updatedEntries = diaryEntries.map((entry) =>
      entry.id === selectedEntryId
        ? { ...entry, title: editedEntry.title, content: editedEntry.content }
        : entry
    );
    setDiaryEntries(updatedEntries);
    writeDiaryEntries(updatedEntries);
  };

  const handleTitleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setDiaryTitle(event.target.value);
  };

  const handleDiaryChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setDiaryContent(event.target.value);
  };

  const handleDiarySubmit = () => {
    const newEntry: DiaryEntry = {
      id: Date.now().toString(),
      title: diaryTitle || `Diary Entry ${diaryEntries.length + 1}`,
      content: diaryContent,
      date: new Date().toLocaleString(),
      pinned: false,
    };

    const updatedEntries = [newEntry, ...diaryEntries];
    setDiaryEntries(updatedEntries);
    writeDiaryEntries(updatedEntries);
    setDiaryTitle('');
    setDiaryContent('');
  };

  const handleDeleteEntry = (id: string) => {
    const updatedEntries = diaryEntries.filter((entry) => entry.id !== id);
    setDiaryEntries(updatedEntries);
    writeDiaryEntries(updatedEntries);
    setSelectedEntryId(null);
  };

  const toggleDrawer = (id: string) => {
    setSelectedEntryId(selectedEntryId === id ? null : id);
  };

  const handlePinEntry = (id: string) => {
    const updatedEntries = diaryEntries.map((entry) =>
      entry.id === id ? { ...entry, pinned: !entry.pinned } : entry
    );
    setDiaryEntries(updatedEntries);
    writeDiaryEntries(updatedEntries);
  };

  useEffect(() => {
    const storedEntries = readDiaryEntries();
    setDiaryEntries(storedEntries);
  }, []);

  // Sort entries to display pinned entries first
  const sortedEntries = [...diaryEntries].sort((a, b) => (a.pinned === b.pinned ? 0 : a.pinned ? -1 : 1));

  return (
    <div>
    <div className="banner">AWS NOTEPAD</div>
    <div className="container">
      <div className="leftPanel">
        <h1>Note App</h1>
        <input
          type="text"
          className="titleInput"
          placeholder="Title"
          value={diaryTitle}
          onChange={handleTitleChange}
        />
        <textarea
          className="textArea"
          placeholder="Write your thoughts..."
          value={diaryContent}
          onChange={handleDiaryChange}
        />
        <button className="button" onClick={handleDiarySubmit}>
          Add Entry
        </button>
      </div>
      <div className="rightPanel">
        <div>
          {sortedEntries.map((entry) => (
            <div key={entry.id} className={`entryItem ${entry.pinned ? 'pinnedEntry' : 'unpinnedEntry'}`}>
              <div className="entryHeader" onClick={() => toggleDrawer(entry.id)}>
                <h3>{entry.title}</h3>
                <p>{entry.date}</p>
                <button className="button" onClick={() => handlePinEntry(entry.id)}>
                  {entry.pinned ? <BsPinAngleFill /> : <BsPinAngle />}
                </button>
              </div>
              {selectedEntryId === entry.id && (
                <DiaryEntryDisplay
                  entry={entry}
                  onClose={() => setSelectedEntryId(null)}
                  onDelete={() => handleDeleteEntry(entry.id)}
                  onEdit={handleEditEntry}
                />
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
    </div>
  );
};

export default DiaryApp;