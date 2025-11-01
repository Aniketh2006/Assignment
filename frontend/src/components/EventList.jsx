import React from 'react';

const EventList = ({ events, onMakeSwappable }) => {
  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      weekday: 'short',
      month: 'short',
      day: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    });
  };

  if (events.length === 0) {
    return (
      <div className="empty-state">
        <h3>📅 No Events Yet</h3>
        <p>Create your first event using the form above!</p>
      </div>
    );
  }

  return (
    <div className="events-grid">
      {events.map(event => (
        <div key={event.id} className="event-card">
          <h3>{event.title}</h3>
          <div className="date-display">
            <span className="date-icon">📅</span>
            <span>{formatDateTime(event.startTime)}</span>
          </div>
          <div className="date-display">
            <span className="date-icon">⏰</span>
            <span>{formatDateTime(event.endTime)}</span>
          </div>
          <span className={`status-badge status-${event.status.toLowerCase()}`}>
            {event.status}
          </span>
          {event.status === 'BUSY' && (
            <button
              onClick={() => onMakeSwappable(event.id)}
              className="btn btn--secondary"
            >
              Make Swappable
            </button>
          )}
        </div>
      ))}
    </div>
  );
};

export default EventList;
