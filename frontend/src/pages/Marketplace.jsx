import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';
import SwapModal from '../components/SwapModal';
import { API_URL } from '../config';

const Marketplace = () => {
  const [swappableEvents, setSwappableEvents] = useState([]);
  const [mySwappable, setMySwappable] = useState([]);
  const [selectedEvent, setSelectedEvent] = useState(null);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchSwappableEvents();
    fetchMySwappable();
  }, [token]);

  const fetchSwappableEvents = async () => {
    try {
      const res = await axios.get(`${API_URL}/events/swappable`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSwappableEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMySwappable = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMySwappable(res.data.filter(e => e.status === 'SWAPPABLE'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestSwap = async (mySlotId) => {
    try {
      await axios.post(`${API_URL}/swap/request`, {
        mySlotId,
        theirSlotId: selectedEvent.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert('Swap request sent!');
      setSelectedEvent(null);
      fetchSwappableEvents();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to request swap');
    }
  };

  const formatDateTime = (dateStr) => {
    return new Date(dateStr).toLocaleString('en-US', {
      dateStyle: 'short',
      timeStyle: 'short'
    });
  };

  return (
    <div className="container">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', marginTop: '2rem' }}>
        🛒 Marketplace
      </h1>
      <p className="card-meta">Browse and request swappable time slots from other users</p>
      {swappableEvents.length === 0 ? (
        <div className="card">No swappable events available</div>
      ) : (
        <div className="grid">
          {swappableEvents.map(event => (
            <div key={event.id} className="card">
              <h3 className="card-title">{event.title}</h3>
              <p className="card-meta">
                👤 Owner: {event.ownerName}<br />
                📅 Start: {formatDateTime(event.startTime)}<br />
                ⏰ End: {formatDateTime(event.endTime)}
              </p>
              <span className="status-badge status-swappable">{event.status}</span>
              <button 
                onClick={() => setSelectedEvent(event)} 
                className="btn btn--primary"
                style={{ marginTop: '1rem' }}
              >
                Request Swap
              </button>
            </div>
          ))}
        </div>
      )}
      {selectedEvent && (
        <SwapModal
          event={selectedEvent}
          mySwappable={mySwappable}
          onSelect={handleRequestSwap}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};

export default Marketplace;
