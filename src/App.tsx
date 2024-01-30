// App.tsx
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import Task from './Task/task'; // Import the Task component
import DiaryApp from './diary';
import './App.css'; // Import the CSS
import Drive from './Drive/mydrive';

const HomePage: React.FC = () => {
  return (
    <div className="home-page">
      <div>
        <h1>Welcome to the Home Page!</h1>
      </div>
    </div>

  ); // Add a welcome message
};

const App: React.FC = () => {
  return (
    <Router>
      <div className="navbar"> {/* Use the navbar class for the navigation bar */}
        <button>
          <Link className="navbar-link" to="/">Home Page</Link> {/* Add the class here */}
        </button>
        <button>
          <Link className="navbar-link" to="/task">Task Page</Link> {/* And here */}
        </button>
        <button>
          <Link className="navbar-link" to="/diary">Diary Page</Link> {/* And here */}
        </button>
        <button>
          <Link className="navbar-link" to="/drive">Drive Page</Link> {/* And here */}
        </button>
      </div>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/diary" element={<DiaryApp />} />
        <Route path="/task" element={<Task />} />
        <Route path="/drive" element={<Drive />} />
      </Routes>
    </Router>
  );
};

export default App;
