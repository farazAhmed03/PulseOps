import React, { useState, useEffect, useContext } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import API from '../services/api';
import { AuthContext } from '../context/AuthContext';

export default function MyBlogs() {
  const { user } = useContext(AuthContext);
  const [searchParams] = useSearchParams();

  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState(searchParams.get('new') === 'true' ? 'create' : 'list');

  // Form states
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('');
  const [content, setContent] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [feedback, setFeedback] = useState({ text: '', type: '' });
  const [searchTerm, setSearchTerm] = useState('');

  const fetchMyArticles = async () => {
    try {
      setLoading(true);
      const res = await API.get('/posts/my-posts');
      setArticles(res.data);
    } catch (err) {
      console.error('Failed to load my articles:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyArticles();
  }, []);

  const notify = (text, type = 'success') => {
    setFeedback({ text, type });
    setTimeout(() => setFeedback({ text: '', type: '' }), 4000);
  };

  const handleSaveArticle = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      notify('Both title and content are required.', 'error');
      return;
    }

    try {
      if (editingId) {
        await API.put(`/posts/${editingId}`, {
          title,
          content,
          category: category.trim() || 'General',
        });
        notify('Your article has been updated successfully.');
        setEditingId(null);
      } else {
        await API.post('/posts', {
          title,
          content,
          category: category.trim() || 'General',
        });
        notify('Your article has been published successfully.');
      }

      setTitle('');
      setCategory('');
      setContent('');
      setActiveTab('list');
      fetchMyArticles();
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to save article.', 'error');
    }
  };

  const handleStartEdit = (article) => {
    setEditingId(article._id);
    setTitle(article.title);
    setCategory(article.category || 'General');
    setContent(article.content);
    setActiveTab('create');
  };

  const handleDeleteArticle = async (id) => {
    if (!window.confirm('Are you sure you want to delete your article? This action cannot be undone.')) return;
    try {
      await API.delete(`/posts/${id}`);
      notify('Article deleted successfully.');
      fetchMyArticles();
    } catch (err) {
      notify(err.response?.data?.message || 'Failed to delete article.', 'error');
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setTitle('');
    setCategory('');
    setContent('');
  };

  const filteredArticles = articles.filter(
    (a) =>
      a.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (a.category && a.category.toLowerCase().includes(searchTerm.toLowerCase())) ||
      a.content.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      {/* Header */}
      <div className="section-header" style={{ marginBottom: '1.5rem' }}>
        <div>
          <h2>My Articles & Publications</h2>
          <p className="section-sub">
            Author workspace for <strong>{user?.name}</strong> • Publish, edit, and manage your articles
          </p>
        </div>
        <button
          className="btn-primary"
          onClick={() => {
            handleCancel();
            setActiveTab(activeTab === 'create' ? 'list' : 'create');
          }}
        >
          {activeTab === 'create' ? 'View My Articles' : '+ Write New Article'}
        </button>
      </div>

      {feedback.text && (
        <div className={`notification-banner ${feedback.type}`}>
          {feedback.text}
        </div>
      )}

      {/* Tabs */}
      <div className="admin-nav-tabs">
        <button
          className={`tab-link ${activeTab === 'list' ? 'active' : ''}`}
          onClick={() => {
            setActiveTab('list');
            handleCancel();
          }}
        >
          Published Articles ({articles.length})
        </button>
        <button
          className={`tab-link ${activeTab === 'create' ? 'active' : ''}`}
          onClick={() => setActiveTab('create')}
        >
          {editingId ? 'Edit Article' : 'Compose Article'}
        </button>
      </div>

      {/* TAB 1: LIST MY ARTICLES */}
      {activeTab === 'list' && (
        <div>
          {articles.length > 0 && (
            <div className="search-bar-container" style={{ marginBottom: '1.5rem' }}>
              <input
                type="text"
                placeholder="Search within your articles..."
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
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Loading your articles...</p>
            </div>
          ) : articles.length === 0 ? (
            <div className="empty-state">
              <h3>You haven't published any articles yet</h3>
              <p>Share your technical insights and ideas with the community.</p>
              <button
                className="btn-primary"
                style={{ marginTop: '1.25rem' }}
                onClick={() => setActiveTab('create')}
              >
                Write Your First Article
              </button>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="empty-state">
              <h3>No matching articles found</h3>
              <p>Try searching for a different keyword.</p>
            </div>
          ) : (
            <div className="panel-card">
              <div className="table-wrapper">
                <table className="data-table">
                  <thead>
                    <tr>
                      <th>Title</th>
                      <th>Category</th>
                      <th>Published On</th>
                      <th style={{ textAlign: 'right' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredArticles.map((article) => (
                      <tr key={article._id}>
                        <td className="table-title">
                          <Link to={`/posts/${article._id}`} style={{ color: 'inherit', textDecoration: 'none' }}>
                            {article.title}
                          </Link>
                        </td>
                        <td>
                          <span className="category-pill">{article.category || 'General'}</span>
                        </td>
                        <td>
                          {new Date(article.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric',
                          })}
                        </td>
                        <td style={{ textAlign: 'right' }}>
                          <button
                            className="btn-action edit"
                            onClick={() => handleStartEdit(article)}
                          >
                            Edit
                          </button>
                          <button
                            className="btn-action delete"
                            onClick={() => handleDeleteArticle(article._id)}
                          >
                            Delete
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: WRITE / EDIT ARTICLE */}
      {activeTab === 'create' && (
        <div className="panel-card">
          <div className="panel-card-header">
            <h3>{editingId ? 'Edit Your Article' : 'Write and Publish a New Article'}</h3>
          </div>

          <form onSubmit={handleSaveArticle} className="admin-form">
            <div className="form-group">
              <label>Article Title *</label>
              <input
                type="text"
                placeholder="Enter a descriptive, engaging title..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label>Category / Topic (Choose or type your own)</label>
              <input
                type="text"
                placeholder="e.g. Cloud Computing, Artificial Intelligence, Web Development, DevOps, Life"
                list="category-suggestions"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
              />
              <datalist id="category-suggestions">
                <option value="Cloud Architecture" />
                <option value="Web Development" />
                <option value="Artificial Intelligence" />
                <option value="DevOps & CI/CD" />
                <option value="Cybersecurity" />
                <option value="Mobile Development" />
                <option value="Database Systems" />
                <option value="General" />
              </datalist>
            </div>

            <div className="form-group">
              <label>Article Content *</label>
              <textarea
                rows="9"
                placeholder="Write your article body here in detail..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
              />
            </div>

            <div className="form-actions-row">
              <button type="submit" className="btn-primary">
                {editingId ? 'Save Changes' : 'Publish Article'}
              </button>
              {editingId && (
                <button
                  type="button"
                  className="btn-cancel"
                  onClick={() => {
                    handleCancel();
                    setActiveTab('list');
                  }}
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>
      )}
    </div>
  );
}
