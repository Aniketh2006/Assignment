import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';
import SwapModal from '../components/SwapModal';

const Marketplace = () => {
  const [slots, setSlots] = useState([]);
  const [mySlots, setMySlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchMarketplace();
    fetchMySlots();
  }, [token]);

  const fetchMarketplace = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/events/swappable', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setSlots(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchMySlots = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMySlots(res.data.filter(e => e.status === 'SWAPPABLE'));
    } catch (err) {
      console.error(err);
    }
  };

  const handleRequestSwap = (slot) => {
    setSelectedSlot(slot);
    setShowModal(true);
  };

  const handleSelectMySlot = async (mySlotId) => {
    try {
      await axios.post('http://localhost:3001/api/swap/request', {
        mySlotId,
        theirSlotId: selectedSlot.id
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setShowModal(false);
      alert('Swap request sent!');
      fetchMarketplace();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to send swap request');
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
      <p className="card-meta mb-2">
        Browse swappable slots from other users. You need at least one swappable slot to request a swap.
      </p>
      {slots.length === 0 ? (
        <div className="card">
          <p>No swappable slots available right now. Check back later!</p>
        </div>
      ) : (
        <div className="grid">
          {slots.map(slot => (
            <div key={slot.id} className="card">
              <div className="flex justify-between items-center mb-2">
                <h3 className="card-title">{slot.title}</h3>
                <span className="status-badge status-swappable">AVAILABLE</span>
              </div>
              <p className="card-meta">
                👤 Owner: {slot.ownerName}<br />
                📅 {formatDateTime(slot.startTime)}<br />
                🕒 {formatDateTime(slot.endTime)}
              </p>
              <button 
                onClick={() => handleRequestSwap(slot)} 
                className="btn btn-primary mt-2"
                disabled={mySlots.length === 0}
              >
                {mySlots.length === 0 ? 'No Swappable Slots' : 'Request Swap'}
              </button>
            </div>
          ))}
        </div>
      )}
      <SwapModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        mySlots={mySlots}
        onSelectSlot={handleSelectMySlot}
        theirEvent={selectedSlot}
      />
    </div>
  );
};

export default Marketplace;
