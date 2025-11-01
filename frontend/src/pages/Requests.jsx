import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';
import { API_URL } from '../config';

const Requests = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate('/login');
      return;
    }
    fetchRequests();
  }, [token]);

  const fetchRequests = async () => {
    try {
      setLoading(true);
      const [inRes, outRes] = await Promise.all([
        axios.get(`${API_URL}/swap/incoming`, {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get(`${API_URL}/swap/outgoing`, {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      console.log('✅ Incoming requests:', inRes.data);
      console.log('✅ Outgoing requests:', outRes.data);
      setIncoming(inRes.data);
      setOutgoing(outRes.data);
    } catch (err) {
      console.error('❌ Error fetching requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleResponse = async (id, accept) => {
    try {
      console.log(`📤 ${accept ? 'Accepting' : 'Rejecting'} swap request ${id}`);
      
      const response = await axios.post(
        `${API_URL}/swap/response/${id}`, 
        { accept }, 
        {
          headers: { Authorization: `Bearer ${token}` }
        }
      );
      
      console.log('✅ Response successful:', response.data);
      alert(accept ? '✅ Swap accepted! Events exchanged.' : '❌ Swap rejected.');
      
      // Refresh requests
      await fetchRequests();
    } catch (err) {
      console.error('❌ Error responding to swap:', err);
      console.error('Error details:', err.response?.data);
      alert(err.response?.data?.error || 'Failed to respond to request');
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    
    try {
      const date = new Date(dateStr);
      
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateStr);
        return dateStr;
      }
      
      return date.toLocaleString('en-US', {
        weekday: 'short',
        month: 'short',
        day: 'numeric',
        year: 'numeric',
        hour: 'numeric',
        minute: '2-digit',
        hour12: true
      });
    } catch (err) {
      console.error('Date formatting error:', err);
      return dateStr;
    }
  };

  if (loading) {
    return (
      <div className="container">
        <div className="dashboard-header">
          <h1>📬 Swap Requests</h1>
        </div>
        <div className="loading-state">Loading requests...</div>
      </div>
    );
  }

  return (
    <div className="container">
      <div className="dashboard-header">
        <h1>📬 Swap Requests</h1>
      </div>

      <h2 className="section-title">Incoming Requests</h2>
      {incoming.length === 0 ? (
        <div className="empty-state">
          <h3>📭 No Incoming Requests</h3>
          <p>You don't have any swap requests yet.</p>
        </div>
      ) : (
        <div className="events-grid">
          {incoming.map(req => (
            <div key={req.id} className="event-card">
              <h3>Swap Request from {req.requesterName || 'Unknown User'}</h3>
              <div className="card-meta">
                <strong>They offer:</strong><br />
                📝 {req.requesterEventTitle || 'N/A'}<br />
                📅 {req.requesterStartTime ? formatDateTime(req.requesterStartTime) : 'N/A'}<br /><br />
                
                <strong>For your:</strong><br />
                📝 {req.requesteeEventTitle || 'N/A'}<br />
                📅 {req.requesteeStartTime ? formatDateTime(req.requesteeStartTime) : 'N/A'}
              </div>
              
              {req.status === 'PENDING' ? (
                <div className="button-row">
                  <button 
                    onClick={() => handleResponse(req.id, true)} 
                    className="btn btn-success"
                  >
                    ✓ Accept
                  </button>
                  <button 
                    onClick={() => handleResponse(req.id, false)} 
                    className="btn btn-danger"
                  >
                    ✗ Reject
                  </button>
                </div>
              ) : (
                <span className={`status-badge ${
                  req.status === 'ACCEPTED' ? 'status-swappable' : 'status-busy'
                }`}>
                  {req.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 className="section-title">Outgoing Requests</h2>
      {outgoing.length === 0 ? (
        <div className="empty-state">
          <h3>📭 No Outgoing Requests</h3>
          <p>You haven't sent any swap requests yet.</p>
        </div>
      ) : (
        <div className="events-grid">
          {outgoing.map(req => (
            <div key={req.id} className="event-card">
              <h3>Request to {req.requesteeName || 'Unknown User'}</h3>
              <div className="card-meta">
                <strong>You offered:</strong><br />
                📝 {req.requesterEventTitle || 'N/A'}<br />
                📅 {req.requesterStartTime ? formatDateTime(req.requesterStartTime) : 'N/A'}<br /><br />
                
                <strong>For their:</strong><br />
                📝 {req.requesteeEventTitle || 'N/A'}<br />
                📅 {req.requesteeStartTime ? formatDateTime(req.requesteeStartTime) : 'N/A'}
              </div>
              
              <span className={`status-badge ${
                req.status === 'PENDING' ? 'status-swappending' :
                req.status === 'ACCEPTED' ? 'status-swappable' : 'status-busy'
              }`}>
                {req.status}
              </span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Requests;
