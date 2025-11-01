import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';
import EventList from '../components/EventList';
import EventForm from '../components/EventForm';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchEvents();
  }, [token]);

  const fetchEvents = async () => {
    try {
      const res = await axios.get('http://localhost:3001/api/events', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setEvents(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      await axios.post('http://localhost:3001/api/events', eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  const handleMakeSwappable = async (id) => {
    try {
      await axios.put(`http://localhost:3001/api/events/swappable/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      fetchEvents();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="container">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', marginTop: '2rem' }}>
        📅 My Dashboard
      </h1>
      <EventForm onSubmit={handleCreateEvent} />
      <h2 style={{ fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1rem' }}>
        Your Events
      </h2>
      {events.length === 0 ? (
        <p className="card-meta">No events yet. Create your first event above!</p>
      ) : (
        <EventList events={events} onMakeSwappable={handleMakeSwappable} />
      )}
    </div>
  );
};

export default Dashboard;
