import React from 'react';

const SwapModal = ({ isOpen, onClose, mySlots, onSelectSlot, theirEvent }) => {
  if (!isOpen) return null;

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h2 className="modal-title">Select Your Slot to Offer</h2>
        <p className="card-meta mb-2">
          You're requesting: <strong>{theirEvent?.title}</strong><br />
          📅 {theirEvent && formatDateTime(theirEvent.startTime)}
        </p>
        <hr style={{ border: '1px solid var(--border)', margin: '1rem 0' }} />
        <div className="grid">
          {mySlots.map(slot => (
            <div key={slot.id} className="card" onClick={() => onSelectSlot(slot.id)}>
              <h4>{slot.title}</h4>
              <p className="card-meta">
                📅 {formatDateTime(slot.startTime)}<br />
                🕒 {formatDateTime(slot.endTime)}
              </p>
              <button className="btn btn-primary mt-2">Offer This Slot</button>
            </div>
          ))}
        </div>
        <button onClick={onClose} className="btn btn-secondary mt-2">Cancel</button>
      </div>
    </div>
  );
};

export default SwapModal;
