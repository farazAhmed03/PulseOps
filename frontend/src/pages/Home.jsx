import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import API from '../services/api';

export default function Home() {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');

  const fetchArticles = async () => {
    try {
      setLoading(true);
      const res = await API.get('/posts');
      setPosts(res.data);
    } catch (err) {
      console.error('Failed to load articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  // Filter posts based on search input
  const filteredPosts = posts.filter((post) => {
    const q = searchTerm.toLowerCase();
    const titleMatch = post.title.toLowerCase().includes(q);
    const contentMatch = post.content.toLowerCase().includes(q);
    const categoryMatch = (post.category || '').toLowerCase().includes(q);
    const authorMatch = (post.author || '').toLowerCase().includes(q);
    return titleMatch || contentMatch || categoryMatch || authorMatch;
  });

  return (
    <div className="container">
      {/* Hero */}
      <section className="hero-banner">
        <span className="hero-tag">Technology & Systems</span>
        <h1>Engineering & Architecture Journal</h1>
        <p>In-depth technical perspectives, system design patterns, and cloud deployment guides.</p>
      </section>

      {/* Search Bar */}
      <div className="search-section">
        <div className="search-bar-container">
          <svg className="search-icon" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M9 3.5a5.5 5.5 0 100 11 5.5 5.5 0 000-11zM2 9a7 7 0 1112.452 4.391l3.328 3.329a.75.75 0 11-1.06 1.06l-3.329-3.328A7 7 0 012 9z"
              clipRule="evenodd"
            />
          </svg>
          <input
            type="text"
            placeholder="Search articles by title, category, or author..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="search-input"
          />
          {searchTerm && (
            <button className="search-clear-btn" onClick={() => setSearchTerm('')}>
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Section Header */}
      <div className="section-header">
        <div>
          <h2>
            {searchTerm ? `Search Results for "${searchTerm}"` : 'Featured Articles'}
          </h2>
          <p className="section-sub">
            {searchTerm
              ? `Found ${filteredPosts.length} matching publication(s)`
              : 'Latest technical publications and software engineering insights'}
          </p>
        </div>
        <span className="count-pill">
          {filteredPosts.length} {filteredPosts.length === 1 ? 'Article' : 'Articles'}
        </span>
      </div>

      {/* Articles Grid */}
      {loading ? (
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading publications...</p>
        </div>
      ) : filteredPosts.length === 0 ? (
        <div className="empty-state">
          <h3>No articles match your search</h3>
          <p>Try searching for a different keyword or check back later for new articles.</p>
          {searchTerm && (
            <button className="btn-primary" style={{ marginTop: '1rem' }} onClick={() => setSearchTerm('')}>
              Clear Search Query
            </button>
          )}
        </div>
      ) : (
        <div className="articles-grid">
          {filteredPosts.map((post) => (
            <article key={post._id} className="article-card">
              <div className="article-card-header">
                {/* DYNAMIC USER-DEFINED CATEGORY */}
                <span className="article-category">{post.category || 'General'}</span>
                <span className="article-date">
                  {new Date(post.createdAt).toLocaleDateString('en-US', {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </span>
              </div>

              <div className="article-card-body">
                <h3>
                  <Link to={`/posts/${post._id}`}>{post.title}</Link>
                </h3>
                <p className="article-excerpt">
                  {post.content.length > 160
                    ? `${post.content.substring(0, 160)}...`
                    : post.content}
                </p>
              </div>

              <div className="article-card-footer">
                <div className="author-info">
                  <div className="author-avatar">
                    {(post.author || 'E')[0].toUpperCase()}
                  </div>
                  <span className="author-name">{post.author || 'Editorial Staff'}</span>
                </div>
                <Link to={`/posts/${post._id}`} className="read-link">
                  Read Article →
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
