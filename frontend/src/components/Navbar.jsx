import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActive = (path) => (location.pathname === path ? 'nav-link active' : 'nav-link');

  return (
    <nav className="navbar">
      <div className="nav-container">
        {/* Brand Logo */}
        <Link to="/" className="brand-logo">
          <div className="brand-icon">⚡</div>
          <div className="brand-text">
            <span className="brand-title">PromptVerse</span>
            <span className="brand-sub">AI PROMPT HUB</span>
          </div>
        </Link>

        {/* Center Nav Links */}
        <div className="nav-menu">
          <Link to="/" className={isActive('/')}>
            🔍 Explore Prompts
          </Link>

          {user && (
            <Link to="/my-prompts" className={isActive('/my-prompts')}>
              📝 My Prompts
            </Link>
          )}

          <Link to="/guide" className={isActive('/guide')}>
            📖 User Guide (EN)
          </Link>

          {user && user.role === 'admin' && (
            <Link to="/admin" className={isActive('/admin')}>
              🛡️ Admin Console
            </Link>
          )}
        </div>

        {/* Right Nav Action */}
        <div className="nav-auth">
          {user ? (
            <div className="user-profile-menu">
              <Link to="/my-prompts" className="btn-create-prompt">
                + Create Prompt
              </Link>
              <div className="user-badge">
                <span className="user-avatar">{user.name ? user.name[0].toUpperCase() : 'U'}</span>
                <span className="user-name">{user.name}</span>
              </div>
              <button onClick={handleLogout} className="btn-logout">
                Sign Out
              </button>
            </div>
          ) : (
            <div className="auth-btns">
              <Link to="/login" className="btn-signin">
                Sign In
              </Link>
              <Link to="/register" className="btn-signup">
                Get Started
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
