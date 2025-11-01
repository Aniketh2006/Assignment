import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../auth/AuthProvider';

const Nav = () => {
  const { token, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="nav">
      <div className="nav-container">
        <Link to="/" className="nav-brand">🔄 SlotSwapper</Link>
        <div className="nav-links">
          {token ? (
            <>
              <span style={{ color: 'var(--text-secondary)' }}>Welcome, {user?.name}</span>
              <Link to="/dashboard" className="nav-link">Dashboard</Link>
              <Link to="/marketplace" className="nav-link">Marketplace</Link>
              <Link to="/requests" className="nav-link">Requests</Link>
              <button onClick={handleLogout} className="btn btn-secondary">Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Login</Link>
              <Link to="/signup" className="nav-link">Sign Up</Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Nav;
