import React from 'react';

const SwapModal = ({ event, mySwappable, onSelect, onClose }) => {
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

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">🔄 Request Swap</h2>
          <button className="modal-close" onClick={onClose}>
            ✕
          </button>
        </div>

        <div style={{ marginBottom: '1.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', color: 'var(--text)' }}>
            You want:
          </h3>
          <div className="card" style={{ padding: '1rem' }}>
            <strong>{event.title}</strong><br />
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              📅 {formatDateTime(event.startTime)}<br />
              👤 Owner: {event.ownerName}
            </span>
          </div>
        </div>

        <h3 style={{ fontSize: '1.1rem', marginBottom: '1rem', color: 'var(--text)' }}>
          Select one of your swappable events to offer:
        </h3>

        {mySwappable.length === 0 ? (
          <div className="empty-state">
            <p>❌ You don't have any swappable events.</p>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
              Mark an event as swappable first from your Dashboard.
            </p>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {mySwappable.map(myEvent => (
              <div 
                key={myEvent.id} 
                className="card" 
                style={{ 
                  padding: '1rem',
                  cursor: 'pointer',
                  transition: 'all 0.2s'
                }}
                onClick={() => onSelect(myEvent.id)}
              >
                <strong>{myEvent.title}</strong><br />
                <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
                  📅 {formatDateTime(myEvent.startTime)}<br />
                  ⏰ {formatDateTime(myEvent.endTime)}
                </span>
                <button 
                  className="btn btn--primary"
                  style={{ marginTop: '0.75rem', width: '100%' }}
                  onClick={(e) => {
                    e.stopPropagation();
                    onSelect(myEvent.id);
                  }}
                >
                  ✨ Offer This Slot
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SwapModal;
