// DiaryEntryDisplay.tsx
import React, { useState } from 'react';
import '../Diary.css';

interface DiaryEntryDisplayProps {
  entry: {
    id: string;
    title: string;
    content: string;
    date: string;
    pinned: boolean; // Add the pinned property
  };
  onClose: () => void;
  onDelete: () => void;
  onEdit: (editedEntry: { title: string; content: string }) => void;
}

const DiaryEntryDisplay: React.FC<DiaryEntryDisplayProps> = ({ entry, onClose, onDelete, onEdit }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState(entry.title);
  const [editedContent, setEditedContent] = useState(entry.content);

  const startEditing = () => {
    setIsEditing(true);
  };

  const saveEdit = () => {
    // Add validation if needed
    if (editedTitle.trim() === '' || editedContent.trim() === '') {
      // Handle validation error, e.g., show a message
      return;
    }

    // Handle newlines in content
    const sanitizedContent = editedContent.replace(/\n/g, '<br/>');

    onEdit({ title: editedTitle, content: sanitizedContent });
    setIsEditing(false);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    // Reset edited content on cancel
    setEditedTitle(entry.title);
    setEditedContent(entry.content);
  };

  return (
    <div className={`floatingWindow ${entry.pinned ? 'pinnedEntry' : 'unpinnedEntry'}`}>
      <div className="entryHeader_1">
        <h3>
          {isEditing ? (
            <input type="text" value={editedTitle} onChange={(e) => setEditedTitle(e.target.value)} />
          ) : (
            entry.title
          )}
        </h3>
        <p>{entry.date}</p>
      </div>
      <div className="drawerContent">
        {isEditing ? (
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            placeholder="Edit your thoughts..."
          />
        ) : (
          <div dangerouslySetInnerHTML={{ __html: entry.content.replace(/\n/g, '<br/>') }} />
        )}
      </div>
      <div className="entryFooter">
        {isEditing ? (
          <>
            <button className="button" onClick={saveEdit}>
              Save
            </button>
            <button className="button" onClick={cancelEdit}>
              Cancel
            </button>
          </>
        ) : (
          <button className="button" onClick={startEditing}>
            Edit
          </button>
        )}
        <button className="button" onClick={onDelete}>
          Delete
        </button>
        <button className="button" onClick={onClose}>
          Close
        </button>
      </div>
    </div>
  );
};

export default DiaryEntryDisplay;
