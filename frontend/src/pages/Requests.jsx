import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../auth/AuthProvider';

const Requests = () => {
  const [incoming, setIncoming] = useState([]);
  const [outgoing, setOutgoing] = useState([]);
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
      const [inRes, outRes] = await Promise.all([
        axios.get('http://localhost:3001/api/swap/incoming', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        axios.get('http://localhost:3001/api/swap/outgoing', {
          headers: { Authorization: `Bearer ${token}` }
        })
      ]);
      setIncoming(inRes.data);
      setOutgoing(outRes.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleResponse = async (id, accept) => {
    try {
      await axios.post(`http://localhost:3001/api/swap/response/${id}`, { accept }, {
        headers: { Authorization: `Bearer ${token}` }
      });
      alert(accept ? 'Swap accepted!' : 'Swap rejected');
      fetchRequests();
    } catch (err) {
      alert(err.response?.data?.error || 'Failed to respond');
    }
  };

  const formatDateTime = (dateStr) => {
    if (!dateStr) return 'N/A';
    
    try {
      const date = new Date(dateStr);
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.warn('Invalid date:', dateStr);
        return dateStr;
      }
      
      return date.toLocaleString('en-US', {
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

  return (
    <div className="container">
      <h1 style={{ fontSize: '2.5rem', marginBottom: '2rem', marginTop: '2rem' }}>
        📬 Swap Requests
      </h1>

      <h2 style={{ fontSize: '1.8rem', marginTop: '2rem', marginBottom: '1rem' }}>
        Incoming Requests
      </h2>
      {incoming.length === 0 ? (
        <div className="card">No incoming requests</div>
      ) : (
        <div className="grid">
          {incoming.map(req => (
            <div key={req.id} className="card">
              <h3 className="card-title">Swap Request from {req.requesterName || 'Unknown User'}</h3>
              <p className="card-meta">
                <strong>They offer:</strong> {req.requesterEventTitle || 'N/A'}<br />
                📅 {req.requesterStartTime ? formatDateTime(req.requesterStartTime) : 'N/A'}<br /><br />
                <strong>For your:</strong> {req.requesteeEventTitle || 'N/A'}<br />
                📅 {req.requesteeStartTime ? formatDateTime(req.requesteeStartTime) : 'N/A'}
              </p>
              {req.status === 'PENDING' ? (
                <div className="flex gap-2 mt-2">
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
                <span className={`status-badge ${req.status === 'ACCEPTED' ? 'status-swappable' : 'status-busy'}`}>
                  {req.status}
                </span>
              )}
            </div>
          ))}
        </div>
      )}

      <h2 style={{ fontSize: '1.8rem', marginTop: '3rem', marginBottom: '1rem' }}>
        Outgoing Requests
      </h2>
      {outgoing.length === 0 ? (
        <div className="card">No outgoing requests</div>
      ) : (
        <div className="grid">
          {outgoing.map(req => (
            <div key={req.id} className="card">
              <h3 className="card-title">Request to {req.requesteeName || 'Unknown User'}</h3>
              <p className="card-meta">
                <strong>You offered:</strong> {req.requesterEventTitle || 'N/A'}<br />
                📅 {req.requesterStartTime ? formatDateTime(req.requesterStartTime) : 'N/A'}<br /><br />
                <strong>For their:</strong> {req.requesteeEventTitle || 'N/A'}<br />
                📅 {req.requesteeStartTime ? formatDateTime(req.requesteeStartTime) : 'N/A'}
              </p>
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

