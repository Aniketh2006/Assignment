import React, { useState } from 'react';

const EventForm = ({ onSubmit }) => {
  const [title, setTitle] = useState('');
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    
    if (!title || !startTime || !endTime) {
      alert('Please fill in all fields');
      return;
    }

    if (new Date(endTime) <= new Date(startTime)) {
      alert('End time must be after start time');
      return;
    }

    onSubmit({ title, startTime, endTime });
    
    // Reset form
    setTitle('');
    setStartTime('');
    setEndTime('');
  };

  return (
    <div className="event-form">
      <h2>📝 Create New Event</h2>
      <form onSubmit={handleSubmit}>
        <div className="form-group">
          <label className="form-label">Event Title</label>
          <input
            type="text"
            className="form-control"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="e.g., Team Meeting"
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">Start Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            required
          />
        </div>
        
        <div className="form-group">
          <label className="form-label">End Time</label>
          <input
            type="datetime-local"
            className="form-control"
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            required
          />
        </div>
        
        <button type="submit" className="btn btn--primary btn--full-width">
          ✨ Create Event
        </button>
      </form>
    </div>
  );
};

export default EventForm;
