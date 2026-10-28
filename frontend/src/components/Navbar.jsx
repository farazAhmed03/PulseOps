import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout, isAdmin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <Link to="/" className="brand-logo">
          <span className="brand-accent">Dev</span>Journal
        </Link>

        <div className="nav-links">
          <Link to="/" className="nav-link">
            Articles
          </Link>

          {user && (
            <>
              <Link to="/my-articles" className="nav-link">
                My Articles
              </Link>
              <Link to="/my-articles?new=true" className="btn-write-nav">
                + Write Article
              </Link>
            </>
          )}

          {isAdmin && (
            <Link to="/admin" className="nav-link admin-pill">
              Admin Dashboard
            </Link>
          )}

          {user ? (
            <div className="user-section">
              <div className="user-badge-wrapper">
                <span className="user-name">{user.name}</span>
                <span className={`badge ${user.role === 'admin' ? 'badge-admin' : 'badge-user'}`}>
                  {user.role}
                </span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-login-link">
                Sign In
              </Link>
              <Link to="/register" className="btn-register-link">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
