import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';
import EventList from '../components/EventList';
import EventForm from '../components/EventForm';
import { API_URL } from '../config';

const Dashboard = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
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
      setLoading(true);
      const res = await axios.get(`${API_URL}/events`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Events fetched:', res.data);
      setEvents(res.data || []);
    } catch (err) {
      console.error('❌ Error fetching events:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateEvent = async (eventData) => {
    try {
      console.log('📝 Creating event:', eventData);
      const res = await axios.post(`${API_URL}/events`, eventData, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Event created:', res.data);
      
      await fetchEvents();
      alert('Event created successfully!');
    } catch (err) {
      console.error('❌ Error creating event:', err);
      alert(err.response?.data?.error || 'Failed to create event');
    }
  };

  const handleMakeSwappable = async (id) => {
    try {
      await axios.put(`${API_URL}/events/swappable/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      console.log('✅ Event marked as swappable');
      fetchEvents();
    } catch (err) {
      console.error('❌ Error marking event as swappable:', err);
    }
  };

  return (
    <div className="container">
      <div className="dashboard-header">
  	<h1>📅 My Dashboard</h1>
      </div>

      <EventForm onSubmit={handleCreateEvent} />
      <h2 className="section-title">Your Events</h2>
      {loading ? (
        <p className="card-meta">Loading events...</p>
      ) : events.length === 0 ? (
        <p className="card-meta">No events yet. Create your first event above!</p>
      ) : (
        <EventList events={events} onMakeSwappable={handleMakeSwappable} />
      )}
    </div>
  );
};

export default Dashboard;
