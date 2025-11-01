import React from 'react';

const EventList = ({ events, onMakeSwappable }) => {
  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="grid">
      {events.map(event => (
        <div key={event.id} className="card">
          <div className="flex justify-between items-center mb-2">
            <h3 className="card-title">{event.title}</h3>
            <span className={`status-badge status-${event.status.toLowerCase()}`}>
              {event.status}
            </span>
          </div>
          <p className="card-meta">
            📅 {formatDateTime(event.startTime)}<br />
            🕒 {formatDateTime(event.endTime)}
          </p>
          {event.status === 'BUSY' && (
            <button 
              onClick={() => onMakeSwappable(event.id)} 
              className="btn btn-success mt-2"
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
