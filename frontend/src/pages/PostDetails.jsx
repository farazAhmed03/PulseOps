import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import API from '../services/api';

export default function PostDetails() {
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchArticle = async () => {
      try {
        setLoading(true);
        const res = await API.get(`/posts/${id}`);
        setPost(res.data);
      } catch (err) {
        setError(err.response?.data?.message || 'Article could not be found.');
      } finally {
        setLoading(false);
      }
    };
    fetchArticle();
  }, [id]);

  if (loading) {
    return (
      <div className="container" style={{ padding: '4rem 1rem', textAlign: 'center', color: '#94a3b8' }}>
        Loading article...
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="container" style={{ padding: '3rem 1rem' }}>
        <div className="card" style={{ textAlign: 'center', padding: '3rem 2rem' }}>
          <h2>Article Not Found</h2>
          <p style={{ color: '#94a3b8', margin: '0.75rem 0 1.5rem' }}>
            {error || 'The requested article does not exist or may have been removed.'}
          </p>
          <Link to="/" className="btn-primary">
            Return to Articles
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="container article-view-container">
      <Link to="/" className="back-link">
        ← Back to All Articles
      </Link>

      <article className="article-main">
        <header className="article-header">
          <div className="article-meta-tags">
            {/* DYNAMIC CATEGORY */}
            <span className="article-category">{post.category || 'General'}</span>
            <span className="dot">•</span>
            <span>
              {new Date(post.createdAt).toLocaleDateString('en-US', {
                month: 'long',
                day: 'numeric',
                year: 'numeric',
              })}
            </span>
          </div>

          <h1 className="article-title">{post.title}</h1>

          <div className="article-author-row">
            <div className="author-avatar lg">
              {(post.author || 'E')[0].toUpperCase()}
            </div>
            <div>
              <div className="author-name-lg">{post.author || 'Editorial Staff'}</div>
              <div className="author-sub">Contributor & Technical Writer</div>
            </div>
          </div>
        </header>

        <hr className="divider" />

        <div className="article-content-body">{post.content}</div>
      </article>
    </div>
  );
}
