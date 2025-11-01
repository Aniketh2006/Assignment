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
  const [loading, setLoading] = useState(false);
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
      setLoading(true);
      const res = await axios.get(`${API_URL}/events/swappable`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Marketplace events:', res.data);
      setSwappableEvents(res.data);
    } catch (err) {
      console.error('❌ Error fetching marketplace events:', err);
    } finally {
      setLoading(false);
    }
  };

  const fetchMySwappable = async () => {
    try {
      const res = await axios.get(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      const swappable = res.data.filter(e => e.status === 'SWAPPABLE');
      console.log('✅ My swappable events:', swappable);
      setMySwappable(swappable);
    } catch (err) {
      console.error('❌ Error fetching my swappable events:', err);
    }
  };

  const handleRequestSwap = async (mySlotId) => {
    try {
      console.log('📤 Requesting swap:', {
        mySlotId,
        theirSlotId: selectedEvent.id
      });

      const response = await axios.post(
        `${API_URL}/swap/request`,
        {
          mySlotId,
          theirSlotId: selectedEvent.id
        },
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );

      console.log('✅ Swap request sent:', response.data);
      alert('✅ Swap request sent successfully!');
      
      setSelectedEvent(null);
      
      // Refresh marketplace
      await fetchSwappableEvents();
      await fetchMySwappable();
    } catch (err) {
      console.error('❌ Error requesting swap:', err);
      console.error('Error details:', err.response?.data);
      alert(err.response?.data?.error || 'Failed to request swap');
    }
  };

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

  if (loading) {
    return (
      <div className="container">
        <div className="dashboard-header">
          <h1>🛒 Marketplace</h1>
        </div>
        <div className="loading-state">Loading marketplace...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>🛒 Marketplace</h1>
        <p className="card-meta">Browse and request swappable time slots from other users</p>
      </div>

      {swappableEvents.length === 0 ? (
        <div className="empty-state">
          <h3>🏪 Marketplace is Empty</h3>
          <p>No swappable events available right now. Check back later!</p>
        </div>
      ) : (
        <div className="events-grid">
          {swappableEvents.map(event => (
            <div key={event.id} className="event-card">
              <h3>{event.title}</h3>
              <div className="card-meta">
                <div className="date-display">
                  <span className="date-icon">👤</span>
                  <span>Owner: {event.ownerName}</span>
                </div>
                <div className="date-display">
                  <span className="date-icon">📅</span>
                  <span>{formatDateTime(event.startTime)}</span>
                </div>
                <div className="date-display">
                  <span className="date-icon">⏰</span>
                  <span>{formatDateTime(event.endTime)}</span>
                </div>
              </div>
              <span className="status-badge status-swappable">
                {event.status}
              </span>
              <button 
                onClick={() => setSelectedEvent(event)} 
                className="btn btn--primary"
              >
                🔄 Request Swap
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
