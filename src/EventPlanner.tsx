// src/EventPlanner.tsx
import React, { useState, useEffect } from 'react';
import { db } from './firebase';
import { ref, set, onValue } from 'firebase/database';
import './EventPlanner.css';
import { differenceInDays, differenceInWeeks, differenceInMonths, differenceInYears, differenceInHours, format } from 'date-fns';
import { BsPinAngleFill, BsPinAngle } from 'react-icons/bs';
import { isValid } from 'date-fns';

interface Event {
  id: number;
  name: string;
  dateTime: string;
  location: string;
  pinned: boolean;
}

const EventPlanner: React.FC = () => {
  const [events, setEvents] = useState<Event[]>([]);
  const [eventData, setEventData] = useState({
    name: '',
    dateTime: '',
    location: '',
  });
  const [showPinned, setShowPinned] = useState(false);

  useEffect(() => {
    // Fetch events data from Firebase
    const eventsRef = ref(db, 'events');
    onValue(eventsRef, (snapshot) => {
      if (snapshot.exists()) {
        setEvents(snapshot.val());
      } else {
        setEvents([]);
      }
    });
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEventData({ ...eventData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newEvent: Event = {
      id: Date.now(),
      name: eventData.name,
      dateTime: eventData.dateTime,
      location: eventData.location,
      pinned: false,
    };

    // Save the new event to Firebase
    const eventsRef = ref(db, 'events');
    set(eventsRef, [...events, newEvent]);

    setEvents([...events, newEvent]);
    setEventData({ name: '', dateTime: '', location: '' });
  };

  const handleDelete = (id: number) => {
    const updatedEvents = events.filter((event) => event.id !== id);

    // Update Firebase with the new events list
    const eventsRef = ref(db, 'events');
    set(eventsRef, updatedEvents);

    setEvents(updatedEvents);
  };

  const handlePinToggle = (id: number) => {
    const updatedEvents = events.map((event) =>
      event.id === id ? { ...event, pinned: !event.pinned } : event
    );

    // Update Firebase with the new events list
    const eventsRef = ref(db, 'events');
    set(eventsRef, updatedEvents);

    setEvents(updatedEvents);
  };

  const filterEvents = () => {
    const filteredEvents = showPinned ? events.filter((event) => event.pinned) : events;

    // Sort events based on date and time
    filteredEvents.sort((a, b) => {
      const dateA = new Date(a.dateTime);
      const dateB = new Date(b.dateTime);

      // If dates are the same, compare times
      if (dateA.toISOString() === dateB.toISOString()) {
        const timeDifferenceA = dateA.getHours() * 60 + dateA.getMinutes();
        const timeDifferenceB = dateB.getHours() * 60 + dateB.getMinutes();

        return timeDifferenceA - timeDifferenceB;
      }

      // Otherwise, compare dates
      return dateA.getTime() - dateB.getTime();
    });

    return filteredEvents;
  };

  const calculateTimeRemaining = (eventDate: Date): string => {
    const now = new Date();
    const daysDifference = differenceInDays(eventDate, now);
    const weeksDifference = differenceInWeeks(eventDate, now);
    const monthsDifference = differenceInMonths(eventDate, now);
    const yearsDifference = differenceInYears(eventDate, now);
    const hoursDifference = differenceInHours(eventDate, now);

    if (hoursDifference < 24) {
      return `${hoursDifference} ${hoursDifference === 1 ? 'hour' : 'hours'}`;
    } else if (daysDifference < 1) {
      return `Today`;
    } else if (daysDifference === 1) {
      return `Tomorrow`;
    } else if (daysDifference < 7) {
      return `${daysDifference} ${daysDifference === 1 ? 'day' : 'days'}`;
    } else if (weeksDifference < 1) {
      return `${Math.floor(daysDifference / 7)} weeks`;
    } else if (monthsDifference < 1) {
      return `${weeksDifference} ${weeksDifference === 1 ? 'week' : 'weeks'}`;
    } else if (monthsDifference === 1) {
      return `1 month`;
    } else if (monthsDifference < 12) {
      return `${monthsDifference} ${monthsDifference === 1 ? 'month' : 'months'}`;
    } else if (yearsDifference === 1) {
      return `1 year`;
    } else {
      return `${yearsDifference} ${yearsDifference === 1 ? 'year' : 'years'}`;
    }
  };

  return (
    <div className="EventPlanner">
      <h1>Event Planner</h1>
      <div className="flex-container">
        <div className="input-container">
          <form onSubmit={handleSubmit}>
            <label>
              Event Name:
              <input
                type="text"
                name="name"
                value={eventData.name}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Date and Time:
              <input
                type="datetime-local"
                name="dateTime"
                value={eventData.dateTime}
                onChange={handleInputChange}
                required
              />
            </label>
            <label>
              Location:
              <input
                type="text"
                name="location"
                value={eventData.location}
                onChange={handleInputChange}
                required
              />
            </label>
            <button type="submit">Add Event</button>
          </form>
        </div>
        <div className="events-list">
          <div>
            <label>
              Show Pinned Events
              <input
                type="checkbox"
                checked={showPinned}
                onChange={() => setShowPinned(!showPinned)}
              />
            </label>
          </div>
          <table>
            <thead>
              <tr>
                <th>Event Name</th>
                <th>Date and Time</th>
                <th>Location</th>
                <th>Time Remaining</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filterEvents().map((event) => (
                <tr key={event.id}>
                  <td>{event.name}</td>
                  <td>{isValid(new Date(event.dateTime)) ? format(new Date(event.dateTime), 'yyyy-MM-dd HH:mm') : 'Invalid Date'}</td>
                  <td>{event.location}</td>
                  <td>{calculateTimeRemaining(new Date(event.dateTime))}</td>
                  <td>
                    <button className="delete-button" onClick={() => handleDelete(event.id)}>
                      Delete
                    </button>
                    <button className="pin-button" onClick={() => handlePinToggle(event.id)}>
                      {event.pinned ? <BsPinAngleFill /> : <BsPinAngle />}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default EventPlanner;
