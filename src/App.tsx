// App.tsx
import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Task from './Task/task';
import DiaryApp from './diary';
import './App.css';
import Drive from './Drive/mydrive';
import { db } from './firebase'; // Import Firebase
import { ref, onValue } from "firebase/database";
import EventPlanner from './EventPlanner';


const CollapsibleNavbar: React.FC<{ isOpen: boolean }> = ({ isOpen }) => (
  <div className={`collapsible-navbar ${isOpen ? 'open' : 'closed'}`}>
    <div className="nav-logo">
      <img src="/aws.png" alt="Company Logo" className="logo-image" />
    </div>
    <Link className="navbar-link" to="/">Home</Link>
    <Link className="navbar-link" to="/task">Tasks</Link>
    <Link className="navbar-link" to="/diary">Diary</Link>
    <Link className="navbar-link" to="/drive">Drive</Link>
    <Link className="navbar-link" to="/eventplanner">Event Planner</Link>
  </div>
);

const HomePage: React.FC<{ todosCount: number; diaryEntriesCount: number; driveFilesCount: number; eventPlanCount: number }> = ({
  todosCount,
  diaryEntriesCount,
  driveFilesCount,
  eventPlanCount
}) => {
  return (
    <div className="home-page">
      <div className="home-page-content">
        <h1>Welcome to Your Dashboard!</h1>
        <div className="count-container">
          <p>Total Tasks: {todosCount}</p>
          <p>Total Diary Entries: {diaryEntriesCount}</p>
          <p>Total Drive Files: {driveFilesCount}</p>
          <p>Total Event Plans: {eventPlanCount}</p>
        </div>
      </div>
    </div>
  );
};

const App: React.FC = () => {
  const [todos, setTodos] = useState([]);
  const [diaryEntries, setDiaryEntries] = useState([]);
  const [driveFiles, setDriveFiles] = useState([]);
  const [eventPlans, setEventPlans] = useState([]);
  const [isNavbarOpen, setNavbarOpen] = useState(false);

  useEffect(() => {
    // Fetch tasks data
    const todoEntriesRef = ref(db, 'todo_entries');
    onValue(todoEntriesRef, (snapshot) => {
      setTodos(snapshot.exists() ? snapshot.val() : []);
    });

    // Fetch diary entries data
    const diaryEntriesRef = ref(db, 'diary_entries');
    onValue(diaryEntriesRef, (snapshot) => {
      setDiaryEntries(snapshot.exists() ? snapshot.val() : []);
    });

    // Fetch drive files data
    const driveFilesRef = ref(db, 'drive_files');
    onValue(driveFilesRef, (snapshot) => {
      setDriveFiles(snapshot.exists() ? snapshot.val() : []);
    });

    // Fetch drive files data
    const eventPlansRef = ref(db, 'events');
    onValue(eventPlansRef, (snapshot) => {
      setEventPlans(snapshot.exists() ? snapshot.val() : []);
    });
  }, []);

  return (
    <Router>
      <div className="app-container">
        <CollapsibleNavbar isOpen={isNavbarOpen} />
        <div className={`content ${isNavbarOpen ? 'shifted-content' : ''}`}>
          <button className="toggle-navbar" onClick={() => setNavbarOpen(!isNavbarOpen)}>
            ☰
          </button>
          <Routes>
            <Route
              path="/"
              element={<HomePage todosCount={todos.length}
                diaryEntriesCount={diaryEntries.length}
                driveFilesCount={driveFiles.length}
                eventPlanCount={eventPlans.length} />}
            />
            <Route path="/diary" element={<DiaryApp />} />
            <Route path="/task" element={<Task />} />
            <Route path="/drive" element={<Drive />} />
            <Route path="/eventplanner" element={<EventPlanner />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
};

export default App;
